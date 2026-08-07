# TwinMind AI

### “Think Before You Act”

**Enterprise Digital Twin & AI Decision Intelligence Platform**

> A **Business Flight Simulator** for enterprise executives. Simulate high-impact decisions, stress-test outcomes across 8 specialized AI agents and 1,000 Monte Carlo runs, and receive explainable recommendations before taking real-world action.

---

## 1. Project Overview

**TwinMind AI** helps executives answer the critical question:
> **“What will happen to my business if I make this decision?”**

For example, when a CEO asks: *"What happens if we increase our product price by 10%?"*, TwinMind AI doesn't just return text from a generic chatbot. It activates a stateful multi-agent system combined with deterministic mathematical models and Monte Carlo simulations to evaluate revenue, profit, customer churn, market risks, and workforce impact.

---

## 2. Problem & Solution

### The Problem
* Executive decision-making relies heavily on intuition or static spreadsheet models.
* Cross-departmental consequences (e.g. price increases causing customer churn, CAC spikes, or operational bottlenecks) are siloed and difficult to quantify simultaneously.
* Traditional AI chatbots invent numbers ("hallucinate") rather than computing rigorous quantitative forecasts.

### The Solution
* **Deterministic Simulation Engine**: Python logic handles exact numerical models (Revenue, Demand Elasticity, Churn, Profit, ROI, Monte Carlo).
* **Multi-Agent Orchestrator**: 8 specialized AI agents analyze the quantitative results independently, debate trade-offs, and reach executive consensus.
* **Interactive Digital Twin**: Visualizes enterprise nodes (Finance, Sales, Marketing, HR, Ops, Suppliers, Customers) using React Flow.
* **Explainable Executive Recommendation**: Shows confidence scores, risk metrics, agent debate transcripts, and audit logs.

---

## 3. Tech Stack

### Frontend
* **Core**: React 18, Vite, JavaScript
* **Styling**: Custom Enterprise Dark Design System with Tailwind CSS v3 & Glassmorphism
* **Visualization**: Recharts (bar, area, radar charts) & `@xyflow/react` (React Flow Digital Twin)
* **Icons & UI**: Lucide React, React Router v6

### Backend
* **API Gateway**: Python FastAPI & Pydantic v2
* **ORM & DB**: SQLAlchemy with SQLite fallback
* **Quantitative Engine**: NumPy, Pandas, scikit-learn
* **AI Orchestration**: Multi-Agent Orchestrator with `LLMService` abstraction
* **Demo Mode**: Built-in deterministic fallback (`DEMO_MODE=true`) allowing full application execution without any LLM API key.

---

## 4. Multi-Agent Architecture

TwinMind AI employs 8 specialized AI agents running in a stateful orchestration graph:

1. **Finance Agent**: Analyzes revenue impact, gross margin expansion, operating profit, and cash flow.
2. **Sales Agent**: Evaluates sales pipeline conversion, win rate variations, and enterprise vs SMB segment behavior.
3. **Marketing Agent**: Models price elasticity (-1.4), customer acquisition cost (CAC), churn risk, and retention campaigns.
4. **HR Agent**: Assesses workforce requirements, hiring opportunities from profits, and training costs.
5. **Supply Chain Agent**: Evaluates vendor risks, infrastructure scale-down savings, and capacity limits.
6. **Inventory Agent**: Calculates stockout probability adjustments and safety stock recommendations.
7. **Risk Agent**: Generates a composite risk score (0–100) across 6 weighted risk categories.
8. **Executive Agent**: Synthesizes all agent insights, compares scenarios, and issues the final recommendation.

---

## 5. Digital Twin & Simulation Engine

### Digital Twin Model
Represents `DemoCorp`, a fictional $10M B2B SaaS enterprise with 50,000 customers, 420 employees, 68% gross margin, and 2.5%/mo churn.

### Deterministic Equations
* **Revenue**: $\text{New Revenue} = \text{New Price} \times \text{Expected Customers} \times \text{Purchase Frequency}$
* **Demand Elasticity**: $\text{Expected Customers} = \text{Current Customers} \times (1 + \text{Elasticity} \times \Delta P)$
* **Profit**: $\text{Revenue} \times \text{Gross Margin} - \text{Operating Costs} - \text{Marketing Costs} - \text{R\&D}$
* **ROI**: $\frac{\Delta \text{Profit} - \text{Investment Cost}}{\text{Investment Cost}} \times 100$

### Monte Carlo Engine
Runs **1,000 randomized simulations** per scenario, sampling normal distributions for demand elasticity, base churn rate, gross margin, and operating costs to generate P10, P50, and P90 confidence bounds.

---

## 6. Installation & Quick Start

### Prerequisites
* **Python**: 3.10+
* **Node.js**: 18+

### Step 1: Backend Setup
```bash
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
# source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
```

### Step 2: Start Backend Server
```bash
python main.py
# Backend runs at http://localhost:8000
```

### Step 3: Frontend Setup & Run
Open a new terminal:
```bash
cd frontend
npm install
npm run dev
# Frontend runs at http://localhost:5173
```

---

## 7. Demo Scenario

### Primary Hackathon Walkthrough:
1. Launch TwinMind AI in your browser at `http://localhost:5173`.
2. View current enterprise state on the **Executive Dashboard**.
3. Navigate to **Scenario Simulator** and enter:
   > *"What happens if we increase product prices by 10%?"*
4. Click **[RUN SIMULATION]**.
5. Watch live progress as 8 AI agents execute and 1,000 Monte Carlo runs process.
6. Observe scenario comparisons (**Baseline, +5%, +7%, +10%, +15%**).
7. Review the **Executive Recommendation**:
   > **RECOMMENDED ACTION**: Implement a 7% price increase.
   > **REASON**: The 7% scenario produces the optimal balance between profit growth (+23.1%) and customer retention at LOW risk.
8. Explore the interactive **Digital Twin** React Flow graph.

---

## 8. API Documentation

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/scenario/create` | Create a new business scenario |
| `POST` | `/api/scenario/simulate` | Trigger background simulation & agent pipeline |
| `GET` | `/api/scenario/{id}` | Get scenario state & results |
| `GET` | `/api/scenarios` | List all scenarios |
| `POST` | `/api/agents/run` | Execute multi-agent orchestration |
| `GET` | `/api/agents/status` | Get status of active/completed agent runs |
| `GET` | `/api/digital-twin` | Fetch Digital Twin React Flow graph nodes & edges |
| `GET` | `/api/dashboard` | Fetch executive dashboard KPIs & recent activity |
| `GET` | `/api/recommendation/{id}` | Fetch final executive recommendation |
| `POST` | `/api/company/reset` | Reset DemoCorp state to default |

Interactive Swagger documentation is available at `http://localhost:8000/docs`.

---

## 9. License & Credits

Built for the Hackathon by the TwinMind AI team.
**Tagline**: *Simulate. Stress-Test. Decide.*
