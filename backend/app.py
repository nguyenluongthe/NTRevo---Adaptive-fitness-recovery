"""
NTRevo Adaptive Fitness & Recovery Platform - Backend Application Entrypoint
Author: Dev1-BackendLead (dev1.backendlead@ntrevo.io)
Sprint: 1 - AI trong Phân tích Yêu cầu & Sản phẩm
"""

import json
from http.server import HTTPServer, BaseHTTPRequestHandler
import urllib.parse
from routes.auth_routes import handle_auth_routes
from routes.assessment_routes import handle_assessment_routes
from routes.recovery_routes import handle_recovery_routes
from routes.workout_routes import handle_workout_routes

API_PREFIX = "/api/v1"
PORT = 8000

class NTRevoRequestHandler(BaseHTTPRequestHandler):
    def _send_json_response(self, status_code, data):
        response_body = json.dumps(data, indent=2).encode('utf-8')
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.send_header("Content-Length", str(len(response_body)))
        self.end_headers()
        self.wfile.write(response_body)

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.end_headers()

    def do_GET(self):
        parsed_url = urllib.parse.urlparse(self.path)
        path = parsed_url.path
        query = urllib.parse.parse_qs(parsed_url.query)

        if path == "/" or path == f"{API_PREFIX}/health":
            self._send_json_response(200, {
                "status": "healthy",
                "service": "NTRevo Backend API Engine",
                "version": "1.0.0",
                "environment": "development",
                "modules": ["auth", "assessment", "recovery", "workouts"]
            })
            return

        # Route matching
        if path.startswith(f"{API_PREFIX}/auth"):
            status, res = handle_auth_routes("GET", path, query, None)
            self._send_json_response(status, res)
        elif path.startswith(f"{API_PREFIX}/assessment"):
            status, res = handle_assessment_routes("GET", path, query, None)
            self._send_json_response(status, res)
        elif path.startswith(f"{API_PREFIX}/recovery"):
            status, res = handle_recovery_routes("GET", path, query, None)
            self._send_json_response(status, res)
        elif path.startswith(f"{API_PREFIX}/workouts"):
            status, res = handle_workout_routes("GET", path, query, None)
            self._send_json_response(status, res)
        else:
            self._send_json_response(404, {"error": "Endpoint not found", "path": path})

    def do_POST(self):
        parsed_url = urllib.parse.urlparse(self.path)
        path = parsed_url.path
        content_length = int(self.headers.get("Content-Length", 0))
        body_data = {}
        if content_length > 0:
            raw_body = self.rfile.read(content_length).decode('utf-8')
            try:
                body_data = json.loads(raw_body)
            except Exception:
                body_data = {"raw": raw_body}

        if path.startswith(f"{API_PREFIX}/auth"):
            status, res = handle_auth_routes("POST", path, {}, body_data)
            self._send_json_response(status, res)
        elif path.startswith(f"{API_PREFIX}/assessment"):
            status, res = handle_assessment_routes("POST", path, {}, body_data)
            self._send_json_response(status, res)
        elif path.startswith(f"{API_PREFIX}/recovery"):
            status, res = handle_recovery_routes("POST", path, {}, body_data)
            self._send_json_response(status, res)
        elif path.startswith(f"{API_PREFIX}/workouts"):
            status, res = handle_workout_routes("POST", path, {}, body_data)
            self._send_json_response(status, res)
        else:
            self._send_json_response(404, {"error": "Endpoint not found", "path": path})

def run_server(port=PORT):
    server_address = ('', port)
    httpd = HTTPServer(server_address, NTRevoRequestHandler)
    print(f"[*] NTRevo Backend Server running on http://localhost:{port}")
    httpd.serve_forever()

if __name__ == "__main__":
    run_server()
