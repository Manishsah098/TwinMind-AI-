"""
TwinMind AI - Multi-Agent Orchestrator
Manages the full agent execution pipeline with shared state.

Execution flow:
  1. Scenario Manager (runs simulations for all scenarios)
  2. Parallel: Finance, Sales, Marketing, HR, Supply Chain, Inventory agents
  3. Risk Agent (uses all previous agent outputs)
  4. Executive Agent (produces final recommendation)
"""
import asyncio
from typing import Dict, Any, Optional
from datetime import datetime

from .state import OrchestrationState
from simulation.scenario_engine import run_scenario, run_all_scenarios, find_optimal_scenario
from agents import (
    FinanceAgent, SalesAgent, MarketingAgent, HRAgent,
    SupplyChainAgent, InventoryAgent, RiskAgent, ExecutiveAgent
)
from services.llm_service import llm_service
from data.demo_company import DEMO_COMPANY

# In-memory store for active orchestrations (keyed by scenario_id)
_active_runs: Dict[str, OrchestrationState] = {}


def get_run(scenario_id: str) -> Optional[OrchestrationState]:
    return _active_runs.get(scenario_id)


def get_all_runs() -> Dict[str, OrchestrationState]:
    return _active_runs


async def run_orchestration(scenario_id: str, scenario: Dict[str, Any], company_state: Dict = None) -> OrchestrationState:
    """
    Main orchestration entry point.
    Creates a new OrchestrationState and drives all agents through it.
    """
    state = OrchestrationState(
        scenario_id=scenario_id,
        company_state=company_state or DEMO_COMPANY,
        scenario=scenario,
        started_at=datetime.utcnow(),
        status="running",
    )
    _active_runs[scenario_id] = state

    try:
        # --- STEP 1: Scenario Manager ---
        state.agent_statuses["Scenario Manager"] = "running"
        price_chg = scenario.get("price_change_percent", 10)

        # Run all 5 comparison scenarios
        all_scenarios = run_all_scenarios(company_state=state.company_state)
        state.all_scenarios = all_scenarios

        # Primary scenario simulation
        primary_sim = run_scenario(price_chg, company_state=state.company_state)
        state.simulation_results = primary_sim
        state.agent_statuses["Scenario Manager"] = "completed"

        # Find optimal before agents run
        optimal = find_optimal_scenario(all_scenarios)
        state.optimal = optimal

        # --- STEP 2: Parallel Agents (Finance, Sales, Marketing, HR, Supply Chain, Inventory) ---
        parallel_agents = [
            FinanceAgent(llm_service),
            SalesAgent(llm_service),
            MarketingAgent(llm_service),
            HRAgent(llm_service),
            SupplyChainAgent(llm_service),
            InventoryAgent(llm_service),
        ]

        for agent in parallel_agents:
            state.agent_statuses[agent.name] = "running"

        # Run in parallel with small staggered delays for visual effect
        async def run_with_delay(agent, delay=0):
            await asyncio.sleep(delay)
            result = await agent.run(state.company_state, state.scenario, state.simulation_results)
            state.agent_results[agent.name] = result
            state.agent_statuses[agent.name] = "completed"
            return result

        tasks = [
            run_with_delay(parallel_agents[0], 0.0),
            run_with_delay(parallel_agents[1], 0.1),
            run_with_delay(parallel_agents[2], 0.2),
            run_with_delay(parallel_agents[3], 0.15),
            run_with_delay(parallel_agents[4], 0.25),
            run_with_delay(parallel_agents[5], 0.05),
        ]
        await asyncio.gather(*tasks)

        # --- STEP 3: Risk Agent ---
        state.agent_statuses["Risk"] = "running"
        risk_agent = RiskAgent(llm_service)
        risk_result = await risk_agent.run(state.company_state, state.scenario, state.simulation_results)
        state.agent_results["Risk"] = risk_result
        state.risk_analysis = risk_result
        state.agent_statuses["Risk"] = "completed"

        # --- STEP 4: Executive Agent ---
        state.agent_statuses["Executive"] = "running"
        exec_sim_data = {
            **state.simulation_results,
            "all_scenarios": all_scenarios,
            "agent_results": state.agent_results,
            "optimal": state.optimal,
        }
        exec_agent = ExecutiveAgent(llm_service)
        exec_result = await exec_agent.run(state.company_state, state.scenario, exec_sim_data)
        state.agent_results["Executive"] = exec_result
        state.final_recommendation = exec_result
        state.agent_statuses["Executive"] = "completed"

        state.status = "completed"
        state.completed_at = datetime.utcnow()

    except Exception as e:
        state.status = "failed"
        state.error = str(e)
        state.completed_at = datetime.utcnow()
        print(f"[Orchestrator] Error in scenario {scenario_id}: {e}")
        raise

    return state
