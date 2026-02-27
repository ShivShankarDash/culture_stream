import { useRef, useEffect } from 'react'
import anime from 'animejs'
import type { WeekData, CultureState } from '../types'

interface Props {
  weekData: WeekData | null
  open: boolean
  onToggle: () => void
}

const STATE_COLORS: Record<CultureState, string> = {
  healthy: '#2563eb',
  warning: '#eab308',
  critical: '#ef4444',
  recovery: '#2563eb',
}

const DRAWER_WIDTH = 360

export { DRAWER_WIDTH }

export default function DiagnosticsDrawer({ weekData, open, onToggle }: Props) {
  const drawerRef = useRef<HTMLDivElement>(null)
  const state: CultureState = weekData?.state || weekData?.status || 'healthy'
  const color = weekData ? STATE_COLORS[state] : '#2563eb'
  const mutations = weekData?.mutations || []
  const metrics = weekData?.metrics

  useEffect(() => {
    if (!drawerRef.current) return
    anime({
      targets: drawerRef.current,
      translateX: open ? 0 : DRAWER_WIDTH,
      duration: 400,
      easing: 'easeOutCubic',
    })
  }, [open])

  return (
    <>
      {/* Toggle pill top-right */}
      <button
        onClick={onToggle}
        style={{
          ...styles.tab,
          right: open ? DRAWER_WIDTH + 16 : 16,
        }}
        aria-label={open ? 'Close panel' : 'Open panel'}
      >
        <span style={{ ...styles.tabDot, background: color }} />
        <span style={styles.tabLabel}>{open ? '✕' : 'Stats'}</span>
      </button>

      {/* Drawer */}
      <div
        ref={drawerRef}
        style={{
          ...styles.drawer,
          transform: `translateX(${open ? 0 : DRAWER_WIDTH}px)`,
        }}
      >
        <div style={styles.header}>
          <span style={styles.title}>
            {weekData ? `Week ${weekData.week}` : 'Stats & Diagnostics'}
          </span>
          {weekData && (
            <span style={{ ...styles.badge, background: color }}>
              {state}
            </span>
          )}
        </div>

        <div style={styles.body}>
          {!weekData && (
            <p style={styles.empty}>Run the simulation to see real-time data</p>
          )}

          {/* ===== STATS SECTION ===== */}
          {weekData && (
            <div style={styles.group}>
              <div style={styles.groupTitle}>Stats</div>

              {/* Metrics */}
              {metrics && (
                <div style={styles.section}>
                  <div style={styles.sectionTitle}>Metrics</div>
                  <div style={styles.metricGrid}>
                    <MetricCard label="Silos" value={metrics.silos} warn={metrics.silos > 0.25} color={color} />
                    <MetricCard label="Sentiment" value={metrics.sentiment} warn={metrics.sentiment < 0.55} color={color} />
                    <MetricCard label="Response" value={metrics.response_time} suffix="h" warn={metrics.response_time > 5} color={color} />
                    <MetricCard label="Burnout" value={metrics.burnout_risk} warn={metrics.burnout_risk > 0.3} color={color} />
                  </div>
                </div>
              )}

              {/* Mutations */}
              {mutations.length > 0 && (
                <div style={styles.section}>
                  <div style={styles.sectionTitle}>Active Mutations</div>
                  {mutations.map((m, i) => (
                    <div key={i} style={styles.mutRow}>
                      <span style={{
                        ...styles.mutBadge,
                        background: m.severity === 'critical' ? '#fef2f2' : '#fffbeb',
                        color: m.severity === 'critical' ? '#ef4444' : '#d97706',
                      }}>
                        {m.severity}
                      </span>
                      <span style={styles.mutMsg}>{m.message}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Activity */}
              {weekData.messageCount && (
                <div style={styles.section}>
                  <div style={styles.sectionTitle}>Activity</div>
                  <p style={styles.stat}>{weekData.messageCount} messages this week</p>
                </div>
              )}
            </div>
          )}

          {/* ===== DIAGNOSTICS SECTION ===== */}
          {weekData && (
            <div style={styles.group}>
              <div style={styles.groupTitle}>Diagnostics</div>

              {weekData.diagnosis && (
                <div style={styles.section}>
                  <p style={styles.diagText}>{weekData.diagnosis.current}</p>
                  {weekData.diagnosis.alert && (
                    <p style={styles.alert}>⚠ {weekData.diagnosis.alert}</p>
                  )}
                  {weekData.diagnosis.suggestion && (
                    <p style={styles.suggestion}>→ {weekData.diagnosis.suggestion}</p>
                  )}
                </div>
              )}

              {!weekData.diagnosis && weekData.root_cause && (
                <div style={styles.section}>
                  <p style={styles.diagText}>{weekData.root_cause}</p>
                  {weekData.suggestion && (
                    <p style={styles.suggestion}>→ {weekData.suggestion}</p>
                  )}
                </div>
              )}

              {!weekData.diagnosis && !weekData.root_cause && (
                <p style={styles.emptySmall}>No issues detected</p>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

function MetricCard({ label, value, suffix, warn, color }: {
  label: string; value: number; suffix?: string; warn: boolean; color: string
}) {
  const display = typeof value === 'number' ? value.toFixed(2) : value
  return (
    <div style={styles.metricCard}>
      <div style={{ ...styles.metricBar, background: warn ? '#fee2e2' : '#eff6ff' }}>
        <div style={{
          ...styles.metricFill,
          width: `${Math.min(Math.abs(typeof value === 'number' ? value : 0) * 100, 100)}%`,
          background: warn ? '#ef4444' : color,
        }} />
      </div>
      <div style={styles.metricInfo}>
        <span style={{ ...styles.metricVal, color: warn ? '#ef4444' : '#111' }}>
          {display}{suffix || ''}
        </span>
        <span style={styles.metricLabel}>{label}</span>
      </div>
    </div>
  )
}


const styles: Record<string, React.CSSProperties> = {
  tab: {
    position: 'fixed',
    top: 16,
    zIndex: 110,
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '6px 14px',
    background: 'rgba(255,255,255,0.92)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid #e8e8e8',
    borderRadius: 50,
    cursor: 'pointer',
    boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
    transition: 'right 0.4s cubic-bezier(0.4,0,0.2,1)',
    fontFamily: '-apple-system, system-ui, sans-serif',
  },
  tabDot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    display: 'block',
    flexShrink: 0,
  },
  tabLabel: {
    fontSize: 11,
    color: '#666',
    fontWeight: 500,
    letterSpacing: 0.3,
  },
  drawer: {
    position: 'fixed',
    top: 0,
    right: 0,
    width: DRAWER_WIDTH,
    height: '100vh',
    background: 'rgba(255,255,255,0.96)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    borderLeft: '1px solid #f0f0f0',
    boxShadow: '-4px 0 30px rgba(0,0,0,0.06)',
    zIndex: 105,
    display: 'flex',
    flexDirection: 'column',
    fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif',
    overflowY: 'auto',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '20px 20px 16px',
    borderBottom: '1px solid #f5f5f5',
  },
  title: {
    fontSize: 15,
    fontWeight: 600,
    color: '#111',
    flex: 1,
  },
  badge: {
    fontSize: 10,
    fontWeight: 600,
    padding: '3px 10px',
    borderRadius: 20,
    color: '#fff',
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  },
  body: {
    padding: '8px 20px 24px',
    flex: 1,
  },
  empty: {
    fontSize: 13,
    color: '#bbb',
    textAlign: 'center' as const,
    marginTop: 40,
  },
  emptySmall: {
    fontSize: 12,
    color: '#ccc',
    margin: '8px 0 0',
  },
  group: {
    marginTop: 16,
    paddingTop: 12,
    borderTop: '1px solid #f0f0f0',
  },
  groupTitle: {
    fontSize: 13,
    fontWeight: 600,
    color: '#333',
    marginBottom: 12,
    letterSpacing: -0.2,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 600,
    color: '#bbb',
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
    marginBottom: 8,
  },
  metricGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 10,
  },
  metricCard: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 6,
  },
  metricBar: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  metricFill: {
    height: '100%',
    borderRadius: 2,
    transition: 'width 0.6s ease',
  },
  metricInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  metricVal: {
    fontSize: 16,
    fontWeight: 600,
  },
  metricLabel: {
    fontSize: 10,
    color: '#999',
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  },
  mutRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 8,
  },
  mutBadge: {
    fontSize: 9,
    fontWeight: 600,
    padding: '2px 7px',
    borderRadius: 4,
    textTransform: 'uppercase' as const,
    flexShrink: 0,
    marginTop: 2,
  },
  mutMsg: {
    fontSize: 12,
    color: '#555',
    lineHeight: 1.4,
  },
  diagText: {
    fontSize: 13,
    color: '#444',
    lineHeight: 1.6,
    margin: '0 0 8px',
  },
  alert: {
    fontSize: 12,
    color: '#d97706',
    margin: '0 0 6px',
    fontWeight: 500,
  },
  suggestion: {
    fontSize: 12,
    color: '#2563eb',
    margin: 0,
    fontWeight: 500,
    lineHeight: 1.5,
  },
  stat: {
    fontSize: 13,
    color: '#666',
    margin: 0,
  },
}
