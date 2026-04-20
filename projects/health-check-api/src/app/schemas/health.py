"""Health check response schema."""

from pydantic import BaseModel


class HealthResponse(BaseModel):
    """Response model for GET /health."""

    status: str = "ok"
    service: str = "health-check-api"
