"""
NTRevo Specialized Biometric Calculators (Single Responsibility Principle)
Author: Dev1-BackendLead (dev1.backendlead@ntrevo.io)
Sprint: 5 - Tái cấu trúc & Review Mã nguồn cùng AI
SOLID Principle: S - Single Responsibility Principle (SRP)
"""

import math

class HRVCalculator:
    """Calculates autonomic nervous system parasympathetic tone from raw rMSSD."""

    @staticmethod
    def calculate(hrv_today: float, baseline_mean: float, baseline_std: float) -> float:
        if baseline_std <= 0:
            baseline_std = 5.0
        z_score = (hrv_today - baseline_mean) / baseline_std
        score = 50.0 + (z_score * 20.0)
        return max(0.0, min(100.0, round(score, 2)))

class SleepCalculator:
    """Evaluates restorative sleep duration and deep slow-wave sleep percentage."""

    @staticmethod
    def calculate(sleep_hours: float, deep_sleep_ratio: float) -> float:
        duration_score = (min(sleep_hours, 9.0) / 8.0) * 70.0
        deep_score = (min(deep_sleep_ratio, 0.30) / 0.20) * 30.0
        total = duration_score + deep_score
        return max(0.0, min(100.0, round(total, 2)))

class SubjectiveFatigueCalculator:
    """Normalizes perceived exertion (RPE 1-10) and muscle soreness (DOMS 1-10)."""

    @staticmethod
    def normalize_rpe(rpe: float) -> float:
        clamped = max(1.0, min(10.0, rpe))
        norm = 100.0 - ((clamped - 1.0) * (100.0 / 9.0))
        return max(0.0, min(100.0, round(norm, 2)))

    @staticmethod
    def normalize_doms(doms: int) -> float:
        clamped = max(1, min(10, doms))
        norm = 100.0 - ((clamped - 1) * (100.0 / 9.0))
        return max(0.0, min(100.0, round(norm, 2)))
