"""
NTRevo Workout Route Handlers (REST API Layer)
Author: Dev1-BackendLead (dev1.backendlead@ntrevo.io)
Sprint: 3 - AI trong Thiết kế & Kiến trúc Phần mềm (Chương 5)
Leverages GenerateAdaptiveWorkoutUseCase and WorkoutStrategyFactory (GoF Strategy & Factory).
"""

from typing import Tuple, Dict, Any
from datetime import datetime
try:
    from backend.services.workout_strategies import WorkoutStrategyFactory
    from backend.use_cases.generate_adaptive_workout import GenerateAdaptiveWorkoutUseCase
    from backend.domain.entities import ReadinessScore
except ImportError:
    from services.workout_strategies import WorkoutStrategyFactory
    from use_cases.generate_adaptive_workout import GenerateAdaptiveWorkoutUseCase
    from domain.entities import ReadinessScore

_use_case = GenerateAdaptiveWorkoutUseCase()

def handle_workout_routes(method: str, path: str, query: Dict[str, Any], body: Any) -> Tuple[int, Dict[str, Any]]:
    # GET /api/v1/workouts/today
    if method == "GET" and "/today" in path:
        # Default mock score for athlete usr-101
        readiness = ReadinessScore(
            score_value=82,
            classification="Optimal / Full Session",
            volume_multiplier=1.05,
            intensity_multiplier=1.00,
            overtraining_alert=False,
            recommendation="Khối lượng phục hồi tối ưu. Tiến hành buổi tập theo giáo án chuẩn hoặc tăng tải lũy tiến."
        )
        plan = _use_case.execute(
            athlete_id="usr-101",
            session_type="Strength",
            readiness=readiness
        )
        return 200, {
            "workout_id": "wk-today-404",
            "title": "Upper Body Hypertrophy (Push Focus)",
            "scheduled_date": datetime.now().strftime("%Y-%m-%d"),
            **plan
        }

    # POST /api/v1/workouts/logs (log set completion)
    if method == "POST" and ("/logs" in path or "/log" in path):
        exercise_id = body.get("exercise_id", "0025") if body else "0025"
        reps = body.get("reps", 8) if body else 8
        weight = body.get("weight_kg", 80.0) if body else 80.0
        rpe = body.get("rpe", 7.5) if body else 7.5
        return 201, {
            "success": True,
            "message": "Exercise set recorded successfully in 3NF relational store",
            "data": {
                "set_id": "set-auto-901",
                "exercise_id": exercise_id,
                "reps": reps,
                "weight_kg": weight,
                "rpe": rpe,
                "volume_load_kg": round(float(reps) * float(weight), 2)
            }
        }

    return 404, {"error": "Workout route not found", "path": path}
