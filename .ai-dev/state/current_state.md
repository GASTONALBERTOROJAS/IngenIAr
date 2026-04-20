
# IngenIAr Current State

## Operational baseline

- Base repository migrated from an OpenCode-centric AI developer scaffold.
- Claude runtime support added alongside the OpenCode runtime.
- QA closure gate added at system level.
- MCP-ready architecture documented, with Context7 wired and Engram/n8n kept optional by design.
- Existing projects preserved as source projects, but cleaned from generated artifacts and local secrets in this deliverable.

## Validated repository status

- Root `CLAUDE.md` aligns with the canonical IngenIAr workflow and explicitly applies Prompt Engineer, Architect, Planner, Developer, QA, and Reviewer roles.
- Root `opencode.json` includes `shared/agent_core/core.md` in active instructions and explicit `architect`, `qa`, and `review` entrypoints.
- Root Claude runtime includes operational agent files for `prompt-engineer`, `architect`, and `reviewer` under `.claude/agents/`.
- Root `.ai-dev/README.md` defines the minimum operating convention for `requirements/`, `plans/`, `loops/`, `decisions/`, `runs/`, `state/`, `qa/`, and `artifacts/`.
- The base project template includes local runtime starters for Prompt Engineer, Architect, Planner, Developer, QA, and Reviewer, plus project-level `.ai-dev/` guidance.
- Repository documentation and memory files now distinguish operational state, policy, and project-specific history more clearly.
- Enforcement layer now active: governance is validated automatically via scripts, pre-commit hooks, and CI.
- New projects must be created via `python scripts/new_project.py` — the validator blocks non-compliant projects.
- All existing projects under `projects/` have `.ai-dev/` and runtime files.
- Security layer now active: secrets use placeholder model, injection via `setup_secrets.py`, leak detection via `detect_secrets.py` (pre-commit hook), and `.env.secrets` is gitignored.

## Closure evidence

- High-priority runtime-alignment remediation: `.ai-dev/artifacts/2026-04-20_high-gap-remediation-review.md` and `.ai-dev/qa/2026-04-20_high-gap-remediation-qa.md`
- Medium-priority template and traceability remediation: `.ai-dev/artifacts/2026-04-20_medium-gap-remediation-review.md` and `.ai-dev/qa/2026-04-20_medium-gap-remediation-qa.md`
- Repository-wide closeout: `.ai-dev/artifacts/2026-04-20_repository-closeout-review.md`, `.ai-dev/qa/2026-04-20_repository-closeout-qa.md`, and `.ai-dev/artifacts/2026-04-20_repository-closeout-summary.md`
- Enforcement layer: `.ai-dev/artifacts/2026-04-20_enforcement-layer-review.md` and `.ai-dev/qa/2026-04-20_enforcement-layer-qa.md`
- Security remediation: `.ai-dev/qa/2026-04-20_security-remediation-qa.md`

## Active reference

- Historical backlog definition remains in `.ai-dev/artifacts/2026-04-20_repository-gap-report.md`
