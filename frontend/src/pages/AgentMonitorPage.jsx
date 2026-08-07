/**
 * TwinMind AI - Agent Monitor Page
 * Real-time view of all 8 AI agents' status and outputs
 */
import { useEffect, useState } from 'react'
import {
  DollarSign, TrendingUp, Megaphone, Users,
  Truck, Package, ShieldAlert, Crown,
  CheckCircle2, Clock, AlertTriangle, Loader2
} from 'lucide-react'
import Header from '../components/Layout/Header'
import { getAgentsStatus } from '../services/api'

const AGENT_META = {
  Finance:        { icon: DollarSign, color: 'from-cyan-500/20 to-cyan-600/10', border: 'border-cyan-500/20', accent: 'text-cyan-400' },
  Sales:          { icon: TrendingUp, color: 'from-indigo-500/20 to-indigo-600/10', border: 'border-indigo-500/20', accent: 'text-indigo-400' },
  Marketing:      { icon: Megaphone, color: 'from-purple-500/20 to-purple-600/10', border: 'border-purple-500/20', accent: 'text-purple-400' },
  HR:             { icon: Users, color: 'from-sky-500/20 to-sky-600/10', border: 'border-sky-500/20', accent: 'text-sky-400' },
  'Supply Chain': { icon: Truck, color: 'from-teal-500/20 to-teal-600/10', border: 'border-teal-500/20', accent: 'text-teal-400' },
  Inventory:      { icon: Package, color: 'from-emerald-500/20 to-emerald-600/10', border: 'border-emerald-500/20', accent: 'text-emerald-400' },
  Risk:           { icon: ShieldAlert, color: 'from-amber-500/20 to-amber-600/10', border: 'border-amber-500/20', accent: 'text-amber-400' },
  Executive:      { icon: Crown, color: 'from-rose-500/20 to-rose-600/10', border: 'border-rose-500/20', accent: 'text-rose-400' },
}

function AgentCard({ name, status, result }) {
  const meta = AGENT_META[name] || {}
  const Icon = meta.icon || DollarSign
  const isRunning = status === 'running'
  const isCompleted = status === 'completed'
  const isFailed = status === 'failed'

  return (
    <div className={`relative glass-card p-5 border ${meta.border || 'border-white/8'} transition-all ${
      isRunning ? 'shadow-glow-cyan scale-[1.01]' : ''
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2 rounded-lg bg-gradient-to-br ${meta.color}`}>
          <Icon size={16} className={meta.accent} />
        </div>
        <div className="flex items-center gap-1.5">
          {isRunning && <Loader2 size={13} className="text-cyan-400 animate-spin" />}
          {isCompleted && <CheckCircle2 size={13} className="text-emerald-400" />}
          {isFailed && <AlertTriangle size={13} className="text-rose-400" />}
          {!status && <Clock size={13} className="text-slate-600" />}
          <span className={`text-[10px] font-bold uppercase tracking-wider ${
            isRunning ? 'text-cyan-400' :
            isCompleted ? 'text-emerald-400' :
            isFailed ? 'text-rose-400' : 'text-slate-600'
          }`}>
            {status || 'Waiting'}
          </span>
        </div>
      </div>

      <div className={`text-sm font-semibold mb-1 ${meta.accent}`}>{name} Agent</div>

      {/* Result Preview */}
      {isCompleted && result && (
        <div className="space-y-2 mt-3 pt-3 border-t border-white/5">
          {result.impact && result.impact !== 'risk_assessment' && result.impact !== 'executive_recommendation' && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Impact</span>
              <span className={`font-semibold capitalize ${
                result.impact?.includes('positive') ? 'text-emerald-400' :
                result.impact?.includes('negative') ? 'text-rose-400' : 'text-amber-400'
              }`}>{result.impact?.replace('_', ' ')}</span>
            </div>
          )}
          {result.confidence && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Confidence</span>
              <span className="text-white font-semibold">{((result.confidence || 0) * 100).toFixed(0)}%</span>
            </div>
          )}
          {result.risk_score !== undefined && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Risk Score</span>
              <span className={`font-semibold ${result.risk_score < 30 ? 'text-emerald-400' : result.risk_score < 55 ? 'text-amber-400' : 'text-rose-400'}`}>
                {result.risk_score}/100
              </span>
            </div>
          )}
          {result.recommended_action && (
            <div className="text-[11px] text-slate-400 mt-2 leading-relaxed border-t border-white/5 pt-2">
              {result.recommended_action}
            </div>
          )}
          {result.reasoning && !result.recommended_action && (
            <div className="text-[11px] text-slate-500 mt-2 line-clamp-3 leading-relaxed">
              {result.reasoning}
            </div>
          )}
        </div>
      )}

      {isRunning && (
        <div className="mt-3">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: '60%' }} />
          </div>
          <div className="text-[11px] text-slate-600 mt-1">Analyzing…</div>
        </div>
      )}

      {!status && (
        <div className="text-[11px] text-slate-600 mt-2">Waiting for activation…</div>
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
    } catch { /* Backend may not be running yet */ }
  }

  useEffect(() => {
    loadStatus()
    const timer = setInterval(loadStatus, 2000)
    return () => clearInterval(timer)
  }, [])

  const agentStatuses = selectedRun?.agent_statuses || {}

  // Demo state when no real runs
  const demoStatuses = {
    'Finance': 'completed', 'Sales': 'completed', 'Marketing': 'completed',
    'HR': 'completed', 'Supply Chain': 'completed', 'Inventory': 'completed',
    'Risk': 'completed', 'Executive': 'completed',
  }
  const displayStatuses = Object.keys(agentStatuses).length > 0 ? agentStatuses : demoStatuses

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-950">
      <Header title="Agent Monitor" subtitle="Real-time view of all 8 specialized AI agents" />

      <div className="flex-1 overflow-auto p-6 space-y-5">
        {/* Status Banner */}
        <div className="glass-card p-4 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              selectedRun?.overall_status === 'running' ? 'bg-cyan-400 animate-pulse' : 'bg-emerald-400'
            }`} />
            <span className="text-sm font-semibold text-white">
              {selectedRun?.overall_status === 'running' ? 'Agents Running' : 'Agent System Ready'}
            </span>
          </div>
          <div className="text-xs text-slate-500">
            {Object.values(displayStatuses).filter(s => s === 'completed').length} / {Object.keys(AGENT_META).length} agents completed
          </div>
          <div className="ml-auto flex items-center gap-2">
            {runs.length > 0 && (
              <select
                className="form-input text-xs py-1.5"
                style={{ width: 'auto', minWidth: 200 }}
                onChange={e => setSelectedRun(runs.find(r => r.scenario_id === e.target.value))}
                value={selectedRun?.scenario_id || ''}
              >
                {runs.map(r => (
                  <option key={r.scenario_id} value={r.scenario_id}>
                    {r.scenario_id.slice(0, 8)}… — {r.overall_status}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Agent Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.keys(AGENT_META).map(name => (
            <AgentCard
              key={name}
              name={name}
              status={displayStatuses[name]}
              result={selectedRun?.agent_results?.[name]}
            />
          ))}
        </div>

        {/* Debate Section */}
        {selectedRun?.agent_results?.Executive?.debate && (
          <div className="glass-card p-5">
            <div className="text-sm font-semibold text-white mb-4">Agent Debate</div>
            <div className="space-y-3">
              {selectedRun.agent_results.Executive.debate.map((entry, i) => {
                const meta = AGENT_META[entry.agent] || {}
                const Icon = meta.icon || DollarSign
                return (
                  <div key={i} className={`flex gap-3 p-3 rounded-lg bg-white/2 border border-white/5 ${
                    entry.agent === 'Executive' ? 'border-cyan-400/20 bg-cyan-400/5' : ''
                  }`}>
                    <div className={`p-1.5 rounded-lg bg-gradient-to-br ${meta.color || 'from-slate-600/20 to-slate-700/10'} flex-shrink-0`}>
                      <Icon size={12} className={meta.accent || 'text-slate-400'} />
                    </div>
                    <div>
                      <div className={`text-xs font-semibold mb-0.5 ${meta.accent || 'text-slate-400'}`}>{entry.agent}</div>
                      <div className="text-xs text-slate-400">{entry.position}</div>
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
