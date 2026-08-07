"""
TwinMind AI - Revenue Simulation Module
Deterministic revenue calculations (no LLM)
"""
import numpy as np
from typing import Dict, Any


def calculate_new_revenue(
    base_revenue: float,
    price_change_percent: float,
    demand_elasticity: float,
    current_customers: int,
    avg_price: float,
    purchase_frequency: float = 12.0,
) -> Dict[str, float]:
    """
    Revenue Model:
    New Revenue = New Price × Expected Customers × Purchase Frequency
    
    Uses price elasticity to estimate demand impact.
    """
    price_multiplier = 1 + (price_change_percent / 100)
    new_price = avg_price * price_multiplier

    # Demand change: elasticity × price_change_percent
    demand_change_percent = demand_elasticity * price_change_percent
    demand_multiplier = 1 + (demand_change_percent / 100)
    expected_customers = max(0, int(current_customers * demand_multiplier))

    new_revenue = new_price * expected_customers * purchase_frequency
    revenue_change = new_revenue - base_revenue
    revenue_change_percent = (revenue_change / base_revenue) * 100

    return {
        "base_revenue": base_revenue,
        "new_revenue": round(new_revenue, 2),
        "revenue_change": round(revenue_change, 2),
        "revenue_change_percent": round(revenue_change_percent, 2),
        "new_price": round(new_price, 2),
        "expected_customers": expected_customers,
        "demand_change_percent": round(demand_change_percent, 2),
        "price_multiplier": round(price_multiplier, 4),
    }


def project_revenue_timeline(
    base_revenue: float,
    price_change_percent: float,
    elasticity: float,
    months: int = 12,
    churn_rate: float = 0.025,
) -> list:
    """Project monthly revenue over the scenario duration."""
    months_data = []
    current_revenue = base_revenue / 12  # monthly
    price_effect = 1 + (price_change_percent / 100)
    elasticity_effect = 1 + (elasticity * price_change_percent / 100)
    adjusted_monthly = current_revenue * price_effect * elasticity_effect

    for month in range(1, months + 1):
        # Gradual churn impact over time
        churn_factor = (1 - churn_rate) ** month
        monthly_rev = adjusted_monthly * churn_factor
        months_data.append({
            "month": month,
            "revenue": round(monthly_rev, 2),
            "cumulative": round(sum(d["revenue"] for d in months_data) + monthly_rev, 2),
        })

    return months_data
