const API_BASE = '/api'

export async function startSimulation(): Promise<{ simulation_id: string; total_weeks: number; week_1_data: unknown }> {
  const res = await fetch(`${API_BASE}/simulation/start`, { method: 'POST' })
  if (!res.ok) throw new Error('Failed to start simulation')
  return res.json()
}

export async function getWeekData(simId: string, week: number): Promise<Record<string, unknown>> {
  const res = await fetch(`${API_BASE}/simulation/${simId}/week/${week}`)
  if (!res.ok) throw new Error(`Failed to fetch week ${week}`)
  return res.json()
}
