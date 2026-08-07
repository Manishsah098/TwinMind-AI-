"""
TwinMind AI - Scenario API Endpoints
POST /api/scenario/create
POST /api/scenario/simulate
GET  /api/scenario/{id}
GET  /api/scenarios
"""
import uuid
from typing import Optional
from fastapi import APIRouter, BackgroundTasks, HTTPException
from pydantic import BaseModel, Field

from orchestration.orchestrator import run_orchestration, get_run, get_all_runs
from data.demo_company import DEMO_COMPANY

router = APIRouter(prefix="/api/scenario", tags=["scenarios"])

# In-memory scenario store (lightweight for hackathon)
_scenarios: dict = {}


class ScenarioCreate(BaseModel):
    name: str = Field(..., description="Scenario name")
    price_change_percent: float = Field(default=10.0, ge=-50, le=100)
    duration_months: int = Field(default=12, ge=1, le=60)
    description: Optional[str] = None


class SimulateRequest(BaseModel):
    scenario_id: str
    company_override: Optional[dict] = None


@router.post("/create")
async def create_scenario(body: ScenarioCreate):
    scenario_id = str(uuid.uuid4())
    scenario = {
        "id": scenario_id,
        "name": body.name,
        "price_change_percent": body.price_change_percent,
        "duration_months": body.duration_months,
        "description": body.description,
        "status": "created",
    }
    _scenarios[scenario_id] = scenario
    return {"scenario_id": scenario_id, "scenario": scenario}


@router.post("/simulate")
async def simulate_scenario(body: SimulateRequest, background_tasks: BackgroundTasks):
    """
    Kicks off the full orchestration pipeline in the background.
    Poll GET /api/scenario/{id} for status.
    """
    scenario = _scenarios.get(body.scenario_id)
    if not scenario:
        # Auto-create a demo scenario
        scenario = {
            "id": body.scenario_id,
            "name": "10% Price Increase",
            "price_change_percent": 10.0,
            "duration_months": 12,
            "status": "created",
        }
        _scenarios[body.scenario_id] = scenario

    scenario["status"] = "running"
    company_state = body.company_override or DEMO_COMPANY

    background_tasks.add_task(
        _run_simulation_task,
        body.scenario_id,
        scenario,
        company_state,
    )

    return {
        "scenario_id": body.scenario_id,
        "status": "running",
        "message": "Simulation started. Poll GET /api/scenario/{id} for progress.",
    }


async def _run_simulation_task(scenario_id: str, scenario: dict, company_state: dict):
    try:
        state = await run_orchestration(scenario_id, scenario, company_state)
        _scenarios[scenario_id]["status"] = state.status
        _scenarios[scenario_id]["result"] = state.to_dict()
    except Exception as e:
        _scenarios[scenario_id]["status"] = "failed"
        _scenarios[scenario_id]["error"] = str(e)


@router.get("/{scenario_id}")
async def get_scenario(scenario_id: str):
    # Check orchestration state first (most up to date)
    run = get_run(scenario_id)
    if run:
        return {
            "scenario_id": scenario_id,
            "status": run.status,
            "agent_statuses": run.agent_statuses,
            "scenario": run.scenario,
            "simulation_results": run.simulation_results,
            "all_scenarios": run.all_scenarios,
            "agent_results": run.agent_results,
            "final_recommendation": run.final_recommendation,
            "optimal": run.optimal,
            "completed_at": run.completed_at.isoformat() if run.completed_at else None,
        }

    scenario = _scenarios.get(scenario_id)
    if not scenario:
        raise HTTPException(status_code=404, detail="Scenario not found")
    return scenario


@router.get("")
async def list_scenarios():
    all_runs = get_all_runs()
    result = []
    for sid, run in all_runs.items():
        result.append({
            "scenario_id": sid,
            "status": run.status,
            "scenario": run.scenario,
            "completed_at": run.completed_at.isoformat() if run.completed_at else None,
        })

    # Also include locally created scenarios not yet run
    for sid, s in _scenarios.items():
        if sid not in all_runs:
            result.append({"scenario_id": sid, "status": s.get("status", "created"), "scenario": s})

    return {"scenarios": result}
