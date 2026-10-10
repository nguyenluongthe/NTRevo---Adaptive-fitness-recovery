"""
NTRevo Clean Architecture Controllers (Layer 3: Interface Adapters)
Author: Dev1-BackendLead (dev1.backendlead@ntrevo.io)
Sprint: 3 - AI trong Thiết kế & Kiến trúc Phần mềm (Chương 5)
Handles HTTP parameter parsing and delegates to Use Cases.
"""

from typing import Dict, Any, Tuple
from datetime import datetime
try:
    from backend.adapters.repositories import JsonFileExerciseRepository, InMemoryBiometricRepository
    from backend.adapters.dtos import ExerciseDTO, ReadinessResponseDTO
    from backend.use_cases.filter_safe_exercises import FilterSafeExercisesUseCase
    from backend.use_cases.calculate_readiness import CalculateReadinessUseCase
    from backend.use_cases.generate_adaptive_workout import GenerateAdaptiveWorkoutUseCase
    from backend.domain.entities import BiometricSample
    from backend.cache.cache_manager import cache_manager
except ImportError:
    from adapters.repositories import JsonFileExerciseRepository, InMemoryBiometricRepository
    from adapters.dtos import ExerciseDTO, ReadinessResponseDTO
    from use_cases.filter_safe_exercises import FilterSafeExercisesUseCase
    from use_cases.calculate_readiness import CalculateReadinessUseCase
    from use_cases.generate_adaptive_workout import GenerateAdaptiveWorkoutUseCase
    from domain.entities import BiometricSample
    from cache.cache_manager import cache_manager

class ExerciseController:
    """Controller for Exercise catalog browsing and DOMS-safe filtering."""

    def __init__(self, exercise_repo: JsonFileExerciseRepository):
        self.exercise_repo = exercise_repo
        self.filter_use_case = FilterSafeExercisesUseCase(exercise_repo)

    def get_exercises(self, query_params: Dict[str, Any]) -> Tuple[int, Dict[str, Any]]:
        page = int(query_params.get("page", [1])[0]) if "page" in query_params else 1
        limit = int(query_params.get("limit", [12])[0]) if "limit" in query_params else 12
        search_query = query_params.get("search", [""])[0] if "search" in query_params else ""
        body_part = query_params.get("body_part", [None])[0] if "body_part" in query_params else None
        equipment = query_params.get("equipment", [None])[0] if "equipment" in query_params else None

        res = self.exercise_repo.search(
            query=search_query,
            body_part=body_part,
            equipment=equipment,
            page=page,
            limit=limit
        )

        return 200, {
            "total": res["total"],
            "page": res["page"],
            "limit": res["limit"],
            "total_pages": res["total_pages"],
            "data": [ExerciseDTO.to_dict(ex) for ex in res["items"]]
        }

    def get_exercise_by_id(self, exercise_id: str) -> Tuple[int, Dict[str, Any]]:
        ex = self.exercise_repo.get_by_id(exercise_id)
        if not ex:
            return 404, {"error": "Exercise not found", "id": exercise_id}
        return 200, ExerciseDTO.to_dict(ex)

    def get_categories(self) -> Tuple[int, Dict[str, Any]]:
        cats = self.exercise_repo.get_categories()
        return 200, cats

    def filter_safe(self, body_part: str, sore_muscles_str: str) -> Tuple[int, Dict[str, Any]]:
        sore_muscles = [m.strip() for m in sore_muscles_str.split(",") if m.strip()]
        result = self.filter_use_case.execute(body_part=body_part, sore_muscles=sore_muscles)
        return 200, result
