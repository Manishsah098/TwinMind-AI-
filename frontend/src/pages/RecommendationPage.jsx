/**
 * TwinMind AI - Executive Recommendation Page
 * The final, high-impact recommendation card
 */
import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import {
  Crown, ShieldCheck, TrendingUp, DollarSign,
  Users, ChevronDown, ChevronUp, Brain,
  CheckCircle2, AlertTriangle, BarChart2,
  Lightbulb, FileText, ArrowUpRight
} from 'lucide-react'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  ResponsiveContainer, PolarRadiusAxis, Tooltip
} from 'recharts'
import Header from '../components/Layout/Header'

// Demo recommendation data
const DEMO_RECOMMENDATION = {
  recommended_action: 'Implement a 7% price increase',
  recommended_price_change_percent: 7,
  confidence: 0.87,
  risk_category: 'LOW',
  risk_score: 35,
  expected_profit_impact: 820000,
  expected_revenue_impact: 4.1,
  expected_roi: 191,
  churn_risk: 2.73,
  reasoning: 'After consulting 7 specialized agents and running 1,000 Monte Carlo simulations, a 7% price increase emerges as the optimal decision. This scenario produces a 23.1% profit improvement at LOW risk, with a 191% ROI. The Finance Agent confirms margin expansion; the Marketing Agent validates churn remains within acceptable bounds; the Risk Agent classifies this as LOW risk. Enterprise accounts (low price sensitivity) anchor revenue stability. Implement loyalty discounts for at-risk SMB accounts to maximize retention.',
  debate: [
    { agent: 'Finance', position: 'Price increase improves margin by 23.1%. ROI is 191%.' },
    { agent: 'Marketing', position: 'Higher price increases churn by 9%. Customer replacement costs $416,000.' },
    { agent: 'Sales', position: 'Enterprise customers have LOW price sensitivity. SMB/individual segments show 5% win rate risk.' },
    { agent: 'Risk', position: 'Risk score 35/100 (LOW). Risk is manageable with proper mitigations.' },
    { agent: 'Executive', position: '7% price increase provides the best risk/reward balance across all dimensions.' },
  ],
  key_factors: [
    'Margin improvement: +23.1% operating profit',
    'Customer retention maintained with 9% incremental churn risk',
    'Risk level: LOW — acceptable threshold',
    'Price elasticity analysis supports this level of increase',
    'Enterprise segment shows low price sensitivity',
  ],
  mitigations: [
    'Offer loyalty discounts to high-value accounts',
    'Phase price increase over 2-3 quarters',
    'Introduce value-add features to justify price increase',
  ],
  audit_log: {
    scenario_evaluated: '7% price increase',
    agents_consulted: ['Finance', 'Sales', 'Marketing', 'HR', 'Supply Chain', 'Inventory', 'Risk'],
    simulations: 1000,
    key_factors: ['margin improvement', 'customer retention', 'price elasticity'],
    confidence: 0.87,
  },
}

const RADAR_DATA = [
  { subject: 'Revenue',   A: 78 },
  { subject: 'Profit',    A: 88 },
  { subject: 'Retention', A: 72 },
  { subject: 'Risk',      A: 65 },
  { subject: 'ROI',       A: 85 },
  { subject: 'Growth',    A: 70 },
]

const AGENT_META = {
  Finance:    { color: 'text-cyan-400' },
  Marketing:  { color: 'text-purple-400' },
  Sales:      { color: 'text-indigo-400' },
  Risk:       { color: 'text-amber-400' },
  Executive:  { color: 'text-rose-400' },
}

function CollapseSection({ title, icon: Icon, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="glass-card overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 hover:bg-white/2 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Icon size={15} className="text-slate-400" />
          <span className="text-sm font-semibold text-white">{title}</span>
        </div>
        {open ? <ChevronUp size={14} className="text-slate-500" /> : <ChevronDown size={14} className="text-slate-500" />}
      </button>
      {open && <div className="px-5 pb-5 border-t border-white/5">{children}</div>}
    </div>
  )
}

export default function RecommendationPage() {
  const location = useLocation()
  const simState = location.state?.sim
  const rec = simState?.finalRecommendation || DEMO_RECOMMENDATION

  const fmt = (n) => n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(2)}M` : n >= 1_000 ? `$${(n / 1_000).toFixed(0)}K` : `$${n}`

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-950">
      <Header title="Executive Recommendation" subtitle="AI-synthesized decision intelligence" />

      <div className="flex-1 overflow-auto p-6 space-y-5">
        {/* HERO RECOMMENDATION CARD */}
        <div className="recommendation-card p-8">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <Crown size={20} className="text-amber-400" />
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Executive AI Recommendation</span>
              </div>
              <h2 className="text-3xl font-black text-white mb-2 leading-tight">
                {rec.recommended_action || 'Implement a 7% price increase'}
              </h2>
              <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">{rec.reasoning}</p>
            </div>

            {/* Score Dial */}
            <div className="flex-shrink-0 text-center">
              <div className="relative w-28 h-28">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#22d3ee" strokeWidth="8"
                    strokeDasharray={`${((rec.confidence || 0.87) * 251).toFixed(0)} 251`}
                    strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-2xl font-black text-white">{((rec.confidence || 0.87) * 100).toFixed(0)}%</div>
                  <div className="text-[9px] text-slate-500 uppercase tracking-wider">Confidence</div>
                </div>
              </div>
            </div>
          </div>

          {/* KPI Pills */}
          <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-white/5">
            <div className="flex items-center gap-2 bg-emerald-400/10 border border-emerald-400/20 rounded-lg px-4 py-2.5">
              <TrendingUp size={14} className="text-emerald-400" />
              <div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider">Profit Impact</div>
                <div className="text-sm font-bold text-emerald-400">{fmt(rec.expected_profit_impact || 820000)}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-cyan-400/10 border border-cyan-400/20 rounded-lg px-4 py-2.5">
              <DollarSign size={14} className="text-cyan-400" />
              <div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider">ROI</div>
                <div className="text-sm font-bold text-cyan-400">{(rec.expected_roi || 191).toFixed(0)}%</div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-amber-400/10 border border-amber-400/20 rounded-lg px-4 py-2.5">
              <ShieldCheck size={14} className="text-amber-400" />
              <div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider">Risk</div>
                <div className="text-sm font-bold text-amber-400">{rec.risk_category || 'LOW'} ({rec.risk_score || 35}/100)</div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-indigo-400/10 border border-indigo-400/20 rounded-lg px-4 py-2.5">
              <Users size={14} className="text-indigo-400" />
              <div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider">Churn Risk</div>
                <div className="text-sm font-bold text-indigo-400">{(rec.churn_risk || 2.73).toFixed(2)}%/mo</div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-slate-400/10 border border-slate-400/20 rounded-lg px-4 py-2.5">
              <BarChart2 size={14} className="text-slate-400" />
              <div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider">Revenue Impact</div>
                <div className="text-sm font-bold text-slate-300">+{(rec.expected_revenue_impact || 4.1).toFixed(1)}%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-2 gap-5">
          {/* Radar Chart */}
          <div className="glass-card p-5">
            <div className="text-sm font-semibold text-white mb-4">Decision Scorecard</div>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={RADAR_DATA}>
                <PolarGrid stroke="rgba(255,255,255,0.05)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11 }} />
                <PolarRadiusAxis domain={[0, 100]} tick={{ fill: '#475569', fontSize: 9 }} />
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 11 }} />
                <Radar name="Score" dataKey="A" stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.2} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Key Factors */}
          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb size={15} className="text-amber-400" />
              <span className="text-sm font-semibold text-white">Why This Decision?</span>
            </div>
            <div className="space-y-2.5">
              {(rec.key_factors || DEMO_RECOMMENDATION.key_factors).map((f, i) => (
                <div key={i} className="flex gap-2.5">
                  <CheckCircle2 size={13} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-400 leading-relaxed">{f}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-white/5">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle size={13} className="text-amber-400" />
                <span className="text-xs font-semibold text-white">Recommended Mitigations</span>
              </div>
              {(rec.mitigations || DEMO_RECOMMENDATION.mitigations).map((m, i) => (
                <div key={i} className="flex gap-2 mb-1.5">
                  <ArrowUpRight size={11} className="text-cyan-400 flex-shrink-0 mt-0.5" />
                  <span className="text-[11px] text-slate-500">{m}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Agent Debate */}
        <CollapseSection title="Agent Debate" icon={Brain} defaultOpen={true}>
          <div className="space-y-3 mt-4">
            {(rec.debate || DEMO_RECOMMENDATION.debate).map((entry, i) => {
              const meta = AGENT_META[entry.agent] || {}
              return (
                <div key={i} className={`flex gap-3 p-3 rounded-lg border ${
                  entry.agent === 'Executive' ? 'border-cyan-400/20 bg-cyan-400/5' : 'border-white/5 bg-white/2'
                }`}>
                  <div className="flex-shrink-0 pt-0.5">
                    <div className={`text-[10px] font-bold uppercase tracking-wider ${meta.color || 'text-slate-400'}`}>
                      {entry.agent}
                    </div>
                  </div>
                  <div className="text-xs text-slate-400 leading-relaxed">{entry.position}</div>
                </div>
              )
            })}
          </div>
        </CollapseSection>

        {/* Audit Log */}
        <CollapseSection title="Audit Log" icon={FileText}>
          <div className="mt-4 font-mono text-xs bg-slate-900 rounded-lg p-4 border border-white/5 space-y-1 text-slate-400">
            {Object.entries(rec.audit_log || DEMO_RECOMMENDATION.audit_log).map(([k, v]) => (
              <div key={k} className="flex gap-2">
                <span className="text-cyan-500 flex-shrink-0">{k}:</span>
                <span>{typeof v === 'object' ? JSON.stringify(v) : String(v)}</span>
              </div>
            ))}
            <div className="text-emerald-400 mt-2">// Simulations: 1,000 · Agents: 7 · Time: ~2s</div>
          </div>
        </CollapseSection>
      </div>
    </div>
  )
}
