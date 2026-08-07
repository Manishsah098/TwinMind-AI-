/**
 * TwinMind AI - Header Bar
 */
import { Clock, ShieldCheck, Zap, Activity } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function Header({ title, subtitle }) {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-dark-900/60 backdrop-blur-xl flex-shrink-0 relative z-10">
      <div>
        <h1 className="text-base font-bold text-white tracking-tight">{title}</h1>
        {subtitle && <p className="text-xs text-slate-400 font-medium">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-slate-400 text-xs font-mono bg-white/3 px-3 py-1.5 rounded-lg border border-white/5">
          <Clock size={13} className="text-cyan-400" />
          <span>{time.toLocaleTimeString()}</span>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
          <ShieldCheck size={14} />
          <span>Monte Carlo Engine Live</span>
        </div>

        <div className="flex items-center gap-3 border-l border-white/10 pl-5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center text-xs font-extrabold text-white shadow-glow-cyan">
            CEO
          </div>
          <div className="hidden sm:block">
            <div className="text-xs font-bold text-white">Executive View</div>
            <div className="text-[10px] text-slate-500 font-medium">DemoCorp HQ</div>
          </div>
        </div>
      </div>
    </header>
  )
}
