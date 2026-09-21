"""
NTRevo Adaptive Workout Planner Engine
Author: Dev1-BackendLead (dev1.backendlead@ntrevo.io)
Sprint: 4 - AI Lập trình (Code Generation & Completion)
"""

from typing import List, Dict, Any, Optional
from backend.services.recovery_engine import RecoveryScoreResult

class AdaptivePlanner:
    """
    Dynamically adjusts volume, intensity, and exercises based on AI Readiness Score
    and localized muscular soreness signals.
    """

    EXERCISE_SUBSTITUTIONS = {
        "Barbell Back Squat": {
            "sore_legs": "Leg Press (Reduced Spinal Load)",
            "sore_back": "Belt Squat / Goblet Squat"
        },
        "Barbell Deadlift": {
            "sore_back": "Chest-Supported Dumbbell Row",
            "sore_hamstrings": "Leg Curl Machine"
        },
        "Barbell Bench Press": {
            "sore_shoulders": "Neutral-Grip Dumbbell Floor Press"
        }
    }

    def adapt_workout(
        self,
        base_workout: Dict[str, Any],
        recovery: RecoveryScoreResult,
        sore_muscles: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        """
        Applies volume multiplier, intensity recalculations, and exercise swaps.
        """
        sore_muscles = [m.lower() for m in (sore_muscles or [])]
        adapted_workout = {
            "workout_id": base_workout.get("workout_id", "wk-adapted"),
            "original_title": base_workout.get("title", "Standard Workout"),
            "adapted_title": f"{base_workout.get('title', 'Workout')} ({recovery.classification})",
            "classification": recovery.classification,
            "readiness_score": recovery.readiness_score,
            "volume_multiplier": recovery.volume_multiplier,
            "intensity_multiplier": recovery.intensity_multiplier,
            "recommendation": recovery.recommendation,
            "exercises": []
        }

        # If Complete Rest, clear exercises and provide recovery protocol
        if recovery.classification == "Complete Rest":
            adapted_workout["exercises"] = []
            adapted_workout["rest_protocol"] = [
                "20-minute Box Breathing (4s Inhale, 4s Hold, 4s Exhale, 4s Hold)",
                "Full hydration (35ml/kg bodyweight + electrolytes)",
                "8.5+ hours restorative sleep focus"
            ]
            return adapted_workout

        # If Active Recovery, swap for Zone 2 cardio & mobility
        if recovery.classification == "Active Recovery":
            adapted_workout["exercises"] = [
                {"name": "Incline Treadmill Walk (Zone 2 HR)", "sets": 1, "duration_minutes": 30, "target_hr": "120-135 bpm"},
                {"name": "Thoracic Spine Foam Rolling & World's Greatest Stretch", "sets": 3, "duration_minutes": 10, "intensity": "Light"}
            ]
            return adapted_workout

        # Adapt existing exercises
        for ex in base_workout.get("exercises", []):
            ex_name = ex.get("name", "")
            adapted_name = ex_name
            swap_note = None

            # Check muscle soreness substitution
            if any("leg" in m or "quad" in m for m in sore_muscles) and ex_name in self.EXERCISE_SUBSTITUTIONS and "sore_legs" in self.EXERCISE_SUBSTITUTIONS[ex_name]:
                adapted_name = self.EXERCISE_SUBSTITUTIONS[ex_name]["sore_legs"]
                swap_note = "Swapped to reduce patellar / quad shear stress due to reported DOMS."
            elif any("back" in m for m in sore_muscles) and ex_name in self.EXERCISE_SUBSTITUTIONS and "sore_back" in self.EXERCISE_SUBSTITUTIONS[ex_name]:
                adapted_name = self.EXERCISE_SUBSTITUTIONS[ex_name]["sore_back"]
                swap_note = "Swapped to deload lumbar spine due to reported lower back tightness."

            # Calculate adapted sets and reps
            base_sets = ex.get("sets", 3)
            adapted_sets = max(2, int(round(base_sets * recovery.volume_multiplier)))
            base_reps = ex.get("reps", 10)
            target_rpe = round(ex.get("rpe_target", 8.0) * recovery.intensity_multiplier, 1)

            adapted_ex = {
                "name": adapted_name,
                "original_name": ex_name if adapted_name != ex_name else None,
                "sets": adapted_sets,
                "reps": base_reps,
                "rpe_target": target_rpe,
                "substitution_applied": bool(swap_note),
                "substitution_reason": swap_note
            }
            adapted_workout["exercises"].append(adapted_ex)

        return adapted_workout
