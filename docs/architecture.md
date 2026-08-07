# TwinMind AI — System Architecture & Technical Specification

## Overview

**TwinMind AI** is an Enterprise Digital Twin & AI Decision Intelligence Platform designed to act as a **Business Flight Simulator**. Executives simulate high-impact business decisions across deterministic mathematical models and a collaborative 8-agent AI intelligence graph.

```
+-------------------------------------------------------------------------+
|                         REACT EXECUTIVE DASHBOARD                       |
|   (Vite + React + Tailwind CSS + Recharts + React Flow + Lucide Icons)  |
+-------------------------------------------------------------------------+
                                    |
                                    v  HTTP / REST API
+-------------------------------------------------------------------------+
|                           FASTAPI API GATEWAY                           |
+-------------------------------------------------------------------------+
                                    |
                                    v
+-------------------------------------------------------------------------+
|                            SCENARIO MANAGER                             |
|       (Creates baseline & alternative price change scenarios)           |
+-------------------------------------------------------------------------+
                                    |
                                    v
+-------------------------------------------------------------------------+
|                        MULTI-AGENT ORCHESTRATOR                         |
|                   (Stateful Agent Execution Graph)                      |
+-------------------------------------------------------------------------+
          /           |             |           |             \
         v            v             v           v              v
   +----------+  +----------+  +----------+  +------+  +---------------+
   | Finance  |  |  Sales   |  |Marketing |  |  HR  |  | Supply Chain  |
   |  Agent   |  |  Agent   |  |  Agent   |  |Agent |  |     Agent     |
   +----------+  +----------+  +----------+  +------+  +---------------+
         \            |             |           |              /
          +-----------+-------------+-----------+-------------+
                                    |
                                    v
                             +--------------+
                             |  Inventory   |
                             |    Agent     |
                             +--------------+
                                    |
                                    v
                             +--------------+
                             | Risk Agent   |
                             +--------------+
                                    |
                                    v
                             +--------------+
                             |  Executive   |
                             |    Agent     |
                             +--------------+
                                    |
                                    v
+-------------------------------------------------------------------------+
|                   QUANTITATIVE SIMULATION ENGINE                        |
|            (Monte Carlo: 1,000 runs via NumPy & Pandas)                 |
+-------------------------------------------------------------------------+
                                    |
                                    v
+-------------------------------------------------------------------------+
|                          DIGITAL TWIN STATE                             |
|          (DemoCorp Enterprise Model & React Flow Graph Nodes)           |
+-------------------------------------------------------------------------+
                                    |
                                    v
+-------------------------------------------------------------------------+
|                       EXECUTIVE RECOMMENDATION                          |
|         (Explainable decision card, confidence score & audit log)       |
+-------------------------------------------------------------------------+
```

---

## 8 Specialized AI Agents

1. **Finance Agent**: Analyzes revenue impact, gross margin, operating profit, cash flow, and ROI.
2. **Sales Agent**: Evaluates pipeline conversion, win rate, customer acquisition cost (CAC), and regional segment impacts.
3. **Marketing Agent**: Models customer price elasticity (-1.4), demand reduction, churn risk, and retention campaign requirements.
4. **HR Agent**: Assesses workforce requirements, hiring capability from profit, employee morale, and training costs.
5. **Supply Chain Agent**: Monitors vendor risk, infrastructure costs, operational lead times, and capacity.
6. **Inventory Agent**: Calculates stockout probabilities, safety stock adjustments, and warehouse requirements.
7. **Risk Agent**: Computes a composite risk score (0-100) across 6 weighted risk categories (financial, market, customer, operational, supply chain, regulatory).
8. **Executive Agent**: Synthesizes inputs from all 7 agents and 1,000 Monte Carlo runs to generate an explainable final recommendation card.

---

## Simulation & Monte Carlo Engine

The mathematical simulation is completely deterministic (no LLM hallucinated numbers):

$$\text{New Revenue} = \text{New Price} \times \text{Expected Customers} \times \text{Purchase Frequency}$$

$$\text{Expected Customers} = \text{Current Customers} \times (1 + \text{Elasticity} \times \Delta P)$$

$$\text{Profit} = \text{Revenue} \times \text{Gross Margin} - \text{Operating Costs} - \text{Marketing Costs} - \text{R\&D Costs}$$

$$\text{ROI} = \frac{\Delta \text{Profit} - \text{Investment Cost}}{\text{Investment Cost}} \times 100$$

Monte Carlo simulations run **1,000 randomized trials** per scenario, sampling elasticity, base churn, gross margin, and operating expense variations via NumPy normal distributions.
