"""
TwinMind AI - Risk Agent
Comprehensive risk analysis across all business dimensions.
"""
from typing import Dict, Any, List
from .base_agent import BaseAgent


class RiskAgent(BaseAgent):
    name = "Risk"
    description = "Analyzes financial, operational, market, customer, supply chain, and regulatory risks."

    async def _analyze(self, company_state: Dict, scenario: Dict, simulation_results: Dict) -> Dict[str, Any]:
        risk = simulation_results.get("risk", {})
        mc = simulation_results.get("monte_carlo", {})
        price_chg = simulation_results.get("price_change_percent", 0)

        composite_score = risk.get("composite_score", 50)
        category = risk.get("category", "MEDIUM")
        breakdown = risk.get("breakdown", {})
        major_risks = risk.get("major_risks", [])
        mitigations = risk.get("mitigations", [])

        loss_probability = mc.get("probabilities", {}).get("loss", 0)
        high_churn_prob = mc.get("probabilities", {}).get("high_churn", 0)

        confidence = 0.91

        reasoning = ""
        if self.llm:
            reasoning = await self.llm.complete(
                system_prompt="You are a Chief Risk Officer performing a comprehensive risk assessment of a pricing decision.",
                user_prompt=f"Risk analysis: {self._get_llm_context(simulation_results)} Risk score: {composite_score}. Category: {category}."
            )
        else:
            reasoning = (
                f"Composite risk score: {composite_score}/100 — {category} risk. "
                f"Probability of financial loss: {loss_probability*100:.1f}%. "
                f"Probability of high churn (>4%/mo): {high_churn_prob*100:.1f}%. "
                f"Primary risk: {'competitor undercutting and SMB churn' if price_chg >= 10 else 'moderate customer sensitivity — manageable'}. "
                f"Recommended mitigations: {'; '.join(mitigations[:2])}."
            )

        return {
            "impact": "risk_assessment",
            "risk_score": composite_score,
            "risk_category": category,
            "risk_breakdown": breakdown,
            "major_risks": major_risks,
            "mitigations": mitigations,
            "loss_probability": round(loss_probability, 3),
            "high_churn_probability": round(high_churn_prob, 3),
            "financial_risk": breakdown.get("financial_risk", 0),
            "market_risk": breakdown.get("market_risk", 0),
            "customer_risk": breakdown.get("customer_risk", 0),
            "operational_risk": breakdown.get("operational_risk", 0),
            "supply_chain_risk": breakdown.get("supply_chain_risk", 0),
            "regulatory_risk": breakdown.get("regulatory_risk", 0),
            "confidence": confidence,
            "reasoning": reasoning,
            "debate_position": f"Risk score {composite_score}/100 ({category}). {'Competitor reaction creates downside risk.' if price_chg >= 10 else 'Risk is manageable with proper mitigations.'}",
        }
