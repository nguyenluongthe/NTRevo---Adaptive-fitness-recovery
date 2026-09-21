"""
Authentication and User Profile Route Handlers
Author: Dev1-BackendLead
"""

def handle_auth_routes(method, path, query, body):
    if path.endswith("/login") and method == "POST":
        email = body.get("email", "")
        return 200, {
            "success": True,
            "access_token": "mock-jwt-token-ntrevo-user-001",
            "token_type": "bearer",
            "expires_in": 86400,
            "user": {
                "id": "usr-101",
                "email": email or "athlete@ntrevo.io",
                "full_name": "Nguyen The Long",
                "role": "athlete"
            }
        }
    elif path.endswith("/profile") and method == "GET":
        return 200, {
            "id": "usr-101",
            "email": "athlete@ntrevo.io",
            "full_name": "Nguyen The Long",
            "age": 28,
            "height_cm": 178.5,
            "weight_kg": 74.0,
            "fitness_level": "intermediate",
            "primary_goal": "hypertrophy_and_conditioning"
        }
    return 404, {"error": "Auth route not found", "path": path}
