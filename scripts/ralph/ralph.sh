#!/bin/bash
# Ralph Loop Runner
# Usage: ./ralph.sh [--tool amp|claude] [max_iterations]

set -e

TOOL="amp"
MAX_ITERATIONS=10

while [[ $# -gt 0 ]]; do
  case $1 in
    --tool)
      TOOL="$2"
      shift 2
      ;;
    --tool=*)
      TOOL="${1#*=}"
      shift
      ;;
    *)
      if [[ "$1" =~ ^[0-9]+$ ]]; then
        MAX_ITERATIONS="$1"
      fi
      shift
      ;;
  esac
done

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
PRD_FILE="$ROOT_DIR/prd.json"
[ -f "$PRD_FILE" ] || PRD_FILE="$SCRIPT_DIR/prd.json"
PROGRESS_FILE="$ROOT_DIR/progress.txt"
[ -f "$PROGRESS_FILE" ] || PROGRESS_FILE="$SCRIPT_DIR/progress.txt"
ARCHIVE_DIR="$SCRIPT_DIR/archive"
LAST_BRANCH_FILE="$SCRIPT_DIR/.last-branch"

if [ ! -f "$PRD_FILE" ]; then
  echo "Error: prd.json not found in $ROOT_DIR or $SCRIPT_DIR."
  echo "Please generate prd.json first using the /ralph skill."
  exit 1
fi

# Archive previous run if branch changed
if [ -f "$PRD_FILE" ] && [ -f "$LAST_BRANCH_FILE" ]; then
  CURRENT_BRANCH=$(jq -r '.branchName // empty' "$PRD_FILE" 2>/dev/null || echo "")
  LAST_BRANCH=$(cat "$LAST_BRANCH_FILE" 2>/dev/null || echo "")

  if [ -n "$CURRENT_BRANCH" ] && [ -n "$LAST_BRANCH" ] && [ "$CURRENT_BRANCH" != "$LAST_BRANCH" ]; then
    DATE=$(date +%Y-%m-%d)
    CLEAN_NAME=$(echo "$LAST_BRANCH" | sed 's|^ralph/||')
    TARGET_ARCHIVE="$ARCHIVE_DIR/$DATE-$CLEAN_NAME"
    mkdir -p "$TARGET_ARCHIVE"
    [ -f "$PRD_FILE" ] && cp "$PRD_FILE" "$TARGET_ARCHIVE/"
    [ -f "$PROGRESS_FILE" ] && cp "$PROGRESS_FILE" "$TARGET_ARCHIVE/"
    echo "# Progress Log" > "$PROGRESS_FILE"
  fi
fi

jq -r '.branchName // empty' "$PRD_FILE" > "$LAST_BRANCH_FILE"

echo "=== Starting Ralph autonomous loop ==="
echo "Tool: $TOOL | Max Iterations: $MAX_ITERATIONS"
echo "PRD: $PRD_FILE"

for ((i=1; i<=MAX_ITERATIONS; i++)); do
  echo "--- Iteration $i of $MAX_ITERATIONS ---"
  REMAINING=$(jq '[.userStories[] | select(.passes == false)] | length' "$PRD_FILE")
  if [ "$REMAINING" -eq 0 ]; then
    echo "All user stories have passed! Ralph loop complete."
    exit 0
  fi

  echo "$REMAINING stories remaining."

  if [ "$TOOL" = "claude" ]; then
    claude -p "$(cat "$SCRIPT_DIR/prompt.md")"
  else
    amp --prompt "$(cat "$SCRIPT_DIR/prompt.md")"
  fi
done

echo "Reached maximum iterations ($MAX_ITERATIONS). Check progress.txt and prd.json."
