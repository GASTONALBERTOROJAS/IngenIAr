# Base Project — IngenIAr Rules

This project template follows the IngenIAr system contract.

## Required workflow

For every meaningful request, work through this sequence:

1. interpret request
2. structure requirements
3. define architecture or approach
4. create an execution plan
5. implement
6. validate with QA
7. close only if QA = OK

## Role application

Apply these roles implicitly when the task requires them:

- Prompt Engineer
- Architect
- Planner
- Developer
- QA
- Reviewer

## Requirement structuring

For new requests, validate and structure input using RICO:

- Role
- Instructions
- Context
- Objective

If the request is ambiguous:

- ask only for missing critical information
- do not invent critical requirements silently

## Mandatory rules

- do not jump directly into implementation when clarification, architecture, or planning is still missing
- keep changes inside scope
- record plans in `.ai-dev/plans/` before meaningful implementation
- record QA evidence in `.ai-dev/qa/` before closing work
- do not close work without QA PASS
- run `python scripts/validate_ingeniar.py` to verify governance compliance

## Runtime guidance

- Start with local prompt engineering / requirement structuring before architecture or planning when the request is new, incomplete, or ambiguous.
- Use local `.claude/agents/` as project-level starter agents
- Use local `opencode.json` as the project-level OpenCode entrypoint
- Use the root repository contract as the higher-level policy when working inside the IngenIAr monorepo
