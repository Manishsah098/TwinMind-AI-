"""
TwinMind AI - Profit Simulation Module
"""
from typing import Dict, Any


def calculate_profit(
    revenue: float,
    operating_costs: float,
    marketing_costs: float,
    rd_costs: float,
    supply_costs: float = 0.0,
    gross_margin: float = 0.68,
) -> Dict[str, float]:
    """
    Profit = Revenue × Gross Margin - Operating Costs - Marketing Costs - RD Costs
    """
    gross_profit = revenue * gross_margin
    total_opex = operating_costs + marketing_costs + rd_costs + supply_costs
    operating_profit = gross_profit - total_opex
    net_margin = operating_profit / revenue if revenue > 0 else 0

    return {
        "gross_profit": round(gross_profit, 2),
        "total_opex": round(total_opex, 2),
        "operating_profit": round(operating_profit, 2),
        "net_margin": round(net_margin * 100, 2),
        "operating_costs": round(operating_costs, 2),
        "marketing_costs": round(marketing_costs, 2),
        "rd_costs": round(rd_costs, 2),
    }


def calculate_profit_impact(
    base_revenue: float,
    new_revenue: float,
    base_operating_costs: float,
    marketing_costs: float,
    rd_costs: float,
    gross_margin: float = 0.68,
    cost_scale_factor: float = 0.3,  # operating costs scale with revenue at 30%
) -> Dict[str, float]:
    """
    Compare base vs scenario profit.
    Operating costs partially scale with revenue (variable costs).
    """
    # Scale operating costs: fixed portion + variable portion
    fixed_costs = base_operating_costs * 0.6
    variable_costs = base_operating_costs * 0.4
    revenue_ratio = new_revenue / base_revenue if base_revenue > 0 else 1
    new_operating_costs = fixed_costs + variable_costs * revenue_ratio

    base_profit_data = calculate_profit(base_revenue, base_operating_costs, marketing_costs, rd_costs, gross_margin=gross_margin)
    new_profit_data = calculate_profit(new_revenue, new_operating_costs, marketing_costs, rd_costs, gross_margin=gross_margin)

    profit_change = new_profit_data["operating_profit"] - base_profit_data["operating_profit"]
    profit_change_percent = (profit_change / abs(base_profit_data["operating_profit"])) * 100 if base_profit_data["operating_profit"] != 0 else 0

    return {
        "base_profit": base_profit_data["operating_profit"],
        "new_profit": new_profit_data["operating_profit"],
        "profit_change": round(profit_change, 2),
        "profit_change_percent": round(profit_change_percent, 2),
        "base_margin": base_profit_data["net_margin"],
        "new_margin": new_profit_data["net_margin"],
        "base_detail": base_profit_data,
        "new_detail": new_profit_data,
    }
