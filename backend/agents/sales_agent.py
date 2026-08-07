"""
TwinMind AI - Sales Agent
Analyzes conversion rate, pipeline, regional sales, and revenue impact.
"""
from typing import Dict, Any
from .base_agent import BaseAgent


class SalesAgent(BaseAgent):
    name = "Sales"
    description = "Analyzes conversion rate, sales pipeline, customer acquisition, and expected revenue changes."

    async def _analyze(self, company_state: Dict, scenario: Dict, simulation_results: Dict) -> Dict[str, Any]:
        demand = simulation_results.get("demand", {})
        revenue = simulation_results.get("revenue", {})
        price_chg = simulation_results.get("price_change_percent", 0)

        customers_lost = demand.get("customers_lost", 0)
        segments = demand.get("segments", {})
        enterprise_lost = segments.get("enterprise", {}).get("lost", 0)
        smb_lost = segments.get("smb", {}).get("lost", 0)
        individual_lost = segments.get("individual", {}).get("lost", 0)

        # Enterprise accounts are less sensitive — key sales insight
        enterprise_impact = "LOW" if enterprise_lost < 10 else "MEDIUM"
        pipeline_impact_pct = max(-20, -(price_chg * 1.2))  # pipeline shrinks with price
        win_rate_change = -(price_chg * 0.08)  # win rate drops slightly with higher price
        new_cac = company_state.get("cac", 320) * (1 + price_chg * 0.005)

        confidence = 0.82

        reasoning = ""
        if self.llm:
            reasoning = await self.llm.complete(
                system_prompt="You are a VP of Sales analyzing the impact of a pricing change on sales performance.",
                user_prompt=f"Sales analysis: {self._get_llm_context(simulation_results)} Enterprise customers lost: {enterprise_lost}."
            )
        else:
            reasoning = (
                f"Enterprise segment shows {enterprise_impact} price sensitivity ({enterprise_lost} accounts at risk). "
                f"SMB and individual segments face higher churn risk ({smb_lost + individual_lost:,} customers). "
                f"Win rate expected to decrease by {abs(win_rate_change):.1f}% as prospects compare competitor pricing. "
                f"Sales cycle may extend by 5-7 days for new prospects requiring price justification."
            )

        return {
            "impact": "slightly_negative" if customers_lost > 500 else "neutral",
            "customers_lost_total": customers_lost,
            "enterprise_accounts_at_risk": enterprise_lost,
            "smb_accounts_at_risk": smb_lost,
            "pipeline_impact_percent": round(pipeline_impact_pct, 2),
            "win_rate_change_percent": round(win_rate_change, 2),
            "new_cac": round(new_cac, 2),
            "sales_cycle_impact_days": 5 if price_chg >= 7 else 2,
            "regional_impact": {
                "north_america": "LOW",
                "europe": "MEDIUM" if price_chg >= 10 else "LOW",
                "apac": "MEDIUM",
                "latam": "HIGH" if price_chg >= 10 else "MEDIUM",
            },
            "confidence": confidence,
            "reasoning": reasoning,
            "debate_position": f"Enterprise customers have LOW price sensitivity. SMB/individual segments show {abs(win_rate_change):.0f}% win rate risk.",
        }
