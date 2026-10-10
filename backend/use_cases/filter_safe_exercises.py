"""
NTRevo Use Case: FilterSafeExercisesUseCase (Application Business Rules)
Author: Dev1-BackendLead (dev1.backendlead@ntrevo.io)
Sprint: 3 - AI trong Thiết kế & Kiến trúc Phần mềm (Chương 5)
Orchestrates SafeExerciseSpecification and provides active recovery substitutes.
"""

from typing import List, Dict, Any, Optional
try:
    from backend.domain.entities import Exercise
    from backend.domain.specifications import SafeExerciseSpecification
    from backend.use_cases.interfaces import IExerciseRepository, ICacheService
except ImportError:
    from domain.entities import Exercise
    from domain.specifications import SafeExerciseSpecification
    from use_cases.interfaces import IExerciseRepository, ICacheService

class FilterSafeExercisesUseCase:
    """
    Evaluates exercises against the athlete's sore muscle groups.
    Marks exercises as SAFE or OVERLOAD_RISK, and generates safe mobility substitutes.
    """

    def __init__(self, exercise_repo: IExerciseRepository, cache_service: Optional[ICacheService] = None):
        self.exercise_repo = exercise_repo
        self.cache_service = cache_service

    def execute(self, body_part: Optional[str], sore_muscles: List[str], limit: int = 12) -> Dict[str, Any]:
        # Cache-Aside lookup if enabled
        cache_key = f"exercises:safe:{body_part or 'all'}:{','.join(sorted(sore_muscles))}:{limit}"
        if self.cache_service:
            cached_res = self.cache_service.get(cache_key)
            if cached_res is not None:
                cached_res["cached"] = True
                return cached_res

        # Retrieve exercises from repository
        if body_part:
            exercises = self.exercise_repo.find_by_body_part(body_part)
        else:
            exercises = self.exercise_repo.find_all(limit=100)

        safe_spec = SafeExerciseSpecification(sore_muscles=sore_muscles)
        safe_list: List[Dict[str, Any]] = []
        warning_list: List[Dict[str, Any]] = []

        for ex in exercises:
            is_safe = safe_spec.is_satisfied_by(ex)
            item = {
                "id": ex.id,
                "name": ex.name,
                "category": ex.category,
                "body_part": ex.body_part,
                "equipment": ex.equipment,
                "target": ex.target_muscle,
                "secondary_muscles": ex.secondary_muscles,
                "is_compound": ex.is_compound(),
                "is_safe": is_safe,
                "doms_warning": not is_safe,
                "warning_message": f"Tác động vào vùng cơ đang mỏi DOMS: {', '.join(sore_muscles)}" if not is_safe else None,
                "image": ex.image_url,
                "gif_url": ex.gif_url
            }

            if is_safe:
                safe_list.append(item)
            else:
                warning_list.append(item)

        # If sore muscles are present, fetch active recovery substitutes (mobility / gentle stretch)
        substitutes = []
        if sore_muscles and warning_list:
            mobility_exercises = self.exercise_repo.find_by_body_part("cardio") + self.exercise_repo.find_by_body_part("waist")
            substitutes = [
                {
                    "id": m.id,
                    "name": m.name,
                    "category": m.category,
                    "body_part": m.body_part,
                    "target": m.target_muscle,
                    "equipment": m.equipment,
                    "reason": "Bài tập thay thế phục hồi nhẹ nhàng không gây áp lực lên vùng cơ đang đau nhức"
                }
                for m in mobility_exercises[:4]
            ]

        result = {
            "total_evaluated": len(exercises),
            "safe_count": len(safe_list),
            "warning_count": len(warning_list),
            "sore_muscles_checked": sore_muscles,
            "safe_exercises": safe_list[:limit],
            "warning_exercises": warning_list[:limit],
            "substitutes": substitutes,
            "cached": False
        }

        if self.cache_service:
            self.cache_service.set(cache_key, result, ttl_seconds=1800)

        return result
