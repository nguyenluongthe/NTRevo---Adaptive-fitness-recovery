"""
NTRevo Interface Adapters: Concrete Repositories (Clean Architecture - Layer 3)
Author: Dev1-BackendLead (dev1.backendlead@ntrevo.io)
Sprint: 3 - AI trong Thiết kế & Kiến trúc Phần mềm (Chương 5)
Implements IExerciseRepository, IBiometricRepository, and IWorkoutRepository.
"""

import os
import json
from typing import List, Optional, Dict, Any
from datetime import datetime
try:
    from backend.domain.entities import Exercise, BiometricSample, WorkoutSession
    from backend.use_cases.interfaces import IExerciseRepository, IBiometricRepository, IWorkoutRepository
except ImportError:
    from domain.entities import Exercise, BiometricSample, WorkoutSession
    from use_cases.interfaces import IExerciseRepository, IBiometricRepository, IWorkoutRepository

class JsonFileExerciseRepository(IExerciseRepository):
    """
    Adapter reading from data/exercises.json.
    Builds in-memory hash maps for body parts and target muscles to ensure sub-5ms lookups.
    """

    def __init__(self, json_path: Optional[str] = None):
        if not json_path:
            base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
            json_path = os.path.join(base_dir, "data", "exercises.json")
        self.json_path = json_path
        self._exercises_by_id: Dict[str, Exercise] = {}
        self._exercises_by_body_part: Dict[str, List[Exercise]] = {}
        self._exercises_by_target: Dict[str, List[Exercise]] = {}
        self._exercises_list: List[Exercise] = []
        self._load_data()

    def _load_data(self) -> None:
        if not os.path.exists(self.json_path):
            return

        with open(self.json_path, "r", encoding="utf-8") as f:
            raw_list = json.load(f)

        for item in raw_list:
            # Flatten or format secondary muscles
            sec_muscles = item.get("secondary_muscles", [])
            if isinstance(sec_muscles, str):
                sec_muscles = [s.strip() for s in sec_muscles.split(",") if s.strip()]

            # Extract instructions
            instructions_text = ""
            instr = item.get("instructions")
            if isinstance(instr, dict):
                instructions_text = instr.get("en", "")
            elif isinstance(instr, str):
                instructions_text = instr

            ex = Exercise(
                id=str(item.get("id", "")),
                name=item.get("name", ""),
                category=item.get("category", item.get("body_part", "")),
                body_part=item.get("body_part", ""),
                equipment=item.get("equipment", ""),
                target_muscle=item.get("target", item.get("target_muscle", "")),
                secondary_muscles=sec_muscles,
                image_url=item.get("image", item.get("image_url")),
                gif_url=item.get("gif_url"),
                instructions_en=instructions_text
            )

            self._exercises_list.append(ex)
            self._exercises_by_id[ex.id] = ex

            bp = ex.body_part.lower()
            if bp not in self._exercises_by_body_part:
                self._exercises_by_body_part[bp] = []
            self._exercises_by_body_part[bp].append(ex)

            tgt = ex.target_muscle.lower()
            if tgt not in self._exercises_by_target:
                self._exercises_by_target[tgt] = []
            self._exercises_by_target[tgt].append(ex)

    def get_by_id(self, exercise_id: str) -> Optional[Exercise]:
        return self._exercises_by_id.get(str(exercise_id))

    def find_all(self, limit: int = 100, offset: int = 0) -> List[Exercise]:
        return self._exercises_list[offset:offset + limit]

    def find_by_body_part(self, body_part: str) -> List[Exercise]:
        return self._exercises_by_body_part.get(body_part.lower().strip(), [])

    def find_by_target(self, target: str) -> List[Exercise]:
        return self._exercises_by_target.get(target.lower().strip(), [])

    def search(
        self,
        query: str = "",
        body_part: Optional[str] = None,
        equipment: Optional[str] = None,
        page: int = 1,
        limit: int = 12
    ) -> Dict[str, Any]:
        results = self._exercises_list

        if body_part:
            bp_lower = body_part.lower().strip()
            results = [e for e in results if e.body_part.lower() == bp_lower]

        if equipment:
            eq_lower = equipment.lower().strip()
            results = [e for e in results if eq_lower in e.equipment.lower()]

        if query:
            q = query.lower().strip()
            results = [e for e in results if q in e.name.lower() or q in e.target_muscle.lower()]

        total = len(results)
        start = (page - 1) * limit
        paginated = results[start:start + limit]

        return {
            "total": total,
            "page": page,
            "limit": limit,
            "total_pages": (total + limit - 1) // limit if limit > 0 else 0,
            "items": paginated
        }

    def get_categories(self) -> Dict[str, List[str]]:
        body_parts = sorted(list(self._exercises_by_body_part.keys()))
        targets = sorted(list(self._exercises_by_target.keys()))
        equipments = sorted(list({e.equipment.lower() for e in self._exercises_list if e.equipment}))
        return {
            "body_parts": body_parts,
            "targets": targets,
            "equipments": equipments
        }

class InMemoryBiometricRepository(IBiometricRepository):
    """In-memory telemetry store for unit testing and local sandbox."""

    def __init__(self):
        self._samples: Dict[str, List[BiometricSample]] = {}

    def get_latest_sample(self, athlete_id: str) -> Optional[BiometricSample]:
        user_samples = self._samples.get(athlete_id, [])
        return user_samples[-1] if user_samples else None

    def save_sample(self, sample: BiometricSample) -> None:
        if sample.athlete_id not in self._samples:
            self._samples[sample.athlete_id] = []
        self._samples[sample.athlete_id].append(sample)

    def get_history(self, athlete_id: str, days: int = 7) -> List[BiometricSample]:
        return self._samples.get(athlete_id, [])[-days:]

class InMemoryWorkoutRepository(IWorkoutRepository):
    """In-memory workout repository."""

    def __init__(self):
        self._workouts: Dict[str, WorkoutSession] = {}

    def get_scheduled_workout(self, user_id: str, date_str: str) -> Optional[WorkoutSession]:
        key = f"{user_id}:{date_str}"
        return self._workouts.get(key)

    def save_workout(self, session: WorkoutSession) -> None:
        key = f"{session.user_id}:{session.scheduled_date}"
        self._workouts[key] = session
