/**
 * TwinMind AI - Sidebar Navigation
 */
import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  FlaskConical,
  Bot,
  Network,
  BarChart3,
  Lightbulb,
  Zap,
  Brain
} from 'lucide-react'

const NAV_ITEMS = [
  { path: '/',           label: 'Dashboard',       icon: LayoutDashboard },
  { path: '/simulator',  label: 'Scenario Simulator', icon: FlaskConical },
  { path: '/agents',     label: 'Agent Monitor',   icon: Bot },
  { path: '/twin',       label: 'Digital Twin',    icon: Network },
  { path: '/comparison', label: 'Scenario Compare', icon: BarChart3 },
  { path: '/recommendation', label: 'Recommendation', icon: Lightbulb },
]

export default function Sidebar() {
  return (
    <aside className="w-56 flex-shrink-0 flex flex-col bg-slate-900 border-r border-white/5 min-h-screen">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center">
            <Brain size={16} className="text-white" />
          </div>
          <div>
            <div className="text-sm font-bold text-white tracking-tight">TwinMind AI</div>
            <div className="text-[10px] text-slate-500 font-medium tracking-widest uppercase">Decision Intelligence</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <div className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest px-2 mb-2">Platform</div>
        {NAV_ITEMS.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            <Icon size={15} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] text-slate-500">Demo Mode Active</span>
        </div>
        <div className="mt-1 text-[10px] text-slate-600">DemoCorp · v1.0.0</div>
      </div>
    </aside>
  )
}
