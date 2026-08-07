"""
TwinMind AI - Demand Simulation Module
"""
import numpy as np
from typing import Dict, Any


def calculate_demand_impact(
    current_customers: int,
    price_change_percent: float,
    elasticity: float,
    enterprise_share: float = 0.0084,
    smb_share: float = 0.164,
) -> Dict[str, Any]:
    """
    Calculate demand change by customer segment.
    Enterprise is less price sensitive, individual most sensitive.
    """
    enterprise_customers = int(current_customers * enterprise_share)
    smb_customers = int(current_customers * smb_share)
    individual_customers = current_customers - enterprise_customers - smb_customers

    # Segment-specific elasticities
    enterprise_elasticity = -0.6
    smb_elasticity = -1.8
    individual_elasticity = -2.2

    def segment_new_customers(count, seg_elasticity):
        change = (seg_elasticity * price_change_percent) / 100
        return max(0, int(count * (1 + change)))

    new_enterprise = segment_new_customers(enterprise_customers, enterprise_elasticity)
    new_smb = segment_new_customers(smb_customers, smb_elasticity)
    new_individual = segment_new_customers(individual_customers, individual_elasticity)

    new_total = new_enterprise + new_smb + new_individual
    lost_customers = current_customers - new_total
    demand_change_pct = ((new_total - current_customers) / current_customers) * 100

    return {
        "original_customers": current_customers,
        "new_total_customers": new_total,
        "customers_lost": lost_customers,
        "demand_change_percent": round(demand_change_pct, 2),
        "segments": {
            "enterprise": {"original": enterprise_customers, "new": new_enterprise, "lost": enterprise_customers - new_enterprise},
            "smb": {"original": smb_customers, "new": new_smb, "lost": smb_customers - new_smb},
            "individual": {"original": individual_customers, "new": new_individual, "lost": individual_customers - new_individual},
        }
    }
