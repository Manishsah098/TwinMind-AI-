/**
 * TwinMind AI - Dashboard Page
 * Company overview KPIs + recent simulation activity
 */
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  TrendingUp, Users, DollarSign, ShieldCheck,
  Activity, Brain, ArrowRight, BarChart2,
  ChevronRight, Zap
} from 'lucide-react'
import Header from '../components/Layout/Header'
import { getDashboard } from '../services/api'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts'

// Static sparkline data for demo
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

function MetricCard({ icon: Icon, label, value, sub, color = 'cyan', trend, trendData }) {
  const colorMap = {
    cyan: 'text-cyan-400',
    emerald: 'text-emerald-400',
    indigo: 'text-indigo-400',
    amber: 'text-amber-400',
    rose: 'text-rose-400',
  }

  return (
    <div className="metric-card">
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2 rounded-lg bg-white/5 ${colorMap[color]}`}>
          <Icon size={16} />
        </div>
        {trend !== undefined && (
          <span className={`text-xs font-semibold ${trend >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {trend >= 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <div className="text-xl font-bold text-white mb-0.5">{value}</div>
      <div className="text-xs text-slate-500">{label}</div>
      {sub && <div className="text-[11px] text-slate-600 mt-0.5">{sub}</div>}
    </div>
  )
}

function QuickAction({ icon: Icon, label, desc, to, color }) {
  const navigate = useNavigate()
  return (
    <button
      onClick={() => navigate(to)}
      className="w-full glass-card p-4 text-left hover:border-cyan-400/20 transition-all group"
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon size={16} className="text-white" />
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold text-white">{label}</div>
          <div className="text-[11px] text-slate-500">{desc}</div>
        </div>
        <ChevronRight size={14} className="text-slate-600 group-hover:text-cyan-400 transition-colors" />
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
        // Use demo data if backend unavailable
        setData({
          company: {
            name: 'DemoCorp', revenue: 10000000, customers: 50000,
            employees: 420, gross_margin: 0.68, monthly_churn: 0.025,
            nps_score: 42, cash: 3500000, avg_price: 200, ltv_cac_ratio: 25
          },
          simulation_activity: { total_simulations: 0, active: 0, completed: 0 },
          latest_recommendation: null,
          llm_status: { demo_mode: true }
        })
      })
      .finally(() => setLoading(false))
  }, [])

  const co = data?.company || {}
  const fmt = (n) => n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(1)}M` : n >= 1000 ? `$${(n / 1000).toFixed(0)}K` : `$${n}`

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-950 bg-grid-pattern">
      <Header title="Executive Dashboard" subtitle="DemoCorp · Real-time Business Intelligence" />

      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Hero Banner */}
        <div className="recommendation-card p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Brain size={18} className="text-cyan-400" />
                <span className="text-xs font-semibold text-cyan-400 uppercase tracking-widest">TwinMind AI</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-1">Think Before You Act</h2>
              <p className="text-slate-400 text-sm max-w-lg">
                Enter a high-impact business decision. TwinMind simulates thousands of possible outcomes
                using 8 specialized AI agents before you commit.
              </p>
            </div>
            <button
              onClick={() => navigate('/simulator')}
              className="btn-primary whitespace-nowrap"
            >
              <Zap size={14} />
              Run Simulation
            </button>
          </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard icon={DollarSign} label="Annual Revenue" value={loading ? '—' : fmt(co.revenue)} sub="FY 2026" color="cyan" trend={8.4} />
          <MetricCard icon={Users} label="Total Customers" value={loading ? '—' : co.customers?.toLocaleString()} sub="50K+ active" color="indigo" trend={4.2} />
          <MetricCard icon={TrendingUp} label="Gross Margin" value={loading ? '—' : `${((co.gross_margin || 0) * 100).toFixed(0)}%`} sub="Industry avg: 65%" color="emerald" trend={2.1} />
          <MetricCard icon={ShieldCheck} label="Monthly Churn" value={loading ? '—' : `${((co.monthly_churn || 0) * 100).toFixed(1)}%`} sub="Target: <3%" color="amber" trend={-2.0} />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard icon={Activity} label="NPS Score" value={loading ? '—' : co.nps_score} sub="Industry avg: 32" color="emerald" />
          <MetricCard icon={DollarSign} label="Cash Reserve" value={loading ? '—' : fmt(co.cash)} sub="8 months runway" color="cyan" />
          <MetricCard icon={TrendingUp} label="Avg Price/mo" value={loading ? '—' : `$${co.avg_price}`} sub="Per seat" color="indigo" />
          <MetricCard icon={BarChart2} label="LTV / CAC" value={loading ? '—' : `${co.ltv_cac_ratio}x`} sub="Excellent (>5x)" color="emerald" />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-semibold text-white">Monthly Revenue (K)</div>
              <span className="badge badge-success">↑ 8.4%</span>
            </div>
            <ResponsiveContainer width="100%" height={120}>
              <AreaChart data={REVENUE_SPARK}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="m" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }} />
                <Area type="monotone" dataKey="v" stroke="#06b6d4" fill="url(#revGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-semibold text-white">Monthly Churn Rate (%)</div>
              <span className="badge badge-success">↓ Improving</span>
            </div>
            <ResponsiveContainer width="100%" height={120}>
              <AreaChart data={CHURN_SPARK}>
                <defs>
                  <linearGradient id="churnGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="m" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} domain={[2, 3.5]} />
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }} />
                <Area type="monotone" dataKey="v" stroke="#f59e0b" fill="url(#churnGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Quick Actions</div>
          <div className="grid grid-cols-3 gap-3">
            <QuickAction icon={Zap} label="Run What-If Simulation" desc="Ask any business question" to="/simulator" color="bg-gradient-to-br from-cyan-600 to-indigo-600" />
            <QuickAction icon={Activity} label="Monitor Agents" desc="View AI agent activity" to="/agents" color="bg-gradient-to-br from-indigo-600 to-purple-700" />
            <QuickAction icon={BarChart2} label="Compare Scenarios" desc="Side-by-side analysis" to="/comparison" color="bg-gradient-to-br from-emerald-600 to-teal-700" />
          </div>
        </div>

        {/* Simulation Activity */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-semibold text-white">Simulation Activity</div>
            <button onClick={() => navigate('/simulator')} className="btn-secondary text-xs py-1.5">
              New Simulation <ArrowRight size={12} />
            </button>
          </div>
          {data?.simulation_activity?.completed > 0 ? (
            <div className="text-sm text-slate-400">
              {data.simulation_activity.completed} simulation{data.simulation_activity.completed !== 1 ? 's' : ''} completed
            </div>
          ) : (
            <div className="text-center py-8 text-slate-600">
              <Brain size={32} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">No simulations run yet.</p>
              <p className="text-xs mt-1">Go to Scenario Simulator to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
