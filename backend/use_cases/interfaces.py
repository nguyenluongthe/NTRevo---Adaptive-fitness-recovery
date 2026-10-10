"""
NTRevo Abstract Ports / Repository Interfaces (Clean Architecture - Layer 2)
Author: Dev1-BackendLead (dev1.backendlead@ntrevo.io)
Sprint: 3 - AI trong Thiết kế & Kiến trúc Phần mềm (Chương 5)
Follows Dependency Inversion Principle (DIP) - Use cases define interfaces, outer layers implement them.
"""

from abc import ABC, abstractmethod
from typing import List, Optional, Dict, Any
try:
    from backend.domain.entities import Exercise, Athlete, BiometricSample, WorkoutSession
except ImportError:
    from domain.entities import Exercise, Athlete, BiometricSample, WorkoutSession

class IExerciseRepository(ABC):
    """Port for accessing exercise dataset catalog."""

    @abstractmethod
    def get_by_id(self, exercise_id: str) -> Optional[Exercise]:
        pass

    @abstractmethod
    def find_all(self, limit: int = 100, offset: int = 0) -> List[Exercise]:
        pass

    @abstractmethod
    def find_by_body_part(self, body_part: str) -> List[Exercise]:
        pass

    @abstractmethod
    def find_by_target(self, target: str) -> List[Exercise]:
        pass

    @abstractmethod
    def search(self, query: str, body_part: Optional[str] = None, equipment: Optional[str] = None, page: int = 1, limit: int = 12) -> Dict[str, Any]:
        pass

    @abstractmethod
    def get_categories(self) -> Dict[str, List[str]]:
        pass

class IBiometricRepository(ABC):
    """Port for athlete biometric telemetry logs."""

    @abstractmethod
    def get_latest_sample(self, athlete_id: str) -> Optional[BiometricSample]:
        pass

    @abstractmethod
    def save_sample(self, sample: BiometricSample) -> None:
        pass

    @abstractmethod
    def get_history(self, athlete_id: str, days: int = 7) -> List[BiometricSample]:
        pass

class IWorkoutRepository(ABC):
    """Port for workout sessions and plans."""

    @abstractmethod
    def get_scheduled_workout(self, user_id: str, date_str: str) -> Optional[WorkoutSession]:
        pass

    @abstractmethod
    def save_workout(self, session: WorkoutSession) -> None:
        pass

class ICacheService(ABC):
    """Port for high-speed caching abstraction (Cache-Aside pattern)."""

    @abstractmethod
    def get(self, key: str) -> Optional[Any]:
        pass

    @abstractmethod
    def set(self, key: str, value: Any, ttl_seconds: Optional[int] = None) -> None:
        pass

    @abstractmethod
    def delete(self, key: str) -> bool:
        pass
