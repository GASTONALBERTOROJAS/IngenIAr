# High Gap Remediation Plan

## Goal
Close the approved High-priority repository gaps so the runtime behavior better matches the IngenIAr canonical workflow.

## Architecture

### Solution Overview
- Type of change: runtime contract alignment and agent scaffolding
- General approach: make the Claude runtime and OpenCode config explicitly reflect the same canonical flow already defined in `AGENTS.md` and `shared/agent_core/core.md`

### Components
1. `CLAUDE.md`
   - Align the Claude runtime contract with the canonical workflow
   - Make role usage explicit

2. `.claude/agents/`
   - Add missing role agents: prompt-engineer, architect, reviewer

3. `opencode.json`
   - Add shared core to runtime instructions
   - Make planning/architecture and QA/review handoff more explicit

### Risks & Considerations
- Keep wording simple and compatible with existing runtime conventions
- Avoid overengineering config fields that may not be used by all environments
- Preserve the mandatory QA gate

## Execution Plan

1. Update `CLAUDE.md`
   - Output: Claude contract aligned to the canonical flow and role model

2. Add missing Claude agents
   - Output: `prompt-engineer.md`, `architect.md`, `reviewer.md`

3. Update `opencode.json`
   - Output: stronger runtime instructions and explicit QA/review agents

4. Validate implementation
   - Output: review + QA records with PASS/FAIL

## Dependencies
- Agent additions depend on the clarified runtime contract in `CLAUDE.md`
- QA depends on all file updates being complete

## Scope Boundary
- Included: High-priority backlog items from `.ai-dev/artifacts/2026-04-20_repository-gap-report.md`
- Excluded for now: template runtime upgrades and broader `.ai-dev/` operating policy changes
