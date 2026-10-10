"""
NTRevo Exercise Route Handlers (REST API Layer)
Author: Dev1-BackendLead (dev1.backendlead@ntrevo.io)
Sprint: 3 - AI trong Thiết kế & Kiến trúc Phần mềm (Chương 5)
Connects HTTP endpoints to ExerciseController (Clean Architecture).
"""

from typing import Tuple, Dict, Any
try:
    from backend.adapters.repositories import JsonFileExerciseRepository
    from backend.adapters.controllers import ExerciseController
    from backend.infra.sdui_loader import SduiLayoutLoader
except ImportError:
    from adapters.repositories import JsonFileExerciseRepository
    from adapters.controllers import ExerciseController
    from infra.sdui_loader import SduiLayoutLoader

_repo = JsonFileExerciseRepository()
_controller = ExerciseController(_repo)
_sdui_loader = SduiLayoutLoader()

def handle_exercise_routes(method: str, path: str, query: Dict[str, Any], body: Any) -> Tuple[int, Dict[str, Any]]:
    # GET /api/v1/exercises/categories
    if method == "GET" and "/categories" in path:
        return _controller.get_categories()

    # GET /api/v1/exercises/safe-filter?body_part=shoulders&sore_muscles=shoulders,quads
    if method == "GET" and "/safe-filter" in path:
        body_part = query.get("body_part", [""])[0]
        sore = query.get("sore_muscles", [""])[0]
        return _controller.filter_safe(body_part, sore)

    # GET /api/v1/exercises/:id
    if method == "GET" and path.startswith("/api/v1/exercises/"):
        ex_id = path.replace("/api/v1/exercises/", "").strip()
        if ex_id and not "/" in ex_id:
            return _controller.get_exercise_by_id(ex_id)

    # GET /api/v1/exercises
    if method == "GET" and (path == "/api/v1/exercises" or path == "/api/v1/exercises/"):
        return _controller.get_exercises(query)

    return 404, {"error": "Exercise endpoint not found", "path": path}

def handle_sdui_routes(method: str, path: str, query: Dict[str, Any], body: Any) -> Tuple[int, Dict[str, Any]]:
    # GET /api/v1/sdui/layouts/:id
    if method == "GET" and "/layouts/" in path:
        layout_name = path.split("/layouts/")[-1].strip()
        layout_json = _sdui_loader.get_layout(layout_name)
        if layout_json:
            return 200, layout_json
        return 404, {"error": "SDUI Layout not found", "layout": layout_name}

    return 404, {"error": "SDUI endpoint not found", "path": path}
