"""
TwinMind AI - Agents API Endpoints
POST /api/agents/run
GET  /api/agents/status
"""
import uuid
from fastapi import APIRouter, BackgroundTasks
from pydantic import BaseModel, Field
from typing import Optional

from orchestration.orchestrator import run_orchestration, get_run, get_all_runs
from data.demo_company import DEMO_COMPANY

router = APIRouter(prefix="/api/agents", tags=["agents"])


class AgentsRunRequest(BaseModel):
    scenario_id: Optional[str] = None
    price_change_percent: float = Field(default=10.0, ge=-50, le=100)
    duration_months: int = Field(default=12, ge=1, le=60)
    company_override: Optional[dict] = None


@router.post("/run")
async def run_agents(body: AgentsRunRequest, background_tasks: BackgroundTasks):
    """Trigger agent orchestration directly."""
    scenario_id = body.scenario_id or str(uuid.uuid4())
    scenario = {
        "id": scenario_id,
        "name": f"{body.price_change_percent}% Price Change",
        "price_change_percent": body.price_change_percent,
        "duration_months": body.duration_months,
    }
    company_state = body.company_override or DEMO_COMPANY

    background_tasks.add_task(run_orchestration, scenario_id, scenario, company_state)

    return {
        "scenario_id": scenario_id,
        "status": "started",
        "message": f"8 agents activated for {body.price_change_percent}% price change scenario.",
    }


@router.get("/status")
async def get_agents_status():
    """Returns status of all running/completed agent orchestrations."""
    all_runs = get_all_runs()
    statuses = []
    for sid, run in all_runs.items():
        statuses.append({
            "scenario_id": sid,
            "overall_status": run.status,
            "agent_statuses": run.agent_statuses,
            "started_at": run.started_at.isoformat() if run.started_at else None,
            "completed_at": run.completed_at.isoformat() if run.completed_at else None,
        })
    return {"runs": statuses}
