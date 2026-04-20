# Repository Closeout Requirement

Date: 2026-04-20

## Role

- Prompt Engineer
- Architect
- Planner
- Developer
- Reviewer
- QA

## Instructions

1. Verify the real repository state before acting.
2. Formally close the approved Medium-priority remediation with review and QA evidence.
3. Fix any remaining issues needed for Medium closure.
4. Resolve the remaining Low-priority clarity gaps from the repository gap report.
5. Perform a final repository-wide review and QA pass.
6. Update `.ai-dev/`, `memory/`, and state tracking before closure.
7. Do not close the work unless QA passes.

## Context

- Source of truth:
  - `AGENTS.md`
  - `.ai-dev/requirements/full_system_context.md`
  - `shared/agent_core/core.md`
  - `.ai-dev/artifacts/2026-04-20_repository-gap-report.md`
- High-priority remediation is already closed with QA PASS.
- Medium-priority remediation was implemented partially but lacked formal closure and still needed validation against the actual files.
- Low-priority backlog focuses on documentation and memory clarity, especially around target-state vs operational-state wording.

## Objective

Leave IngenIAr operationally coherent, traceable, and validated across root runtime files, templates, documentation, memory, and project state, with explicit evidence for plan, implementation, review, and QA PASS.

## Acceptance Criteria

- Medium-priority backlog has a matching review record and QA PASS record.
- Any Medium defects found during closure are corrected before QA passes.
- Low-priority backlog from the gap report is either resolved or shown to be non-blocking with explicit evidence.
- Root and template runtime guidance remain aligned with the canonical IngenIAr flow.
- `.ai-dev/state/current_state.md` and `memory/state.md` reflect the real post-closeout status.
- Final closure evidence exists in `.ai-dev/artifacts/` and `.ai-dev/qa/`.
