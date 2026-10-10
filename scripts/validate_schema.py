#!/usr/bin/env python3
"""
Database Schema Validator Script
Complies with NTRevo database safety and naming policies:
1. Safety: No DROP TABLE statements allowed.
2. Naming: All table names must follow snake_case.
3. Structure: Every table must define an 'id' column as PRIMARY KEY.
"""

import sys
import re

def validate_sql_schema(file_path: str) -> bool:
    print(f"[*] Validating database schema: {file_path}")
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
    except Exception as e:
        print(f"[ERROR] Failed to read schema file: {e}")
        return False

    errors = []
    
    # 1. Safety Policy: Check for DROP TABLE
    drop_matches = re.findall(r"\bDROP\s+TABLE\b", content, re.IGNORECASE)
    if drop_matches:
        errors.append(f"Safety Violation: Found {len(drop_matches)} forbidden 'DROP TABLE' statement(s).")

    # 2. Extract CREATE TABLE statements
    # Pattern to match table name and column definitions
    table_pattern = re.compile(
        r"CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?([a-zA-Z0-9_]+)\s*\((.*?)\);",
        re.DOTALL | re.IGNORECASE
    )
    
    tables = table_pattern.findall(content)
    if not tables:
        errors.append("Structure Violation: No CREATE TABLE statements found in file.")

    snake_case_regex = re.compile(r"^[a-z]+(_[a-z0-9]+)*$")

    for table_name, table_body in tables:
        # Naming Policy: snake_case
        if not snake_case_regex.match(table_name):
            errors.append(f"Naming Violation: Table '{table_name}' is not in snake_case format.")

        # Structure Policy: id column as PRIMARY KEY
        has_id_pk = False
        lines = [line.strip() for line in table_body.split("\n") if line.strip()]
        for line in lines:
            line_clean = re.sub(r"--.*$", "", line).strip()
            # Check for inline: id ... PRIMARY KEY
            if re.match(r"^id\s+[a-zA-Z0-9_\(\)]+\s+PRIMARY\s+KEY", line_clean, re.IGNORECASE):
                has_id_pk = True
                break
            # Or table-level: PRIMARY KEY (id)
            if re.match(r"^PRIMARY\s+KEY\s*\(\s*id\s*\)", line_clean, re.IGNORECASE):
                has_id_pk = True
                break

        if not has_id_pk:
            errors.append(f"Structure Violation: Table '{table_name}' does not have an 'id' column designated as PRIMARY KEY.")

    if errors:
        print("[!] Validation FAILED with errors:")
        for err in errors:
            print(f"  - {err}")
        return False

    print(f"[+] Validation PASSED: {len(tables)} tables verified successfully.")
    print("    - Safety: No DROP TABLE detected.")
    print("    - Naming: 100% tables follow snake_case.")
    print("    - Structure: 100% tables have 'id' PRIMARY KEY.")
    return True

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python scripts/validate_schema.py <path_to_schema_sql>")
        sys.exit(1)

    schema_file = sys.argv[1]
    success = validate_sql_schema(schema_file)
    sys.exit(0 if success else 1)
