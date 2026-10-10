"""
NTRevo Data Transfer Objects (DTOs) & Serializers (Clean Architecture - Layer 3)
Author: Dev1-BackendLead (dev1.backendlead@ntrevo.io)
Sprint: 3 - AI trong Thiết kế & Kiến trúc Phần mềm (Chương 5)
100% Conforming to api/openapi_spec.yaml contracts.
"""

from typing import List, Dict, Any, Optional
try:
    from backend.domain.entities import Exercise, ReadinessScore
except ImportError:
    from domain.entities import Exercise, ReadinessScore

class ExerciseDTO:
    """DTO representing an Exercise item in API responses."""

    @staticmethod
    def to_dict(exercise: Exercise) -> Dict[str, Any]:
        return {
            "id": exercise.id,
            "name": exercise.name,
            "category": exercise.category,
            "body_part": exercise.body_part,
            "equipment": exercise.equipment,
            "target": exercise.target_muscle,
            "secondary_muscles": exercise.secondary_muscles,
            "image": exercise.image_url,
            "gif_url": exercise.gif_url,
            "attribution": "Exercises Dataset Public Domain / MIT",
            "instructions": {
                "en": exercise.instructions_en or ""
            }
        }

class ReadinessResponseDTO:
    """DTO representing the AI Recovery Engine evaluation response."""

    @staticmethod
    def to_dict(score: ReadinessScore, athlete_id: str, date_str: str) -> Dict[str, Any]:
        return {
            "athlete_id": athlete_id,
            "evaluation_date": date_str,
            "readiness_score": score.score_value,
            "classification": score.classification,
            "volume_multiplier": score.volume_multiplier,
            "intensity_multiplier": score.intensity_multiplier,
            "overtraining_alert": score.overtraining_alert,
            "recommendation": score.recommendation,
            "override_reason": score.override_reason,
            "component_scores": score.component_scores
        }
