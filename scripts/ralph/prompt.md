# Ralph Agent Instructions

You are an autonomous coding agent working on a software project.

## Your Task

1. Read the PRD at `prd.json` (in the project root or current directory).
2. Read the progress log at `progress.txt` (check Codebase Patterns section first).
3. Check you're on the correct branch from PRD `branchName`. If not, check it out or create it.
4. Pick the **highest priority** user story where `passes: false`.
5. Implement that single user story.
6. Run quality checks (e.g., typecheck, lint, test - use whatever your project requires).
7. If checks pass, commit ALL changes with message: `feat: [Story ID] - [Story Title]`.
8. Update the PRD to set `passes: true` for the completed story.
9. Append your progress to `progress.txt`.

## Progress Report Format

APPEND to `progress.txt` (never replace, always append):

```markdown
## [Date/Time] - [Story ID]
- What was implemented: ...
- Files changed: ...
- **Learnings for future iterations:**
  - Patterns discovered: ...
  - Gotchas encountered: ...
  - Useful context: ...
---
```

The learnings section is critical - it helps future iterations avoid repeating mistakes and understand the codebase better.

## Consolidate Patterns

If you discover a **reusable pattern** that future iterations should know, add it to the `## Codebase Patterns` section at the TOP of `progress.txt` (create it if it doesn't exist). This section consolidates the most important learnings:

```markdown
## Codebase Patterns
- Example: Use specific patterns for state management
- Example: Always run lint and typecheck before committing
```
