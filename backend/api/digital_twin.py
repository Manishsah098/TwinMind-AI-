"""
TwinMind AI - Digital Twin API Endpoint
GET /api/digital-twin
"""
from fastapi import APIRouter
from data.demo_company import DEMO_COMPANY, TWIN_NODES, TWIN_EDGES, TWIN_KPIs

router = APIRouter(prefix="/api/digital-twin", tags=["digital-twin"])


@router.get("")
async def get_digital_twin():
    """
    Returns the Digital Twin data structure for React Flow visualization.
    Includes nodes, edges, KPIs, and the full company state.
    """
    # Build React Flow compatible nodes
    flow_nodes = []
    for node in TWIN_NODES:
        flow_nodes.append({
            "id": node["id"],
            "type": "twinNode",
            "position": {"x": node["x"], "y": node["y"]},
            "data": {
                "label": node["label"],
                "nodeType": node["type"],
                "kpis": TWIN_KPIs.get(node["id"], {}),
            },
        })

    # Build React Flow compatible edges
    flow_edges = []
    for i, edge in enumerate(TWIN_EDGES):
        flow_edges.append({
            "id": f"e{i}-{edge['source']}-{edge['target']}",
            "source": edge["source"],
            "target": edge["target"],
            "type": "smoothstep",
            "animated": True,
        })

    return {
        "company": DEMO_COMPANY["company"],
        "nodes": flow_nodes,
        "edges": flow_edges,
        "kpis": TWIN_KPIs,
        "company_state": DEMO_COMPANY,
    }
