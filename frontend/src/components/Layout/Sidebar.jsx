/**
 * TwinMind AI - Sidebar Navigation
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
  Sparkles,
  ShieldAlert
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
    <aside className="w-60 flex-shrink-0 flex flex-col bg-dark-900 border-r border-white/5 min-h-screen relative z-20">
      {/* Brand Logo */}
      <div className="px-6 py-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 via-blue-600 to-indigo-600 flex items-center justify-center shadow-glow-cyan">
            <Brain size={20} className="text-white" />
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-cyan-400 border-2 border-dark-900 animate-ping" />
          </div>
          <div>
            <div className="text-base font-extrabold text-white tracking-tight flex items-center gap-1.5">
              TwinMind <span className="text-cyan-400">AI</span>
            </div>
            <div className="text-[10px] text-slate-500 font-semibold tracking-widest uppercase">Decision Intelligence</div>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1.5">
        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-3">Enterprise Core</div>
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
      <div className="p-4 m-4 rounded-xl bg-gradient-to-br from-cyan-950/40 to-slate-900 border border-cyan-500/20 backdrop-blur-md">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles size={12} /> Autonomous Mode
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </div>
        <div className="text-[11px] text-slate-400 leading-relaxed">
          DemoCorp Digital Twin Active · 8 AI Agents Standby
        </div>
      </div>
    </aside>
  )
}
