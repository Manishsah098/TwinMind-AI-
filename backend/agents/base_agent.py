"""
TwinMind AI - Base Agent Class
All agents inherit from this.
"""
import asyncio
from abc import ABC, abstractmethod
from typing import Dict, Any, Optional
from datetime import datetime


class BaseAgent(ABC):
    """
    Base class for all TwinMind AI agents.
    Each agent receives simulation results + company state and returns structured JSON.
    """
    name: str = "BaseAgent"
    description: str = ""

    def __init__(self, llm_service=None):
        self.llm = llm_service
        self.started_at: Optional[datetime] = None
        self.completed_at: Optional[datetime] = None
        self.status: str = "idle"  # idle | running | completed | failed

    async def run(self, company_state: Dict, scenario: Dict, simulation_results: Dict) -> Dict[str, Any]:
        """
        Execute the agent analysis. Returns structured JSON result.
        """
        self.status = "running"
        self.started_at = datetime.utcnow()
        try:
            result = await self._analyze(company_state, scenario, simulation_results)
            result["agent"] = self.name
            result["timestamp"] = datetime.utcnow().isoformat()
            result["status"] = "completed"
            self.status = "completed"
            return result
        except Exception as e:
            self.status = "failed"
            return {
                "agent": self.name,
                "status": "failed",
                "error": str(e),
                "timestamp": datetime.utcnow().isoformat(),
            }
        finally:
            self.completed_at = datetime.utcnow()

    @abstractmethod
    async def _analyze(self, company_state: Dict, scenario: Dict, simulation_results: Dict) -> Dict[str, Any]:
        """Implement agent-specific analysis logic."""
        pass

    def _get_llm_context(self, simulation_results: Dict) -> str:
        """Build a concise context string for LLM prompting."""
        price_chg = simulation_results.get("price_change_percent", 0)
        rev_chg = simulation_results.get("revenue", {}).get("revenue_change_percent", 0)
        profit_chg = simulation_results.get("profit", {}).get("profit_change_percent", 0)
        return (
            f"Scenario: {price_chg}% price increase. "
            f"Revenue impact: {rev_chg:.1f}%. "
            f"Profit impact: {profit_chg:.1f}%."
        )
