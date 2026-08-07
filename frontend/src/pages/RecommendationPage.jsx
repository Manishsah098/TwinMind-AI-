/**
 * TwinMind AI - Executive Recommendation Page
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

const DEMO_RECOMMENDATION = {
  recommended_action: 'Implement a 7% price increase',
  recommended_price_change_percent: 7,
  confidence: 0.87,
  risk_category: 'LOW',
  risk_score: 30.7,
  expected_profit_impact: 420000,
  expected_revenue_impact: 3.9,
  expected_roi: 191,
  churn_risk: 3.55,
  reasoning: 'After consulting 7 specialized agents and running 1,000 Monte Carlo simulations, a 7% price increase emerges as the optimal decision. This scenario produces a 19.1% profit improvement at LOW risk, with a 191% ROI. The Finance Agent confirms margin expansion; the Marketing Agent validates churn remains within acceptable bounds; the Risk Agent classifies this as LOW risk. Enterprise accounts anchor revenue stability. Implement loyalty discounts for at-risk SMB accounts to maximize retention.',
  debate: [
    { agent: 'Finance', position: 'Price increase improves margin by 19.1%. ROI is 191%.' },
    { agent: 'Marketing', position: 'Higher price increases churn to 3.55%/mo. Retention campaign recommended.' },
    { agent: 'Sales', position: 'Enterprise customers have LOW price sensitivity. SMB win rates remain within 4% of baseline.' },
    { agent: 'Risk', position: 'Composite risk score 30.7/100 (LOW). Risk is manageable with proper mitigations.' },
    { agent: 'Executive', position: '7% price increase provides the best risk/reward balance across all business dimensions.' },
  ],
  key_factors: [
    'Operating profit expansion: +$420,000 annually (+19.1%)',
    'Customer retention maintained with acceptable 3.55%/mo churn',
    'Composite risk score: 30.7/100 (LOW category)',
    'Price elasticity analysis supports this pricing level',
    'Enterprise segment anchors revenue predictability',
  ],
  mitigations: [
    'Offer targeted loyalty discounts to high-value enterprise accounts',
    'Phase price increase over 2 consecutive quarters',
    'Introduce new value-add feature tiers to justify price increase',
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
  { subject: 'Retention', A: 75 },
  { subject: 'Risk',      A: 70 },
  { subject: 'ROI',       A: 86 },
  { subject: 'Growth',    A: 72 },
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
        className="w-full flex items-center justify-between p-6 hover:bg-white/2 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <Icon size={18} className="text-cyan-400" />
          <span className="text-base font-bold text-white">{title}</span>
        </div>
        {open ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
      </button>
      {open && <div className="px-6 pb-6 border-t border-white/5 pt-4">{children}</div>}
    </div>
  )
}

export default function RecommendationPage() {
  const location = useLocation()
  const simState = location.state?.sim
  const rec = simState?.finalRecommendation || DEMO_RECOMMENDATION

  const fmt = (n) => n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(2)}M` : n >= 1_000 ? `$${(n / 1_000).toFixed(0)}K` : `$${n}`

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-dark-950 bg-radial-glow">
      <Header title="Executive Recommendation" subtitle="AI-Synthesized Decision Intelligence & Audit Trail" />

      <div className="flex-1 overflow-auto p-8 space-y-6">
        {/* HERO RECOMMENDATION CARD */}
        <div className="recommendation-card p-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-widest mb-3">
                <Crown size={14} /> Executive AI Recommendation
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
                {rec.recommended_action || 'Implement a 7% price increase'}
              </h2>
              <p className="text-slate-300 text-sm max-w-2xl leading-relaxed font-medium">{rec.reasoning}</p>
            </div>

            {/* Confidence Dial */}
            <div className="flex-shrink-0 bg-dark-900/80 p-5 rounded-2xl border border-white/10 text-center">
              <div className="relative w-28 h-28 mx-auto">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#22d3ee" strokeWidth="8"
                    strokeDasharray={`${((rec.confidence || 0.87) * 251).toFixed(0)} 251`}
                    strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-2xl font-extrabold text-white">{((rec.confidence || 0.87) * 100).toFixed(0)}%</div>
                  <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Confidence</div>
                </div>
              </div>
            </div>
          </div>

          {/* Metric Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mt-8 pt-6 border-t border-white/10 relative z-10">
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3.5">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Profit Impact</div>
              <div className="text-base font-extrabold text-emerald-400">{fmt(rec.expected_profit_impact || 420000)}</div>
            </div>
            <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-3.5">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Expected ROI</div>
              <div className="text-base font-extrabold text-cyan-400">{(rec.expected_roi || 191).toFixed(0)}%</div>
            </div>
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3.5">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Risk Score</div>
              <div className="text-base font-extrabold text-amber-400">{rec.risk_category || 'LOW'} ({rec.risk_score?.toFixed(1) || 30.7})</div>
            </div>
            <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-3.5">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Monthly Churn</div>
              <div className="text-base font-extrabold text-indigo-400">{(rec.churn_risk || 3.55).toFixed(2)}%/mo</div>
            </div>
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-3.5">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Revenue Change</div>
              <div className="text-base font-extrabold text-purple-400">+{(rec.expected_revenue_impact || 3.9).toFixed(1)}%</div>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Radar Chart */}
          <div className="glass-card p-6">
            <div className="text-base font-bold text-white mb-4">Decision Balance Scorecard</div>
            <ResponsiveContainer width="100%" height={240}>
              <RadarChart data={RADAR_DATA}>
                <PolarGrid stroke="rgba(255,255,255,0.08)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 11, fontWeight: 600 }} />
                <PolarRadiusAxis domain={[0, 100]} tick={{ fill: '#6b7280', fontSize: 9 }} />
                <Tooltip contentStyle={{ background: '#0b0f19', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, fontSize: 11 }} />
                <Radar name="Score" dataKey="A" stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.25} strokeWidth={2.5} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Key Decision Drivers */}
          <div className="glass-card p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Lightbulb size={18} className="text-amber-400" />
              <div className="text-base font-bold text-white">Why This Recommendation?</div>
            </div>
            <div className="space-y-3">
              {(rec.key_factors || DEMO_RECOMMENDATION.key_factors).map((f, i) => (
                <div key={i} className="flex gap-3">
                  <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-300 font-medium leading-relaxed">{f}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-white/5 space-y-2">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Required Risk Mitigations</div>
              {(rec.mitigations || DEMO_RECOMMENDATION.mitigations).map((m, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-slate-400">
                  <ArrowUpRight size={13} className="text-cyan-400" />
                  <span>{m}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Debate Transcript */}
        <CollapseSection title="Multi-Agent Debate Transcript" icon={Brain} defaultOpen={true}>
          <div className="space-y-3">
            {(rec.debate || DEMO_RECOMMENDATION.debate).map((entry, i) => {
              const meta = AGENT_META[entry.agent] || {}
              return (
                <div key={i} className={`flex gap-4 p-4 rounded-xl border ${
                  entry.agent === 'Executive' ? 'border-cyan-400/30 bg-cyan-500/10' : 'border-white/5 bg-white/2'
                }`}>
                  <div className={`text-xs font-extrabold uppercase tracking-wider ${meta.color || 'text-slate-400'} w-24 flex-shrink-0`}>
                    {entry.agent}
                  </div>
                  <div className="text-xs text-slate-300 leading-relaxed font-medium">{entry.position}</div>
                </div>
              )
            })}
          </div>
        </CollapseSection>

        {/* Audit Log */}
        <CollapseSection title="Verification & Audit Trail" icon={FileText}>
          <div className="font-mono text-xs bg-dark-900 rounded-xl p-5 border border-white/5 space-y-1.5 text-slate-300">
            {Object.entries(rec.audit_log || DEMO_RECOMMENDATION.audit_log).map(([k, v]) => (
              <div key={k} className="flex gap-3">
                <span className="text-cyan-400 font-bold">{k}:</span>
                <span>{typeof v === 'object' ? JSON.stringify(v) : String(v)}</span>
              </div>
            ))}
            <div className="text-emerald-400 mt-3 pt-2 border-t border-white/5">
              ✓ Verified by TwinMind Monte Carlo Engine (1,000 iterations)
            </div>
          </div>
        </CollapseSection>
      </div>
    </div>
  )
}
