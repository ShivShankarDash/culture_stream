import { useState, useRef, useCallback, useEffect } from 'react'
import TimelineCanvas from './components/TimelineCanvas'
import FloatingPanel from './components/FloatingPanel'
import DiagnosticsDrawer, { DRAWER_WIDTH } from './components/DiagnosticsDrawer'
import { startSimulation as apiStart, getWeekData } from './api/client'
import WEEK_DATA from './data/weekData'
import type { WeekData } from './types'

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

  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

  // Track window size
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
    } catch {
      console.warn('Backend unavailable, using mock data')
    }

    for (let week = 1; week <= 8; week++) {
      if (!runningRef.current) break
      while (pausedRef.current && runningRef.current) await sleep(100)
      if (!runningRef.current) break

      let data: WeekData
      if (simId) {
        try {
          const raw = await getWeekData(simId, week) as Record<string, any>
          data = {
            week: raw.week,
            state: raw.status,
            metrics: {
              silos: raw.metrics.silosScore,
              sentiment: raw.metrics.sentiment,
              response_time: raw.metrics.responseTimeHours,
              burnout_risk: raw.metrics.burnoutRisk,
            },
            mutations: raw.mutations || [],
            diagnosis: raw.diagnosis,
            sampleMessages: raw.sampleMessages || [],
            root_cause: raw.diagnosis?.current || '',
            suggestion: raw.diagnosis?.suggestion || '',
            messageCount: raw.messageCount,
          }
        } catch {
          data = WEEK_DATA[week - 1]
        }
      } else {
        data = WEEK_DATA[week - 1]
      }

      setWeekData(data)
      await sleep(7000 / speedRef.current)
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
  }

  // Canvas adapts: full width when drawer closed, shrinks when open
  const canvasWidth = drawerOpen ? viewSize.w - DRAWER_WIDTH : viewSize.w
  const canvasHeight = viewSize.h

  return (
    <>
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: canvasWidth,
        height: canvasHeight,
        transition: 'width 0.4s cubic-bezier(0.4,0,0.2,1)',
        overflow: 'hidden',
      }}>
        <TimelineCanvas
          weekData={weekData}
          width={canvasWidth}
          height={canvasHeight}
        />
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
    </>
  )
}
