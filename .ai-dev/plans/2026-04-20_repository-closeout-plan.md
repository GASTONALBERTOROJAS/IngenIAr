# Repository Closeout Plan

Date: 2026-04-20

## Goal

Close the remaining approved Medium and Low repository gaps, then validate the full IngenIAr repository for coherent cross-runtime operation and traceable closure.

## Architecture / Approach

### Solution Overview
- Type of change: repository governance, template alignment, documentation clarity, and validation closeout
- General approach: preserve the already-closed High remediation, harden the remaining Medium template/runtime guidance, clean the Low clarity gaps, and record final review + QA evidence in `.ai-dev/`

### Components
1. Medium closeout scope
   - `templates/base_project/AGENTS.md`
   - `templates/base_project/CLAUDE.md`
   - `templates/base_project/opencode.json`
   - `templates/base_project/.claude/agents/*`
   - `templates/base_project/.ai-dev/*`
   - `.ai-dev/README.md`
   - `.ai-dev/state/current_state.md`
   - `memory/state.md`

2. Low remediation scope
   - `README.md`
   - `memory/decisions.md`
   - `memory/risks.md`

3. Traceability and closure scope
   - `.ai-dev/requirements/*`
   - `.ai-dev/plans/*`
   - `.ai-dev/artifacts/*`
   - `.ai-dev/qa/*`

### Risks & Considerations
- Avoid overstating automation that still depends on runtime instructions instead of external hooks.
- Keep template assets lightweight while still making local startup behavior explicit.
- Do not rewrite historical memory content more than needed; add status framing instead of erasing useful history.

## Execution Plan

1. Formalize requirement and plan
   - Output: closeout requirement and plan records in `.ai-dev/`

2. Re-open Medium scope and harden weak spots
   - Output: updated template runtime starter files and state/memory files aligned to the real closure target

3. Resolve Low-priority clarity gaps
   - Output: updated root README and memory records that distinguish operational state, policy, and historical/project-specific context

4. Record implementation outcome
   - Output: updated Medium summary and a final repository closeout summary

5. Run review pass
   - Output: Medium remediation review record and final repository coherence review record

6. Run QA pass
   - Output: Medium remediation QA PASS and final repository QA PASS, or rework loop if validation fails

7. Update operational state
   - Output: final `.ai-dev/state/current_state.md`, `memory/state.md`, and session memory reflecting the validated repository status

## Dependencies

- Medium closure depends on template/runtime fixes being complete before review and QA.
- Final repository closure depends on both the prior High QA PASS and the new Medium/Low validation records.

## Done Definition

The repository is only considered closed when:

- Medium remediation has review + QA PASS evidence.
- Low-priority clarity gaps are resolved.
- Final project-wide review reports PASS.
- Final project-wide QA reports PASS.
- State and memory files point to the real validated status instead of a partial implementation snapshot.
