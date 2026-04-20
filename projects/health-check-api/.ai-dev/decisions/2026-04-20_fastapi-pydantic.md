# Decision — FastAPI + Pydantic for Health Check API

Date: 2026-04-20

## Decision
Use FastAPI with Pydantic response models and APIRouter for route organization.

## Rationale
- FastAPI provides automatic OpenAPI docs and type safety out of the box
- APIRouter allows clean separation of concerns (routes vs app setup)
- Pydantic ensures consistent response shape and self-documenting schemas
- Minimal overhead for a single-endpoint monitoring API

## Alternatives Considered
- Flask: simpler but lacks async and automatic OpenAPI
- Plain Starlette: lower level, more boilerplate
- Single-file app: acceptable for MVP but doesn't scale cleanly
