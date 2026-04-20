"""Tests for the health check endpoint."""

from fastapi.testclient import TestClient

from src.app.main import app

client = TestClient(app)


def test_health_returns_200():
    """GET /health must return HTTP 200."""
    response = client.get("/health")
    assert response.status_code == 200


def test_health_returns_ok_status():
    """GET /health must return status 'ok'."""
    response = client.get("/health")
    data = response.json()
    assert data["status"] == "ok"


def test_health_returns_service_name():
    """GET /health must include the service name."""
    response = client.get("/health")
    data = response.json()
    assert data["service"] == "health-check-api"


def test_health_response_schema():
    """GET /health response must match the expected schema."""
    response = client.get("/health")
    data = response.json()
    assert "status" in data
    assert "service" in data
    assert len(data) == 2
