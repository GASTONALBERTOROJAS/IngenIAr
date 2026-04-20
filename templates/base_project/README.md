# Base project template for new IngenIAr projects.

## What this template includes

- project-local `AGENTS.md` and `CLAUDE.md` aligned with the IngenIAr workflow
- project-local `opencode.json` with explicit planning, architecture, build, QA, and review entrypoints
- starter Claude agents under `.claude/agents/`
- extension folders for project-specific Claude and OpenCode assets
- `.ai-dev/` structure for traceability

## Intended usage

Use this template for new projects that live inside the IngenIAr repository and should inherit the same workflow discipline:

`interpret → structure → architecture → plan → implement → QA → close`

For new or ambiguous requests, start by structuring the requirement with RICO (Role, Instructions, Context, Objective) before architecture or implementation.

## Traceability

Record meaningful work in `.ai-dev/` as the project evolves.

This template provides working runtime starters and traceability scaffolding, but teams still need to maintain plans, decisions, review records, and QA evidence as real work happens.
