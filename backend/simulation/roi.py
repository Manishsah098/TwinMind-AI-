"""
TwinMind AI - ROI Simulation Module
"""
from typing import Dict, Any


def calculate_roi(
    profit_change: float,
    investment_cost: float,
    time_horizon_months: int = 12,
) -> Dict[str, float]:
    """
    ROI = (Gain From Scenario - Investment Cost) / Investment Cost
    """
    if investment_cost <= 0:
        investment_cost = 50_000  # minimal implementation cost estimate

    net_gain = profit_change - investment_cost
    roi = (net_gain / investment_cost) * 100
    payback_months = (investment_cost / (profit_change / time_horizon_months)) if profit_change > 0 else 999

    return {
        "roi_percent": round(roi, 2),
        "net_gain": round(net_gain, 2),
        "investment_cost": round(investment_cost, 2),
        "profit_change": round(profit_change, 2),
        "payback_months": round(min(payback_months, 999), 1),
        "annualized_roi": round(roi * (12 / time_horizon_months), 2),
    }
