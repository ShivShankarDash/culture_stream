import { useRef, useEffect, useCallback } from 'react'
import anime from 'animejs'
import type { WeekData, CultureState } from '../types'

interface Props {
  weekData: WeekData | null
  width: number
  height: number
}

// RGB tuples for smooth interpolation
const COLOR_RGB: Record<CultureState, [number, number, number]> = {
  healthy:  [37, 99, 235],
  warning:  [234, 179, 8],
  critical: [239, 68, 68],
  recovery: [37, 99, 235],
}

interface Strand {
  baseY: number
  amplitude: number
  frequency: number
  phase: number
  speed: number
  thickness: number
  opacity: number
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
      amplitude: 2 + Math.random() * 4,
      frequency: 0.003 + Math.random() * 0.002,
      phase: Math.random() * Math.PI * 2,
      speed: 0.4 + Math.random() * 0.3,
      thickness: 2.5 + Math.random() * 2,
      opacity: 0.5 + Math.random() * 0.5,
    })
  }
  return strands
}

function createTreeBranches(): TreeBranch[] {
  const branches: TreeBranch[] = []

  // Tier 1: minimal
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

  // Tier 2: warning
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

  // Tier 3: critical
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

// Smooth RGB lerp
function lerpRGB(a: [number, number, number], b: [number, number, number], t: number): string {
  const r = Math.round(a[0] + (b[0] - a[0]) * t)
  const g = Math.round(a[1] + (b[1] - a[1]) * t)
  const bl = Math.round(a[2] + (b[2] - a[2]) * t)
  return `rgb(${r},${g},${bl})`
}

function lerpRGBAlpha(a: [number, number, number], b: [number, number, number], t: number, alpha: number): string {
  const r = Math.round(a[0] + (b[0] - a[0]) * t)
  const g = Math.round(a[1] + (b[1] - a[1]) * t)
  const bl = Math.round(a[2] + (b[2] - a[2]) * t)
  return `rgba(${r},${g},${bl},${alpha})`
}

export default function TimelineCanvas({ weekData, width, height }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  // colorT: 0=blue, 0.5=yellow, 1=red — animated smoothly
  const animRef = useRef({ time: 0, fray: 0, colorT: 0 })
  const rafRef = useRef<number>(0)
  const frayAnime = useRef<ReturnType<typeof anime> | null>(null)
  const colorAnime = useRef<ReturnType<typeof anime> | null>(null)

  const getStreamY = useCallback((x: number, cy: number, time: number): number => {
    let avg = 0
    for (const s of BASE_STRANDS) {
      avg += Math.sin(x * s.frequency + time * s.speed + s.phase) * s.amplitude
    }
    return cy + avg / BASE_STRANDS.length
  }, [])

  // Get interpolated color from colorT
  const getColor = useCallback((colorT: number): string => {
    const blue = COLOR_RGB.healthy
    const yellow = COLOR_RGB.warning
    const red = COLOR_RGB.critical
    if (colorT <= 0.5) {
      return lerpRGB(blue, yellow, colorT * 2)
    }
    return lerpRGB(yellow, red, (colorT - 0.5) * 2)
  }, [])

  const getGlow = useCallback((colorT: number): string => {
    const blue = COLOR_RGB.healthy
    const yellow = COLOR_RGB.warning
    const red = COLOR_RGB.critical
    if (colorT <= 0.5) {
      return lerpRGBAlpha(blue, yellow, colorT * 2, 0.2)
    }
    return lerpRGBAlpha(yellow, red, (colorT - 0.5) * 2, 0.22)
  }, [])

  const drawBranch = useCallback((
    ctx: CanvasRenderingContext2D,
    startX: number, startY: number,
    angle: number, side: number, length: number,
    curve: number, time: number, phase: number,
    thickness: number, opacity: number,
    color: string, glow: string, intensity: number,
  ) => {
    if (intensity <= 0.01) return
    ctx.beginPath()
    ctx.strokeStyle = color
    ctx.lineWidth = thickness * Math.min(intensity, 1)
    ctx.globalAlpha = opacity * Math.min(intensity, 1)
    ctx.shadowColor = glow
    ctx.shadowBlur = 8
    ctx.lineCap = 'round'

    const steps = 25
    for (let i = 0; i <= steps; i++) {
      const t = i / steps
      const dist = t * length
      const sway = Math.sin(time * 0.4 + phase + t * 2.5) * 4 * t
      const curveOffset = curve * dist * dist
      const dx = Math.cos(angle * 0.3) * dist
      const dy = -side * Math.sin(angle) * dist + curveOffset + sway
      const px = startX + dx
      const py = startY + dy
      if (i === 0) ctx.moveTo(px, py)
      else ctx.lineTo(px, py)
    }
    ctx.stroke()
    ctx.shadowBlur = 0
    ctx.globalAlpha = 1
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
    const color = getColor(colorT)
    const glow = getGlow(colorT)

    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, W, H)

    // Main bundled stream
    const tightness = 1 - fray * 0.25

    for (const strand of BASE_STRANDS) {
      ctx.beginPath()
      ctx.strokeStyle = color
      ctx.lineWidth = strand.thickness
      ctx.globalAlpha = strand.opacity
      ctx.shadowColor = glow
      ctx.shadowBlur = 14
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'

      const steps = Math.max(200, Math.floor(W / 3))
      for (let i = 0; i <= steps; i++) {
        const t = i / steps
        const x = t * W
        const wave = Math.sin(x * strand.frequency + time * strand.speed + strand.phase) * strand.amplitude
        const y = cy + strand.baseY * tightness + wave * tightness
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()
      ctx.shadowBlur = 0
      ctx.globalAlpha = 1
    }

    // Tree branches
    for (const branch of TREE_BRANCHES) {
      let intensity = 0
      if (branch.tier === 1) {
        intensity = Math.min(fray * 4, 1) * 0.5 + fray * 0.5
        intensity = Math.max(0, Math.min(intensity, 1))
        if (fray < 0.03) intensity = 0
      } else if (branch.tier === 2) {
        intensity = Math.max(0, (fray - 0.15) / 0.25)
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
        branch.thickness, branch.opacity,
        color, glow, intensity,
      )

      for (const child of branch.children) {
        const parentDist = child.parentT * branchLen
        const parentSway = Math.sin(time * 0.4 + branch.phase + child.parentT * 2.5) * 4 * child.parentT
        const parentDx = Math.cos(branch.angle * 0.3) * parentDist
        const parentDy = -branch.side * Math.sin(branch.angle) * parentDist
          + branch.curve * parentDist * parentDist + parentSway
        const childX = spawnX + parentDx
        const childY = spawnY + parentDy
        const childSide = branch.side * child.side
        const childLen = child.lengthRatio * H

        drawBranch(
          ctx, childX, childY,
          child.angle, childSide, childLen,
          child.curve, time, branch.phase + 1.5,
          child.thickness, child.opacity,
          color, glow, intensity * 0.75,
        )
      }
    }
  }, [weekData, width, height, getStreamY, drawBranch, getColor, getGlow])

  // Animation loop
  useEffect(() => {
    let running = true
    const loop = () => {
      if (!running) return
      animRef.current.time += 0.018
      draw()
      rafRef.current = requestAnimationFrame(loop)
    }
    loop()
    return () => { running = false; cancelAnimationFrame(rafRef.current) }
  }, [draw])

  // Animate fray + color on weekData change
  useEffect(() => {
    const state: CultureState = weekData?.state || weekData?.status || 'healthy'

    // Map state to colorT: blue=0, yellow=0.5, red=1
    let targetColorT = 0
    if (state === 'warning') targetColorT = 0.5
    else if (state === 'critical') targetColorT = 1
    else targetColorT = 0 // healthy + recovery

    const targetFray = weekData ? weekData.metrics.silos : 0

    // Determine if recovering (going down)
    const isRecovering = targetFray < animRef.current.fray
    const frayDuration = isRecovering ? 3500 : 2000
    const colorDuration = isRecovering ? 4000 : 2500

    if (frayAnime.current) frayAnime.current.pause()
    frayAnime.current = anime({
      targets: animRef.current,
      fray: targetFray,
      duration: frayDuration,
      easing: 'easeInOutQuad',
    })

    if (colorAnime.current) colorAnime.current.pause()
    colorAnime.current = anime({
      targets: animRef.current,
      colorT: targetColorT,
      duration: colorDuration,
      easing: 'easeInOutQuad',
    })

    return () => {
      if (frayAnime.current) frayAnime.current.pause()
      if (colorAnime.current) colorAnime.current.pause()
    }
  }, [weekData])

  return (
    <canvas
      ref={canvasRef}
      style={{ width, height, display: 'block' }}
    />
  )
}
