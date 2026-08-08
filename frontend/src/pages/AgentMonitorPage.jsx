/**
 * TwinMind AI - Agent Monitor Page (Clean Professional Light)
 */
import { useEffect, useState } from 'react'
import {
  DollarSign, TrendingUp, Megaphone, Users,
  Truck, Package, ShieldAlert, Crown,
  CheckCircle2, Clock, AlertTriangle, Loader2,
  Brain
} from 'lucide-react'
import Header from '../components/Layout/Header'
import { getAgentsStatus } from '../services/api'

const AGENT_META = {
  Finance:        { icon: DollarSign, color: 'from-blue-100 to-indigo-50', border: 'border-blue-200', accent: 'text-blue-600' },
  Sales:          { icon: TrendingUp, color: 'from-indigo-100 to-purple-50', border: 'border-indigo-200', accent: 'text-indigo-600' },
  Marketing:      { icon: Megaphone, color: 'from-purple-100 to-pink-50', border: 'border-purple-200', accent: 'text-purple-600' },
  HR:             { icon: Users, color: 'from-sky-100 to-blue-50', border: 'border-sky-200', accent: 'text-sky-600' },
  'Supply Chain': { icon: Truck, color: 'from-teal-100 to-emerald-50', border: 'border-teal-200', accent: 'text-teal-600' },
  Inventory:      { icon: Package, color: 'from-emerald-100 to-green-50', border: 'border-emerald-200', accent: 'text-emerald-600' },
  Risk:           { icon: ShieldAlert, color: 'from-amber-100 to-orange-50', border: 'border-amber-200', accent: 'text-amber-600' },
  Executive:      { icon: Crown, color: 'from-rose-100 to-red-50', border: 'border-rose-200', accent: 'text-rose-600' },
}

function AgentCard({ name, status, result }) {
  const meta = AGENT_META[name] || {}
  const Icon = meta.icon || DollarSign
  const isRunning = status === 'running'
  const isCompleted = status === 'completed'
  const isFailed = status === 'failed'

  return (
    <div className={`relative glass-card p-6 border ${meta.border || 'border-slate-200'} transition-all ${
      isRunning ? 'ring-2 ring-blue-500 shadow-md' : ''
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${meta.color} flex items-center justify-center border border-white`}>
          <Icon size={20} className={meta.accent} />
        </div>
        <div className="flex items-center gap-1.5">
          {isRunning && <Loader2 size={14} className="text-blue-600 animate-spin" />}
          {isCompleted && <CheckCircle2 size={14} className="text-emerald-600" />}
          {isFailed && <AlertTriangle size={14} className="text-rose-600" />}
          {!status && <Clock size={14} className="text-slate-400" />}
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
        <div className="space-y-2 mt-4 pt-4 border-t border-slate-100">
          {result.impact && result.impact !== 'risk_assessment' && result.impact !== 'executive_recommendation' && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Impact Assessment</span>
              <span className={`font-bold capitalize ${
                result.impact?.includes('positive') ? 'text-emerald-600' :
                result.impact?.includes('negative') ? 'text-rose-600' : 'text-amber-600'
              }`}>{result.impact?.replace('_', ' ')}</span>
            </div>
          )}
          {result.confidence && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Model Confidence</span>
              <span className="text-slate-900 font-bold">{((result.confidence || 0) * 100).toFixed(0)}%</span>
            </div>
          )}
          {result.risk_score !== undefined && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Composite Risk</span>
              <span className={`font-bold ${result.risk_score < 30 ? 'text-emerald-600' : result.risk_score < 55 ? 'text-amber-600' : 'text-rose-600'}`}>
                {result.risk_score}/100
              </span>
            </div>
          )}
          {result.recommended_action && (
            <div className="text-xs text-slate-800 font-semibold mt-3 p-3 rounded-lg bg-blue-50 border border-blue-100 leading-relaxed">
              {result.recommended_action}
            </div>
          )}
          {result.reasoning && !result.recommended_action && (
            <div className="text-xs text-slate-600 mt-3 line-clamp-3 leading-relaxed">
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
          <div className="text-xs text-slate-500 mt-2 font-medium">Evaluating scenario...</div>
        </div>
      )}

      {!status && (
        <div className="text-xs text-slate-400 mt-3 font-medium">Standby for simulation trigger</div>
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
    <div className="flex-1 flex flex-col min-h-0 bg-slate-50">
      <Header title="Agent Collaboration Monitor" subtitle="Real-time multi-agent orchestrator & transcript debate" />

      <div className="flex-1 overflow-auto p-8 space-y-6">
        {/* Banner */}
        <div className="glass-card p-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
            <div>
              <span className="text-sm font-bold text-slate-900">8-Agent System Ready</span>
              <p className="text-xs text-slate-500 font-medium">
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
              <Brain size={18} className="text-blue-600" />
              <div className="text-base font-bold text-slate-900">Agent Debate Transcript</div>
            </div>
            <div className="space-y-3">
              {selectedRun.agent_results.Executive.debate.map((entry, i) => {
                const meta = AGENT_META[entry.agent] || {}
                const Icon = meta.icon || DollarSign
                return (
                  <div key={i} className={`flex gap-4 p-4 rounded-xl border ${
                    entry.agent === 'Executive' ? 'border-blue-200 bg-blue-50' : 'border-slate-100 bg-slate-50'
                  }`}>
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${meta.color || 'from-slate-100 to-slate-200'} flex items-center justify-center flex-shrink-0 mt-0.5 border border-white`}>
                      <Icon size={16} className={meta.accent || 'text-slate-600'} />
                    </div>
                    <div>
                      <div className={`text-xs font-bold mb-1 ${meta.accent || 'text-slate-700'}`}>{entry.agent} Agent</div>
                      <div className="text-xs text-slate-700 leading-relaxed font-medium">{entry.position}</div>
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
