import { createSimulation, getSimulation, getWeekData } from './engine/simulation'

const PORT = 9000

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}

function notFound(msg: string): Response {
  return json({ error: msg }, 404)
}

const server = Bun.serve({
  port: PORT,
  fetch(req) {
    const url = new URL(req.url)
    const path = url.pathname

    // CORS preflight
    if (req.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      })
    }

    // Health check
    if (path === '/health') {
      return json({ status: 'ok', service: 'culture-stream-backend', timestamp: new Date().toISOString() })
    }

    // POST /api/simulation/start
    if (path === '/api/simulation/start' && req.method === 'POST') {
      const sim = createSimulation()
      return json({
        simulation_id: sim.id,
        total_weeks: 8,
        week_1_data: sim.weeks[0],
      })
    }

    // GET /api/simulation/:id/week/:n
    const weekMatch = path.match(/^\/api\/simulation\/([^/]+)\/week\/(\d+)$/)
    if (weekMatch && req.method === 'GET') {
      const [, simId, weekStr] = weekMatch
      const week = parseInt(weekStr)
      const data = getWeekData(simId, week)
      if (!data) return notFound('Simulation or week not found')
      return json(data)
    }

    // GET /api/simulation/:id/narrative
    const narrativeMatch = path.match(/^\/api\/simulation\/([^/]+)\/narrative$/)
    if (narrativeMatch && req.method === 'GET') {
      const sim = getSimulation(narrativeMatch[1])
      if (!sim) return notFound('Simulation not found')
      return json({
        simulation_id: sim.id,
        total_weeks: 8,
        weeks: sim.weeks.map(w => ({
          week: w.week,
          status: w.status,
          diagnosis: w.diagnosis,
          mutations: w.mutations,
        })),
        summary: {
          mutations_detected: sim.weeks.reduce((sum, w) => sum + w.mutations.length, 0),
          critical_week: 5,
          recovery_start: 7,
          final_health_score: 0.85,
        },
      })
    }

    // GET /api/simulation/:id/stats
    const statsMatch = path.match(/^\/api\/simulation\/([^/]+)\/stats$/)
    if (statsMatch && req.method === 'GET') {
      const sim = getSimulation(statsMatch[1])
      if (!sim) return notFound('Simulation not found')
      return json({
        total_weeks: 8,
        mutations_detected: new Set(sim.weeks.flatMap(w => w.mutations.map(m => m.type))).size,
        critical_week: 5,
        recovery_start: 7,
        final_health_score: 0.85,
      })
    }

    return notFound('Route not found')
  },
})

console.log(`🌿 Culture Stream Backend`)
console.log(`📍 http://localhost:${server.port}`)
console.log(`✅ API ready`)
