"""
NTRevo Infrastructure: Server-Driven UI (SDUI) Schema Loader
Author: Dev1-BackendLead (dev1.backendlead@ntrevo.io)
Sprint: 3 - AI trong Thiết kế & Kiến trúc Phần mềm (Chương 5)
Loads and parses dynamic wireframe JSON schema for client renderers.
"""

import os
import json
from typing import Dict, Any, Optional

class SduiLayoutLoader:
    """Loads and serves JSON layouts for Server-Driven UI."""

    def __init__(self, design_dir: Optional[str] = None):
        if not design_dir:
            base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
            design_dir = os.path.join(base_dir, "design")
        self.design_dir = design_dir

    def get_layout(self, layout_name: str) -> Optional[Dict[str, Any]]:
        filename = f"{layout_name}.json" if not layout_name.endswith(".json") else layout_name
        file_path = os.path.join(self.design_dir, filename)

        if not os.path.exists(file_path):
            # Try appending _wireframe
            alt_path = os.path.join(self.design_dir, f"{layout_name}_wireframe.json")
            if os.path.exists(alt_path):
                file_path = alt_path
            else:
                return None

        with open(file_path, "r", encoding="utf-8") as f:
            return json.load(f)
