# Medium Gap Remediation Decision

Date: 2026-04-20

## Decision

Close the Medium-priority repository gaps by making the base project template locally usable and by documenting a minimum `.ai-dev/` operating convention.

## Applied In

- `templates/base_project/AGENTS.md`
- `templates/base_project/CLAUDE.md`
- `templates/base_project/opencode.json`
- `templates/base_project/.claude/agents/*`
- `templates/base_project/.claude/skills/README.md`
- `templates/base_project/.opencode/skills/README.md`
- `templates/base_project/.opencode/command/README.md`
- `.ai-dev/README.md`
- `templates/base_project/.ai-dev/README.md`
- `templates/base_project/.ai-dev/state/current_state.md`
- `.ai-dev/state/current_state.md`
- `memory/state.md`

## Rationale

- The gap report identified that the base template preserved structure but did not yet provide enough local runtime help.
- The root `.ai-dev/` tree needed an operating convention so future work would leave consistent state and QA evidence.
- `memory/state.md` needed clearer status boundaries to avoid mixing operational and pending notes.

## Consequences

- New generated projects now start with richer local runtime scaffolding.
- The repository now has an explicit minimum write policy for `.ai-dev/`.
- The remaining backlog is now concentrated in Low-priority documentation cleanup and future maturity improvements.
