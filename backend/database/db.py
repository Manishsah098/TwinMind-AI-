"""
TwinMind AI - Database Setup (SQLite via SQLAlchemy async)
"""
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy import Column, String, JSON, Float, Integer, DateTime, Text
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./twinmind.db")

engine = create_async_engine(DATABASE_URL, echo=False)
AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False)


class Base(DeclarativeBase):
    pass


class ScenarioRecord(Base):
    __tablename__ = "scenarios"
    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    price_change_percent = Column(Float, default=0.0)
    duration_months = Column(Integer, default=12)
    status = Column(String, default="pending")  # pending, running, completed, failed
    simulation_results = Column(JSON, nullable=True)
    agent_results = Column(JSON, nullable=True)
    recommendation = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)


class AgentRunRecord(Base):
    __tablename__ = "agent_runs"
    id = Column(String, primary_key=True)
    scenario_id = Column(String, nullable=False)
    agent_name = Column(String, nullable=False)
    status = Column(String, default="pending")
    result = Column(JSON, nullable=True)
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)


async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
