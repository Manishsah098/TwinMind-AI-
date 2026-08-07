"""
TwinMind AI - Inventory Agent
Analyzes inventory demand, stockout probability, turnover, and warehouse requirements.
"""
from typing import Dict, Any
from .base_agent import BaseAgent


class InventoryAgent(BaseAgent):
    name = "Inventory"
    description = "Analyzes inventory demand, stockout probability, inventory turnover, and safety stock requirements."

    async def _analyze(self, company_state: Dict, scenario: Dict, simulation_results: Dict) -> Dict[str, Any]:
        demand = simulation_results.get("demand", {})
        price_chg = simulation_results.get("price_change_percent", 0)

        inventory = company_state.get("inventory", 150_000)
        demand_change_pct = demand.get("demand_change_percent", 0)

        # Inventory value adjusts with demand
        new_inventory_value = inventory * (1 + demand_change_pct / 100)
        stockout_probability = max(0.01, 0.03 - (abs(demand_change_pct) * 0.001))  # lower demand = lower stockout risk
        safety_stock_change = "REDUCE" if demand_change_pct < -5 else "MAINTAIN"
        turnover_change = demand_change_pct * 0.6  # turnover tracks demand

        reasoning = ""
        if self.llm:
            reasoning = await self.llm.complete(
                system_prompt="You are a VP of Inventory/Logistics analyzing inventory impact of a pricing change.",
                user_prompt=f"Inventory analysis: {self._get_llm_context(simulation_results)}"
            )
        else:
            reasoning = (
                f"Demand reduction of {abs(demand_change_pct):.1f}% reduces inventory requirements. "
                f"Inventory value adjusts from ${inventory:,} to ${new_inventory_value:,.0f}. "
                f"Stockout probability decreases from 3% to {stockout_probability*100:.1f}% — actually an improvement. "
                f"Safety stock recommendation: {safety_stock_change}. "
                f"{'No significant inventory changes needed for this scenario.' if price_chg <= 7 else 'Recommend reducing inventory orders by 10% to match lower demand.'}"
            )

        return {
            "impact": "slightly_positive",  # less demand = easier to manage inventory
            "current_inventory_value": inventory,
            "new_inventory_value": round(new_inventory_value, 2),
            "inventory_change_percent": round(demand_change_pct * 0.8, 2),
            "stockout_probability": round(stockout_probability, 3),
            "safety_stock_recommendation": safety_stock_change,
            "turnover_change_percent": round(turnover_change, 2),
            "warehouse_impact": "NONE",
            "order_adjustment_needed": price_chg >= 10,
            "confidence": 0.86,
            "reasoning": reasoning,
            "debate_position": f"Lower demand reduces inventory risk. Stockout probability drops to {stockout_probability*100:.1f}%.",
        }
