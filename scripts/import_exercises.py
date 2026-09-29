"""
Exercise Dataset Importer for NTRevo / VKU Project
Extracts curated diverse exercises from D:/data/exercises-dataset/data/exercises.json
"""
import json
import os

SOURCE_PATH = r"D:\data\exercises-dataset\data\exercises.json"
TARGET_PATH = r"d:\CD4\NTRevo\data\exercises.json"

def main():
    if not os.path.exists(SOURCE_PATH):
        print(f"Error: Source file not found at {SOURCE_PATH}")
        return

    with open(SOURCE_PATH, 'r', encoding='utf-8') as f:
        all_exercises = json.load(f)

    print(f"Loaded {len(all_exercises)} exercises from source dataset.")

    # Group by body_part
    by_body_part = {}
    for ex in all_exercises:
        bp = ex.get('body_part', 'other')
        by_body_part.setdefault(bp, []).append(ex)

    print(f"Found body parts: {list(by_body_part.keys())}")

    # Pick up to 15 diverse exercises per body part (prioritizing different targets/equipment)
    selected = []
    for bp, items in sorted(by_body_part.items()):
        seen_targets = set()
        part_selected = []
        # First pass: one of each target
        for ex in items:
            target = ex.get('target', '')
            if target not in seen_targets and len(part_selected) < 15:
                seen_targets.add(target)
                part_selected.append(ex)
        # Second pass if needed
        for ex in items:
            if len(part_selected) >= 15:
                break
            if ex not in part_selected:
                part_selected.append(ex)
        selected.extend(part_selected)
        print(f"  - {bp}: selected {len(part_selected)} exercises")

    print(f"Total curated exercises: {len(selected)}")

    os.makedirs(os.path.dirname(TARGET_PATH), exist_ok=True)
    with open(TARGET_PATH, 'w', encoding='utf-8') as f:
        json.dump(selected, f, ensure_ascii=False, indent=2)

    print(f"Successfully saved to {TARGET_PATH}")

if __name__ == '__main__':
    main()
