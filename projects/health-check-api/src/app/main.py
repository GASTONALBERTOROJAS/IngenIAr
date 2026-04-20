"""Health-check API — FastAPI application entry point."""

from fastapi import FastAPI

from .routes.health import router as health_router

app = FastAPI(
    title="Health Check API",
    description="REST API for service health monitoring",
    version="1.0.0",
)

app.include_router(health_router)
