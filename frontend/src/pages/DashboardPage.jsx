/**
 * TwinMind AI - Executive Dashboard Page
 */
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  TrendingUp, Users, DollarSign, ShieldCheck,
  Activity, Brain, ArrowRight, BarChart2,
  ChevronRight, Zap, Sparkles, Layers
} from 'lucide-react'
import Header from '../components/Layout/Header'
import { getDashboard } from '../services/api'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts'

const REVENUE_SPARK = [
  { m: 'Jan', v: 780 }, { m: 'Feb', v: 810 }, { m: 'Mar', v: 795 },
  { m: 'Apr', v: 840 }, { m: 'May', v: 865 }, { m: 'Jun', v: 833 },
  { m: 'Jul', v: 850 }, { m: 'Aug', v: 860 },
]

const CHURN_SPARK = [
  { m: 'Jan', v: 2.8 }, { m: 'Feb', v: 2.6 }, { m: 'Mar', v: 2.5 },
  { m: 'Apr', v: 2.5 }, { m: 'May', v: 2.4 }, { m: 'Jun', v: 2.5 },
  { m: 'Jul', v: 2.5 }, { m: 'Aug', v: 2.5 },
]

function MetricCard({ icon: Icon, label, value, sub, color = 'cyan', trend }) {
  const colorMap = {
    cyan: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    indigo: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    rose: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
  }

  return (
    <div className="metric-card">
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2.5 rounded-xl border ${colorMap[color]}`}>
          <Icon size={18} />
        </div>
        {trend !== undefined && (
          <span className={`badge ${trend >= 0 ? 'badge-success' : 'badge-error'}`}>
            {trend >= 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <div className="text-2xl font-extrabold text-white tracking-tight mb-1">{value}</div>
      <div className="text-xs font-semibold text-slate-400">{label}</div>
      {sub && <div className="text-[11px] text-slate-500 mt-1 font-medium">{sub}</div>}
    </div>
  )
}

function QuickAction({ icon: Icon, label, desc, to, gradient }) {
  const navigate = useNavigate()
  return (
    <button
      onClick={() => navigate(to)}
      className="glass-card p-5 text-left hover:border-cyan-400/30 transition-all group relative overflow-hidden"
    >
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
          <Icon size={20} className="text-white" />
        </div>
        <div className="flex-1">
          <div className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">{label}</div>
          <div className="text-xs text-slate-400 mt-0.5">{desc}</div>
        </div>
        <ChevronRight size={16} className="text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
      </div>
    </button>
  )
}

export default function DashboardPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    getDashboard()
      .then(setData)
      .catch(() => {
        setData({
          company: {
            name: 'DemoCorp', revenue: 10000000, customers: 50000,
            employees: 420, gross_margin: 0.68, monthly_churn: 0.025,
            nps_score: 42, cash: 3500000, avg_price: 200, ltv_cac_ratio: 25
          },
          simulation_activity: { total_simulations: 0, active: 0, completed: 0 },
        })
      })
      .finally(() => setLoading(false))
  }, [])

  const co = data?.company || {}
  const fmt = (n) => n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(1)}M` : n >= 1000 ? `$${(n / 1000).toFixed(0)}K` : `$${n}`

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-dark-950 bg-radial-glow bg-grid-pattern">
      <Header title="Executive Dashboard" subtitle="DemoCorp Enterprise Digital Twin · Business Intelligence" />

      <div className="flex-1 overflow-auto p-8 space-y-8">
        {/* Hero Flight Simulator Banner */}
        <div className="recommendation-card p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-3">
                <Brain size={14} /> Business Flight Simulator
              </div>
              <h2 className="text-3xl font-extrabold text-white tracking-tight mb-2">
                Simulate Business Outcomes <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">Before You Act</span>
              </h2>
              <p className="text-slate-300 text-sm max-w-xl leading-relaxed">
                Enter any high-impact business decision. 8 specialized AI agents stress-test consequences and run 1,000 Monte Carlo simulations to deliver explainable recommendations.
              </p>
            </div>
            <button
              onClick={() => navigate('/simulator')}
              className="btn-primary text-base py-3.5 px-7 whitespace-nowrap shadow-glow-cyan"
            >
              <Zap size={18} />
              Run New Simulation
            </button>
          </div>
        </div>

        {/* Primary KPIs */}
        <div>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Enterprise Financial Health</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <MetricCard icon={DollarSign} label="Annual Revenue" value={loading ? '—' : fmt(co.revenue)} sub="FY 2026 Run Rate" color="cyan" trend={8.4} />
            <MetricCard icon={Users} label="Active Customers" value={loading ? '—' : co.customers?.toLocaleString()} sub="50,000+ Accounts" color="indigo" trend={4.2} />
            <MetricCard icon={TrendingUp} label="Gross Profit Margin" value={loading ? '—' : `${((co.gross_margin || 0) * 100).toFixed(0)}%`} sub="Industry benchmark 65%" color="emerald" trend={2.1} />
            <MetricCard icon={ShieldCheck} label="Monthly Churn Rate" value={loading ? '—' : `${((co.monthly_churn || 0) * 100).toFixed(1)}%`} sub="Target <3.0%" color="amber" trend={-2.0} />
          </div>
        </div>

        {/* Secondary KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <MetricCard icon={Activity} label="NPS Score" value={loading ? '—' : co.nps_score} sub="Industry Avg: 32" color="emerald" />
          <MetricCard icon={DollarSign} label="Cash Reserve" value={loading ? '—' : fmt(co.cash)} sub="8 Months Runway" color="cyan" />
          <MetricCard icon={TrendingUp} label="Avg Price / Customer" value={loading ? '—' : `$${co.avg_price}`} sub="Monthly ARPU" color="indigo" />
          <MetricCard icon={BarChart2} label="LTV / CAC Ratio" value={loading ? '—' : `${co.ltv_cac_ratio}x`} sub="Top Decile (>5x)" color="emerald" />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="text-sm font-bold text-white">Monthly Revenue Velocity ($K)</div>
                <div className="text-xs text-slate-400">Trailing 8 months</div>
              </div>
              <span className="badge badge-success">↑ 8.4% YoY</span>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={REVENUE_SPARK}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="m" tick={{ fontSize: 11, fill: '#6b7280' }} />
                <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} />
                <Tooltip contentStyle={{ background: '#0b0f19', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10 }} />
                <Area type="monotone" dataKey="v" stroke="#06b6d4" fill="url(#revGrad)" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="text-sm font-bold text-white">Customer Churn Trajectory (%)</div>
                <div className="text-xs text-slate-400">Monthly churn rate</div>
              </div>
              <span className="badge badge-info">Stable 2.5%</span>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={CHURN_SPARK}>
                <defs>
                  <linearGradient id="churnGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="m" tick={{ fontSize: 11, fill: '#6b7280' }} />
                <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} domain={[2, 3.5]} />
                <Tooltip contentStyle={{ background: '#0b0f19', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10 }} />
                <Area type="monotone" dataKey="v" stroke="#f59e0b" fill="url(#churnGrad)" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Platform Modules</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <QuickAction icon={Zap} label="Scenario Simulator" desc="Run Monte Carlo decision simulation" to="/simulator" gradient="from-cyan-500 to-blue-600" />
            <QuickAction icon={Activity} label="8-Agent Collaboration" desc="Monitor multi-agent analysis & debate" to="/agents" gradient="from-indigo-500 to-purple-600" />
            <QuickAction icon={Layers} label="Digital Twin Graph" desc="Interactive React Flow enterprise twin" to="/twin" gradient="from-emerald-500 to-teal-600" />
          </div>
        </div>
      </div>
    </div>
  )
}
