/**
 * TwinMind AI - useSimulation Hook
 * Manages the full simulation workflow state
 */
import { useState, useCallback, useRef } from 'react'
import { createScenario, simulateScenario, pollScenario } from '../services/api'

const INITIAL_STATE = {
  status: 'idle', // idle | creating | running | completed | failed
  scenarioId: null,
  scenario: null,
  agentStatuses: {},
  simulationResults: null,
  allScenarios: [],
  agentResults: {},
  finalRecommendation: null,
  optimal: null,
  error: null,
  progress: 0,
}

const AGENTS = ['Scenario Manager', 'Finance', 'Sales', 'Marketing', 'HR', 'Supply Chain', 'Inventory', 'Risk', 'Executive']

export function useSimulation() {
  const [state, setState] = useState(INITIAL_STATE)
  const stopPollingRef = useRef(null)

  const updateState = useCallback((updates) => {
    setState((prev) => ({ ...prev, ...updates }))
  }, [])

  const calculateProgress = (agentStatuses) => {
    const completed = Object.values(agentStatuses).filter((s) => s === 'completed').length
    return Math.min(95, (completed / AGENTS.length) * 100)
  }

  const runSimulation = useCallback(async ({ question, priceChangePercent, name }) => {
    // Stop any existing poll
    if (stopPollingRef.current) stopPollingRef.current()

    updateState({ ...INITIAL_STATE, status: 'creating' })

    try {
      // 1. Create scenario
      const scenarioName = name || `${priceChangePercent}% Price Increase`
      const created = await createScenario({
        name: scenarioName,
        price_change_percent: priceChangePercent,
        duration_months: 12,
        description: question,
      })

      const scenarioId = created.scenario_id
      updateState({ scenarioId, scenario: created.scenario, status: 'running', progress: 5 })

      // 2. Kick off simulation
      await simulateScenario(scenarioId)

      // 3. Poll for results
      const stop = pollScenario(scenarioId, (data) => {
        const agentStatuses = data.agent_statuses || {}
        const progress = calculateProgress(agentStatuses)

        updateState({
          agentStatuses,
          progress,
          simulationResults: data.simulation_results || null,
          allScenarios: data.all_scenarios || [],
          agentResults: data.agent_results || {},
          finalRecommendation: data.final_recommendation || null,
          optimal: data.optimal || null,
          status: data.status === 'completed' ? 'completed'
            : data.status === 'failed' ? 'failed'
            : 'running',
          error: data.status === 'failed' ? 'Simulation failed. Please try again.' : null,
        })

        if (data.status === 'completed') {
          updateState({ progress: 100 })
        }
      })

      stopPollingRef.current = stop
    } catch (err) {
      updateState({ status: 'failed', error: err.message })
    }
  }, [updateState])

  const reset = useCallback(() => {
    if (stopPollingRef.current) stopPollingRef.current()
    setState(INITIAL_STATE)
  }, [])

  return {
    ...state,
    agents: AGENTS,
    runSimulation,
    reset,
  }
}
