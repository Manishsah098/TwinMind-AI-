"""
TwinMind AI - Demo Company Data (DemoCorp)
Synthetic enterprise data for the hackathon demo
"""

DEMO_COMPANY = {
    "id": "democorp-001",
    "company": "DemoCorp",
    "industry": "B2B SaaS",
    "founded": 2018,
    "headquarters": "San Francisco, CA",
    
    # Financial KPIs
    "revenue": 10_000_000,
    "annual_revenue": 10_000_000,
    "monthly_revenue": 833_333,
    "gross_margin": 0.68,
    "operating_margin": 0.22,
    "net_margin": 0.18,
    "ebitda": 2_200_000,
    "cash": 3_500_000,
    "debt": 500_000,
    "operating_costs": 2_600_000,
    "marketing_costs": 1_200_000,
    "rd_costs": 800_000,
    
    # Customer KPIs
    "customers": 50_000,
    "enterprise_customers": 420,
    "smb_customers": 8_200,
    "individual_customers": 41_380,
    "average_price": 200,          # monthly subscription
    "avg_price": 200,
    "average_contract_value": 2_400,
    "monthly_churn": 0.025,        # 2.5% monthly churn
    "annual_churn": 0.27,
    "nps_score": 42,
    "csat_score": 0.81,
    "ltv": 8_000,
    "cac": 320,
    "ltv_cac_ratio": 25.0,
    
    # Sales KPIs
    "sales_pipeline": 4_200_000,
    "win_rate": 0.24,
    "average_sales_cycle_days": 45,
    "monthly_new_customers": 1_250,
    "conversion_rate": 0.032,
    "leads_per_month": 39_000,
    
    # Operations
    "employees": 420,
    "engineering": 120,
    "sales": 85,
    "marketing": 55,
    "operations": 80,
    "support": 60,
    "hr_finance": 20,
    "revenue_per_employee": 23_809,
    
    # Supply Chain
    "suppliers": 35,
    "primary_suppliers": 8,
    "inventory": 150_000,
    "inventory_turnover": 12.4,
    "lead_time_days": 14,
    "stockout_rate": 0.03,
    
    # Price elasticity (used in simulations)
    "price_elasticity": -0.55,     # segment-weighted price elasticity
    "enterprise_elasticity": -0.6,  # enterprise is less price sensitive
    "smb_elasticity": -1.8,
    "individual_elasticity": -2.2,
    
    # Competitive position
    "market_share": 0.08,
    "competitor_price_index": 1.05, # competitors 5% more expensive
    "brand_strength": 0.72,
}

# Scenario configurations for the demo
DEMO_SCENARIOS = [
    {"name": "Baseline (0%)",    "price_change_percent": 0,   "duration_months": 12},
    {"name": "+5% Price Increase", "price_change_percent": 5,  "duration_months": 12},
    {"name": "+7% Price Increase", "price_change_percent": 7,  "duration_months": 12},
    {"name": "+10% Price Increase","price_change_percent": 10, "duration_months": 12},
    {"name": "+15% Price Increase","price_change_percent": 15, "duration_months": 12},
]

# Digital Twin node relationships for React Flow
TWIN_NODES = [
    {"id": "company",    "label": "DemoCorp",      "type": "company",    "x": 400, "y": 50},
    {"id": "finance",    "label": "Finance",        "type": "finance",    "x": 100, "y": 200},
    {"id": "sales",      "label": "Sales",          "type": "sales",      "x": 250, "y": 200},
    {"id": "marketing",  "label": "Marketing",      "type": "marketing",  "x": 400, "y": 200},
    {"id": "hr",         "label": "HR",             "type": "hr",         "x": 550, "y": 200},
    {"id": "operations", "label": "Operations",     "type": "operations", "x": 700, "y": 200},
    {"id": "inventory",  "label": "Inventory",      "type": "inventory",  "x": 200, "y": 380},
    {"id": "suppliers",  "label": "Suppliers",      "type": "suppliers",  "x": 400, "y": 380},
    {"id": "customers",  "label": "Customers",      "type": "customers",  "x": 600, "y": 380},
]

TWIN_EDGES = [
    {"source": "company",    "target": "finance"},
    {"source": "company",    "target": "sales"},
    {"source": "company",    "target": "marketing"},
    {"source": "company",    "target": "hr"},
    {"source": "company",    "target": "operations"},
    {"source": "sales",      "target": "customers"},
    {"source": "marketing",  "target": "customers"},
    {"source": "operations", "target": "inventory"},
    {"source": "operations", "target": "suppliers"},
    {"source": "suppliers",  "target": "inventory"},
    {"source": "finance",    "target": "hr"},
]

# Node KPI data for the Digital Twin
TWIN_KPIs = {
    "company":    {"Revenue": "$10M", "Employees": "420", "Market Share": "8%", "NPS": "42"},
    "finance":    {"Gross Margin": "68%", "Operating Margin": "22%", "Cash": "$3.5M", "EBITDA": "$2.2M"},
    "sales":      {"Pipeline": "$4.2M", "Win Rate": "24%", "New Customers/mo": "1,250", "Sales Cycle": "45 days"},
    "marketing":  {"CAC": "$320", "LTV": "$8,000", "LTV/CAC": "25x", "Monthly Leads": "39,000"},
    "hr":         {"Employees": "420", "Revenue/Employee": "$23,809", "Departments": "6"},
    "operations": {"Suppliers": "35", "Lead Time": "14 days", "Stockout Rate": "3%"},
    "inventory":  {"Value": "$150K", "Turnover": "12.4x", "Stockout Rate": "3%"},
    "suppliers":  {"Active": "35", "Primary": "8", "Lead Time": "14 days"},
    "customers":  {"Total": "50,000", "Churn": "2.5%/mo", "Avg Price": "$200/mo", "CSAT": "81%"},
}
