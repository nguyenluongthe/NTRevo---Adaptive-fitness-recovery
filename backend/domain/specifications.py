"""
NTRevo Domain Specifications (Design Pattern: Specification Pattern)
Author: Dev1-BackendLead (dev1.backendlead@ntrevo.io)
Sprint: 3 - AI trong Thiết kế & Kiến trúc Phần mềm (Chương 5)
Enables composable business rules for exercise safety and selection.
"""

from abc import ABC, abstractmethod
from typing import List, Any
try:
    from backend.domain.entities import Exercise
except ImportError:
    from domain.entities import Exercise

class Specification(ABC):
    """Abstract Base Specification with Boolean combinators."""

    @abstractmethod
    def is_satisfied_by(self, candidate: Any) -> bool:
        pass

    def __and__(self, other: "Specification") -> "Specification":
        return AndSpecification(self, other)

    def __or__(self, other: "Specification") -> "Specification":
        return OrSpecification(self, other)

    def __invert__(self) -> "Specification":
        return NotSpecification(self)

class AndSpecification(Specification):
    def __init__(self, spec1: Specification, spec2: Specification):
        self.spec1 = spec1
        self.spec2 = spec2

    def is_satisfied_by(self, candidate: Any) -> bool:
        return self.spec1.is_satisfied_by(candidate) and self.spec2.is_satisfied_by(candidate)

class OrSpecification(Specification):
    def __init__(self, spec1: Specification, spec2: Specification):
        self.spec1 = spec1
        self.spec2 = spec2

    def is_satisfied_by(self, candidate: Any) -> bool:
        return self.spec1.is_satisfied_by(candidate) or self.spec2.is_satisfied_by(candidate)

class NotSpecification(Specification):
    def __init__(self, spec: Specification):
        self.spec = spec

    def is_satisfied_by(self, candidate: Any) -> bool:
        return not self.spec.is_satisfied_by(candidate)

class SafeExerciseSpecification(Specification):
    """
    Validates whether an exercise is safe given acute sore muscle groups (DOMS >= 7).
    Disqualifies any exercise whose primary target or secondary muscles overlap with sore muscles.
    """
    def __init__(self, sore_muscles: List[str]):
        self.sore_muscles = [m.strip().lower() for m in sore_muscles if m]

    def is_satisfied_by(self, exercise: Exercise) -> bool:
        if not self.sore_muscles:
            return True

        for sore in self.sore_muscles:
            if exercise.affects_muscle(sore):
                return False
        return True

class EquipmentAvailableSpecification(Specification):
    """Verifies that the required equipment is available in the athlete's environment."""
    def __init__(self, available_equipments: List[str]):
        self.available_equipments = [eq.strip().lower() for eq in available_equipments]

    def is_satisfied_by(self, exercise: Exercise) -> bool:
        return exercise.equipment.lower() in self.available_equipments

class CompoundMovementSpecification(Specification):
    """Verifies if an exercise is a multi-joint compound movement."""
    def is_satisfied_by(self, exercise: Exercise) -> bool:
        return exercise.is_compound()
