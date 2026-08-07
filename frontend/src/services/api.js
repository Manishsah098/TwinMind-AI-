/**
 * TwinMind AI - API Service
 * Centralized Axios instance for all backend calls
 */
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use((config) => {
  return config
}, (error) => Promise.reject(error))

// Response interceptor — normalize errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.detail || error.message || 'API error'
    console.error('[API Error]', message)
    return Promise.reject(new Error(message))
  }
)

// ============================================================
// Dashboard
// ============================================================
export const getDashboard = () => api.get('/api/dashboard')

// ============================================================
// Scenarios
// ============================================================
export const createScenario = (data) => api.post('/api/scenario/create', data)
export const simulateScenario = (scenario_id, company_override = null) =>
  api.post('/api/scenario/simulate', { scenario_id, company_override })
export const getScenario = (id) => api.get(`/api/scenario/${id}`)
export const listScenarios = () => api.get('/api/scenarios')

// ============================================================
// Agents
// ============================================================
export const runAgents = (data) => api.post('/api/agents/run', data)
export const getAgentsStatus = () => api.get('/api/agents/status')

// ============================================================
// Digital Twin
// ============================================================
export const getDigitalTwin = () => api.get('/api/digital-twin')

// ============================================================
// Recommendation
// ============================================================
export const getRecommendation = (id) => api.get(`/api/recommendation/${id}`)

// ============================================================
// Company
// ============================================================
export const resetCompany = () => api.post('/api/company/reset')

// ============================================================
// Utility: Poll scenario until completed
// ============================================================
export const pollScenario = (id, onUpdate, intervalMs = 800) => {
  const timer = setInterval(async () => {
    try {
      const data = await getScenario(id)
      onUpdate(data)
      if (data.status === 'completed' || data.status === 'failed') {
        clearInterval(timer)
      }
    } catch (err) {
      console.error('[Poll] Error', err)
    }
  }, intervalMs)
  return () => clearInterval(timer)
}

export default api
