"""
TwinMind AI - Main FastAPI Application
"""
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from dotenv import load_dotenv

load_dotenv()

from database.db import init_db
from api.scenarios import router as scenarios_router
from api.agents import router as agents_router
from api.digital_twin import router as digital_twin_router
from api.dashboard import router as dashboard_router

CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:3000").split(",")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize database on startup."""
    await init_db()
    print("✅ TwinMind AI Backend started")
    print(f"📊 DEMO_MODE: {os.getenv('DEMO_MODE', 'true')}")
    print(f"🌐 CORS origins: {CORS_ORIGINS}")
    yield
    print("⏹ TwinMind AI Backend shutting down")


app = FastAPI(
    title="TwinMind AI",
    description="Enterprise Digital Twin & AI Decision Intelligence Platform",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(scenarios_router)
app.include_router(agents_router)
app.include_router(digital_twin_router)
app.include_router(dashboard_router)


@app.get("/")
async def root():
    return {
        "app": "TwinMind AI",
        "tagline": "Think Before You Act",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs",
    }


@app.get("/health")
async def health():
    return {"status": "healthy", "service": "TwinMind AI Backend"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
