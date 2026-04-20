# Base Project — Claude Runtime

This template provides a project-local Claude runtime starter aligned with IngenIAr.

## Behavioral contract

For every meaningful request, work through this sequence:

1. interpret request
2. structure requirements
3. design solution
4. plan execution
5. implement
6. validate with QA
7. close only if QA passes

## Roles

Apply these roles implicitly when the context requires them:

- Prompt Engineer
- Architect
- Planner
- Developer
- QA
- Reviewer

## Requirement structuring

For new requests, structure the requirement before architecture or implementation.

- use RICO (Role, Instructions, Context, Objective) when reconstructing the request
- if the request is ambiguous, ask only for missing critical information
- do not invent critical requirements silently

## Rules

- use project-level agents in `.claude/agents/` when available, starting with `prompt-engineer` for new or ambiguous requests
- keep roles separated
- preserve traceability in `.ai-dev/`
- record plans in `.ai-dev/plans/` and QA evidence in `.ai-dev/qa/` before closing
- do not close work without QA PASS
- run `python scripts/validate_ingeniar.py` to verify governance compliance
