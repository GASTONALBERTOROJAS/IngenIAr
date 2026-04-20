# IngenIAr Repository Gap Report

Date: 2026-04-20

## Executive Verdict

**Overall status: partially applies**

The repository reflects the expected IngenIAr logic at the documentation and scaffolding level, but runtime enforcement is incomplete. The OpenCode side is more operational than the Claude side, and `.ai-dev/` currently behaves more like a prepared structure than an actively used state system.

## Evaluation Baseline

Expected logic taken from:
- `AGENTS.md`
- `CLAUDE.md`
- `.ai-dev/requirements/full_system_context.md`
- `shared/agent_core/core.md`
- `README.md`

Canonical expected flow:

`request → prompt engineering → architecture → planning → implementation → QA → close`

## What Already Aligns

1. Dual-runtime structure exists in practice
   - `AGENTS.md`
   - `CLAUDE.md`
   - `opencode.json`
   - `.claude/agents/`
   - `.opencode/skills/`

2. The QA gate is consistent in the main contract files
   - `AGENTS.md`
   - `CLAUDE.md`
   - `README.md`
   - `.ai-dev/qa/README.md`

3. The canonical core exists and is coherent
   - `shared/agent_core/core.md`

4. Context7 is truly wired
   - `opencode.json`

5. The expected state folders exist
   - `.ai-dev/artifacts/`
   - `.ai-dev/decisions/`
   - `.ai-dev/loops/`
   - `.ai-dev/plans/`
   - `.ai-dev/qa/`
   - `.ai-dev/requirements/`
   - `.ai-dev/runs/`
   - `.ai-dev/state/`

## File-by-File Gap Assessment

Each prioritized entry below maps to one specific file path, including explicitly missing files when the gap is absence rather than weak content.

| Priority | File | Expected | Observed | Gap | Recommended fix |
| --- | --- | --- | --- | --- | --- |
| High | `CLAUDE.md` | Mirror the canonical workflow, including architecture and strict QA closure | Uses `interpret → structure → plan → implement → validate → close` and limits subagent usage to planning / implementation / QA | Claude runtime contract is simpler than the system contract | Align workflow text and role usage with `AGENTS.md` and `shared/agent_core/core.md` |
| High | `opencode.json` | Make the canonical flow more explicit at runtime | Wires `plan` and `build`, with no explicit architecture/reviewer/QA phase wiring | Runtime orchestration is partial and relies on implicit discipline | Expand prompts/config to make architecture and QA/review stages explicit |
| High | `MISSING: .claude/agents/prompt-engineer.md` | Claude runtime should operationalize Prompt Engineer role | File does not exist | Requirement-structuring role is documented but not executable in Claude runtime | Add the missing agent with RICO/clarification behavior aligned to `AGENTS.md` |
| High | `MISSING: .claude/agents/architect.md` | Claude runtime should operationalize Architect role | File does not exist | Architecture is documented but not executable as a dedicated Claude role | Add the missing architect agent aligned to the canonical design stage |
| High | `MISSING: .claude/agents/reviewer.md` | Claude runtime should operationalize Reviewer role | File does not exist | Final coherence review is documented but not executable as a dedicated Claude role | Add the missing reviewer agent aligned to the repository contract |
| Medium | `templates/base_project/AGENTS.md` | New projects should inherit a practical local workflow entrypoint | Only points back to root `AGENTS.md` | Template gives policy inheritance but minimal local operational help | Expand with concise project-local guidance or link to starter runtime assets |
| Medium | `templates/base_project/CLAUDE.md` | New Claude projects should inherit usable runtime behavior | Only points back to root `CLAUDE.md` | Template preserves policy, but not enough practical startup behavior | Expand with concise local runtime expectations and QA handoff guidance |
| Medium | `templates/base_project/opencode.json` | New OpenCode projects should inherit more complete workflow defaults | Contains minimal `plan` and `build` prompts only | Template bootstrap is weaker than the target system behavior | Enrich default prompts or document how it inherits the richer root behavior |
| Medium | `.ai-dev/state/current_state.md` | Reflect live operational reality, not only migration summary | Describes migration and high-level current state, but not the active workflow gaps | State tracking is true but incomplete for current governance needs | Extend with current operational limitations or link to a maintained gap backlog |
| Medium | `memory/state.md` | Versioned memory should separate operational state from target state clearly | Mixes active constraints with aspirational/integration notes | Future readers may overestimate what is already wired | Mark each note as operational, pending, or planned |
| Low | `README.md` | Describe both capability and current operational level accurately | Describes the target behavior strongly and coherently | Can be read as if full enforcement already exists | Optionally distinguish target-state from implemented-state behavior |
| Low | `memory/decisions.md` | Record decisions with clear status boundaries | Contains valid history, but some items can be read as stronger than actual runtime wiring | Historical memory is useful but not always explicit about implementation maturity | Clarify future entries as implemented vs planned |
| Low | `memory/risks.md` | Reflect risks tied to current implementation | Mostly accurate; some risks refer to optional integrations and evolving states | Low severity, but can blur current vs future risk posture | Keep future risk entries tagged by active vs latent |
| Low | `shared/docs/mcp_integration.md` | Match runtime reality and boundaries | Correctly states Context7 is enabled and Engram/n8n are optional | No direct file defect; it confirms partial MCP operationalization by design | No immediate fix needed unless MCP scope changes |

## Repository-Wide Structural Observation

This is not a single-file defect, but it materially affects the system promise:

- Root `.ai-dev/plans/`, `.ai-dev/loops/`, `.ai-dev/decisions/`, `.ai-dev/runs/` and most of `.ai-dev/artifacts/` are still mostly empty.
- This means the traceability model exists structurally, but is not yet exercised as a consistent operating practice.

Recommended next step:

- Define a minimum write policy for each `.ai-dev/` subfolder so future work leaves recoverable evidence by default.

## Priority Summary

### Fix First
1. Align `CLAUDE.md` with the canonical workflow
2. Add missing Claude agents: prompt-engineer, architect, reviewer
3. Strengthen `opencode.json` orchestration for architecture and QA/review phases

### Then Stabilize
4. Turn `.ai-dev/` into active traceability instead of empty scaffold
5. Upgrade `templates/base_project/` from structural placeholder to working starter template

### Nice to Improve
6. Clarify target-state vs current-state language in repo documentation and memory files

## Proposed Remediation Sequence

1. Update root Claude runtime contract
2. Add missing Claude agents
3. Refine OpenCode runtime prompts/config
4. Establish `.ai-dev/` write rules
5. Backfill template runtime assets
6. Refresh README/state/memory to reflect actual status

## Conclusion

IngenIAr already has a strong contract and a credible skeleton. The main gap is not conceptual design but operational consistency: the documented workflow is stronger than the currently enforced runtime behavior.
