"""
NTRevo Centralized Scoring and Algorithm Configuration Provider
Author: Dev1-BackendLead (dev1.backendlead@ntrevo.io)
Sprint: 5 - Tái cấu trúc & Review Mã nguồn cùng AI
Eliminates: Hardcoded Magic Numbers (Clean Code Principle)
"""

from dataclasses import dataclass
from typing import Dict

@dataclass(frozen=True)
class WeightCoefficients:
    hrv: float = 0.40
    sleep: float = 0.30
    rpe: float = 0.15
    doms: float = 0.15

@dataclass(frozen=True)
class ThresholdConfig:
    optimal_threshold: float = 80.0
    modified_threshold: float = 60.0
    active_recovery_threshold: float = 40.0
    hrv_crash_std_multiplier: float = 2.5
    extreme_doms_threshold: int = 9

@dataclass(frozen=True)
class MultiplierConfig:
    optimal_volume: float = 1.05
    optimal_intensity: float = 1.00
    modified_volume: float = 0.85
    modified_intensity: float = 0.90
    active_volume: float = 0.50
    active_intensity: float = 0.60
    rest_volume: float = 0.00
    rest_intensity: float = 0.00

class ScoringConfigProvider:
    """
    Centralized configuration provider supporting environment customization
    and A/B algorithm testing without code modifications.
    """

    def __init__(
        self,
        weights: WeightCoefficients = WeightCoefficients(),
        thresholds: ThresholdConfig = ThresholdConfig(),
        multipliers: MultiplierConfig = MultiplierConfig()
    ):
        self.weights = weights
        self.thresholds = thresholds
        self.multipliers = multipliers

# Default Global Configuration Instance
default_scoring_config = ScoringConfigProvider()
