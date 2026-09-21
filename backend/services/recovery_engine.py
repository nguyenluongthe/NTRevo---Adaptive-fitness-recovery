"""
NTRevo AI Recovery Engine & Adaptive Rules Service
Author: Dev1-BackendLead (dev1.backendlead@ntrevo.io)
Sprint: 4 - AI Lập trình (Code Generation & Completion)
Standard: Clean Architecture Domain Service
"""

from dataclasses import dataclass
from typing import List, Optional, Tuple, Dict, Any
import math

@dataclass
class BiometricInput:
    athlete_id: str
    hrv_rmssd: float          # ms (e.g. 64.0)
    sleep_hours: float        # hours (e.g. 7.8)
    deep_sleep_ratio: float   # 0.0 - 1.0 (e.g. 0.22)
    doms_score: int           # 1 - 10 (e.g. 3)
    rpe_previous_day: float   # 1.0 - 10.0 (e.g. 7.5)
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
    Core AI scoring and adaptive volume engine synthesized through AI Pair Programming.
    Applies multi-variable normalization and sports science recovery regression.
    """

    # Weights configuration
    W_HRV = 0.40
    W_SLEEP = 0.30
    W_RPE = 0.15
    W_DOMS = 0.15

    def normalize_hrv(self, hrv_today: float, baseline_mean: float, baseline_std: float) -> float:
        """
        Normalizes HRV (rMSSD) based on athlete's rolling baseline using Z-score sigmoid.
        """
        if baseline_std <= 0:
            baseline_std = 5.0
        z_score = (hrv_today - baseline_mean) / baseline_std
        # Center at 50, standard deviation scaling
        score = 50.0 + (z_score * 20.0)
        return max(0.0, min(100.0, round(score, 2)))

    def normalize_sleep(self, sleep_hours: float, deep_sleep_ratio: float) -> float:
        """
        Synthesizes total sleep duration (70%) and deep sleep restorative ratio (30%).
        Optimal target: 8.0 hours sleep, 20% deep sleep.
        """
        duration_score = (min(sleep_hours, 9.0) / 8.0) * 70.0
        deep_score = (min(deep_sleep_ratio, 0.30) / 0.20) * 30.0
        total_sleep_norm = duration_score + deep_score
        return max(0.0, min(100.0, round(total_sleep_norm, 2)))

    def normalize_rpe(self, rpe: float) -> float:
        """
        Inverse linear scale for previous day perceived exertion (Borg CR10).
        RPE 1 = 100% fresh, RPE 10 = 0% fresh.
        """
        clamped_rpe = max(1.0, min(10.0, rpe))
        norm = 100.0 - ((clamped_rpe - 1.0) * (100.0 / 9.0))
        return max(0.0, min(100.0, round(norm, 2)))

    def normalize_doms(self, doms: int) -> float:
        """
        Inverse linear scale for delayed onset muscle soreness (DOMS 1-10).
        DOMS 1 = 100% (No soreness), DOMS 10 = 0% (Extreme pain).
        """
        clamped_doms = max(1, min(10, doms))
        norm = 100.0 - ((clamped_doms - 1) * (100.0 / 9.0))
        return max(0.0, min(100.0, round(norm, 2)))

    def evaluate_readiness(self, data: BiometricInput) -> RecoveryScoreResult:
        """
        Calculates composite readiness score and evaluates adaptive training rules.
        """
        # 1. Component normalization
        hrv_norm = self.normalize_hrv(data.hrv_rmssd, data.baseline_hrv_mean, data.baseline_hrv_std)
        sleep_norm = self.normalize_sleep(data.sleep_hours, data.deep_sleep_ratio)
        rpe_norm = self.normalize_rpe(data.rpe_previous_day)
        doms_norm = self.normalize_doms(data.doms_score)

        # 2. Weighted synthesis
        composite_score = (
            (self.W_HRV * hrv_norm) +
            (self.W_SLEEP * sleep_norm) +
            (self.W_RPE * rpe_norm) +
            (self.W_DOMS * doms_norm)
        )
        composite_score = round(composite_score, 1)

        # 3. Check for Overtraining / Safety Overrides
        overtraining_alert = False
        override_reason = None

        hrv_crash = data.hrv_rmssd < (data.baseline_hrv_mean - (2.5 * data.baseline_hrv_std))
        extreme_doms = data.doms_score >= 9

        if hrv_crash:
            overtraining_alert = True
            override_reason = "HRV dropped >2.5 standard deviations below 14-day baseline. Autonomic nervous system fatigue detected."
            composite_score = min(composite_score, 38.0)
        elif extreme_doms:
            overtraining_alert = True
            override_reason = "Extreme localized DOMS (Level >= 9) reported. Musculoskeletal overload protection engaged."
            composite_score = min(composite_score, 45.0)

        # 4. Adaptive Rules Classification
        if composite_score >= 80.0:
            classification = "Optimal / Full Session"
            vol_mult = 1.05
            int_mult = 1.00
            recommendation = "Full training capacity. Recommended to pursue progressive overload or standard prescribed intensity."
        elif composite_score >= 60.0:
            classification = "Modified Intensity"
            vol_mult = 0.85
            int_mult = 0.90
            recommendation = "Moderate recovery. Proceed with primary compound exercises, reduce accessory volume by 15%."
        elif composite_score >= 40.0:
            classification = "Active Recovery"
            vol_mult = 0.50
            int_mult = 0.60
            recommendation = "Suboptimal recovery. Pivot to Zone 2 cardio, mobility flow, and foam rolling."
        else:
            classification = "Complete Rest"
            vol_mult = 0.00
            int_mult = 0.00
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
