"""
TwinMind AI - Churn Simulation Module
"""
import numpy as np
from typing import Dict, Any


def calculate_churn_impact(
    base_monthly_churn: float,
    price_change_percent: float,
    customers: int,
    months: int = 12,
) -> Dict[str, Any]:
    """
    Model incremental churn caused by price increase.
    Higher price increases churn in price-sensitive segments.
    """
    # Churn sensitivity: every 1% price increase adds ~0.15% to monthly churn
    churn_sensitivity = 0.0015
    incremental_churn = churn_sensitivity * price_change_percent
    new_monthly_churn = min(0.15, base_monthly_churn + incremental_churn)

    # Customers at end of 12 months
    base_retained = int(customers * (1 - base_monthly_churn) ** months)
    new_retained = int(customers * (1 - new_monthly_churn) ** months)
    incremental_lost = base_retained - new_retained

    churn_change_percent = ((new_monthly_churn - base_monthly_churn) / base_monthly_churn) * 100

    return {
        "base_monthly_churn": round(base_monthly_churn * 100, 2),
        "new_monthly_churn": round(new_monthly_churn * 100, 2),
        "churn_change_percent": round(churn_change_percent, 2),
        "incremental_monthly_churn": round(incremental_churn * 100, 4),
        "customers_at_risk": incremental_lost,
        "base_retained_12mo": base_retained,
        "new_retained_12mo": new_retained,
        "annual_churn_rate": round((1 - (1 - new_monthly_churn) ** 12) * 100, 2),
    }


def high_churn_probability(base_churn: float, price_change_percent: float, threshold: float = 0.04) -> float:
    """Probability that monthly churn exceeds the threshold."""
    sensitivity = 0.0015
    new_churn = base_churn + sensitivity * price_change_percent
    # Simple linear model: prob grows as new_churn approaches threshold
    if new_churn >= threshold:
        return min(0.95, 0.5 + (new_churn - threshold) * 20)
    return max(0.05, (new_churn / threshold) * 0.4)
