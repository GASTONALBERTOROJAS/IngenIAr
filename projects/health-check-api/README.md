# Health Check API

REST API for service health monitoring, built with Python + FastAPI.

## Endpoint

| Method | Path | Response |
|--------|------|----------|
| GET | `/health` | `{ "status": "ok", "service": "health-check-api" }` |

## Quick start

```bash
pip install -r requirements.txt
uvicorn src.app.main:app --reload
```

The API will be available at `http://localhost:8000` with automatic OpenAPI docs at `/docs`.

## Running tests

```bash
pytest tests/ -v
```

## Project structure

```
src/app/
  main.py              # FastAPI application entry point
  routes/health.py     # GET /health endpoint
  schemas/health.py   # HealthResponse Pydantic model
tests/
  test_health.py       # 4 test cases for the health endpoint
requirements.txt       # Python dependencies
.ai-dev/               # Governance artifacts (requirements, plans, QA, decisions)
```

## Traceability

This project follows the IngenIAr workflow: `interpret → structure → architecture → plan → implement → QA → close`.

All work is tracked in `.ai-dev/` — requirements, plans, decisions, QA records, and state.
