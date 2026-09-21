"""
NTRevo Workout Strategy & Factory Module (SOLID Refactoring)
Author: Dev1-BackendLead (dev1.backendlead@ntrevo.io)
Sprint: 5 - Tái cấu trúc & Review Mã nguồn cùng AI
Design Patterns: Strategy Pattern + Factory Pattern
Eliminates: Long Method, Switch Statements, and Hardcoded Conditionals
"""

from abc import ABC, abstractmethod
from typing import Dict, List, Any

class WorkoutStrategy(ABC):
    """
    Abstract Strategy Interface representing a workout adaptation philosophy.
    Adheres to Open/Closed Principle (OCP) - New modalities can be added without modifying existing code.
    """

    @abstractmethod
    def get_modality_name(self) -> str:
        pass

    @abstractmethod
    def generate_routine(
        self,
        readiness_score: float,
        volume_multiplier: float,
        intensity_multiplier: float
    ) -> Dict[str, Any]:
        pass

class StrengthWorkoutStrategy(WorkoutStrategy):
    """Heavy compound resistance training with progressive overload auto-regulation."""

    def get_modality_name(self) -> str:
        return "Strength"

    def generate_routine(self, readiness_score: float, volume_multiplier: float, intensity_multiplier: float) -> Dict[str, Any]:
        base_sets = 4
        adapted_sets = max(2, int(round(base_sets * volume_multiplier)))
        target_rpe = round(8.0 * intensity_multiplier, 1)

        return {
            "session_type": "Strength",
            "focus": "Hypertrophy & Neuromuscular Drive",
            "volume_multiplier": volume_multiplier,
            "intensity_multiplier": intensity_multiplier,
            "exercises": [
                {"name": "Barbell Bench Press", "sets": adapted_sets, "reps": 8, "rpe_target": target_rpe},
                {"name": "Barbell Back Squat", "sets": adapted_sets, "reps": 6, "rpe_target": target_rpe},
                {"name": "Pendlay Row", "sets": adapted_sets, "reps": 8, "rpe_target": max(6.0, target_rpe - 0.5)},
                {"name": "Standing Overhead Press", "sets": max(2, adapted_sets - 1), "reps": 10, "rpe_target": target_rpe}
            ]
        }

class HIITWorkoutStrategy(WorkoutStrategy):
    """High-Intensity Interval Training with cardiovascular interval pacing."""

    def get_modality_name(self) -> str:
        return "HIIT"

    def generate_routine(self, readiness_score: float, volume_multiplier: float, intensity_multiplier: float) -> Dict[str, Any]:
        intervals = max(4, int(round(8 * volume_multiplier)))
        work_sec = int(round(40 * intensity_multiplier))
        rest_sec = 60

        return {
            "session_type": "HIIT",
            "focus": "Anaerobic Lactic Capacity & EPOC",
            "intervals_count": intervals,
            "work_interval_sec": work_sec,
            "rest_interval_sec": rest_sec,
            "exercises": [
                {"name": "Kettlebell Swings", "work": f"{work_sec}s", "rest": f"{rest_sec}s"},
                {"name": "Assault Bike Sprints", "work": f"{work_sec}s", "rest": f"{rest_sec}s"},
                {"name": "Burpee Box Jump-Overs", "work": f"{work_sec}s", "rest": f"{rest_sec}s"}
            ]
        }

class CardioWorkoutStrategy(WorkoutStrategy):
    """Zone 2 aerobic base building and cardiovascular recovery."""

    def get_modality_name(self) -> str:
        return "Cardio"

    def generate_routine(self, readiness_score: float, volume_multiplier: float, intensity_multiplier: float) -> Dict[str, Any]:
        duration_min = max(20, int(round(45 * volume_multiplier)))
        target_hr_zone = "Zone 2 (60-70% Max HR)"

        return {
            "session_type": "Cardio",
            "focus": "Mitochondrial Density & Aerobic Base",
            "target_duration_minutes": duration_min,
            "target_heart_rate_zone": target_hr_zone,
            "exercises": [
                {"name": "Steady-State Rowing or Cycling", "duration": f"{duration_min} mins", "intensity": target_hr_zone}
            ]
        }

class MobilityWorkoutStrategy(WorkoutStrategy):
    """Myofascial release, joint decoaptation, and restorative parasympathetic recovery."""

    def get_modality_name(self) -> str:
        return "Mobility"

    def generate_routine(self, readiness_score: float, volume_multiplier: float, intensity_multiplier: float) -> Dict[str, Any]:
        return {
            "session_type": "Mobility",
            "focus": "Parasympathetic Tone & Active Rest",
            "duration_minutes": 25,
            "exercises": [
                {"name": "90/90 Hip Flow", "duration": "5 mins", "intensity": "Restorative"},
                {"name": "Cat-Cow & Thoracic Extension", "duration": "5 mins", "intensity": "Restorative"},
                {"name": "Couch Stretch & Psoas Opener", "duration": "8 mins", "intensity": "Restorative"},
                {"name": "Legs-Up-The-Wall Box Breathing", "duration": "7 mins", "intensity": "Downregulation"}
            ]
        }

class WorkoutStrategyFactory:
    """
    Factory Pattern for dynamic strategy instantiation.
    Decouples clients from concrete implementations.
    """

    _registry: Dict[str, type] = {
        "strength": StrengthWorkoutStrategy,
        "hiit": HIITWorkoutStrategy,
        "cardio": CardioWorkoutStrategy,
        "mobility": MobilityWorkoutStrategy
    }

    @classmethod
    def register_strategy(cls, modality_name: str, strategy_class: type) -> None:
        """Allows runtime plugin extension of new training modalities."""
        cls._registry[modality_name.lower()] = strategy_class

    @classmethod
    def get_strategy(cls, session_type: str) -> WorkoutStrategy:
        strategy_class = cls._registry.get(session_type.lower())
        if not strategy_class:
            # Fallback to Strength default
            strategy_class = StrengthWorkoutStrategy
        return strategy_class()
