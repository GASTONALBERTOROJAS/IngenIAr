# Project Initialization — health-check-api

Date: 2026-04-20

## Role
Developer

## Instructions
Create and initialize a new IngenIAr project from the base template.

## Context
New project scaffolded via `python scripts/new_project.py`.

## Objective
Have a working project with governance layer (.ai-dev/), runtime files, and starter agents ready for development.

## Acceptance Criteria
- Project directory exists under projects/
- .ai-dev/ structure is present with requirements, plans, state, qa, artifacts
- At least one runtime file (AGENTS.md, CLAUDE.md, or opencode.json) is present
- Validate with `python scripts/validate_ingeniar.py`

## Project Description
REST health-check API with Python + FastAPI for service monitoring
