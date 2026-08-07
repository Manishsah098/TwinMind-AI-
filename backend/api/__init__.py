# backend/api/__init__.py
from .scenarios import router as scenarios_router
from .agents import router as agents_router
from .digital_twin import router as digital_twin_router
from .dashboard import router as dashboard_router

__all__ = ["scenarios_router", "agents_router", "digital_twin_router", "dashboard_router"]
