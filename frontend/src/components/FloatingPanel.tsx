import type { WeekData, CultureState } from '../types'

interface Props {
  weekData: WeekData | null
  isRunning: boolean
  isPaused: boolean
  speed: number
  onStart: () => void
  onPause: () => void
  onReset: () => void
  onSpeedChange: (v: number) => void
}

const STATE_COLORS: Record<CultureState, string> = {
  healthy: '#2563eb',
  warning: '#eab308',
  critical: '#ef4444',
  recovery: '#2563eb',
}

export default function FloatingPanel({
  weekData, isRunning, isPaused, speed,
  onStart, onPause, onReset, onSpeedChange,
}: Props) {
  const state: CultureState = weekData?.state || weekData?.status || 'healthy'
  const color = weekData ? STATE_COLORS[state] : '#2563eb'

  return (
    <div style={styles.wrapper}>
      <div style={styles.pill}>
        {weekData && <span style={{ ...styles.dot, background: color }} />}
        {weekData && <span style={styles.week}>W{weekData.week}</span>}

        {!isRunning ? (
          <button onClick={onStart} style={{ ...styles.btn, background: '#2563eb', color: '#fff' }}>
            ▶ Start
          </button>
        ) : (
          <button
            onClick={onPause}
            style={{ ...styles.btn, background: isPaused ? '#2563eb' : '#555', color: '#fff' }}
          >
            {isPaused ? '▶' : '⏸'}
          </button>
        )}

        {isRunning && (
          <button onClick={onReset} style={styles.btn}>↺</button>
        )}

        {isRunning && (
          <div style={styles.speedWrap}>
            <input
              type="range" min={0.5} max={4} step={0.5} value={speed}
              onChange={e => onSpeedChange(parseFloat(e.target.value))}
              style={styles.slider}
              aria-label="Speed"
            />
            <span style={styles.speedLabel}>{speed}×</span>
          </div>
        )}
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    position: 'fixed',
    bottom: 24,
    left: 24,
    zIndex: 100,
    fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif',
  },
  pill: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '8px 16px',
    background: 'rgba(255,255,255,0.92)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid #e8e8e8',
    borderRadius: 50,
    boxShadow: '0 2px 20px rgba(0,0,0,0.06)',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    display: 'inline-block',
    flexShrink: 0,
  },
  week: {
    fontSize: 12,
    fontWeight: 600,
    color: '#555',
    letterSpacing: 0.3,
  },
  btn: {
    padding: '5px 12px',
    borderRadius: 8,
    border: '1px solid #e0e0e0',
    background: '#f5f5f5',
    fontSize: 12,
    fontWeight: 500,
    cursor: 'pointer',
    color: '#333',
    lineHeight: 1,
  },
  speedWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  },
  slider: {
    width: 60,
    height: 2,
    accentColor: '#2563eb',
  },
  speedLabel: {
    fontSize: 10,
    color: '#999',
    fontWeight: 500,
    minWidth: 22,
  },
}
