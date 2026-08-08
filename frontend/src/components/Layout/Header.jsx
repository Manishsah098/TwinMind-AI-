/**
 * TwinMind AI - Header Bar (Clean Professional Light)
 */
import { Clock, ShieldCheck } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function Header({ title, subtitle }) {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <header className="h-16 border-b border-slate-200 flex items-center justify-between px-8 bg-white/90 backdrop-blur-md flex-shrink-0 relative z-10 shadow-sm">
      <div>
        <h1 className="text-base font-bold text-slate-900 tracking-tight">{title}</h1>
        {subtitle && <p className="text-xs text-slate-500 font-medium">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2 text-slate-600 text-xs font-mono bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 font-semibold">
          <Clock size={13} className="text-blue-600" />
          <span>{time.toLocaleTimeString()}</span>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
          <ShieldCheck size={14} className="text-emerald-600" />
          <span>Monte Carlo Engine Live</span>
        </div>

        <div className="flex items-center gap-3 border-l border-slate-200 pl-5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-xs font-extrabold text-white shadow-md">
            CEO
          </div>
          <div className="hidden sm:block">
            <div className="text-xs font-bold text-slate-900">Executive View</div>
            <div className="text-[10px] text-slate-500 font-medium">DemoCorp HQ</div>
          </div>
        </div>
      </div>
    </header>
  )
}
