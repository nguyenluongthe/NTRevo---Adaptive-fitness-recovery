"""
NTRevo Use Case: GenerateAdaptiveWorkoutUseCase (Application Business Rules)
Author: Dev1-BackendLead (dev1.backendlead@ntrevo.io)
Sprint: 3 - AI trong Thiết kế & Kiến trúc Phần mềm (Chương 5)
Leverages Strategy Pattern and Factory Pattern to generate auto-regulated routines.
"""

from typing import Dict, Any, Optional
try:
    from backend.domain.entities import ReadinessScore, WorkoutSession
    from backend.services.workout_strategies import WorkoutStrategyFactory
    from backend.use_cases.interfaces import IWorkoutRepository, ICacheService
except ImportError:
    from domain.entities import ReadinessScore, WorkoutSession
    from services.workout_strategies import WorkoutStrategyFactory
    from use_cases.interfaces import IWorkoutRepository, ICacheService

class GenerateAdaptiveWorkoutUseCase:
    """
    Assembles auto-regulated daily workout routines using GoF Strategy & Factory patterns.
    """

    def __init__(self, workout_repo: Optional[IWorkoutRepository] = None, cache_service: Optional[ICacheService] = None):
        self.workout_repo = workout_repo
        self.cache_service = cache_service

    def execute(
        self,
        athlete_id: str,
        session_type: str,
        readiness: ReadinessScore
    ) -> Dict[str, Any]:
        cache_key = f"user:{athlete_id}:workout:{session_type.lower()}:adaptive"
        if self.cache_service:
            cached = self.cache_service.get(cache_key)
            if cached is not None:
                cached["cached"] = True
                return cached

        # Use Factory to obtain the corresponding Strategy
        strategy = WorkoutStrategyFactory.get_strategy(session_type)

        # Generate routine using strategy
        routine = strategy.generate_routine(
            readiness_score=float(readiness.score_value),
            volume_multiplier=readiness.volume_multiplier,
            intensity_multiplier=readiness.intensity_multiplier
        )

        response = {
            "athlete_id": athlete_id,
            "session_type": session_type,
            "readiness_score": readiness.score_value,
            "classification": readiness.classification,
            "volume_multiplier": readiness.volume_multiplier,
            "intensity_multiplier": readiness.intensity_multiplier,
            "overtraining_alert": readiness.overtraining_alert,
            "recommendation": readiness.recommendation,
            "routine": routine,
            "cached": False
        }

        if self.cache_service:
            self.cache_service.set(cache_key, response, ttl_seconds=1800)

        return response
