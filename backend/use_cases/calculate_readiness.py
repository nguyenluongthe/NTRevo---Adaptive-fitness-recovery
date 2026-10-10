"""
NTRevo Use Case: CalculateReadinessUseCase (Application Business Rules)
Author: Dev1-BackendLead (dev1.backendlead@ntrevo.io)
Sprint: 3 - AI trong Thiết kế & Kiến trúc Phần mềm (Chương 5)
Orchestrates biometric telemetry evaluation and generates ReadinessScore domain entity.
"""

from typing import Optional, Dict, Any
from datetime import datetime
try:
    from backend.domain.entities import BiometricSample, ReadinessScore
    from backend.use_cases.interfaces import IBiometricRepository, ICacheService
except ImportError:
    from domain.entities import BiometricSample, ReadinessScore
    from use_cases.interfaces import IBiometricRepository, ICacheService

class CalculateReadinessUseCase:
    """
    Computes Readiness Score from athlete's biometric telemetry
    using Z-score normalization and weighted multi-biomarker synthesis.
    """

    BASELINE_HRV_MEAN = 62.0
    BASELINE_HRV_STD = 6.5

    def __init__(self, biometric_repo: IBiometricRepository, cache_service: Optional[ICacheService] = None):
        self.biometric_repo = biometric_repo
        self.cache_service = cache_service

    def execute(self, sample: BiometricSample) -> ReadinessScore:
        cache_key = f"user:{sample.athlete_id}:readiness:score"
        if self.cache_service:
            cached = self.cache_service.get(cache_key)
            if cached is not None:
                return cached

        # 1. HRV Normalization via Z-score
        z_hrv = (sample.hrv_rmssd - self.BASELINE_HRV_MEAN) / self.BASELINE_HRV_STD
        hrv_norm = max(0, min(100, int(round(50 + (z_hrv * 20)))))

        # 2. Sleep Normalization
        duration_score = (min(sample.sleep_hours, 9.0) / 8.0) * 70.0
        deep_score = (min(sample.deep_sleep_ratio, 0.30) / 0.20) * 30.0
        sleep_norm = max(0, min(100, int(round(duration_score + deep_score))))

        # 3. RPE & DOMS Normalization
        rpe_norm = max(0, min(100, int(round(100 - ((sample.rpe_previous_day - 1) * (100 / 9))))))
        doms_norm = max(0, min(100, int(round(100 - ((sample.doms_score - 1) * (100 / 9))))))

        # 4. Composite synthesis: 40% HRV, 30% Sleep, 15% RPE, 15% DOMS
        composite = int(round((0.40 * hrv_norm) + (0.30 * sleep_norm) + (0.15 * rpe_norm) + (0.15 * doms_norm)))

        overtraining_alert = False
        override_reason = None

        # Overtraining safeguards
        if sample.hrv_rmssd < (self.BASELINE_HRV_MEAN - (2.5 * self.BASELINE_HRV_STD)):
            overtraining_alert = True
            override_reason = "HRV giảm >2.5 độ lệch chuẩn dưới ngưỡng cơ sở. Dấu hiệu kiệt sức hệ thần kinh phó giao cảm."
            composite = min(composite, 38)
        elif sample.doms_score >= 9:
            overtraining_alert = True
            override_reason = "Đau mỏi cơ cực độ (DOMS >= 9). Kích hoạt cơ chế chống quá tải cơ bắp."
            composite = min(composite, 45)

        # Classification & auto-regulation multipliers
        if composite >= 80:
            classification = "Optimal / Full Session"
            vol_mult = 1.05
            int_mult = 1.00
            recommendation = "Cơ thể hoàn toàn phục hồi. Sẵn sàng tập với 100% cường độ và khối lượng mục tiêu."
        elif composite >= 60:
            classification = "Modified Intensity"
            vol_mult = 0.85
            int_mult = 0.90
            recommendation = "Mức độ hồi phục trung bình. Giảm 15% tổng khối lượng các bài phụ trợ (accessory)."
        elif composite >= 40:
            classification = "Active Recovery"
            vol_mult = 0.50
            int_mult = 0.60
            recommendation = "Hồi phục dưới mức chuẩn. Chuyển sang cardio nhẹ nhàng Zone 1-2 và giãn cơ thư giãn."
        else:
            classification = "Complete Rest"
            vol_mult = 0.00
            int_mult = 0.00
            recommendation = "Nguy cơ kiệt sức cao. Nghỉ ngơi tuyệt đối, ưu tiên giấc ngủ và dinh dưỡng phục hồi."

        score_obj = ReadinessScore(
            score_value=composite,
            classification=classification,
            volume_multiplier=vol_mult,
            intensity_multiplier=int_mult,
            overtraining_alert=overtraining_alert,
            recommendation=recommendation,
            component_scores={
                "hrv_normalized": hrv_norm,
                "sleep_normalized": sleep_norm,
                "rpe_normalized": rpe_norm,
                "doms_normalized": doms_norm
            },
            override_reason=override_reason
        )

        # Save to repository
        self.biometric_repo.save_sample(sample)

        if self.cache_service:
            self.cache_service.set(cache_key, score_obj, ttl_seconds=3600)

        return score_obj
