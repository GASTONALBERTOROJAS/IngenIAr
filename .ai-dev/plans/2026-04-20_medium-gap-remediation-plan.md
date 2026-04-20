# Medium Gap Remediation Plan

## Goal
Close the approved Medium-priority repository gaps by strengthening the base project template and turning `.ai-dev/` traceability into a documented operating practice.

## Architecture

### Solution Overview
- Type of change: template hardening and operational traceability guidance
- General approach: make the base template usable with local runtime starter assets, and define a minimal write policy for `.ai-dev/` so future work leaves consistent evidence

### Components
1. `templates/base_project/`
   - Expand local runtime entrypoints
   - Add minimal starter assets for Claude and OpenCode extension points
   - Improve template README guidance

2. `.ai-dev/`
   - Add a root operating convention for traceability folders
   - Update current state to reflect live operating guidance and remaining scope

3. `memory/state.md`
   - Distinguish operational state from pending/planned notes more clearly

### Risks & Considerations
- Avoid making the template heavier than necessary
- Keep template assets generic and project-safe
- Preserve compatibility with the already-aligned root runtime contract

## Execution Plan

1. Upgrade base template runtime files
   - Output: richer `templates/base_project/AGENTS.md`, `CLAUDE.md`, and `opencode.json`

2. Add template starter assets
   - Output: minimal `.claude/agents/*` and `.opencode/*` guidance assets in the base template

3. Define `.ai-dev/` operating convention
   - Output: root `.ai-dev` policy document and template counterpart

4. Update state and memory tracking
   - Output: clearer `current_state.md` and `memory/state.md`

5. Validate with review + QA
   - Output: explicit review and QA records with PASS/FAIL

## Dependencies
- Template runtime updates should align with the root runtime contract already fixed in the High-priority pass
- QA depends on all documentation and scaffold updates being complete

## Scope Boundary
- Included: Medium-priority items from `.ai-dev/artifacts/2026-04-20_repository-gap-report.md`
- Excluded for now: Low-priority documentation/memory cleanup outside the approved Medium scope
