# State

Status tags:
- [Operational]
- [Pending]
- [Planned]

Repository-wide operational state for IngenIAr.
Project-specific histories → project-level state, decisions, QA artifacts, or Engram session memory.
[Operational] = implemented + reflected in repository contract, templates, or validated project state.

## Current Repository Status
- [Operational] Repository converted into IngenIAr base with Claude + OpenCode support.
- [Operational] Root runtime contracts align with canonical workflow in `AGENTS.md`.
- [Operational] Claude runtime: Prompt Engineer, Architect, Planner, Developer, QA, Reviewer agents.
- [Operational] OpenCode runtime: explicit planning, architecture, build, QA, review entrypoints.
- [Operational] Base project template includes stronger local runtime starters + `.ai-dev/` guidance.
- [Operational] Root `.ai-dev/README.md` defines minimum operating convention for repository traceability.
- [Operational] Documentation + memory files distinguish operational state, policy, project-specific history.
- [Operational] 2026-04-20 High, Medium, Low backlog has matching closure evidence in `.ai-dev/`.
- [Operational] Enforcement layer: `scripts/validate_ingeniar.py` (governance), `scripts/new_project.py` (scaffolding), `.pre-commit-config.yaml` (hooks), `.github/workflows/validate.yml` (CI).
- [Operational] All projects under `projects/` have `.ai-dev/` governance + runtime files.
- [Operational] Security layer: `opencode.json` uses `{env:XXX}` references, real secrets in `.env.secrets` (gitignored), leak detection via `scripts/detect_secrets.py` (pre-commit), guide at `shared/docs/security.md`.
- [Operational] Caveman token optimization: `juliusbrussee/caveman` integrated, default `full` mode, skills in `.opencode/skills/` + `.claude/skills/`, Claude Code hooks installed, .md files compressed for input token savings.

## Active Constraints
- [Operational] `AGENTS.md` = primary policy layer.
- [Operational] Meaningful work flow: interpret → structure → architecture → plan → implement → QA → close.
- [Operational] All new projects inside `projects/` using `python scripts/new_project.py`.
- [Operational] No meaningful implementation complete without QA record in `.ai-dev/qa/`.
- [Operational] Pre-commit hook blocks governance violations; CI blocks merge on push/PR.
- [Operational] Pre-commit hook blocks leaked secrets (GitHub tokens, DB passwords, API keys).

## Pending
- [Pending] No blocking repository gaps from 2026-04-20 gap report.

## Planned
- [Planned] Refine project templates as recurring needs appear in real project usage.
- [Planned] Add content-level governance checks (e.g. verify QA records not empty) if needed.
- [Planned] Install pre-commit hooks on each developer machine (`pip install pre-commit && pre-commit install`).
