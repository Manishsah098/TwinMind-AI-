/**
 * TwinMind AI - Scenario Simulator Page
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Zap, RotateCcw, Brain, CheckCircle2,
  AlertTriangle, ArrowRight, Sparkles, Sliders
} from 'lucide-react'
import Header from '../components/Layout/Header'
import { useSimulation } from '../hooks/useSimulation'

const DEMO_QUESTIONS = [
  { q: 'What happens if we increase product prices by 10%?', pct: 10 },
  { q: 'What if we increase prices by 7%?', pct: 7 },
  { q: 'What happens if we reduce prices by 5%?', pct: -5 },
  { q: 'What if we implement a 15% price increase?', pct: 15 },
]

const AGENT_INFO = {
  'Scenario Manager': { color: 'text-slate-400', desc: 'Generating baseline & comparison scenarios...' },
  'Finance':          { color: 'text-cyan-400',   desc: 'Calculating gross margin & profit impact...' },
  'Sales':            { color: 'text-indigo-400', desc: 'Analyzing pipeline conversion & win rate...' },
  'Marketing':        { color: 'text-purple-400', desc: 'Modeling price elasticity & churn risk...' },
  'HR':               { color: 'text-sky-400',    desc: 'Evaluating hiring & training costs...' },
  'Supply Chain':     { color: 'text-teal-400',   desc: 'Assessing vendor risk & infra savings...' },
  'Inventory':        { color: 'text-emerald-400', desc: 'Calculating safety stock requirements...' },
  'Risk':             { color: 'text-amber-400',  desc: 'Computing composite risk score (0-100)...' },
  'Executive':        { color: 'text-rose-400',   desc: 'Synthesizing final executive recommendation...' },
}

function AgentRow({ name, status }) {
  const info = AGENT_INFO[name] || {}
  const isCompleted = status === 'completed'
  const isRunning = status === 'running'
  const isFailed = status === 'failed'

  return (
    <div className={`flex items-center gap-4 py-3 px-4 rounded-xl border transition-all ${
      isRunning ? 'bg-cyan-500/10 border-cyan-500/30 shadow-glow-cyan' :
      isCompleted ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-white/2 border-white/5 opacity-60'
    }`}>
      <div className="flex-shrink-0">
        {isCompleted && <CheckCircle2 size={18} className="text-emerald-400" />}
        {isRunning && <div className="w-4 h-4 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />}
        {isFailed && <AlertTriangle size={18} className="text-rose-400" />}
        {!status && <div className="w-4 h-4 rounded-full border border-slate-600" />}
      </div>
      <div className="flex-1">
        <div className={`text-sm font-bold ${info.color || 'text-slate-300'}`}>{name} Agent</div>
        {isRunning && <div className="text-xs text-slate-400 mt-0.5">{info.desc}</div>}
      </div>
      <span className={`badge ${
        isCompleted ? 'badge-success' :
        isRunning ? 'badge-info' :
        isFailed ? 'badge-error' : 'badge-neutral'
      }`}>
        {status || 'pending'}
      </span>
    </div>
  )
}

export default function SimulatorPage() {
  const navigate = useNavigate()
  const [question, setQuestion] = useState('')
  const [priceInput, setPriceInput] = useState(10)
  const sim = useSimulation()

  const handleRun = async () => {
    if (sim.status === 'running') return
    await sim.runSimulation({
      question,
      priceChangePercent: priceInput,
      name: question || `${priceInput}% Price Increase`,
    })
  }

  const handleDemoQuestion = (q) => {
    setQuestion(q.q)
    setPriceInput(q.pct)
  }

  const isRunning = sim.status === 'running' || sim.status === 'creating'

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-dark-950 bg-radial-glow">
      <Header title="Scenario Simulator" subtitle="Enter a high-impact business decision to simulate outcomes" />

      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-4xl mx-auto space-y-8">

          {/* Simulator Card */}
          <div className="glass-card-accent p-8 relative overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <Brain size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Ask TwinMind AI</h3>
                  <p className="text-xs text-slate-400">Natural language decision simulation</p>
                </div>
              </div>
              <span className="badge badge-info">1,000 Monte Carlo Runs</span>
            </div>

            {/* Input Field */}
            <div className="decision-input-wrapper mb-6">
              <Sparkles size={20} className="text-cyan-400 flex-shrink-0" />
              <input
                className="decision-input-field"
                placeholder="What happens if we increase product price by 10%?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleRun()}
              />
            </div>

            {/* Controls Slider */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-dark-900/80 p-4 rounded-xl border border-white/5">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-semibold">
                  <span className="flex items-center gap-1.5"><Sliders size={14} /> Price Change Percent</span>
                  <span className={`font-mono text-base font-extrabold ${priceInput > 0 ? 'text-cyan-400' : 'text-rose-400'}`}>
                    {priceInput > 0 ? '+' : ''}{priceInput}%
                  </span>
                </div>
                <input
                  type="range"
                  min={-20}
                  max={25}
                  step={1}
                  value={priceInput}
                  onChange={(e) => setPriceInput(Number(e.target.value))}
                  className="w-full accent-cyan-400"
                />
              </div>

              <div className="bg-dark-900/80 p-4 rounded-xl border border-white/5">
                <label className="text-xs text-slate-400 font-semibold mb-2 block">Simulation Duration</label>
                <select className="form-input text-sm">
                  <option value={12}>12 Months Forecast</option>
                  <option value={6}>6 Months Forecast</option>
                  <option value={24}>24 Months Forecast</option>
                </select>
              </div>
            </div>

            {/* Presets */}
            <div className="mb-6">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Quick Scenario Presets</div>
              <div className="flex flex-wrap gap-2.5">
                {DEMO_QUESTIONS.map((q) => (
                  <button
                    key={q.pct}
                    onClick={() => handleDemoQuestion(q)}
                    className="text-xs font-semibold px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-all"
                  >
                    {q.pct > 0 ? '+' : ''}{q.pct}% Price Scenario
                  </button>
                ))}
              </div>
            </div>

            {/* Run Button */}
            <div className="flex items-center gap-4">
              <button
                id="run-simulation-btn"
                onClick={handleRun}
                disabled={isRunning}
                className="btn-primary text-base px-8 py-3.5"
              >
                <Zap size={18} />
                {isRunning ? 'SIMULATING OUTCOMES...' : 'RUN SIMULATION'}
              </button>
              {sim.status !== 'idle' && (
                <button onClick={sim.reset} className="btn-secondary text-sm">
                  <RotateCcw size={14} />
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Execution Progress */}
          {isRunning && (
            <div className="glass-card p-6 space-y-5 animate-fade-in">
              <div className="flex items-center justify-between">
                <div className="text-sm font-bold text-white">Multi-Agent Execution Pipeline</div>
                <span className="text-sm font-mono font-extrabold text-cyan-400">{Math.round(sim.progress)}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${sim.progress}%` }} />
              </div>
              <div className="space-y-2">
                {sim.agents.map((a) => (
                  <AgentRow key={a} name={a} status={sim.agentStatuses[a]} />
                ))}
              </div>
            </div>
          )}

          {/* Results Completed */}
          {sim.status === 'completed' && (
            <div className="glass-card p-6 space-y-5 animate-fade-in">
              <div className="flex items-center gap-3">
                <CheckCircle2 size={22} className="text-emerald-400" />
                <div>
                  <h4 className="text-base font-bold text-white">Simulation Completed</h4>
                  <p className="text-xs text-slate-400">8 specialized AI agents & 1,000 Monte Carlo runs finished</p>
                </div>
                <span className="badge badge-success ml-auto">8/8 Agents Done</span>
              </div>

              {sim.finalRecommendation && (
                <div className="recommendation-card p-6">
                  <div className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-1">Executive Recommendation</div>
                  <div className="text-xl font-extrabold text-white mb-2">
                    {sim.finalRecommendation.recommended_action}
                  </div>
                  <div className="flex items-center gap-4 text-xs font-semibold text-slate-300">
                    <span>Confidence: <span className="text-emerald-400 font-bold">{((sim.finalRecommendation.confidence || 0) * 100).toFixed(0)}%</span></span>
                    <span>Risk Rating: <span className="text-amber-400 font-bold">{sim.finalRecommendation.risk_category}</span></span>
                    <span>ROI: <span className="text-cyan-400 font-bold">{sim.finalRecommendation.expected_roi?.toFixed(0)}%</span></span>
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-2">
                <button onClick={() => navigate('/recommendation', { state: { sim } })} className="btn-primary text-sm">
                  View Executive Recommendation <ArrowRight size={16} />
                </button>
                <button onClick={() => navigate('/comparison', { state: { sim } })} className="btn-secondary text-sm">
                  Compare All Scenarios
                </button>
              </div>
            </div>
          )}

          {sim.status === 'failed' && (
            <div className="glass-card p-6 border-rose-500/30">
              <div className="flex items-center gap-3 text-rose-400">
                <AlertTriangle size={20} />
                <span className="text-sm font-bold">Simulation Exception: {sim.error}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
