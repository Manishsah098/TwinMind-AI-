"""
TwinMind AI - Finance Agent
Analyzes revenue, margin, profit, cash flow, and ROI impact.
"""
from typing import Dict, Any
from .base_agent import BaseAgent


class FinanceAgent(BaseAgent):
    name = "Finance"
    description = "Analyzes revenue impact, gross margin, operating profit, cash flow, and ROI."

    async def _analyze(self, company_state: Dict, scenario: Dict, simulation_results: Dict) -> Dict[str, Any]:
        revenue = simulation_results.get("revenue", {})
        profit = simulation_results.get("profit", {})
        roi = simulation_results.get("roi", {})
        mc = simulation_results.get("monte_carlo", {})

        price_chg = simulation_results.get("price_change_percent", 0)
        rev_chg = revenue.get("revenue_change_percent", 0)
        profit_chg = profit.get("profit_change_percent", 0)
        cash_impact = profit.get("profit_change", 0)
        roi_pct = roi.get("roi_percent", 0)

        # Determine overall impact
        if profit_chg > 5:
            impact = "positive"
        elif profit_chg > 0:
            impact = "slightly_positive"
        elif profit_chg > -5:
            impact = "slightly_negative"
        else:
            impact = "negative"

        confidence = min(0.95, 0.70 + abs(profit_chg) * 0.01)

        # LLM-enhanced reasoning (falls back to demo)
        reasoning = ""
        if self.llm:
            reasoning = await self.llm.complete(
                system_prompt="You are a CFO analyzing the financial impact of a pricing decision. Be concise and data-driven.",
                user_prompt=f"Finance analysis: {self._get_llm_context(simulation_results)}"
            )
        else:
            reasoning = (
                f"A {price_chg}% price increase drives a {rev_chg:.1f}% revenue change. "
                f"After accounting for demand elasticity, operating profit changes by {profit_chg:.1f}%. "
                f"ROI of {roi_pct:.1f}% is achievable with low implementation cost. "
                f"Cash flow improvement of ${cash_impact:,.0f} strengthens financial position."
            )

        return {
            "impact": impact,
            "revenue_change_percent": round(rev_chg, 2),
            "profit_change_percent": round(profit_chg, 2),
            "cash_impact": round(cash_impact, 2),
            "roi_percent": round(roi_pct, 2),
            "new_gross_margin": profit.get("new_margin", 0),
            "new_revenue": revenue.get("new_revenue", 0),
            "new_profit": profit.get("new_profit", 0),
            "monte_carlo_expected_profit": mc.get("profit", {}).get("expected", 0),
            "profit_increase_probability": mc.get("probabilities", {}).get("profit_increase", 0),
            "confidence": round(confidence, 2),
            "reasoning": reasoning,
            "debate_position": f"Price increase {'improves' if profit_chg > 0 else 'harms'} margin by {abs(profit_chg):.1f}%. ROI is {roi_pct:.0f}%.",
        }
