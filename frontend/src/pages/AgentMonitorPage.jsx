/**
 * TwinMind AI - Agent Monitor Page
 */
import { useEffect, useState } from 'react'
import {
  DollarSign, TrendingUp, Megaphone, Users,
  Truck, Package, ShieldAlert, Crown,
  CheckCircle2, Clock, AlertTriangle, Loader2,
  Brain, Sparkles
} from 'lucide-react'
import Header from '../components/Layout/Header'
import { getAgentsStatus } from '../services/api'

const AGENT_META = {
  Finance:        { icon: DollarSign, color: 'from-cyan-500/20 to-blue-600/10', border: 'border-cyan-500/20', accent: 'text-cyan-400' },
  Sales:          { icon: TrendingUp, color: 'from-indigo-500/20 to-purple-600/10', border: 'border-indigo-500/20', accent: 'text-indigo-400' },
  Marketing:      { icon: Megaphone, color: 'from-purple-500/20 to-pink-600/10', border: 'border-purple-500/20', accent: 'text-purple-400' },
  HR:             { icon: Users, color: 'from-sky-500/20 to-cyan-600/10', border: 'border-sky-500/20', accent: 'text-sky-400' },
  'Supply Chain': { icon: Truck, color: 'from-teal-500/20 to-emerald-600/10', border: 'border-teal-500/20', accent: 'text-teal-400' },
  Inventory:      { icon: Package, color: 'from-emerald-500/20 to-green-600/10', border: 'border-emerald-500/20', accent: 'text-emerald-400' },
  Risk:           { icon: ShieldAlert, color: 'from-amber-500/20 to-orange-600/10', border: 'border-amber-500/20', accent: 'text-amber-400' },
  Executive:      { icon: Crown, color: 'from-rose-500/20 to-red-600/10', border: 'border-rose-500/20', accent: 'text-rose-400' },
}

function AgentCard({ name, status, result }) {
  const meta = AGENT_META[name] || {}
  const Icon = meta.icon || DollarSign
  const isRunning = status === 'running'
  const isCompleted = status === 'completed'
  const isFailed = status === 'failed'

  return (
    <div className={`relative glass-card p-6 border ${meta.border || 'border-white/10'} transition-all ${
      isRunning ? 'shadow-glow-cyan scale-[1.02] border-cyan-400/50' : ''
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${meta.color} flex items-center justify-center border border-white/10`}>
          <Icon size={20} className={meta.accent} />
        </div>
        <div className="flex items-center gap-1.5">
          {isRunning && <Loader2 size={14} className="text-cyan-400 animate-spin" />}
          {isCompleted && <CheckCircle2 size={14} className="text-emerald-400" />}
          {isFailed && <AlertTriangle size={14} className="text-rose-400" />}
          {!status && <Clock size={14} className="text-slate-600" />}
          <span className={`badge ${
            isRunning ? 'badge-info' :
            isCompleted ? 'badge-success' :
            isFailed ? 'badge-error' : 'badge-neutral'
          }`}>
            {status || 'Waiting'}
          </span>
        </div>
      </div>

      <div className={`text-base font-bold mb-1 ${meta.accent}`}>{name} Agent</div>

      {/* Result Metrics */}
      {isCompleted && result && (
        <div className="space-y-2 mt-4 pt-4 border-t border-white/5">
          {result.impact && result.impact !== 'risk_assessment' && result.impact !== 'executive_recommendation' && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Impact Assessment</span>
              <span className={`font-bold capitalize ${
                result.impact?.includes('positive') ? 'text-emerald-400' :
                result.impact?.includes('negative') ? 'text-rose-400' : 'text-amber-400'
              }`}>{result.impact?.replace('_', ' ')}</span>
            </div>
          )}
          {result.confidence && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Model Confidence</span>
              <span className="text-white font-bold">{((result.confidence || 0) * 100).toFixed(0)}%</span>
            </div>
          )}
          {result.risk_score !== undefined && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Composite Risk</span>
              <span className={`font-bold ${result.risk_score < 30 ? 'text-emerald-400' : result.risk_score < 55 ? 'text-amber-400' : 'text-rose-400'}`}>
                {result.risk_score}/100
              </span>
            </div>
          )}
          {result.recommended_action && (
            <div className="text-xs text-slate-300 font-semibold mt-3 p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20 leading-relaxed">
              {result.recommended_action}
            </div>
          )}
          {result.reasoning && !result.recommended_action && (
            <div className="text-xs text-slate-400 mt-3 line-clamp-3 leading-relaxed">
              {result.reasoning}
            </div>
          )}
        </div>
      )}

      {isRunning && (
        <div className="mt-4">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: '65%' }} />
          </div>
          <div className="text-xs text-slate-400 mt-2 font-medium">Evaluating scenario...</div>
        </div>
      )}

      {!status && (
        <div className="text-xs text-slate-500 mt-3 font-medium">Standby for simulation trigger</div>
      )}
    </div>
  )
}

export default function AgentMonitorPage() {
  const [runs, setRuns] = useState([])
  const [selectedRun, setSelectedRun] = useState(null)

  const loadStatus = async () => {
    try {
      const data = await getAgentsStatus()
      setRuns(data.runs || [])
      if (data.runs?.length > 0 && !selectedRun) {
        setSelectedRun(data.runs[data.runs.length - 1])
      }
      if (selectedRun?.scenario_id) {
        const updated = data.runs.find(r => r.scenario_id === selectedRun.scenario_id)
        if (updated) setSelectedRun(updated)
      }
    } catch { /* Handled silently */ }
  }

  useEffect(() => {
    loadStatus()
    const timer = setInterval(loadStatus, 2000)
    return () => clearInterval(timer)
  }, [])

  const agentStatuses = selectedRun?.agent_statuses || {}

  const demoStatuses = {
    'Finance': 'completed', 'Sales': 'completed', 'Marketing': 'completed',
    'HR': 'completed', 'Supply Chain': 'completed', 'Inventory': 'completed',
    'Risk': 'completed', 'Executive': 'completed',
  }
  const displayStatuses = Object.keys(agentStatuses).length > 0 ? agentStatuses : demoStatuses

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-dark-950 bg-radial-glow">
      <Header title="Agent Collaboration Monitor" subtitle="Real-time multi-agent orchestrator & transcript debate" />

      <div className="flex-1 overflow-auto p-8 space-y-6">
        {/* Banner */}
        <div className="glass-card p-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse shadow-glow-emerald" />
            <div>
              <span className="text-sm font-bold text-white">8-Agent System Ready</span>
              <p className="text-xs text-slate-400">
                {Object.values(displayStatuses).filter(s => s === 'completed').length} of {Object.keys(AGENT_META).length} agents completed analysis
              </p>
            </div>
          </div>
          {runs.length > 0 && (
            <select
              className="form-input text-xs py-2 px-3"
              style={{ width: 'auto', minWidth: 220 }}
              onChange={e => setSelectedRun(runs.find(r => r.scenario_id === e.target.value))}
              value={selectedRun?.scenario_id || ''}
            >
              {runs.map(r => (
                <option key={r.scenario_id} value={r.scenario_id}>
                  {r.scenario_id.slice(0, 8)}... — {r.overall_status}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* 8 Agent Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {Object.keys(AGENT_META).map(name => (
            <AgentCard
              key={name}
              name={name}
              status={displayStatuses[name]}
              result={selectedRun?.agent_results?.[name]}
            />
          ))}
        </div>

        {/* Multi-Agent Transcript Debate */}
        {selectedRun?.agent_results?.Executive?.debate && (
          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Brain size={18} className="text-cyan-400" />
              <div className="text-base font-bold text-white">Agent Debate Transcript</div>
            </div>
            <div className="space-y-3">
              {selectedRun.agent_results.Executive.debate.map((entry, i) => {
                const meta = AGENT_META[entry.agent] || {}
                const Icon = meta.icon || DollarSign
                return (
                  <div key={i} className={`flex gap-4 p-4 rounded-xl border ${
                    entry.agent === 'Executive' ? 'border-cyan-400/30 bg-cyan-500/10' : 'border-white/5 bg-white/2'
                  }`}>
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${meta.color || 'from-slate-700 to-slate-800'} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                      <Icon size={16} className={meta.accent || 'text-slate-300'} />
                    </div>
                    <div>
                      <div className={`text-xs font-bold mb-1 ${meta.accent || 'text-slate-300'}`}>{entry.agent} Agent</div>
                      <div className="text-xs text-slate-300 leading-relaxed font-medium">{entry.position}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
