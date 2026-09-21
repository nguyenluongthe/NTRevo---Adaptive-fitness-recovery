"""
AI Recovery Engine Route Handlers - Integrated with AI Engine & Cache Manager
Author: Dev1-BackendLead (dev1.backendlead@ntrevo.io)
Sprint: 4 - AI Lập trình (Code Generation & Completion)
"""

import time
from backend.services.recovery_engine import AIRecoveryEngine, BiometricInput
from backend.cache.cache_manager import cache_manager

recovery_engine = AIRecoveryEngine()

def handle_recovery_routes(method, path, query, body):
    user_id = query.get("user_id", ["usr-101"])[0] if query else "usr-101"
    cache_key = f"user:{user_id}:readiness:today"

    if method == "GET" and "/today" in path:
        # Check Cache first (sub-5ms response time)
        cached_result = cache_manager.get(cache_key)
        if cached_result:
            return 200, {**cached_result, "cached": True}

        # Simulate fetching recent biometric input
        bio_input = BiometricInput(
            athlete_id=user_id,
            hrv_rmssd=64.0,
            sleep_hours=7.8,
            deep_sleep_ratio=0.22,
            doms_score=3,
            rpe_previous_day=7.0
        )
        t_start = time.perf_counter()
        evaluation = recovery_engine.evaluate_readiness(bio_input)
        latency_ms = round((time.perf_counter() - t_start) * 1000, 2)

        response_payload = {
            "date": "2026-09-08",
            "athlete_id": user_id,
            "readiness_score": evaluation.readiness_score,
            "classification": evaluation.classification,
            "volume_multiplier": evaluation.volume_multiplier,
            "intensity_multiplier": evaluation.intensity_multiplier,
            "components": evaluation.component_scores,
            "recommendation": evaluation.recommendation,
            "overtraining_alert": evaluation.overtraining_alert,
            "calculation_latency_ms": latency_ms,
            "cached": False
        }

        # Store in cache
        cache_manager.set(cache_key, response_payload, ttl_seconds=3600)
        return 200, response_payload

    elif method == "POST" and "/log" in path:
        # Invalidate previous cache
        cache_manager.invalidate_user(user_id)

        bio_input = BiometricInput(
            athlete_id=user_id,
            hrv_rmssd=float(body.get("hrv_rmssd", 60.0)),
            sleep_hours=float(body.get("sleep_hours", 7.0)),
            deep_sleep_ratio=float(body.get("deep_sleep_ratio", 0.18)),
            doms_score=int(body.get("doms_score", 3)),
            rpe_previous_day=float(body.get("rpe_previous_day", 7.0)),
            sore_muscle_groups=body.get("sore_muscles", [])
        )
        evaluation = recovery_engine.evaluate_readiness(bio_input)

        response_payload = {
            "success": True,
            "log_id": f"rec-{int(time.time())}",
            "readiness_score": evaluation.readiness_score,
            "classification": evaluation.classification,
            "volume_multiplier": evaluation.volume_multiplier,
            "recommendation": evaluation.recommendation,
            "cache_invalidated": True
        }
        # Populate warm cache
        cache_manager.set(cache_key, response_payload, ttl_seconds=3600)
        return 201, response_payload

    return 404, {"error": "Recovery route not found", "path": path}
