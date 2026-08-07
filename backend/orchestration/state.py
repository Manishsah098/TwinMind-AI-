"""
TwinMind AI - Shared Orchestration State
"""
from typing import Dict, Any, Optional, List
from dataclasses import dataclass, field
from datetime import datetime


@dataclass
class OrchestrationState:
    """
    Shared state passed between all agents during an orchestration run.
    Inspired by LangGraph's StateGraph pattern.
    """
    scenario_id: str = ""
    company_state: Dict[str, Any] = field(default_factory=dict)
    scenario: Dict[str, Any] = field(default_factory=dict)
    simulation_results: Dict[str, Any] = field(default_factory=dict)
    all_scenarios: List[Dict[str, Any]] = field(default_factory=list)
    agent_results: Dict[str, Any] = field(default_factory=dict)
    agent_statuses: Dict[str, str] = field(default_factory=dict)
    risk_analysis: Dict[str, Any] = field(default_factory=dict)
    final_recommendation: Dict[str, Any] = field(default_factory=dict)
    optimal: Dict[str, Any] = field(default_factory=dict)
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    status: str = "pending"  # pending | running | completed | failed
    error: Optional[str] = None

    def to_dict(self) -> Dict[str, Any]:
        return {
            "scenario_id": self.scenario_id,
            "company_state": self.company_state,
            "scenario": self.scenario,
            "simulation_results": self.simulation_results,
            "agent_results": self.agent_results,
            "agent_statuses": self.agent_statuses,
            "risk_analysis": self.risk_analysis,
            "final_recommendation": self.final_recommendation,
            "optimal": self.optimal,
            "status": self.status,
            "started_at": self.started_at.isoformat() if self.started_at else None,
            "completed_at": self.completed_at.isoformat() if self.completed_at else None,
            "error": self.error,
        }
