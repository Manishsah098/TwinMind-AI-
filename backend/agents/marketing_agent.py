"""
TwinMind AI - Marketing Agent
Analyzes customer demand, price elasticity, CAC, churn risk, and retention.
"""
from typing import Dict, Any
from .base_agent import BaseAgent


class MarketingAgent(BaseAgent):
    name = "Marketing"
    description = "Analyzes customer demand, price elasticity, CAC, campaign impact, and customer churn/retention."

    async def _analyze(self, company_state: Dict, scenario: Dict, simulation_results: Dict) -> Dict[str, Any]:
        churn = simulation_results.get("churn", {})
        demand = simulation_results.get("demand", {})
        price_chg = simulation_results.get("price_change_percent", 0)

        new_churn_rate = churn.get("new_monthly_churn", 2.5)
        churn_change_pct = churn.get("churn_change_percent", 0)
        demand_change_pct = demand.get("demand_change_percent", 0)
        customers_lost = demand.get("customers_lost", 0)

        # CAC increases when we need to replace lost customers
        base_cac = company_state.get("cac", 320)
        replacement_cost = customers_lost * base_cac
        new_cac = base_cac * (1 + price_chg * 0.01)  # slight CAC increase

        # Brand sentiment impact
        if price_chg <= 5:
            brand_impact = "neutral"
        elif price_chg <= 10:
            brand_impact = "slightly_negative"
        else:
            brand_impact = "negative"

        # Retention campaign needed?
        retention_campaign_needed = price_chg >= 7
        retention_campaign_cost = 150_000 if retention_campaign_needed else 0

        confidence = 0.79

        reasoning = ""
        if self.llm:
            reasoning = await self.llm.complete(
                system_prompt="You are a CMO analyzing the marketing and customer retention impact of a pricing decision.",
                user_prompt=f"Marketing analysis: {self._get_llm_context(simulation_results)} Churn change: {churn_change_pct:.1f}%."
            )
        else:
            reasoning = (
                f"Price elasticity of -1.4 means a {price_chg}% increase drives {abs(demand_change_pct):.1f}% demand reduction. "
                f"Monthly churn rises from 2.5% to {new_churn_rate:.2f}%. "
                f"Replacing {customers_lost:,} lost customers costs ~${replacement_cost:,.0f} in CAC. "
                f"{'Retention campaign recommended at $150K to protect at-risk accounts.' if retention_campaign_needed else 'No retention campaign required at this price level.'} "
                f"Brand sentiment: {brand_impact}."
            )

        return {
            "impact": "negative" if churn_change_pct > 20 else "slightly_negative",
            "demand_change_percent": round(demand_change_pct, 2),
            "new_monthly_churn": round(new_churn_rate, 2),
            "churn_change_percent": round(churn_change_pct, 2),
            "customers_at_risk": customers_lost,
            "cac_new": round(new_cac, 2),
            "customer_replacement_cost": round(replacement_cost, 2),
            "brand_sentiment_impact": brand_impact,
            "retention_campaign_needed": retention_campaign_needed,
            "retention_campaign_cost": retention_campaign_cost,
            "price_elasticity_used": -1.4,
            "confidence": confidence,
            "reasoning": reasoning,
            "debate_position": f"Higher price increases churn by {churn_change_pct:.0f}%. Customer replacement costs ${replacement_cost:,.0f}.",
        }
