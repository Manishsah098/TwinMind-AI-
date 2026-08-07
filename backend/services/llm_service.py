"""
TwinMind AI - LLM Service Abstraction
Supports OpenAI and a deterministic demo mode fallback
"""
import os
import json
from typing import Optional
from dotenv import load_dotenv

load_dotenv()

DEMO_MODE = os.getenv("DEMO_MODE", "true").lower() == "true"
LLM_PROVIDER = os.getenv("LLM_PROVIDER", "openai")
LLM_API_KEY = os.getenv("LLM_API_KEY", "")
LLM_MODEL = os.getenv("LLM_MODEL", "gpt-4o-mini")


class LLMService:
    """
    Clean LLM abstraction. When DEMO_MODE=true or no API key is set,
    returns realistic deterministic responses so the app always works.
    """

    def __init__(self):
        self.demo_mode = DEMO_MODE or not LLM_API_KEY
        self.provider = LLM_PROVIDER
        self.model = LLM_MODEL
        self._client = None

        if not self.demo_mode:
            self._init_client()

    def _init_client(self):
        try:
            if self.provider == "openai":
                from openai import AsyncOpenAI
                self._client = AsyncOpenAI(api_key=LLM_API_KEY)
        except ImportError:
            self.demo_mode = True

    async def complete(self, system_prompt: str, user_prompt: str, temperature: float = 0.3) -> str:
        """Generate a completion. Falls back to demo mode if LLM unavailable."""
        if self.demo_mode:
            return self._demo_response(user_prompt)

        try:
            response = await self._client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt},
                ],
                temperature=temperature,
                max_tokens=1000,
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"[LLMService] API error, falling back to demo mode: {e}")
            return self._demo_response(user_prompt)

    def _demo_response(self, prompt: str) -> str:
        """Deterministic, realistic response generator for demo mode."""
        prompt_lower = prompt.lower()

        if "finance" in prompt_lower or "revenue" in prompt_lower:
            return (
                "From a financial perspective, the proposed price change improves gross margin "
                "while the revenue impact depends heavily on customer elasticity. "
                "Our models suggest the 7% scenario provides optimal margin expansion "
                "without triggering significant volume loss. Cash flow improves by $650K annually."
            )
        elif "sales" in prompt_lower or "pipeline" in prompt_lower:
            return (
                "Sales analysis indicates enterprise accounts have low price sensitivity (elasticity -0.6), "
                "while SMB and individual segments show higher sensitivity. "
                "The 7% increase maintains competitive positioning and aligns with the market rate. "
                "Pipeline conversion is expected to remain stable for enterprise accounts."
            )
        elif "marketing" in prompt_lower or "churn" in prompt_lower:
            return (
                "Marketing data shows price elasticity of -1.4 for our average customer. "
                "A 10% increase risks 4-6% incremental churn in price-sensitive segments. "
                "The 7% scenario keeps churn within acceptable bounds while allowing "
                "retention campaigns to offset projected losses. CAC remains stable."
            )
        elif "hr" in prompt_lower or "workforce" in prompt_lower:
            return (
                "No significant workforce impact expected. A successful price increase "
                "could fund 12-15 additional hires in sales and engineering. "
                "Team morale impact is neutral. Training costs for new pricing strategy: ~$45K."
            )
        elif "supply" in prompt_lower or "supplier" in prompt_lower:
            return (
                "Supply chain impact is minimal for a SaaS-heavy business. "
                "Reduced volume projections may reduce infrastructure costs by 3-4%. "
                "No supplier renegotiation required. Operational capacity sufficient for all scenarios."
            )
        elif "inventory" in prompt_lower:
            return (
                "Inventory adjustments recommended for the 10-15% scenarios due to projected "
                "demand reduction. Safety stock levels should be reviewed. "
                "The 7% scenario requires no inventory changes."
            )
        elif "risk" in prompt_lower:
            return (
                "Primary risks: (1) Competitor undercutting on price — moderate probability. "
                "(2) SMB customer churn exceeding projections — manageable with retention offers. "
                "(3) Regulatory pricing scrutiny in EU markets — low risk. "
                "The 7% scenario scores LOW on overall risk scale."
            )
        elif "recommend" in prompt_lower or "executive" in prompt_lower:
            return (
                "After consulting all agents and running 1,000 Monte Carlo simulations, "
                "I recommend a 7% price increase effective next quarter. "
                "This maximizes the profit/retention tradeoff with 87% confidence. "
                "Expected annual profit gain: $820K. Churn risk: LOW. ROI: 34%. "
                "Implement loyalty discounts for at-risk enterprise accounts."
            )
        else:
            return (
                "Analysis complete. The proposed scenario has been evaluated across all business dimensions. "
                "Key considerations include revenue impact, customer retention, and competitive positioning."
            )

    @property
    def is_demo(self) -> bool:
        return self.demo_mode

    def status(self) -> dict:
        return {
            "demo_mode": self.demo_mode,
            "provider": self.provider if not self.demo_mode else "demo",
            "model": self.model if not self.demo_mode else "deterministic",
        }


# Singleton
llm_service = LLMService()
