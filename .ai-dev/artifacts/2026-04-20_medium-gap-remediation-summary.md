# Medium Gap Remediation Summary

Date: 2026-04-20

## Scope

Implemented the approved Medium-priority fixes from `.ai-dev/artifacts/2026-04-20_repository-gap-report.md`.

## Changed Areas

### Base template hardening
- stronger `templates/base_project/AGENTS.md`
- stronger `templates/base_project/CLAUDE.md`
- richer `templates/base_project/opencode.json`
- starter Claude agents in `templates/base_project/.claude/agents/`
- project-local extension guidance in `templates/base_project/.claude/skills/` and `templates/base_project/.opencode/`
- clearer template README and starter `.ai-dev/` state guidance

### Traceability guidance
- root `.ai-dev/README.md`
- template `.ai-dev/README.md`
- template starter state file in `templates/base_project/.ai-dev/state/current_state.md`

### State and memory clarity
- updated `.ai-dev/state/current_state.md`
- updated `memory/state.md` with explicit status tags
- updated `README.md`, `memory/decisions.md`, and `memory/risks.md` to distinguish operational state from policy or project-specific history more clearly

## Outcome

- The base project template is now closer to a working local starter instead of a structural placeholder.
- `.ai-dev/` now has an explicit minimum operating convention.
- Repository state and memory now distinguish operational and pending context more clearly.

## Closure status

- Implementation complete for the approved Medium scope.
- Formal closure is supported by:
  - `.ai-dev/artifacts/2026-04-20_medium-gap-remediation-review.md`
  - `.ai-dev/qa/2026-04-20_medium-gap-remediation-qa.md`

## Remaining Out of Scope

- deeper runtime/template automation beyond the approved Medium backlog
