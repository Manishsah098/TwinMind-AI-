"""
TwinMind AI - Monte Carlo Scenario Engine
Runs 1000+ deterministic simulations per scenario with randomized parameters
"""
import numpy as np
from typing import Dict, Any, List
from .revenue import calculate_new_revenue, project_revenue_timeline
from .demand import calculate_demand_impact
from .churn import calculate_churn_impact, high_churn_probability
from .profit import calculate_profit_impact
from .roi import calculate_roi
from .risk import calculate_risk_score


N_SIMULATIONS = 1000

# DemoCorp base parameters
BASE_PARAMS = {
    "revenue": 10_000_000,
    "customers": 50_000,
    "avg_price": 200,
    "gross_margin": 0.68,
    "monthly_churn": 0.025,
    "operating_costs": 6_800_000,
    "marketing_costs": 1_200_000,
    "rd_costs": 800_000,
    "price_elasticity": -1.4,
    "market_share": 0.08,
    "competitor_price_index": 1.05,
    "cash": 3_500_000,
}


def run_monte_carlo(price_change_percent: float, n_sims: int = N_SIMULATIONS, seed: int = 42) -> Dict[str, Any]:
    """
    Run Monte Carlo simulation with randomized parameters.
    Returns statistical summary across all simulations.
    """
    rng = np.random.default_rng(seed)

    profits = []
    revenues = []
    churns = []
    rois = []

    for _ in range(n_sims):
        # Randomize key parameters (±std around base)
        elasticity = rng.normal(-1.4, 0.3)  # demand elasticity
        churn_base = rng.normal(0.025, 0.004)
        churn_sensitivity = rng.normal(0.0015, 0.0004)
        margin = rng.normal(0.68, 0.03)
        op_cost_factor = rng.normal(1.0, 0.05)
        cac_factor = rng.normal(1.0, 0.1)

        # Clamp to realistic ranges
        elasticity = np.clip(elasticity, -3.0, -0.2)
        churn_base = np.clip(churn_base, 0.005, 0.08)
        margin = np.clip(margin, 0.4, 0.85)
        op_cost_factor = np.clip(op_cost_factor, 0.8, 1.2)

        # Revenue
        rev_data = calculate_new_revenue(
            base_revenue=BASE_PARAMS["revenue"],
            price_change_percent=price_change_percent,
            demand_elasticity=elasticity,
            current_customers=BASE_PARAMS["customers"],
            avg_price=BASE_PARAMS["avg_price"],
        )
        new_revenue = rev_data["new_revenue"]

        # Churn
        monthly_churn = churn_base + churn_sensitivity * price_change_percent
        monthly_churn = np.clip(monthly_churn, 0.005, 0.15)

        # Profit
        op_costs = BASE_PARAMS["operating_costs"] * op_cost_factor
        profit_data = calculate_profit_impact(
            base_revenue=BASE_PARAMS["revenue"],
            new_revenue=new_revenue,
            base_operating_costs=op_costs,
            marketing_costs=BASE_PARAMS["marketing_costs"],
            rd_costs=BASE_PARAMS["rd_costs"],
            gross_margin=margin,
        )

        profits.append(profit_data["new_profit"])
        revenues.append(new_revenue)
        churns.append(monthly_churn * 100)  # as percentage

        # ROI
        roi_data = calculate_roi(profit_data["profit_change"], investment_cost=50_000)
        rois.append(roi_data["roi_percent"])

    profits = np.array(profits)
    revenues = np.array(revenues)
    churns = np.array(churns)
    rois = np.array(rois)

    base_profit = calculate_profit_impact(
        BASE_PARAMS["revenue"], BASE_PARAMS["revenue"],
        BASE_PARAMS["operating_costs"], BASE_PARAMS["marketing_costs"],
        BASE_PARAMS["rd_costs"], gross_margin=BASE_PARAMS["gross_margin"]
    )["new_profit"]

    return {
        "n_simulations": n_sims,
        "price_change_percent": price_change_percent,
        "profit": {
            "expected": round(float(np.mean(profits)), 2),
            "best_case": round(float(np.percentile(profits, 90)), 2),
            "worst_case": round(float(np.percentile(profits, 10)), 2),
            "median": round(float(np.median(profits)), 2),
            "std": round(float(np.std(profits)), 2),
            "base": round(base_profit, 2),
        },
        "revenue": {
            "expected": round(float(np.mean(revenues)), 2),
            "best_case": round(float(np.percentile(revenues, 90)), 2),
            "worst_case": round(float(np.percentile(revenues, 10)), 2),
        },
        "churn": {
            "expected": round(float(np.mean(churns)), 2),
            "best_case": round(float(np.percentile(churns, 10)), 2),   # lower churn = better
            "worst_case": round(float(np.percentile(churns, 90)), 2),
        },
        "roi": {
            "expected": round(float(np.mean(rois)), 2),
            "best_case": round(float(np.percentile(rois, 90)), 2),
            "worst_case": round(float(np.percentile(rois, 10)), 2),
        },
        "probabilities": {
            "profit_increase": round(float(np.mean(profits > base_profit)), 3),
            "loss": round(float(np.mean(profits < 0)), 3),
            "high_churn": round(float(np.mean(churns > 4.0)), 3),
            "roi_positive": round(float(np.mean(rois > 0)), 3),
        },
        "distribution": {
            "p10": round(float(np.percentile(profits, 10)), 2),
            "p25": round(float(np.percentile(profits, 25)), 2),
            "p50": round(float(np.percentile(profits, 50)), 2),
            "p75": round(float(np.percentile(profits, 75)), 2),
            "p90": round(float(np.percentile(profits, 90)), 2),
        }
    }


def run_scenario(price_change_percent: float, duration_months: int = 12, company_state: Dict = None) -> Dict[str, Any]:
    """
    Run a full deterministic scenario analysis.
    Returns all simulation outputs for agent consumption.
    """
    params = company_state or BASE_PARAMS

    revenue_data = calculate_new_revenue(
        base_revenue=params["revenue"],
        price_change_percent=price_change_percent,
        demand_elasticity=params.get("price_elasticity", -1.4),
        current_customers=params["customers"],
        avg_price=params["avg_price"],
    )

    demand_data = calculate_demand_impact(
        current_customers=params["customers"],
        price_change_percent=price_change_percent,
        elasticity=params.get("price_elasticity", -1.4),
    )

    churn_data = calculate_churn_impact(
        base_monthly_churn=params["monthly_churn"],
        price_change_percent=price_change_percent,
        customers=params["customers"],
        months=duration_months,
    )

    profit_data = calculate_profit_impact(
        base_revenue=params["revenue"],
        new_revenue=revenue_data["new_revenue"],
        base_operating_costs=params["operating_costs"],
        marketing_costs=params["marketing_costs"],
        rd_costs=params["rd_costs"],
        gross_margin=params["gross_margin"],
    )

    roi_data = calculate_roi(
        profit_change=profit_data["profit_change"],
        investment_cost=50_000,
        time_horizon_months=duration_months,
    )

    risk_data = calculate_risk_score(
        price_change_percent=price_change_percent,
        churn_change_percent=churn_data["churn_change_percent"],
        revenue_change_percent=revenue_data["revenue_change_percent"],
        profit_change_percent=profit_data["profit_change_percent"],
        market_share=params.get("market_share", 0.08),
        competitor_price_index=params.get("competitor_price_index", 1.05),
    )

    timeline = project_revenue_timeline(
        base_revenue=params["revenue"],
        price_change_percent=price_change_percent,
        elasticity=params.get("price_elasticity", -1.4),
        months=duration_months,
        churn_rate=churn_data["new_monthly_churn"] / 100,
    )

    monte_carlo = run_monte_carlo(price_change_percent)

    return {
        "price_change_percent": price_change_percent,
        "duration_months": duration_months,
        "revenue": revenue_data,
        "demand": demand_data,
        "churn": churn_data,
        "profit": profit_data,
        "roi": roi_data,
        "risk": risk_data,
        "timeline": timeline,
        "monte_carlo": monte_carlo,
    }


def run_all_scenarios(company_state: Dict = None) -> List[Dict[str, Any]]:
    """
    Run baseline + 4 price increase scenarios.
    Returns list ordered by price_change_percent.
    """
    price_changes = [0, 5, 7, 10, 15]
    results = []
    for pct in price_changes:
        result = run_scenario(pct, company_state=company_state)
        results.append(result)
    return results


def find_optimal_scenario(scenarios: List[Dict]) -> Dict[str, Any]:
    """
    Determine the optimal scenario using a scoring function:
    score = 0.4 * profit_change + 0.3 * (1 - risk_score/100) + 0.3 * roi
    Normalized across all scenarios.
    """
    if not scenarios:
        return {}

    scores = []
    for s in scenarios:
        profit_chg = s["profit"]["profit_change_percent"]
        risk_score = s["risk"]["composite_score"]
        roi = s["roi"]["roi_percent"]

        # Normalize: profit (higher better), risk (lower better), roi (higher better)
        score = (
            0.40 * profit_chg +
            0.30 * (100 - risk_score) +
            0.30 * min(roi, 200)  # cap ROI contribution
        )
        scores.append(score)

    best_idx = int(np.argmax(scores))
    return {
        "optimal_scenario": scenarios[best_idx],
        "optimal_price_change": scenarios[best_idx]["price_change_percent"],
        "all_scores": [round(s, 2) for s in scores],
        "score": round(scores[best_idx], 2),
    }
