"""
NTRevo Domain Entities (Clean Architecture - Layer 1: Enterprise Business Rules)
Author: Dev1-BackendLead (dev1.backendlead@ntrevo.io)
Sprint: 3 - AI trong Thiết kế & Kiến trúc Phần mềm (Chương 5)
Pure Python Dataclasses with Zero External Framework Dependencies.
"""

from dataclasses import dataclass, field
from typing import List, Optional, Dict, Any
from datetime import datetime

@dataclass(frozen=True)
class Exercise:
    """Core Domain Entity representing an exercise from the catalog."""
    id: str
    name: str
    category: str
    body_part: str
    equipment: str
    target_muscle: str
    secondary_muscles: List[str] = field(default_factory=list)
    image_url: Optional[str] = None
    gif_url: Optional[str] = None
    instructions_en: Optional[str] = None

    def is_compound(self) -> bool:
        """Determines if the exercise is a compound multi-joint movement."""
        return len(self.secondary_muscles) >= 2 or self.equipment in ("barbell", "body weight", "olympic barbell")

    def affects_muscle(self, muscle_name: str) -> bool:
        """Checks if this exercise engages a given muscle as primary or synergist."""
        m_lower = muscle_name.strip().lower()
        if self.target_muscle.lower() == m_lower or self.body_part.lower() == m_lower:
            return True
        return any(m_lower in sec.lower() for sec in self.secondary_muscles)

@dataclass
class Athlete:
    """Core Domain Entity representing the registered user/athlete."""
    id: str
    email: str
    full_name: str
    role: str = "athlete"
    age: int = 25
    gender: str = "male"
    height_cm: float = 175.0
    weight_kg: float = 70.0
    fitness_level: str = "intermediate"
    primary_goal: str = "hypertrophy_and_conditioning"

    def calculate_bmi(self) -> float:
        height_m = self.height_cm / 100.0
        return round(self.weight_kg / (height_m ** 2), 2)

@dataclass
class MusclePainEntry:
    """Represents a localized delayed onset muscle soreness (DOMS) assessment."""
    muscle_group: str
    pain_level: int  # 1 to 10 scale (Borg CR10)

    def is_severe(self, threshold: int = 7) -> bool:
        return self.pain_level >= threshold

@dataclass
class BiometricSample:
    """Biometric snapshot logged on morning check-in."""
    id: str
    athlete_id: str
    recorded_at: datetime
    hrv_rmssd: float
    resting_hr: int
    sleep_hours: float
    deep_sleep_ratio: float
    doms_score: int
    rpe_previous_day: float
    sore_muscles: List[str] = field(default_factory=list)

    def is_hrv_depressed(self, baseline_hrv: float, threshold_pct: float = 0.20) -> bool:
        """Flags if HRV has dropped more than threshold percentage below baseline."""
        return self.hrv_rmssd < (baseline_hrv * (1.0 - threshold_pct))

@dataclass
class ReadinessScore:
    """Output of AI Recovery Engine evaluation."""
    score_value: int  # 0 to 100
    classification: str  # Optimal, Modified, Active Recovery, Complete Rest
    volume_multiplier: float
    intensity_multiplier: float
    overtraining_alert: bool
    recommendation: str
    component_scores: Dict[str, int] = field(default_factory=dict)
    override_reason: Optional[str] = None

@dataclass
class ExerciseSet:
    """Represents an executed set in a workout session."""
    id: str
    exercise_id: Optional[str]
    exercise_name: str
    set_order: int
    target_reps: int
    actual_reps: Optional[int] = None
    target_weight_kg: float = 0.0
    actual_weight_kg: Optional[float] = None
    rpe_actual: Optional[float] = None

@dataclass
class WorkoutSession:
    """Domain Entity representing a scheduled or completed workout session."""
    id: str
    user_id: str
    plan_id: Optional[str]
    title: str
    scheduled_date: str
    session_type: str  # Strength, HIIT, Cardio, Mobility
    intensity_target: str
    exercise_sets: List[ExerciseSet] = field(default_factory=list)
    status: str = "pending"  # pending, in_progress, completed, skipped

    def calculate_total_volume(self) -> float:
        """Volume in kg: sum(weight * reps) across completed sets."""
        total = 0.0
        for s in self.exercise_sets:
            if s.actual_weight_kg is not None and s.actual_reps is not None:
                total += s.actual_weight_kg * s.actual_reps
        return round(total, 2)

    def calculate_average_rpe(self) -> float:
        rpes = [s.rpe_actual for s in self.exercise_sets if s.rpe_actual is not None]
        if not rpes:
            return 0.0
        return round(sum(rpes) / len(rpes), 2)
