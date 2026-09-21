"""
NTRevo AI Recovery Engine & Adaptive Rules Service (Refactored for SOLID)
Author: Dev1-BackendLead (dev1.backendlead@ntrevo.io)
Sprint: 5 - Tái cấu trúc & Review Mã nguồn cùng AI
Refactored: Composed with Single-Responsibility Calculators & Centralized Config Provider
"""

from dataclasses import dataclass
from typing import List, Optional, Dict, Any

from backend.config.scoring_config import ScoringConfigProvider, default_scoring_config
from backend.services.calculators import HRVCalculator, SleepCalculator, SubjectiveFatigueCalculator

@dataclass
class BiometricInput:
    athlete_id: str
    hrv_rmssd: float          # ms
    sleep_hours: float        # hours
    deep_sleep_ratio: float   # 0.0 - 1.0
    doms_score: int           # 1 - 10
    rpe_previous_day: float   # 1.0 - 10.0
    baseline_hrv_mean: float = 62.0
    baseline_hrv_std: float = 6.5
    sore_muscle_groups: Optional[List[str]] = None

@dataclass
class RecoveryScoreResult:
    readiness_score: float             # 0.0 - 100.0
    classification: str                # Optimal, Modified, Active Recovery, Complete Rest
    volume_multiplier: float           # 0.0 - 1.10
    intensity_multiplier: float        # 0.0 - 1.00
    component_scores: Dict[str, float] # normalized [0-100] sub-scores
    recommendation: str
    overtraining_alert: bool
    override_reason: Optional[str] = None

class AIRecoveryEngine:
    """
    AI Recovery Engine refactored to adhere strictly to SOLID:
    - SRP: Delegates normalization to specialized calculator classes.
    - OCP: Configurable scoring parameters through Dependency Injection.
    - DIP: Relies on abstractions rather than hardcoded heuristics.
    """

    def __init__(self, config_provider: ScoringConfigProvider = default_scoring_config):
        self.config = config_provider

    def evaluate_readiness(self, data: BiometricInput) -> RecoveryScoreResult:
        # 1. Component normalization via dedicated calculators (SRP)
        hrv_norm = HRVCalculator.calculate(data.hrv_rmssd, data.baseline_hrv_mean, data.baseline_hrv_std)
        sleep_norm = SleepCalculator.calculate(data.sleep_hours, data.deep_sleep_ratio)
        rpe_norm = SubjectiveFatigueCalculator.normalize_rpe(data.rpe_previous_day)
        doms_norm = SubjectiveFatigueCalculator.normalize_doms(data.doms_score)

        # 2. Weighted synthesis using Config Provider
        w = self.config.weights
        composite_score = (
            (w.hrv * hrv_norm) +
            (w.sleep * sleep_norm) +
            (w.rpe * rpe_norm) +
            (w.doms * doms_norm)
        )
        composite_score = round(composite_score, 1)

        # 3. Check Overtraining / Safety Overrides
        overtraining_alert = False
        override_reason = None

        t = self.config.thresholds
        hrv_crash = data.hrv_rmssd < (data.baseline_hrv_mean - (t.hrv_crash_std_multiplier * data.baseline_hrv_std))
        extreme_doms = data.doms_score >= t.extreme_doms_threshold

        if hrv_crash:
            overtraining_alert = True
            override_reason = "HRV dropped >2.5 SD below 14-day baseline. Autonomic nervous system fatigue detected."
            composite_score = min(composite_score, 38.0)
        elif extreme_doms:
            overtraining_alert = True
            override_reason = f"Extreme localized DOMS (Level >= {t.extreme_doms_threshold}) reported. Musculoskeletal overload protection engaged."
            composite_score = min(composite_score, 45.0)

        # 4. Adaptive Rules Classification using Multiplier Config
        m = self.config.multipliers
        if composite_score >= t.optimal_threshold:
            classification = "Optimal / Full Session"
            vol_mult = m.optimal_volume
            int_mult = m.optimal_intensity
            recommendation = "Full training capacity. Recommended to pursue progressive overload or standard prescribed intensity."
        elif composite_score >= t.modified_threshold:
            classification = "Modified Intensity"
            vol_mult = m.modified_volume
            int_mult = m.modified_intensity
            recommendation = "Moderate recovery. Proceed with primary compound exercises, reduce accessory volume by 15%."
        elif composite_score >= t.active_recovery_threshold:
            classification = "Active Recovery"
            vol_mult = m.active_volume
            int_mult = m.active_intensity
            recommendation = "Suboptimal recovery. Pivot to Zone 2 cardio, mobility flow, and foam rolling."
        else:
            classification = "Complete Rest"
            vol_mult = m.rest_volume
            int_mult = m.rest_intensity
            recommendation = "Exhaustion risk. Take complete passive rest, prioritize 8+ hours sleep and protein repletion."

        return RecoveryScoreResult(
            readiness_score=composite_score,
            classification=classification,
            volume_multiplier=vol_mult,
            intensity_multiplier=int_mult,
            component_scores={
                "hrv_normalized": hrv_norm,
                "sleep_normalized": sleep_norm,
                "rpe_normalized": rpe_norm,
                "doms_normalized": doms_norm
            },
            recommendation=recommendation,
            overtraining_alert=overtraining_alert,
            override_reason=override_reason
        )
