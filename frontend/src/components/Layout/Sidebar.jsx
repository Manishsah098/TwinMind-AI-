/**
 * TwinMind AI - Sidebar Navigation (Sleek Dark Navy / Light Contrast)
 */
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  FlaskConical,
  Bot,
  Network,
  BarChart3,
  Lightbulb,
  Brain,
  Sparkles
} from 'lucide-react'

const NAV_ITEMS = [
  { path: '/',           label: 'Dashboard',          icon: LayoutDashboard },
  { path: '/simulator',  label: 'Scenario Simulator',  icon: FlaskConical },
  { path: '/agents',     label: 'Agent Monitor',      icon: Bot },
  { path: '/twin',       label: 'Digital Twin',       icon: Network },
  { path: '/comparison', label: 'Scenario Compare',    icon: BarChart3 },
  { path: '/recommendation', label: 'Executive Rec',  icon: Lightbulb },
]

export default function Sidebar() {
  return (
    <aside className="w-60 flex-shrink-0 flex flex-col bg-slate-900 border-r border-slate-800 min-h-screen relative z-20 shadow-xl">
      {/* Brand Logo */}
      <div className="px-6 py-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Brain size={20} className="text-white" />
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-900" />
          </div>
          <div>
            <div className="text-base font-extrabold text-white tracking-tight flex items-center gap-1.5">
              TwinMind <span className="text-blue-400">AI</span>
            </div>
            <div className="text-[10px] text-slate-400 font-semibold tracking-widest uppercase">Decision Intelligence</div>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1.5">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-3">Enterprise Suite</div>
        {NAV_ITEMS.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom Status Card */}
      <div className="p-4 m-4 rounded-xl bg-slate-800/80 border border-slate-700/80">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles size={12} /> Live Twin Active
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </div>
        <div className="text-[11px] text-slate-300 leading-relaxed font-medium">
          DemoCorp Digital Twin · 8 AI Agents
        </div>
      </div>
    </aside>
  )
}
