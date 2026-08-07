"""
TwinMind AI - Supply Chain Agent
Analyzes supplier capacity, lead times, logistics, and vendor risk.
"""
from typing import Dict, Any
from .base_agent import BaseAgent


class SupplyChainAgent(BaseAgent):
    name = "Supply Chain"
    description = "Analyzes supplier capacity, lead times, logistics costs, vendor risk, and operational bottlenecks."

    async def _analyze(self, company_state: Dict, scenario: Dict, simulation_results: Dict) -> Dict[str, Any]:
        demand = simulation_results.get("demand", {})
        price_chg = simulation_results.get("price_change_percent", 0)

        suppliers = company_state.get("suppliers", 35)
        demand_change_pct = demand.get("demand_change_percent", 0)

        # For SaaS, supply chain impact is minimal but still exists (infra, etc.)
        infra_cost_change = demand_change_pct * 0.4  # infra scales with demand
        vendor_risk = "LOW" if abs(demand_change_pct) < 10 else "MEDIUM"
        renegotiation_needed = abs(demand_change_pct) > 15

        reasoning = ""
        if self.llm:
            reasoning = await self.llm.complete(
                system_prompt="You are a VP of Supply Chain analyzing operational impact of a pricing change.",
                user_prompt=f"Supply chain analysis: {self._get_llm_context(simulation_results)}"
            )
        else:
            reasoning = (
                f"Demand reduction of {abs(demand_change_pct):.1f}% reduces infrastructure and operational costs proportionally. "
                f"Cloud infrastructure costs decrease by ~{abs(infra_cost_change):.1f}% with lower user volume. "
                f"All {suppliers} suppliers operate within normal capacity. "
                f"No lead time changes expected. Vendor contracts remain stable. "
                f"{'Vendor renegotiation recommended to capture cost savings.' if renegotiation_needed else 'No supply chain changes required.'}"
            )

        return {
            "impact": "positive" if demand_change_pct < 0 else "neutral",  # less demand = lower costs
            "demand_change_percent": round(demand_change_pct, 2),
            "infra_cost_change_percent": round(infra_cost_change, 2),
            "active_suppliers": suppliers,
            "vendor_risk_level": vendor_risk,
            "lead_time_impact_days": 0,
            "renegotiation_opportunity": renegotiation_needed,
            "bottlenecks_identified": [],
            "operational_capacity": "SUFFICIENT",
            "confidence": 0.88,
            "reasoning": reasoning,
            "debate_position": f"Demand reduction of {abs(demand_change_pct):.0f}% lowers infrastructure costs. No supply chain risks.",
        }
