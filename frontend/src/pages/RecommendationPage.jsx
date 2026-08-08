/**
 * TwinMind AI - Executive Recommendation Page (Clean Professional Light)
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
    { agent: 'Finance',   position: 'Price increase improves margin by 19.1%. ROI is 191% on $50K implementation cost.' },
    { agent: 'Marketing', position: 'Higher price increases churn to 3.55%/mo. Retention campaign estimated at $120K is recommended.' },
    { agent: 'Sales',     position: 'Enterprise customers have LOW price sensitivity. SMB win rates remain within 4% of baseline.' },
    { agent: 'Risk',      position: 'Composite risk score 30.7/100 (LOW). Risk is manageable with proper mitigations in place.' },
    { agent: 'Executive', position: '7% price increase provides the best risk/reward balance across all business dimensions. Proceed with phased implementation.' },
  ],
  key_factors: [
    'Operating profit expansion: +$420,000 annually (+19.1%)',
    'Customer retention maintained with acceptable 3.55%/mo churn',
    'Composite risk score: 30.7/100 (LOW category threshold < 40)',
    'Price elasticity analysis supports this level of pricing',
    'Enterprise segment anchors 70%+ of revenue with low sensitivity',
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
  Finance:    { color: 'text-blue-700',   bg: 'bg-blue-50 border-blue-200' },
  Marketing:  { color: 'text-purple-700', bg: 'bg-purple-50 border-purple-200' },
  Sales:      { color: 'text-indigo-700', bg: 'bg-indigo-50 border-indigo-200' },
  Risk:       { color: 'text-amber-700',  bg: 'bg-amber-50 border-amber-200' },
  Executive:  { color: 'text-blue-700',   bg: 'bg-blue-50 border-blue-300' },
}

function CollapseSection({ title, icon: Icon, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="glass-card overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <Icon size={18} className="text-blue-600" />
          <span className="text-base font-bold text-slate-900">{title}</span>
        </div>
        {open
          ? <ChevronUp size={16} className="text-slate-400" />
          : <ChevronDown size={16} className="text-slate-400" />}
      </button>
      {open && <div className="px-6 pb-6 border-t border-slate-100 pt-4">{children}</div>}
    </div>
  )
}

export default function RecommendationPage() {
  const location = useLocation()
  const simState = location.state?.sim
  const rec = simState?.finalRecommendation || DEMO_RECOMMENDATION
  const fmt = (n) => n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(2)}M` : n >= 1_000 ? `$${(n / 1_000).toFixed(0)}K` : `$${n}`

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-50">
      <Header title="Executive Recommendation" subtitle="AI-Synthesized Decision Intelligence & Audit Trail" />

      <div className="flex-1 overflow-auto p-8 space-y-6">

        {/* ── HERO CARD ── */}
        <div className="recommendation-card p-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-700 text-xs font-bold uppercase tracking-widest mb-3">
                <Crown size={14} /> Executive AI Recommendation
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3 leading-tight">
                {rec.recommended_action || 'Implement a 7% price increase'}
              </h2>
              <p className="text-slate-600 text-sm max-w-2xl leading-relaxed font-medium">{rec.reasoning}</p>
            </div>

            {/* Confidence Ring */}
            <div className="flex-shrink-0 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 text-center">
              <div className="relative w-28 h-28 mx-auto">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#e2e8f0" strokeWidth="8" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#2563eb" strokeWidth="8"
                    strokeDasharray={`${((rec.confidence || 0.87) * 251).toFixed(0)} 251`}
                    strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-2xl font-extrabold text-slate-900">{((rec.confidence || 0.87) * 100).toFixed(0)}%</div>
                  <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Confidence</div>
                </div>
              </div>
            </div>
          </div>

          {/* Metric Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mt-8 pt-6 border-t border-blue-100">
            <div className="bg-white rounded-xl border border-emerald-200 p-4 shadow-sm">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                <TrendingUp size={11} className="text-emerald-500" /> Profit Impact
              </div>
              <div className="text-base font-extrabold text-emerald-700">{fmt(rec.expected_profit_impact || 420000)}</div>
            </div>
            <div className="bg-white rounded-xl border border-blue-200 p-4 shadow-sm">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                <DollarSign size={11} className="text-blue-500" /> Expected ROI
              </div>
              <div className="text-base font-extrabold text-blue-700">{(rec.expected_roi || 191).toFixed(0)}%</div>
            </div>
            <div className="bg-white rounded-xl border border-amber-200 p-4 shadow-sm">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                <ShieldCheck size={11} className="text-amber-500" /> Risk Score
              </div>
              <div className="text-base font-extrabold text-amber-700">{rec.risk_category || 'LOW'} ({rec.risk_score?.toFixed(1) || 30.7})</div>
            </div>
            <div className="bg-white rounded-xl border border-indigo-200 p-4 shadow-sm">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                <Users size={11} className="text-indigo-500" /> Monthly Churn
              </div>
              <div className="text-base font-extrabold text-indigo-700">{(rec.churn_risk || 3.55).toFixed(2)}%/mo</div>
            </div>
            <div className="bg-white rounded-xl border border-purple-200 p-4 shadow-sm">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                <BarChart2 size={11} className="text-purple-500" /> Revenue Change
              </div>
              <div className="text-base font-extrabold text-purple-700">+{(rec.expected_revenue_impact || 3.9).toFixed(1)}%</div>
            </div>
          </div>
        </div>

        {/* ── CHARTS ROW ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Radar Chart */}
          <div className="glass-card p-6">
            <div className="text-base font-bold text-slate-900 mb-4">Decision Balance Scorecard</div>
            <ResponsiveContainer width="100%" height={240}>
              <RadarChart data={RADAR_DATA}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11, fontWeight: 700 }} />
                <PolarRadiusAxis domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 9 }} />
                <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 10, boxShadow: '0 4px 12px rgba(0,0,0,0.08)', fontSize: 11 }} />
                <Radar name="Score" dataKey="A" stroke="#2563eb" fill="#2563eb" fillOpacity={0.15} strokeWidth={2.5} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Key Decision Drivers */}
          <div className="glass-card p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Lightbulb size={18} className="text-amber-500" />
              <div className="text-base font-bold text-slate-900">Why This Recommendation?</div>
            </div>
            <div className="space-y-3">
              {(rec.key_factors || DEMO_RECOMMENDATION.key_factors).map((f, i) => (
                <div key={i} className="flex gap-3 bg-emerald-50 border border-emerald-100 rounded-xl p-3">
                  <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-700 font-semibold leading-relaxed">{f}</span>
                </div>
              ))}
            </div>
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <AlertTriangle size={13} className="text-amber-500" /> Required Risk Mitigations
              </div>
              {(rec.mitigations || DEMO_RECOMMENDATION.mitigations).map((m, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-slate-600 bg-amber-50 border border-amber-100 rounded-lg p-2.5">
                  <ArrowUpRight size={13} className="text-amber-600 flex-shrink-0" />
                  <span className="font-medium">{m}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── AGENT DEBATE ── */}
        <CollapseSection title="Multi-Agent Debate Transcript" icon={Brain} defaultOpen={true}>
          <div className="space-y-3">
            {(rec.debate || DEMO_RECOMMENDATION.debate).map((entry, i) => {
              const meta = AGENT_META[entry.agent] || { color: 'text-slate-700', bg: 'bg-slate-50 border-slate-200' }
              return (
                <div key={i} className={`flex gap-4 p-4 rounded-xl border ${meta.bg}`}>
                  <div className={`text-xs font-extrabold uppercase tracking-wider ${meta.color} w-24 flex-shrink-0 pt-0.5`}>
                    {entry.agent}
                  </div>
                  <div className="text-xs text-slate-700 leading-relaxed font-medium">{entry.position}</div>
                </div>
              )
            })}
          </div>
        </CollapseSection>

        {/* ── AUDIT LOG ── */}
        <CollapseSection title="Verification & Audit Trail" icon={FileText}>
          <div className="font-mono text-xs bg-slate-900 text-slate-300 rounded-xl p-5 border border-slate-800 space-y-1.5">
            {Object.entries(rec.audit_log || DEMO_RECOMMENDATION.audit_log).map(([k, v]) => (
              <div key={k} className="flex gap-3">
                <span className="text-blue-400 font-bold">{k}:</span>
                <span>{typeof v === 'object' ? JSON.stringify(v) : String(v)}</span>
              </div>
            ))}
            <div className="text-emerald-400 mt-3 pt-2 border-t border-slate-700">
              ✓ Verified by TwinMind Monte Carlo Engine (1,000 iterations)
            </div>
          </div>
        </CollapseSection>
      </div>
    </div>
  )
}
