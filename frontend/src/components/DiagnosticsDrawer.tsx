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

export default function DiagnosticsDrawer({ weekData, open, onToggle }: Props) {
  const boxRef = useRef<HTMLDivElement>(null)
  const state: CultureState = weekData?.state || weekData?.status || 'healthy'
  const color = weekData ? STATE_COLORS[state] : '#2563eb'
  const mutations = weekData?.mutations || []
  const steps = weekData?.diagnosis?.steps || []

  useEffect(() => {
    if (!boxRef.current) return
    anime({
      targets: boxRef.current,
      opacity: open ? 1 : 0,
      translateY: open ? 0 : 8,
      scale: open ? 1 : 0.97,
      duration: 250,
      easing: 'easeOutCubic',
    })
  }, [open])

  return (
    <div style={styles.wrapper}>
      {/* Toggle pill */}
      <button onClick={onToggle} style={styles.tab} aria-label={open ? 'Close' : 'Open stats'}>
        <span style={{ ...styles.tabDot, background: color }} />
        <span style={styles.tabLabel}>{open ? '✕' : 'Stats'}</span>
      </button>

      {/* Dropdown box */}
      {open && (
        <div
          ref={boxRef}
          style={{ ...styles.box, opacity: 0, transform: 'translateY(-8px) scale(0.97)' }}
        >
          {!weekData && (
            <p style={styles.empty}>Run the simulation to see data</p>
          )}

          {weekData && (
            <>
              <div style={styles.header}>
                <span style={styles.title}>Week {weekData.week}</span>
                <span style={{ ...styles.badge, background: color }}>{state}</span>
              </div>

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
                  <p style={styles.stat}>{weekData.messageCount} messages analyzed</p>
                </div>
              )}

              {/* Diagnostics */}
              {weekData.diagnosis && (
                <div style={styles.section}>
                  <div style={styles.sectionTitle}>Diagnostics</div>
                  <p style={styles.diagText}>{weekData.diagnosis.current}</p>
                  {weekData.diagnosis.alert && (
                    <p style={styles.alert}>⚠ {weekData.diagnosis.alert}</p>
                  )}
                </div>
              )}

              {/* Suggested Steps */}
              {steps.length > 0 && (
                <div style={styles.section}>
                  <div style={styles.sectionTitle}>Suggested Steps</div>
                  {steps.map((step, i) => (
                    <div key={i} style={styles.stepRow}>
                      <span style={styles.stepNum}>{i + 1}</span>
                      <span style={styles.stepText}>{step}</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}


const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    position: 'fixed',
    bottom: 16,
    right: 16,
    zIndex: 110,
    fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif',
    display: 'flex',
    flexDirection: 'column-reverse',
    alignItems: 'flex-end',
    gap: 8,
  },
  tab: {
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
  box: {
    width: 320,
    maxHeight: 280,
    overflowY: 'auto' as const,
    background: 'rgba(255,255,255,0.18)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    border: '1px solid rgba(255,255,255,0.25)',
    borderRadius: 14,
    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
    padding: '12px 14px',
    fontSize: 11,
  },
  empty: {
    fontSize: 12,
    color: '#bbb',
    textAlign: 'center' as const,
    margin: '12px 0',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
    paddingBottom: 10,
    borderBottom: '1px solid #f5f5f5',
  },
  title: {
    fontSize: 14,
    fontWeight: 600,
    color: '#111',
    flex: 1,
  },
  badge: {
    fontSize: 9,
    fontWeight: 600,
    padding: '2px 8px',
    borderRadius: 20,
    color: '#fff',
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 9,
    fontWeight: 600,
    color: '#bbb',
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
    marginBottom: 6,
  },
  mutRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 6,
    marginBottom: 6,
  },
  mutBadge: {
    fontSize: 8,
    fontWeight: 600,
    padding: '1px 6px',
    borderRadius: 3,
    textTransform: 'uppercase' as const,
    flexShrink: 0,
    marginTop: 2,
  },
  mutMsg: {
    fontSize: 11,
    color: '#555',
    lineHeight: 1.4,
  },
  stat: {
    fontSize: 12,
    color: '#666',
    margin: 0,
  },
  diagText: {
    fontSize: 12,
    color: '#444',
    lineHeight: 1.5,
    margin: '0 0 4px',
  },
  alert: {
    fontSize: 11,
    color: '#d97706',
    margin: '0 0 4px',
    fontWeight: 500,
  },
  stepRow: {
    display: 'flex',
    gap: 8,
    marginBottom: 6,
    alignItems: 'flex-start',
  },
  stepNum: {
    fontSize: 9,
    fontWeight: 700,
    color: '#2563eb',
    background: '#eff6ff',
    borderRadius: 10,
    width: 18,
    height: 18,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 1,
  },
  stepText: {
    fontSize: 11,
    color: '#555',
    lineHeight: 1.4,
  },
}
