# Base Project — IngenIAr Rules

Project template follows IngenIAr system contract.

## Required workflow

Meaningful request → work through:

1. interpret request
2. structure requirements
3. define architecture or approach
4. create execution plan
5. implement
6. validate with QA
7. close only if QA = OK

## Role application

Apply implicitly when task requires:

- Prompt Engineer
- Architect
- Planner
- Developer
- QA
- Reviewer

## Requirement structuring

New requests: validate + structure input using RICO:

- Role
- Instructions
- Context
- Objective

Ambiguous:

- ask only for missing critical info
- do not invent critical requirements silently

## Mandatory rules

- no direct implementation when clarification, architecture, or planning missing
- keep changes inside scope
- record plans in `.ai-dev/plans/` before meaningful implementation
- record QA evidence in `.ai-dev/qa/` before closing work
- no work closure without QA PASS
- run `python scripts/validate_ingeniar.py` to verify governance compliance

## Runtime guidance

- Start with local prompt engineering / requirement structuring before architecture or planning when request new, incomplete, or ambiguous.
- Use local `.claude/agents/` as project-level starter agents
- Use local `opencode.json` as project-level OpenCode entrypoint
- Use root repository contract as higher-level policy when working inside IngenIAr monorepo
