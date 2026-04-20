
# IngenIAr — Claude Runtime

This repository follows the IngenIAr system.

## Behavioral contract

Always work through this sequence for every meaningful request:

1. interpret request — if ambiguous, ASK before proceeding
2. structure requirements using RICO (Role, Instructions, Context, Objective)
3. design solution — define architecture, components, risks
4. plan execution — break into atomic tasks, ordered with dependencies
5. implement — execute the approved plan only
6. validate with QA — run tests, checks, validator; write QA record in `.ai-dev/qa/`
7. review — verify coherence, completeness, scope alignment
8. close only if QA passes AND review passes

For new projects: you MUST run `python scripts/new_project.py <name> --description "desc"` — never create project dirs manually.

For every meaningful work: write plan in `.ai-dev/plans/`, QA record in `.ai-dev/qa/`, review in `.ai-dev/artifacts/`.

## Mandatory rules

- do not jump directly into code when requirement structuring or planning is still missing
- reconstruct the requirement when possible and ask only for missing critical information
- keep architecture and planning explicit before implementation
- split large work into explicit steps
- explain relevant decisions and trade-offs
- preserve traceability in project files when changes are meaningful
- do not close tasks without QA
- new projects MUST be created using `python scripts/new_project.py <name> --description "desc"`
- record plans in `.ai-dev/plans/` and QA evidence in `.ai-dev/qa/` before closing work
- run `python scripts/validate_ingeniar.py` to verify governance compliance

## Role application

Apply these roles implicitly when the context requires them:

- Prompt Engineer
- Architect
- Planner
- Developer
- QA
- Reviewer

Keep roles separated.

## QA closure gate

Mandatory closure rule:

- Planner → Developer → QA
- if QA fails, return to development
- only close when QA passes
- create a QA record in `.ai-dev/qa/` with scope, checks executed, and PASS/FAIL

Use Reviewer for final coherence, completeness and delivery quality when the task is meaningful.

## Enforcement

Governance is enforced automatically:

- Pre-commit hook runs `scripts/validate_ingeniar.py` before every commit
- CI pipeline `.github/workflows/validate.yml` runs the same validator on push/PR
- `scripts/new_project.py` is the only approved way to create new projects

## Use of documentation

When framework, library or API information is needed:

- use available documentation tools such as Context7
- prefer real and current examples

Do not use external documentation for trivial internal logic.

## Context

Read these files when needed:

- `AGENTS.md`
- `shared/agent_core/core.md`
- `.ai-dev/requirements/full_system_context.md`
- `memory/state.md`

## Subagents

Use project/system subagents for:

- prompt engineering and clarification
- architecture
- planning
- implementation
- QA
- review
