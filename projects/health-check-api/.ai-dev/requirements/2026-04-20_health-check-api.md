# Health Check API — Requirements

Date: 2026-04-20

## Role
Developer

## Instructions
Create a REST health-check API using Python + FastAPI that exposes a GET /health endpoint for service monitoring.

## Context
New IngenIAr project for monitoring. The API should be minimal, clean, and production-ready.

## Objective
Expose `GET /health` returning a JSON payload with service status for monitoring tools.

## Acceptance Criteria
- `GET /health` returns HTTP 200 with `{ "status": "ok", "service": "health-check-api" }`
- Response schema defined with Pydantic
- Tests validate status code, response content, and schema
- Project passes IngenIAr governance validation

## Technical Constraints
- Python 3.12+
- FastAPI as framework
- Pydantic for response schemas
- pytest + httpx for testing
