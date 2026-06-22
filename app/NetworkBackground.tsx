'use client'

import { useEffect, useRef } from 'react'

type Node = { x: number; y: number; vx: number; vy: number }

const NODE_COUNT = 70
const MAX_DIST = 150 // px — nodes closer than this get connected by a line

export function NetworkBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    let width = 0
    let height = 0
    let nodes: Node[] = []
    let animationId = 0

    // Respect the user's "reduce motion" setting — render one static frame.
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    function resize() {
      width = canvas!.width = window.innerWidth
      height = canvas!.height = window.innerHeight
    }

    function init() {
      nodes = Array.from({ length: NODE_COUNT }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4, // slow drift
        vy: (Math.random() - 0.5) * 0.4,
      }))
    }

    function draw() {
      ctx!.clearRect(0, 0, width, height)

      // Drift the nodes, bouncing off the edges.
      for (const n of nodes) {
        n.x += n.vx
        n.y += n.vy
        if (n.x < 0 || n.x > width) n.vx *= -1
        if (n.y < 0 || n.y > height) n.vy *= -1
      }

      // Draw a line between any two nodes that are close, fading with distance.
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const dist = Math.hypot(dx, dy)
          if (dist < MAX_DIST) {
            ctx!.strokeStyle = `rgba(129, 132, 255, ${(1 - dist / MAX_DIST) * 0.4})`
            ctx!.lineWidth = 1
            ctx!.beginPath()
            ctx!.moveTo(nodes[i].x, nodes[i].y)
            ctx!.lineTo(nodes[j].x, nodes[j].y)
            ctx!.stroke()
          }
        }
      }

      // Draw the nodes on top.
      ctx!.fillStyle = 'rgba(165, 166, 246, 0.85)'
      for (const n of nodes) {
        ctx!.beginPath()
        ctx!.arc(n.x, n.y, 2, 0, Math.PI * 2)
        ctx!.fill()
      }

      // Keep animating unless the user asked for reduced motion.
      if (!prefersReduced) animationId = requestAnimationFrame(draw)
    }

    function handleResize() {
      resize()
      init()
    }

    resize()
    init()
    draw()
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none',
      }}
    />
  )
}
