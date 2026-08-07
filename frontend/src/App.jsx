import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Sidebar from './components/Layout/Sidebar'
import DashboardPage from './pages/DashboardPage'
import SimulatorPage from './pages/SimulatorPage'
import AgentMonitorPage from './pages/AgentMonitorPage'
import DigitalTwinPage from './pages/DigitalTwinPage'
import ComparisonPage from './pages/ComparisonPage'
import RecommendationPage from './pages/RecommendationPage'

export default function App() {
  return (
    <Router>
      <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 font-sans antialiased">
        <Sidebar />
        <main className="flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden relative">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/simulator" element={<SimulatorPage />} />
            <Route path="/agents" element={<AgentMonitorPage />} />
            <Route path="/twin" element={<DigitalTwinPage />} />
            <Route path="/comparison" element={<ComparisonPage />} />
            <Route path="/recommendation" element={<RecommendationPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}
