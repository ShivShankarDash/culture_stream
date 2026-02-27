import type { WeekData, CultureState, Metrics } from '../types'

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

interface MetricDef {
  key: keyof Metrics
  label: string
  format: (v: number) => string
  barValue: (v: number) => number  // 0-1 for progress bar
  warnWhen: (v: number) => boolean
}

// Negative metrics should be moderated — don't show 100% when state is blue/yellow
const METRIC_DEFS: MetricDef[] = [
  { key: 'silos', label: 'Silos', format: v => capMetric(v).toFixed(2), barValue: v => clamp01(capMetric(v)), warnWhen: v => v > 0.25 },
  { key: 'sentiment', label: 'Sentiment', format: v => v.toFixed(2), barValue: v => clamp01(v), warnWhen: v => v < 0.55 },
  { key: 'response_time', label: 'Resp Time', format: v => v.toFixed(1) + 'h', barValue: v => clamp01(v / 12), warnWhen: v => v > 5 },
  { key: 'burnout_risk', label: 'Burnout', format: v => capMetric(v).toFixed(2), barValue: v => clamp01(capMetric(v)), warnWhen: v => v > 0.3 },
  { key: 'crossTeamPercentage', label: 'Cross-Team', format: v => clampPct(v), barValue: v => clamp01(v), warnWhen: v => v < 0.25 },
  { key: 'lateNightPercentage', label: 'Late Night', format: v => clampPct(capMetric(v)), barValue: v => clamp01(capMetric(v)), warnWhen: v => v > 0.1 },
  { key: 'blameScore', label: 'Blame', format: v => capMetric(v).toFixed(2), barValue: v => clamp01(capMetric(v)), warnWhen: v => v > 0.3 },
  { key: 'trustScore', label: 'Trust', format: v => v.toFixed(2), barValue: v => clamp01(v), warnWhen: () => false },
  { key: 'productivity', label: 'Productivity', format: v => v.toFixed(2), barValue: v => clamp01(v), warnWhen: () => false },
  { key: 'wlb', label: 'WLB', format: v => v.toFixed(2), barValue: v => clamp01(v), warnWhen: () => false },
  { key: 'workSatisfaction', label: 'Satisfaction', format: v => v.toFixed(2), barValue: v => clamp01(v), warnWhen: () => false },
]

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v))
}

// Cap negative metrics so they don't hit 100% — max out at ~0.75 even in worst case
function capMetric(v: number): number {
  return Math.max(0, Math.min(0.75, v))
}

function clampPct(v: number): string {
  return Math.round(Math.max(0, Math.min(1, v)) * 100) + '%'
}

export default function FloatingPanel({
  weekData, isRunning, isPaused, speed,
  onStart, onPause, onReset, onSpeedChange,
}: Props) {
  const state: CultureState = weekData?.state || weekData?.status || 'healthy'
  const color = weekData ? STATE_COLORS[state] : '#2563eb'
  const metrics = weekData?.metrics

  return (
    <div style={styles.wrapper}>
      {/* Controls pill */}
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

      {/* Metrics strip with progress bars */}
      {metrics && (
        <div style={styles.metricsStrip}>
          {METRIC_DEFS.map(def => {
            const raw = metrics[def.key]
            const warn = def.warnWhen(raw)
            const barW = def.barValue(raw)
            return (
              <div key={def.key} style={styles.metricItem}>
                <div style={styles.metricTop}>
                  <span style={styles.metricLabel}>{def.label}</span>
                  <span style={{ ...styles.metricValue, color: warn ? '#ff6b6b' : '#fff' }}>
                    {def.format(raw)}
                  </span>
                </div>
                <div style={styles.barBg}>
                  <div style={{
                    ...styles.barFill,
                    width: `${barW * 100}%`,
                    background: warn ? '#ef4444' : color,
                  }} />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}


const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    position: 'fixed',
    bottom: 16,
    left: 16,
    zIndex: 100,
    fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    maxWidth: 'calc(100vw - 32px)',
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
    width: 'fit-content',
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
  metricsStrip: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: 4,
    padding: '10px 12px',
    background: 'linear-gradient(145deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 14,
    boxShadow: '0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)',
  },
  metricItem: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 3,
    padding: '2px 5px',
    minWidth: 68,
    flex: '0 0 auto',
  },
  metricTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    gap: 4,
  },
  metricLabel: {
    fontSize: 8,
    fontWeight: 500,
    color: 'rgba(255,255,255,0.5)',
    textTransform: 'uppercase' as const,
    letterSpacing: 0.3,
  },
  metricValue: {
    fontSize: 10,
    fontWeight: 600,
    lineHeight: 1,
    fontVariantNumeric: 'tabular-nums',
    color: '#fff',
  },
  barBg: {
    height: 3,
    borderRadius: 2,
    background: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 2,
    transition: 'width 1.5s ease, background 1.5s ease',
  },
}
