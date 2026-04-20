# Runtime Alignment Decision

Date: 2026-04-20

## Decision

Align the active runtime entrypoints with the canonical IngenIAr workflow instead of leaving the full role model only in documentation.

## Applied In

- `CLAUDE.md`
- `.claude/agents/prompt-engineer.md`
- `.claude/agents/architect.md`
- `.claude/agents/reviewer.md`
- `opencode.json`

## Rationale

- The gap report identified incomplete Claude role coverage as a High-priority issue.
- The OpenCode runtime relied too heavily on implicit behavior instead of explicit workflow guidance.
- Strengthening the runtime contracts improves consistency between documented behavior and executable scaffolding.

## Consequences

- Claude runtime now exposes the missing non-coding and review roles.
- OpenCode runtime now includes the shared core in active instructions and explicit QA/review agent entrypoints.
- Medium and Low gaps remain for later iterations, especially templates and systematic `.ai-dev/` operating rules.
