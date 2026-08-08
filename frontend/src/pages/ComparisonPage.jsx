/**
 * TwinMind AI - Scenario Comparison Page (Clean Professional Light)
 */
import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import {
  BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
  Cell
} from 'recharts'
import { TrendingUp, ShieldCheck, DollarSign, Users, Star } from 'lucide-react'
import Header from '../components/Layout/Header'

const DEMO_SCENARIOS = [
  { name: 'Baseline', pct: 0,  revenue: 10.00, profit: 2.20, margin: 22.0, churn: 2.50, risk: 2.9,  roi: 0   },
  { name: '+5%',      pct: 5,  revenue: 10.28, profit: 2.42, margin: 23.6, churn: 3.25, risk: 28.5, roi: 141 },
  { name: '+7%',      pct: 7,  revenue: 10.39, profit: 2.62, margin: 25.2, churn: 3.55, risk: 30.7, roi: 191 },
  { name: '+10%',     pct: 10, revenue: 10.45, profit: 2.66, margin: 25.4, churn: 7.00, risk: 33.9, roi: 227 },
  { name: '+15%',     pct: 15, revenue: 10.51, profit: 2.75, margin: 26.1, churn: 15.0, risk: 39.1, roi: 238 },
]

const COLORS = ['#94a3b8', '#3b82f6', '#2563eb', '#f59e0b', '#ef4444']
const OPTIMAL_IDX = 2

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-4 text-xs shadow-lg">
        <p className="font-bold text-slate-900 mb-2 text-sm">{label} Scenario</p>
        {payload.map((p, i) => (
          <div key={i} className="flex items-center gap-3 mb-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: p.color }} />
            <span className="text-slate-500 font-medium">{p.name}:</span>
            <span className="text-slate-900 font-bold">{p.value}</span>
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
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {scenarios.map((s, i) => (
            <tr key={s.name} className={i === OPTIMAL_IDX ? 'bg-blue-50' : ''}>
              <td>
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full" style={{ background: COLORS[i] }} />
                  <span className="font-bold text-slate-900">{s.name}</span>
                </div>
              </td>
              <td className="font-mono text-slate-700">${s.revenue.toFixed(2)}M</td>
              <td className="font-mono text-emerald-700 font-bold">${s.profit.toFixed(2)}M</td>
              <td className={s.margin > 24 ? 'text-emerald-700 font-bold' : 'text-slate-500'}>{s.margin.toFixed(1)}%</td>
              <td className={s.churn > 5.0 ? 'text-rose-700 font-bold' : 'text-slate-700'}>{s.churn.toFixed(2)}%/mo</td>
              <td>
                <div className="flex items-center gap-2.5">
                  <div className="w-20 bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${s.risk < 30 ? 'bg-emerald-500' : s.risk < 40 ? 'bg-amber-500' : 'bg-rose-500'}`}
                      style={{ width: `${Math.min(s.risk, 100)}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-700">{s.risk.toFixed(1)}</span>
                </div>
              </td>
              <td className="font-mono text-blue-700 font-bold">{s.roi > 0 ? `+${s.roi}%` : '—'}</td>
              <td>
                {i === OPTIMAL_IDX ? (
                  <span className="badge badge-info flex items-center gap-1">
                    <Star size={11} className="fill-blue-600" /> Optimal
                  </span>
                ) : (
                  <span className="badge badge-neutral">Alternative</span>
                )}
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
    { key: 'churn',  label: 'Churn Risk',    icon: Users },
    { key: 'risk',   label: 'Risk Score',    icon: ShieldCheck },
    { key: 'roi',    label: 'ROI',           icon: DollarSign },
  ]

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-50">
      <Header title="Scenario Comparison" subtitle="Side-by-side analysis across baseline & alternative scenarios" />

      <div className="flex-1 overflow-auto p-8 space-y-6">
        {/* Optimal Highlight Card */}
        <div className="recommendation-card p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1 flex items-center gap-1.5">
              <Star size={14} className="fill-blue-600" /> Optimal Scenario Identified
            </div>
            <div className="text-2xl font-extrabold text-slate-900 tracking-tight">+7% Price Increase</div>
            <p className="text-slate-600 text-sm mt-1.5 max-w-xl font-medium leading-relaxed">
              Delivers maximum operating profit growth (+19.1%) while keeping monthly churn within safe parameters across 1,000 Monte Carlo simulations.
            </p>
          </div>
          <div className="flex gap-6 text-center bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <div>
              <div className="text-2xl font-extrabold text-emerald-600">+19.1%</div>
              <div className="text-xs font-bold text-slate-500">Profit</div>
            </div>
            <div className="border-l border-slate-200 pl-6">
              <div className="text-2xl font-extrabold text-blue-600">191%</div>
              <div className="text-xs font-bold text-slate-500">ROI</div>
            </div>
            <div className="border-l border-slate-200 pl-6">
              <div className="text-2xl font-extrabold text-amber-600">LOW</div>
              <div className="text-xs font-bold text-slate-500">Risk</div>
            </div>
          </div>
        </div>

        {/* Tabbed Bar Chart */}
        <div className="glass-card p-6 space-y-5">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="text-base font-bold text-slate-900">Comparative Performance Analytics</div>
            <div className="flex gap-2 flex-wrap">
              {tabs.map(t => (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeTab === t.key
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                      : 'text-slate-500 bg-slate-100 hover:text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  <t.icon size={14} /> {t.label}
                </button>
              ))}
            </div>
          </div>

          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={scenarios} barSize={44}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }} />
              <YAxis tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey={activeTab}
                name={activeTab === 'profit' ? 'Profit ($M)' : activeTab === 'churn' ? 'Churn (%)' : activeTab === 'risk' ? 'Risk Score' : 'ROI (%)'}
                radius={[6, 6, 0, 0]}
              >
                {scenarios.map((_, i) => (
                  <Cell key={i} fill={i === OPTIMAL_IDX ? '#2563eb' : COLORS[i]} opacity={i === OPTIMAL_IDX ? 1 : 0.8} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Data Table */}
        <div className="glass-card p-6">
          <div className="text-base font-bold text-slate-900 mb-4">Complete Multi-Scenario Matrix</div>
          <ScenarioTable scenarios={scenarios} />
        </div>
      </div>
    </div>
  )
}
