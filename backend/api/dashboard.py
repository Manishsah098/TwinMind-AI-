"""
TwinMind AI - Dashboard & Recommendation API Endpoints
GET /api/dashboard
GET /api/recommendation/{id}
POST /api/company/reset
"""
from fastapi import APIRouter, HTTPException
from data.demo_company import DEMO_COMPANY
from orchestration.orchestrator import get_run, get_all_runs
from services.llm_service import llm_service

router = APIRouter(tags=["dashboard"])


@router.get("/api/dashboard")
async def get_dashboard():
    """
    Returns high-level dashboard KPIs and recent simulation activity.
    """
    all_runs = get_all_runs()
    completed = [r for r in all_runs.values() if r.status == "completed"]
    running = [r for r in all_runs.values() if r.status == "running"]

    latest_rec = None
    if completed:
        latest = sorted(completed, key=lambda r: r.completed_at or r.started_at)[-1]
        latest_rec = latest.final_recommendation

    return {
        "company": {
            "name": DEMO_COMPANY["company"],
            "revenue": DEMO_COMPANY["revenue"],
            "customers": DEMO_COMPANY["customers"],
            "employees": DEMO_COMPANY["employees"],
            "gross_margin": DEMO_COMPANY["gross_margin"],
            "monthly_churn": DEMO_COMPANY["monthly_churn"],
            "nps_score": DEMO_COMPANY["nps_score"],
            "cash": DEMO_COMPANY["cash"],
            "avg_price": DEMO_COMPANY["average_price"],
            "ltv_cac_ratio": DEMO_COMPANY["ltv_cac_ratio"],
        },
        "simulation_activity": {
            "total_simulations": len(all_runs),
            "active": len(running),
            "completed": len(completed),
        },
        "latest_recommendation": latest_rec,
        "llm_status": llm_service.status(),
    }


@router.get("/api/recommendation/{scenario_id}")
async def get_recommendation(scenario_id: str):
    """Returns the executive recommendation for a completed scenario."""
    run = get_run(scenario_id)
    if not run:
        raise HTTPException(status_code=404, detail="Scenario not found or not yet run")
    if run.status != "completed":
        raise HTTPException(status_code=202, detail=f"Scenario is {run.status}")
    return {
        "scenario_id": scenario_id,
        "recommendation": run.final_recommendation,
        "all_scenarios": run.all_scenarios,
        "agent_results": run.agent_results,
        "optimal": run.optimal,
        "audit_log": run.final_recommendation.get("audit_log", {}),
    }


@router.post("/api/company/reset")
async def reset_company():
    """Reset to DemoCorp default state (for demo purposes)."""
    return {
        "message": "Company state reset to DemoCorp defaults",
        "company": DEMO_COMPANY,
    }
