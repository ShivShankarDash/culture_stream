import { useRef, useEffect, useCallback } from 'react'
import anime from 'animejs'
import type { WeekData, CultureState } from '../types'

export interface AnimState {
  time: number
  fray: number
  colorT: number
}

interface Props {
  weekData: WeekData | null
  width: number
  height: number
  overlay?: boolean
  speed?: number
  sharedAnim?: React.RefObject<AnimState>
}

// More vibrant RGB tuples
const COLOR_RGB: Record<CultureState, [number, number, number]> = {
  healthy:  [30, 110, 255],   // richer blue
  warning:  [255, 195, 0],    // vivid gold
  critical: [255, 50, 50],    // hot red
  recovery: [30, 110, 255],
}

interface Strand {
  baseY: number
  amplitude: number
  frequency: number
  phase: number
  speed: number
  thickness: number
  opacity: number
  // secondary wave for organic feel
  amp2: number
  freq2: number
  phase2: number
}

interface TreeBranch {
  spawnT: number
  side: 1 | -1
  angle: number
  lengthRatio: number
  thickness: number
  opacity: number
  curve: number
  phase: number
  tier: 1 | 2 | 3
  children: SubBranch[]
}

interface SubBranch {
  parentT: number
  side: 1 | -1
  angle: number
  lengthRatio: number
  thickness: number
  opacity: number
  curve: number
}

function createStrands(count: number): Strand[] {
  const strands: Strand[] = []
  for (let i = 0; i < count; i++) {
    const t = (i / (count - 1)) - 0.5
    strands.push({
      baseY: t * 20,
      amplitude: 2.5 + Math.random() * 5,
      frequency: 0.003 + Math.random() * 0.002,
      phase: Math.random() * Math.PI * 2,
      speed: 0.35 + Math.random() * 0.25,
      thickness: 2.8 + Math.random() * 2.2,
      opacity: 0.55 + Math.random() * 0.45,
      amp2: 1 + Math.random() * 2.5,
      freq2: 0.006 + Math.random() * 0.004,
      phase2: Math.random() * Math.PI * 2,
    })
  }
  return strands
}

function createTreeBranches(): TreeBranch[] {
  const branches: TreeBranch[] = []

  for (let i = 0; i < 6; i++) {
    const side = (i % 2 === 0 ? 1 : -1) as 1 | -1
    branches.push({
      spawnT: 0.1 + (i / 5) * 0.8, side,
      angle: Math.PI / 5 + Math.random() * (Math.PI / 6),
      lengthRatio: 0.04 + Math.random() * 0.06,
      thickness: 2.2 + Math.random() * 1.2,
      opacity: 0.3 + Math.random() * 0.2,
      curve: (Math.random() - 0.5) * 0.008,
      phase: Math.random() * Math.PI * 2,
      tier: 1, children: [],
    })
  }

  for (let i = 0; i < 12; i++) {
    const side = (i % 2 === 0 ? 1 : -1) as 1 | -1
    const children: SubBranch[] = []
    for (let c = 0; c < Math.floor(Math.random() * 3); c++) {
      children.push({
        parentT: 0.3 + Math.random() * 0.5,
        side: (Math.random() > 0.5 ? 1 : -1) as 1 | -1,
        angle: Math.PI / 5 + Math.random() * (Math.PI / 4),
        lengthRatio: 0.03 + Math.random() * 0.06,
        thickness: 1.5 + Math.random() * 1.2,
        opacity: 0.3 + Math.random() * 0.25,
        curve: (Math.random() - 0.5) * 0.012,
      })
    }
    branches.push({
      spawnT: 0.05 + Math.random() * 0.9, side,
      angle: Math.PI / 5 + Math.random() * (Math.PI / 3),
      lengthRatio: 0.08 + Math.random() * 0.14,
      thickness: 2.5 + Math.random() * 1.5,
      opacity: 0.4 + Math.random() * 0.3,
      curve: (Math.random() - 0.5) * 0.01,
      phase: Math.random() * Math.PI * 2,
      tier: 2, children,
    })
  }

  for (let i = 0; i < 20; i++) {
    const side = (i % 2 === 0 ? 1 : -1) as 1 | -1
    const children: SubBranch[] = []
    for (let c = 0; c < 1 + Math.floor(Math.random() * 4); c++) {
      children.push({
        parentT: 0.2 + Math.random() * 0.6,
        side: (Math.random() > 0.5 ? 1 : -1) as 1 | -1,
        angle: Math.PI / 6 + Math.random() * (Math.PI / 3),
        lengthRatio: 0.04 + Math.random() * 0.1,
        thickness: 2 + Math.random() * 1.5,
        opacity: 0.3 + Math.random() * 0.35,
        curve: (Math.random() - 0.5) * 0.015,
      })
    }
    branches.push({
      spawnT: 0.03 + Math.random() * 0.94, side,
      angle: Math.PI / 4 + Math.random() * (Math.PI / 4),
      lengthRatio: 0.15 + Math.random() * 0.25,
      thickness: 3 + Math.random() * 2,
      opacity: 0.4 + Math.random() * 0.4,
      curve: (Math.random() - 0.5) * 0.012,
      phase: Math.random() * Math.PI * 2,
      tier: 3, children,
    })
  }

  return branches
}

const BASE_STRANDS = createStrands(8)
const TREE_BRANCHES = createTreeBranches()

// Pre-generate shimmer particles along the stream
interface Particle {
  t: number       // 0-1 position along stream
  phaseOff: number
  size: number
  brightness: number
}
const PARTICLES: Particle[] = Array.from({ length: 60 }, () => ({
  t: Math.random(),
  phaseOff: Math.random() * Math.PI * 2,
  size: 1.5 + Math.random() * 2.5,
  brightness: 0.3 + Math.random() * 0.7,
}))

function lerpRGB(a: [number, number, number], b: [number, number, number], t: number): [number, number, number] {
  return [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
  ]
}

function rgbStr(c: [number, number, number]): string {
  return `rgb(${Math.round(c[0])},${Math.round(c[1])},${Math.round(c[2])})`
}

function rgbaStr(c: [number, number, number], a: number): string {
  return `rgba(${Math.round(c[0])},${Math.round(c[1])},${Math.round(c[2])},${a})`
}

function getColorRGB(colorT: number): [number, number, number] {
  const blue = COLOR_RGB.healthy
  const yellow = COLOR_RGB.warning
  const red = COLOR_RGB.critical
  if (colorT <= 0.5) return lerpRGB(blue, yellow, colorT * 2)
  return lerpRGB(yellow, red, (colorT - 0.5) * 2)
}

export default function TimelineCanvas({ weekData, width, height, overlay, speed = 1, sharedAnim }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const localAnimRef = useRef<AnimState>({ time: 0, fray: 0, colorT: 0 })
  const animRef = sharedAnim || localAnimRef
  const rafRef = useRef<number>(0)
  const frayAnime = useRef<ReturnType<typeof anime> | null>(null)
  const colorAnime = useRef<ReturnType<typeof anime> | null>(null)

  const getStreamY = useCallback((x: number, cy: number, time: number): number => {
    let avg = 0
    for (const s of BASE_STRANDS) {
      avg += Math.sin(x * s.frequency + time * s.speed + s.phase) * s.amplitude
      avg += Math.sin(x * s.freq2 + time * s.speed * 0.7 + s.phase2) * s.amp2
    }
    return cy + avg / (BASE_STRANDS.length * 2)
  }, [])

  const drawBranch = useCallback((
    ctx: CanvasRenderingContext2D,
    startX: number, startY: number,
    angle: number, side: number, length: number,
    curve: number, time: number, phase: number,
    thickness: number, opacity: number,
    rgb: [number, number, number], intensity: number,
  ) => {
    if (intensity <= 0.01) return
    const eff = Math.min(intensity, 1)
    ctx.beginPath()
    ctx.strokeStyle = rgbaStr(rgb, opacity * eff)
    ctx.lineWidth = thickness * eff
    ctx.globalAlpha = 1
    ctx.shadowColor = rgbaStr(rgb, 0.35 * eff)
    ctx.shadowBlur = 10
    ctx.lineCap = 'round'

    const steps = 28
    for (let i = 0; i <= steps; i++) {
      const t = i / steps
      const dist = t * length
      const sway = Math.sin(time * 0.5 + phase + t * 3) * 5 * t
      const sway2 = Math.sin(time * 0.3 + phase * 1.7 + t * 1.8) * 2.5 * t
      const curveOffset = curve * dist * dist
      const dx = Math.cos(angle * 0.3) * dist
      const dy = -side * Math.sin(angle) * dist + curveOffset + sway + sway2
      const px = startX + dx
      const py = startY + dy
      if (i === 0) ctx.moveTo(px, py)
      else ctx.lineTo(px, py)
    }
    ctx.stroke()
    ctx.shadowBlur = 0
  }, [])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const W = width
    const H = height

    if (canvas.width !== W * dpr || canvas.height !== H * dpr) {
      canvas.width = W * dpr
      canvas.height = H * dpr
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    const cy = H / 2
    const { time, fray, colorT } = animRef.current
    const rgb = getColorRGB(colorT)

    // Breathing pulse — subtle oscillation in glow and thickness
    const breath = 0.92 + 0.08 * Math.sin(time * 0.6)
    const glowBreath = 0.85 + 0.15 * Math.sin(time * 0.45 + 0.5)

    if (!overlay) {
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, W, H)
    } else {
      ctx.clearRect(0, 0, W, H)
    }

    // Soft ambient glow behind the stream
    const gradGlow = ctx.createRadialGradient(W * 0.5, cy, 0, W * 0.5, cy, W * 0.45)
    gradGlow.addColorStop(0, rgbaStr(rgb, 0.06 * glowBreath))
    gradGlow.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = gradGlow
    ctx.fillRect(0, 0, W, H)

    const tightness = 1 - fray * 0.25

    // Main bundled stream with dual-wave organic motion
    for (const strand of BASE_STRANDS) {
      ctx.beginPath()
      ctx.strokeStyle = rgbStr(rgb)
      ctx.lineWidth = strand.thickness * breath
      ctx.globalAlpha = strand.opacity
      ctx.shadowColor = rgbaStr(rgb, 0.3 * glowBreath)
      ctx.shadowBlur = 18 * glowBreath
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'

      const steps = Math.max(200, Math.floor(W / 3))
      for (let i = 0; i <= steps; i++) {
        const t = i / steps
        const x = t * W
        const wave1 = Math.sin(x * strand.frequency + time * strand.speed + strand.phase) * strand.amplitude
        const wave2 = Math.sin(x * strand.freq2 + time * strand.speed * 0.7 + strand.phase2) * strand.amp2
        const y = cy + strand.baseY * tightness + (wave1 + wave2) * tightness
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()
      ctx.shadowBlur = 0
      ctx.globalAlpha = 1
    }

    // Shimmer particles along the stream
    for (const p of PARTICLES) {
      const px = p.t * W
      const py = getStreamY(px, cy, time)
      const flicker = 0.5 + 0.5 * Math.sin(time * 2.5 + p.phaseOff)
      const alpha = p.brightness * flicker * breath * 0.7
      if (alpha < 0.05) continue
      ctx.beginPath()
      ctx.arc(px, py, p.size * breath, 0, Math.PI * 2)
      ctx.fillStyle = rgbaStr(rgb, alpha)
      ctx.shadowColor = rgbaStr(rgb, alpha * 0.5)
      ctx.shadowBlur = 6
      ctx.fill()
      ctx.shadowBlur = 0
    }

    // Tree branches
    for (const branch of TREE_BRANCHES) {
      let intensity = 0
      if (branch.tier === 1) {
        intensity = Math.min(fray * 4, 1) * 0.5 + fray * 0.5
        intensity = Math.max(0, Math.min(intensity, 1))
        if (fray < 0.03) intensity = 0
      } else if (branch.tier === 2) {
        intensity = Math.max(0, (fray - 0.1) / 0.2)
        intensity = Math.min(intensity, 1)
      } else {
        intensity = Math.max(0, (fray - 0.35) / 0.25)
        intensity = Math.min(intensity, 1)
      }
      if (intensity <= 0.01) continue

      const spawnX = branch.spawnT * W
      const spawnY = getStreamY(spawnX, cy, time)
      const branchLen = branch.lengthRatio * H

      drawBranch(
        ctx, spawnX, spawnY,
        branch.angle, branch.side, branchLen,
        branch.curve, time, branch.phase,
        branch.thickness * breath, branch.opacity,
        rgb, intensity,
      )

      for (const child of branch.children) {
        const parentDist = child.parentT * branchLen
        const parentSway = Math.sin(time * 0.5 + branch.phase + child.parentT * 3) * 5 * child.parentT
        const parentSway2 = Math.sin(time * 0.3 + branch.phase * 1.7 + child.parentT * 1.8) * 2.5 * child.parentT
        const parentDx = Math.cos(branch.angle * 0.3) * parentDist
        const parentDy = -branch.side * Math.sin(branch.angle) * parentDist
          + branch.curve * parentDist * parentDist + parentSway + parentSway2
        const childX = spawnX + parentDx
        const childY = spawnY + parentDy
        const childSide = branch.side * child.side
        const childLen = child.lengthRatio * H

        drawBranch(
          ctx, childX, childY,
          child.angle, childSide, childLen,
          child.curve, time, branch.phase + 1.5,
          child.thickness * breath, child.opacity,
          rgb, intensity * 0.75,
        )
      }
    }
  }, [weekData, width, height, overlay, getStreamY, drawBranch, animRef])

  // Animation loop
  useEffect(() => {
    let running = true
    const loop = () => {
      if (!running) return
      if (!overlay) {
        animRef.current.time += 0.016
      }
      draw()
      rafRef.current = requestAnimationFrame(loop)
    }
    loop()
    return () => { running = false; cancelAnimationFrame(rafRef.current) }
  }, [draw, overlay, animRef])

  // Animate fray + color on weekData change
  useEffect(() => {
    if (overlay) return

    const week = weekData?.week || 0
    const rawFray = weekData ? weekData.metrics.silos : 0
    let targetFray = week === 8 ? 0 : rawFray
    if (week === 3 && targetFray < 0.3) targetFray = 0.3
    if (week === 4 && targetFray < 0.4) targetFray = 0.4

    let targetColorT = 0
    if (week <= 2) targetColorT = 0
    else if (week === 3) targetColorT = 0.5
    else if (week === 4) targetColorT = 0.5
    else if (week === 5) targetColorT = 0.85
    else if (week === 6) targetColorT = 1
    else if (week === 7) targetColorT = 0.5
    else if (week === 8) targetColorT = 0

    const currentColorT = animRef.current.colorT
    const isRecovering = targetColorT < currentColorT

    const baseFray = isRecovering ? 6000 : 2500
    const baseColor = isRecovering ? 8000 : 2500
    const frayDuration = Math.max(800, baseFray / speed)
    const colorDuration = Math.max(800, baseColor / speed)

    if (frayAnime.current) frayAnime.current.pause()
    frayAnime.current = anime({
      targets: animRef.current,
      fray: targetFray,
      duration: frayDuration,
      easing: 'easeInOutSine',
    })

    if (colorAnime.current) colorAnime.current.pause()
    colorAnime.current = anime({
      targets: animRef.current,
      colorT: targetColorT,
      duration: colorDuration,
      easing: 'easeInOutSine',
    })

    return () => {
      if (frayAnime.current) frayAnime.current.pause()
      if (colorAnime.current) colorAnime.current.pause()
    }
  }, [weekData, speed, overlay, animRef])

  return (
    <canvas
      ref={canvasRef}
      style={{ width, height, display: 'block' }}
    />
  )
}
