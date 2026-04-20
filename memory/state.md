# State

Status tags used below:
- [Operational]
- [Pending]
- [Planned]

This file tracks the current repository-wide operational state for IngenIAr.
Project-specific histories should live in project-level state, decisions, QA artifacts, or Engram session memory.
Here, [Operational] means implemented and currently reflected in the repository contract, templates, or validated project state.

## Current Repository Status
- [Operational] Repository converted into IngenIAr base with Claude + OpenCode support.
- [Operational] Root runtime contracts now align more closely with the canonical workflow defined in `AGENTS.md`.
- [Operational] Claude runtime includes Prompt Engineer, Architect, Planner, Developer, QA, and Reviewer agents.
- [Operational] OpenCode runtime includes explicit planning, architecture, build, QA, and review entrypoints.
- [Operational] The base project template now includes stronger local runtime starters and project-level `.ai-dev/` guidance.
- [Operational] Root `.ai-dev/README.md` defines the minimum operating convention for repository traceability.
- [Operational] Repository documentation and memory files now distinguish operational state, policy, and project-specific history more clearly.
- [Operational] The 2026-04-20 High, Medium, and Low repository backlog has matching closure evidence in `.ai-dev/`.
- [Operational] Enforcement layer active: `scripts/validate_ingeniar.py` (governance validation), `scripts/new_project.py` (template scaffolding), `.pre-commit-config.yaml` (pre-commit hooks), `.github/workflows/validate.yml` (CI pipeline).
- [Operational] All existing projects under `projects/` have `.ai-dev/` governance layer and runtime files.
- [Operational] Security layer active: `opencode.json` uses `__SECRET_XXX__` placeholders, real secrets in `.env.secrets` (gitignored), injection via `scripts/setup_secrets.py`, leak detection via `scripts/detect_secrets.py` (pre-commit hook), guide at `shared/docs/security.md`.

## Active Constraints
- [Operational] Always follow `AGENTS.md` as the primary policy layer.
- [Operational] For meaningful work, keep the flow as interpret → structure → architecture → plan → implement → QA → close.
- [Operational] All new projects must be created inside `projects/` using `python scripts/new_project.py`.
- [Operational] Meaningful implementation work is not considered complete without a QA record in `.ai-dev/qa/`.
- [Operational] Pre-commit hook blocks commits that violate governance; CI blocks merging on push/PR.
- [Operational] Pre-commit hook blocks commits containing leaked secrets (GitHub tokens, DB passwords, API keys).
- [Operational] Before committing, restore opencode.json placeholders with `git checkout -- opencode.json`.

## Pending
- [Pending] No blocking repository gaps remain from the 2026-04-20 gap report.

## Planned
- [Planned] Keep refining project templates as new recurring needs appear in real project usage.
- [Planned] Add content-level governance checks (e.g. verify QA records are not empty) if needed in future.
- [Planned] Install pre-commit hooks on each developer machine (`pip install pre-commit && pre-commit install`).
