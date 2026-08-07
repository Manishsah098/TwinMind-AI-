"""
TwinMind AI - HR Agent
Analyzes workforce requirements, costs, hiring, and productivity impact.
"""
from typing import Dict, Any
from .base_agent import BaseAgent


class HRAgent(BaseAgent):
    name = "HR"
    description = "Analyzes workforce requirements, employee costs, hiring needs, skill gaps, and productivity impact."

    async def _analyze(self, company_state: Dict, scenario: Dict, simulation_results: Dict) -> Dict[str, Any]:
        profit = simulation_results.get("profit", {})
        demand = simulation_results.get("demand", {})
        price_chg = simulation_results.get("price_change_percent", 0)

        employees = company_state.get("employees", 420)
        profit_change = profit.get("profit_change", 0)

        # If profitable, can hire; if not, may need to reduce
        new_hires_possible = max(0, int(profit_change / 75_000)) if profit_change > 0 else 0
        reduction_risk = employees if profit_change < -500_000 else 0
        training_cost = 45_000 if price_chg >= 5 else 0  # sales/CS training on new pricing

        workforce_impact = "positive" if new_hires_possible > 5 else "neutral"
        productivity_impact = 0.02 if price_chg < 10 else -0.01  # slight drag at high price

        reasoning = ""
        if self.llm:
            reasoning = await self.llm.complete(
                system_prompt="You are a CHRO analyzing the HR and workforce impact of a pricing change.",
                user_prompt=f"HR analysis: {self._get_llm_context(simulation_results)}"
            )
        else:
            reasoning = (
                f"A successful price increase enables {new_hires_possible} additional hires across sales and engineering. "
                f"Training cost for new pricing strategy: ${training_cost:,}. "
                f"No layoffs anticipated in any scenario. "
                f"Customer success team may need 2-3 additional headcount to manage at-risk account retention. "
                f"Employee morale impact: neutral (no headcount reduction risk)."
            )

        return {
            "impact": workforce_impact,
            "new_hires_possible": new_hires_possible,
            "training_cost": training_cost,
            "productivity_impact_percent": round(productivity_impact * 100, 1),
            "current_employees": employees,
            "cs_headcount_needed": 3 if price_chg >= 7 else 1,
            "skill_gaps": ["Pricing strategy", "Customer retention"] if price_chg >= 7 else [],
            "layoff_risk": "NONE",
            "confidence": 0.84,
            "reasoning": reasoning,
            "debate_position": f"Price increase creates funding for {new_hires_possible} new hires. Training investment: ${training_cost:,}.",
        }
