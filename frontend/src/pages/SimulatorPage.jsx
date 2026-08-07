/**
 * TwinMind AI - Scenario Simulator Page
 * The primary "What If?" interface
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Zap, ChevronRight, RotateCcw, Brain,
  TrendingUp, AlertTriangle, CheckCircle2,
  ArrowRight, Sparkles
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
  'Scenario Manager': { color: 'text-slate-400', desc: 'Generating comparison scenarios...' },
  'Finance':          { color: 'text-cyan-400',   desc: 'Calculating revenue & profit impact...' },
  'Sales':            { color: 'text-indigo-400', desc: 'Analyzing pipeline & win rates...' },
  'Marketing':        { color: 'text-purple-400', desc: 'Modeling churn & demand elasticity...' },
  'HR':               { color: 'text-sky-400',    desc: 'Evaluating workforce impact...' },
  'Supply Chain':     { color: 'text-teal-400',   desc: 'Assessing vendor & ops risks...' },
  'Inventory':        { color: 'text-emerald-400', desc: 'Reviewing inventory requirements...' },
  'Risk':             { color: 'text-amber-400',  desc: 'Running composite risk analysis...' },
  'Executive':        { color: 'text-rose-400',   desc: 'Synthesizing final recommendation...' },
}

function AgentRow({ name, status }) {
  const info = AGENT_INFO[name] || {}
  const statusIcon = status === 'completed' ? (
    <CheckCircle2 size={14} className="text-emerald-400" />
  ) : status === 'running' ? (
    <div className="w-3.5 h-3.5 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
  ) : status === 'failed' ? (
    <AlertTriangle size={14} className="text-rose-400" />
  ) : (
    <div className="w-3.5 h-3.5 rounded-full border border-slate-600" />
  )

  return (
    <div className={`flex items-center gap-3 py-2.5 px-3 rounded-lg transition-all ${
      status === 'running' ? 'bg-cyan-400/5 border border-cyan-400/15' :
      status === 'completed' ? 'bg-white/2' : 'opacity-50'
    }`}>
      {statusIcon}
      <div className="flex-1">
        <div className={`text-sm font-medium ${info.color || 'text-slate-400'}`}>{name} Agent</div>
        {status === 'running' && (
          <div className="text-[11px] text-slate-600 mt-0.5">{info.desc}</div>
        )}
      </div>
      <span className={`text-[10px] font-semibold uppercase tracking-wider ${
        status === 'completed' ? 'text-emerald-400' :
        status === 'running' ? 'text-cyan-400' :
        status === 'failed' ? 'text-rose-400' : 'text-slate-600'
      }`}>
        {status || 'waiting'}
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
    <div className="flex-1 flex flex-col min-h-0 bg-slate-950">
      <Header title="Scenario Simulator" subtitle="Ask any business question and simulate the outcome" />

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">

          {/* Simulator Input */}
          <div className="glass-card-accent p-6">
            <div className="flex items-center gap-2 mb-4">
              <Brain size={18} className="text-cyan-400" />
              <span className="text-sm font-semibold text-white">What If Simulator</span>
              <span className="badge badge-info ml-2">AI-Powered</span>
            </div>

            {/* Question Input */}
            <div className="decision-input-wrapper mb-4">
              <Sparkles size={16} className="text-cyan-400 flex-shrink-0" />
              <input
                className="decision-input-field"
                placeholder="What happens if we increase product prices by 10%?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleRun()}
              />
            </div>

            {/* Price Slider */}
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div>
                <label className="text-xs text-slate-500 mb-1.5 block">Price Change</label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={-20}
                    max={25}
                    step={1}
                    value={priceInput}
                    onChange={(e) => setPriceInput(Number(e.target.value))}
                    className="flex-1 accent-cyan-500"
                  />
                  <div className={`w-16 text-center text-lg font-bold font-mono ${
                    priceInput > 0 ? 'text-cyan-400' : priceInput < 0 ? 'text-rose-400' : 'text-slate-400'
                  }`}>
                    {priceInput > 0 ? '+' : ''}{priceInput}%
                  </div>
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1.5 block">Duration</label>
                <select className="form-input">
                  <option value={12}>12 months</option>
                  <option value={6}>6 months</option>
                  <option value={24}>24 months</option>
                </select>
              </div>
            </div>

            {/* Demo Quick Picks */}
            <div className="mb-5">
              <div className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest mb-2">Demo Scenarios</div>
              <div className="flex flex-wrap gap-2">
                {DEMO_QUESTIONS.map((q) => (
                  <button
                    key={q.pct}
                    onClick={() => handleDemoQuestion(q)}
                    className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-cyan-400 hover:border-cyan-400/30 transition-all"
                  >
                    {q.pct > 0 ? '+' : ''}{q.pct}% scenario
                  </button>
                ))}
              </div>
            </div>

            {/* Run Button */}
            <div className="flex items-center gap-3">
              <button
                id="run-simulation-btn"
                onClick={handleRun}
                disabled={isRunning}
                className="btn-primary text-base px-6 py-3"
              >
                <Zap size={16} />
                {isRunning ? 'Simulating...' : 'RUN SIMULATION'}
              </button>
              {sim.status !== 'idle' && (
                <button onClick={sim.reset} className="btn-secondary text-xs">
                  <RotateCcw size={12} />
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Progress */}
          {isRunning && (
            <div className="glass-card p-5 animate-fade-in">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-white">Running 8 AI Agents + Monte Carlo</span>
                <span className="text-xs text-cyan-400 font-mono">{Math.round(sim.progress)}%</span>
              </div>
              <div className="progress-bar mb-4">
                <div className="progress-fill" style={{ width: `${sim.progress}%` }} />
              </div>
              <div className="text-xs text-slate-500 mb-3">1,000 Monte Carlo simulations · 8 specialized agents</div>
              <div className="space-y-1">
                {sim.agents.map((a) => (
                  <AgentRow key={a} name={a} status={sim.agentStatuses[a]} />
                ))}
              </div>
            </div>
          )}

          {/* Completed Results Summary */}
          {sim.status === 'completed' && (
            <div className="glass-card p-5 animate-slide-in">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 size={18} className="text-emerald-400" />
                <span className="text-sm font-semibold text-white">Simulation Complete</span>
                <span className="badge badge-success ml-2">8/8 Agents</span>
              </div>

              {/* Quick recommendation preview */}
              {sim.finalRecommendation && (
                <div className="recommendation-card p-4 mb-4">
                  <div className="text-xs text-cyan-400 font-semibold uppercase tracking-widest mb-1">Executive Recommendation</div>
                  <div className="text-lg font-bold text-white mb-1">
                    {sim.finalRecommendation.recommended_action}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span>Confidence: <span className="text-emerald-400 font-semibold">{((sim.finalRecommendation.confidence || 0) * 100).toFixed(0)}%</span></span>
                    <span>Risk: <span className={`font-semibold ${sim.finalRecommendation.risk_category === 'LOW' ? 'text-emerald-400' : 'text-amber-400'}`}>{sim.finalRecommendation.risk_category}</span></span>
                    <span>ROI: <span className="text-cyan-400 font-semibold">{sim.finalRecommendation.expected_roi?.toFixed(0)}%</span></span>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button onClick={() => navigate('/recommendation', { state: { sim } })} className="btn-primary text-sm">
                  View Full Recommendation <ArrowRight size={14} />
                </button>
                <button onClick={() => navigate('/comparison', { state: { sim } })} className="btn-secondary text-sm">
                  <TrendingUp size={14} />
                  Compare Scenarios
                </button>
              </div>
            </div>
          )}

          {sim.status === 'failed' && (
            <div className="glass-card p-5 border-rose-500/20 animate-slide-in">
              <div className="flex items-center gap-2 text-rose-400 mb-2">
                <AlertTriangle size={16} />
                <span className="text-sm font-semibold">Simulation Error</span>
              </div>
              <p className="text-slate-400 text-sm">{sim.error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
