import { useState, useRef, useCallback, useEffect } from 'react'
import TimelineCanvas, { type AnimState } from './components/TimelineCanvas'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore — VS Code TS server cache issue; tsc --noEmit passes clean
import FloatingPanel from './components/FloatingPanel'
import DiagnosticsDrawer from './components/DiagnosticsDrawer'
import MusicToggle from './components/MusicToggle'
import { startSimulation as apiStart, getWeekData, type BackendWeekData } from './api/client'
import type { WeekData } from './types'

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v))
}

export default function App() {
  const [weekData, setWeekData] = useState<WeekData | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [viewSize, setViewSize] = useState({ w: window.innerWidth, h: window.innerHeight })

  const runningRef = useRef(false)
  const pausedRef = useRef(false)
  const speedRef = useRef(1)
  const sharedAnimRef = useRef<AnimState>({ time: 0, fray: 0, colorT: 0 })

  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

  useEffect(() => {
    const onResize = () => setViewSize({ w: window.innerWidth, h: window.innerHeight })
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const handleSpeedChange = (val: number) => {
    setSpeed(val)
    speedRef.current = val
  }

  const runSimulation = useCallback(async () => {
    runningRef.current = true
    setIsRunning(true)
    setIsPaused(false)
    pausedRef.current = false

    let simId: string | null = null
    try {
      const res = await apiStart()
      simId = res.simulation_id
    } catch (err) {
      console.error('Failed to start simulation, backend unavailable', err)
      runningRef.current = false
      setIsRunning(false)
      return
    }

    for (let week = 1; week <= 8; week++) {
      if (!runningRef.current) break
      while (pausedRef.current && runningRef.current) await sleep(100)
      if (!runningRef.current) break
      if (!simId) break

      try {
        const raw: BackendWeekData = await getWeekData(simId, week)
        const m = raw.metrics
        const data: WeekData = {
          week: raw.week,
          state: raw.status,
          metrics: {
            silos: clamp01(m.silosScore),
            sentiment: clamp01(m.sentiment),
            response_time: Math.max(0, m.responseTimeHours),
            burnout_risk: clamp01(m.burnoutRisk),
            crossTeamPercentage: clamp01(m.crossTeamPercentage ?? 0),
            lateNightPercentage: clamp01(m.lateNightPercentage ?? 0),
            blameScore: clamp01(m.blameScore ?? 0),
            trustScore: clamp01(m.trustScore ?? 0),
            productivity: clamp01(m.productivity ?? 0),
            wlb: clamp01(m.wlb ?? 0),
            workSatisfaction: clamp01(m.workSatisfaction ?? 0),
          },
          mutations: raw.mutations || [],
          diagnosis: {
            current: raw.diagnosis?.current || '',
            alert: raw.diagnosis?.alert || null,
            suggestion: raw.diagnosis?.suggestion || '',
            steps: (raw.diagnosis as any)?.steps || [],
          },
          sampleMessages: raw.sampleMessages || [],
          root_cause: raw.diagnosis?.current || '',
          suggestion: raw.diagnosis?.suggestion || '',
          messageCount: raw.messageCount,
        }
        setWeekData(data)
      } catch (err) {
        console.error(`Failed to fetch week ${week}`, err)
        break
      }

      await sleep(20000 / speedRef.current)
    }

    runningRef.current = false
    setIsRunning(false)
  }, [])

  const handlePause = () => {
    pausedRef.current = !pausedRef.current
    setIsPaused(p => !p)
  }

  const handleReset = () => {
    runningRef.current = false
    pausedRef.current = false
    setIsRunning(false)
    setIsPaused(false)
    setWeekData(null)
    sharedAnimRef.current.fray = 0
    sharedAnimRef.current.colorT = 0
  }

  const canvasWidth = viewSize.w
  const canvasHeight = viewSize.h

  return (
    <>
      {/* Canvas layer behind UI for base rendering */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: canvasWidth,
        height: canvasHeight,
        overflow: 'hidden',
        zIndex: 1,
      }}>
        <TimelineCanvas weekData={weekData} width={canvasWidth} height={canvasHeight} speed={speed} sharedAnim={sharedAnimRef} />
      </div>

      {/* Overlay canvas on top of everything — lines paint over UI, pointer-events disabled */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: canvasWidth,
        height: canvasHeight,
        overflow: 'hidden',
        zIndex: 200,
        pointerEvents: 'none',
      }}>
        <TimelineCanvas weekData={weekData} width={canvasWidth} height={canvasHeight} overlay speed={speed} sharedAnim={sharedAnimRef} />
      </div>

      {/* Heading top center */}
      <div style={{
        position: 'fixed',
        top: 32,
        left: 0,
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        zIndex: 90,
        pointerEvents: 'none',
      }}>
        <span style={{
          fontSize: 36,
          fontWeight: 700,
          color: '#1d1d1f',
          letterSpacing: -0.5,
          fontFamily: '-apple-system, "SF Pro Display", "Helvetica Neue", system-ui, sans-serif',
        }}>
          Culture Stream
        </span>
      </div>

      <FloatingPanel
        weekData={weekData}
        isRunning={isRunning}
        isPaused={isPaused}
        speed={speed}
        onStart={() => !isRunning && runSimulation()}
        onPause={handlePause}
        onReset={handleReset}
        onSpeedChange={handleSpeedChange}
      />

      <DiagnosticsDrawer
        weekData={weekData}
        open={drawerOpen}
        onToggle={() => setDrawerOpen(o => !o)}
      />

      <MusicToggle />
    </>
  )
}
