# Review — Workflow Skill Implementation

Date: 2026-04-20

## Overall status

**PASS**

## Scope reviewed

- `.opencode/skills/workflow/SKILL.md`
- `opencode.json` (root — instructions + agent prompts)
- `templates/base_project/opencode.json` (instructions + agent prompts)
- `CLAUDE.md` (root — behavioral contract)
- `templates/base_project/AGENTS.md` (mandatory rules)
- `templates/base_project/CLAUDE.md` (rules)

## Key findings

1. The workflow skill defines 7 explicit phases with clear outputs and handoff rules — the AI now has a step-by-step map instead of just general guidance.
2. Each agent prompt in `opencode.json` now explicitly states "You are in the X phase of the IngenIAr workflow" — this anchors the AI's behavior to the correct phase.
3. The plan agent explicitly requires `new_project.py` as Task 1 for new projects — preventing manual directory creation.
4. The QA agent explicitly requires writing a QA record in `.ai-dev/qa/` — closing the traceability gap observed in the previous test.
5. Both root and template configs reference the workflow skill as a mandatory instruction.
6. `CLAUDE.md` now includes the full phase sequence with concrete obligations (RICO, `.ai-dev/` writes, `new_project.py`).
7. JSON syntax validated for both `opencode.json` files — PASS.

## Required fixes

- None.

## Risks

- The workflow skill is directive but still depends on the AI reading and following instructions. If the model is very weak at instruction-following, it may still skip steps. However, the pre-commit hook and CI validator remain as hard fallbacks.
- Future models may need even more explicit prompts, but the current structure is a significant improvement over the previous "suggestion-only" approach.
