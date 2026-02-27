import { useRef, useState, useCallback } from 'react'

export default function MusicToggle() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [playing, setPlaying] = useState(false)

  const getAudio = useCallback(() => {
    if (!audioRef.current) {
      const audio = new Audio('/bg-music.mp3')
      audio.loop = true
      audio.volume = 0.4
      audioRef.current = audio
    }
    return audioRef.current
  }, [])

  const toggle = useCallback(() => {
    const audio = getAudio()
    if (playing) {
      audio.pause()
    } else {
      audio.play().catch(() => {})
    }
    setPlaying(p => !p)
  }, [playing, getAudio])

  const restart = useCallback(() => {
    const audio = getAudio()
    audio.currentTime = 0
    audio.play().catch(() => {})
    setPlaying(true)
  }, [getAudio])

  return (
    <div style={styles.wrapper}>
      <button onClick={toggle} style={styles.btn} aria-label={playing ? 'Pause music' : 'Play music'}>
        {playing ? '🔊' : '🔇'}
      </button>
      <button onClick={restart} style={styles.btn} aria-label="Restart music">
        ↺
      </button>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    position: 'fixed',
    top: 16,
    right: 16,
    zIndex: 110,
    display: 'flex',
    gap: 8,
  },
  btn: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    border: '1px solid #e8e8e8',
    background: 'rgba(255,255,255,0.92)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
    cursor: 'pointer',
    fontSize: 18,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: '-apple-system, system-ui, sans-serif',
  },
}
