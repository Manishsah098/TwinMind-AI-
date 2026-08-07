/**
 * TwinMind AI - Top Header Bar
 */
import { Clock, Wifi, WifiOff } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function Header({ title, subtitle }) {
  const [time, setTime] = useState(new Date())
  const [connected, setConnected] = useState(true)

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <header className="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-slate-900/50 backdrop-blur-sm flex-shrink-0">
      <div>
        <h1 className="text-sm font-semibold text-white">{title}</h1>
        {subtitle && <p className="text-[11px] text-slate-500">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-slate-500 text-xs">
          <Clock size={12} />
          <span className="font-mono">{time.toLocaleTimeString()}</span>
        </div>
        <div className={`flex items-center gap-1.5 text-xs ${connected ? 'text-emerald-400' : 'text-rose-400'}`}>
          {connected ? <Wifi size={12} /> : <WifiOff size={12} />}
          <span>{connected ? 'Connected' : 'Offline'}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center text-[10px] font-bold text-white">
            CEO
          </div>
        </div>
      </div>
    </header>
  )
}
