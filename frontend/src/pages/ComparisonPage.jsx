/**
 * TwinMind AI - Scenario Comparison Page
 * Side-by-side comparison of all price scenarios with charts
 */
import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, Cell
} from 'recharts'
import { TrendingUp, ShieldCheck, DollarSign, Users, Star } from 'lucide-react'
import Header from '../components/Layout/Header'

// Demo comparison data (used when no simulation results)
const DEMO_SCENARIOS = [
  { name: 'Baseline', pct: 0, revenue: 10.0, profit: 2.2, margin: 22, churn: 2.5, risk: 18, roi: 0 },
  { name: '+5%', pct: 5, revenue: 10.32, profit: 2.55, margin: 24.7, churn: 2.65, risk: 28, roi: 141 },
  { name: '+7%', pct: 7, revenue: 10.41, profit: 2.71, margin: 26.0, churn: 2.73, risk: 35, roi: 191 },
  { name: '+10%', pct: 10, revenue: 10.48, profit: 2.82, margin: 26.9, churn: 2.90, risk: 46, roi: 227 },
  { name: '+15%', pct: 15, revenue: 10.52, profit: 2.84, margin: 27.0, churn: 3.30, risk: 68, roi: 238 },
]

const COLORS = ['#64748b', '#22d3ee', '#818cf8', '#f59e0b', '#f43f5e']
const OPTIMAL_IDX = 2 // +7%

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-slate-800 border border-white/10 rounded-lg p-3 text-xs">
        <p className="font-semibold text-white mb-2">{label}</p>
        {payload.map((p, i) => (
          <div key={i} className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span className="text-slate-400">{p.name}:</span>
            <span className="text-white font-medium">{p.value}</span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

function ScenarioTable({ scenarios }) {
  return (
    <div className="overflow-x-auto">
      <table className="data-table">
        <thead>
          <tr>
            <th>Scenario</th>
            <th>Revenue ($M)</th>
            <th>Profit ($M)</th>
            <th>Net Margin</th>
            <th>Monthly Churn</th>
            <th>Risk Score</th>
            <th>ROI (%)</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {scenarios.map((s, i) => (
            <tr key={s.name} className={i === OPTIMAL_IDX ? 'bg-cyan-400/5' : ''}>
              <td>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: COLORS[i] }} />
                  <span className="font-medium text-white">{s.name}</span>
                  {i === OPTIMAL_IDX && (
                    <span className="badge badge-info text-[9px] py-0.5 px-1.5">OPTIMAL</span>
                  )}
                </div>
              </td>
              <td className="font-mono">${s.revenue.toFixed(2)}M</td>
              <td className="font-mono text-emerald-400">${s.profit.toFixed(2)}M</td>
              <td className={s.margin > 24 ? 'text-emerald-400 font-semibold' : 'text-slate-400'}>{s.margin.toFixed(1)}%</td>
              <td className={s.churn > 3.0 ? 'text-rose-400' : 'text-slate-300'}>{s.churn.toFixed(2)}%/mo</td>
              <td>
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-white/5 rounded-full h-1.5 overflow-hidden">
                    <div className={`h-full rounded-full ${s.risk < 30 ? 'bg-emerald-500' : s.risk < 55 ? 'bg-amber-500' : 'bg-rose-500'}`}
                      style={{ width: `${s.risk}%` }} />
                  </div>
                  <span className="text-xs font-mono">{s.risk}</span>
                </div>
              </td>
              <td className="font-mono text-cyan-400">{s.roi > 0 ? `+${s.roi}%` : '—'}</td>
              <td>
                {i === OPTIMAL_IDX && <Star size={13} className="text-amber-400" />}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function ComparisonPage() {
  const location = useLocation()
  const simState = location.state?.sim
  const [activeTab, setActiveTab] = useState('profit')

  // Convert simulation data or use demo
  let scenarios = DEMO_SCENARIOS
  if (simState?.allScenarios?.length) {
    scenarios = simState.allScenarios.map((s, i) => ({
      name: ['Baseline', '+5%', '+7%', '+10%', '+15%'][i] || `+${s.price_change_percent}%`,
      pct: s.price_change_percent,
      revenue: (s.revenue?.new_revenue || 10_000_000) / 1_000_000,
      profit: (s.profit?.new_profit || 2_200_000) / 1_000_000,
      margin: s.profit?.new_margin || 22,
      churn: s.churn?.new_monthly_churn || 2.5,
      risk: s.risk?.composite_score || 30,
      roi: s.roi?.roi_percent || 0,
    }))
  }

  const tabs = [
    { key: 'profit', label: 'Profit Impact', icon: TrendingUp },
    { key: 'churn', label: 'Churn Risk', icon: Users },
    { key: 'risk', label: 'Risk Score', icon: ShieldCheck },
    { key: 'roi', label: 'ROI', icon: DollarSign },
  ]

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-950">
      <Header title="Scenario Comparison" subtitle="Side-by-side analysis across all price scenarios" />

      <div className="flex-1 overflow-auto p-6 space-y-5">
        {/* Optimal Highlight */}
        <div className="recommendation-card p-5 flex items-center justify-between">
          <div>
            <div className="text-xs text-cyan-400 font-semibold uppercase tracking-widest mb-1">Optimal Scenario</div>
            <div className="text-xl font-bold text-white">+7% Price Increase</div>
            <p className="text-sm text-slate-400 mt-1">Best balance of profit growth, churn risk, and ROI across 1,000 simulations</p>
          </div>
          <div className="flex gap-5 text-center">
            <div>
              <div className="text-2xl font-bold text-emerald-400">+23%</div>
              <div className="text-xs text-slate-500">Profit</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-cyan-400">191%</div>
              <div className="text-xs text-slate-500">ROI</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-400">LOW</div>
              <div className="text-xs text-slate-500">Risk</div>
            </div>
          </div>
        </div>

        {/* Chart Tabs */}
        <div className="glass-card p-5">
          <div className="flex gap-2 mb-5 flex-wrap">
            {tabs.map(t => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === t.key
                    ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-400/25'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <t.icon size={12} /> {t.label}
              </button>
            ))}
          </div>

          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={scenarios} barSize={36}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey={activeTab}
                name={activeTab === 'profit' ? 'Profit ($M)' : activeTab === 'churn' ? 'Churn (%)' : activeTab === 'risk' ? 'Risk Score' : 'ROI (%)'}
                radius={[4, 4, 0, 0]}
              >
                {scenarios.map((_, i) => (
                  <Cell key={i} fill={i === OPTIMAL_IDX ? '#22d3ee' : COLORS[i]} opacity={i === OPTIMAL_IDX ? 1 : 0.6} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Multi-line Revenue Chart */}
        <div className="glass-card p-5">
          <div className="text-sm font-semibold text-white mb-4">Revenue vs Profit by Scenario</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={scenarios} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="revenue" name="Revenue ($M)" fill="#6366f1" radius={[3, 3, 0, 0]} barSize={18} />
              <Bar dataKey="profit" name="Profit ($M)" fill="#22d3ee" radius={[3, 3, 0, 0]} barSize={18} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Data Table */}
        <div className="glass-card p-5">
          <div className="text-sm font-semibold text-white mb-4">Full Comparison Table</div>
          <ScenarioTable scenarios={scenarios} />
        </div>
      </div>
    </div>
  )
}
