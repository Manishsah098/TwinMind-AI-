"""
TwinMind AI - Risk Simulation Module
"""
from typing import Dict, Any, List


RISK_WEIGHTS = {
    "financial_risk":    0.25,
    "market_risk":       0.25,
    "customer_risk":     0.20,
    "operational_risk":  0.15,
    "supply_chain_risk": 0.10,
    "regulatory_risk":   0.05,
}


def calculate_risk_score(
    price_change_percent: float,
    churn_change_percent: float,
    revenue_change_percent: float,
    profit_change_percent: float,
    market_share: float = 0.08,
    competitor_price_index: float = 1.05,
) -> Dict[str, Any]:
    """
    Calculate composite risk score (0-100).
    Higher price changes → higher risk.
    """
    # Financial risk: driven by revenue/profit uncertainty
    financial_risk = min(100, abs(revenue_change_percent) * 3 + max(0, -profit_change_percent) * 2)

    # Market risk: driven by competitive pressure
    price_vs_competitor = (1 + price_change_percent / 100) / competitor_price_index
    market_risk = min(100, max(0, (price_vs_competitor - 1) * 200 + 20))

    # Customer risk: driven by churn
    customer_risk = min(100, abs(churn_change_percent) * 4 + price_change_percent * 2)

    # Operational risk: increases at extremes
    operational_risk = min(100, abs(price_change_percent) * 1.5)

    # Supply chain risk: minimal for SaaS
    supply_chain_risk = min(30, abs(price_change_percent) * 0.8)

    # Regulatory risk: low base
    regulatory_risk = min(20, abs(price_change_percent) * 0.5 + 5)

    composite = (
        financial_risk    * RISK_WEIGHTS["financial_risk"] +
        market_risk       * RISK_WEIGHTS["market_risk"] +
        customer_risk     * RISK_WEIGHTS["customer_risk"] +
        operational_risk  * RISK_WEIGHTS["operational_risk"] +
        supply_chain_risk * RISK_WEIGHTS["supply_chain_risk"] +
        regulatory_risk   * RISK_WEIGHTS["regulatory_risk"]
    )

    if composite < 30:
        category = "LOW"
    elif composite < 55:
        category = "MEDIUM"
    elif composite < 75:
        category = "HIGH"
    else:
        category = "CRITICAL"

    return {
        "composite_score": round(composite, 1),
        "category": category,
        "breakdown": {
            "financial_risk": round(financial_risk, 1),
            "market_risk": round(market_risk, 1),
            "customer_risk": round(customer_risk, 1),
            "operational_risk": round(operational_risk, 1),
            "supply_chain_risk": round(supply_chain_risk, 1),
            "regulatory_risk": round(regulatory_risk, 1),
        },
        "major_risks": _identify_major_risks(price_change_percent, churn_change_percent),
        "mitigations": _suggest_mitigations(price_change_percent, category),
    }


def _identify_major_risks(price_change_percent: float, churn_change_percent: float) -> List[str]:
    risks = []
    if price_change_percent >= 10:
        risks.append("Significant customer churn in price-sensitive segments")
    if price_change_percent >= 7:
        risks.append("Competitor market share gain in overlap segments")
    if abs(churn_change_percent) > 20:
        risks.append("Elevated churn risk exceeds safe threshold")
    if price_change_percent >= 15:
        risks.append("Brand perception damage in enterprise segment")
    risks.append("Macroeconomic downturn compounding price sensitivity")
    return risks[:4]


def _suggest_mitigations(price_change_percent: float, category: str) -> List[str]:
    mitigations = [
        "Offer loyalty discounts to high-value accounts",
        "Phase price increase over 2-3 quarters",
    ]
    if price_change_percent >= 10:
        mitigations.append("Introduce value-add features to justify price increase")
        mitigations.append("Create grandfathering program for legacy customers")
    if category in ["HIGH", "CRITICAL"]:
        mitigations.append("Develop contingency plan for 5%+ churn scenario")
    return mitigations
