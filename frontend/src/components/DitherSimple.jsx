import React, { useRef, useEffect } from 'react'
import './Dither.css'

const DitherSimple = ({
  waveColor = [0.5, 0.5, 0.5],
  disableAnimation = false,
  enableMouseInteraction = true,
  mouseRadius = 0.3,
  colorNum = 4,
  waveAmplitude = 0.3,
  waveFrequency = 3,
  waveSpeed = 0.05
}) => {
  const canvasRef = useRef(null)
  const animationFrameRef = useRef(null)
  const timeRef = useRef(0)
  const mousePosRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let width = canvas.offsetWidth
    let height = canvas.offsetHeight

    const resize = () => {
      width = canvas.offsetWidth
      height = canvas.offsetHeight
      canvas.width = width
      canvas.height = height
    }

    resize()
    window.addEventListener('resize', resize)

    // Bayer matrix for dithering
    const bayerMatrix = [
      [0, 48, 12, 60, 3, 51, 15, 63],
      [32, 16, 44, 28, 35, 19, 47, 31],
      [8, 56, 4, 52, 11, 59, 7, 55],
      [40, 24, 36, 20, 43, 27, 39, 23],
      [2, 50, 14, 62, 1, 49, 13, 61],
      [34, 18, 46, 30, 33, 17, 45, 29],
      [10, 58, 6, 54, 9, 57, 5, 53],
      [42, 26, 38, 22, 41, 25, 37, 21]
    ]

    // Simple noise function
    const noise = (x, y) => {
      const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453
      return (n - Math.floor(n))
    }

    // Fractal Brownian Motion
    const fbm = (x, y, octaves = 4) => {
      let value = 0
      let amplitude = 1
      let frequency = waveFrequency
      for (let i = 0; i < octaves; i++) {
        value += amplitude * Math.abs(noise(x * frequency, y * frequency))
        x *= frequency
        amplitude *= waveAmplitude
      }
      return value
    }

    // Pattern function
    const pattern = (x, y, time) => {
      const p2x = x - time * waveSpeed
      const p2y = y - time * waveSpeed
      return fbm(x + fbm(p2x, p2y), y + fbm(p2x, p2y))
    }

    // Dither function
    const dither = (x, y, value) => {
      const bx = Math.floor(x / 2) % 8
      const by = Math.floor(y / 2) % 8
      const threshold = (bayerMatrix[by][bx] / 64) - 0.25
      const step = 1 / (colorNum - 1)
      value += threshold * step
      value = Math.max(0, Math.min(1, value - 0.2))
      return Math.floor(value * (colorNum - 1) + 0.5) / (colorNum - 1)
    }

    const draw = () => {
      if (!canvas) return

      const imageData = ctx.createImageData(width, height)
      const data = imageData.data
      const time = disableAnimation ? 0 : timeRef.current

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const nx = (x / width - 0.5) * (width / height)
          const ny = (y / height - 0.5)

          let f = pattern(nx, ny, time)

          // Mouse interaction
          if (enableMouseInteraction) {
            const mouseX = (mousePosRef.current.x / width - 0.5) * (width / height)
            const mouseY = (mousePosRef.current.y / height - 0.5)
            const dist = Math.sqrt((nx - mouseX) ** 2 + (ny - mouseY) ** 2)
            const effect = 1 - Math.min(1, dist / mouseRadius)
            f -= 0.5 * effect
          }

          // Apply dithering
          const dithered = dither(x, y, f)

          // Convert to color
          const r = Math.floor(dithered * waveColor[0] * 255)
          const g = Math.floor(dithered * waveColor[1] * 255)
          const b = Math.floor(dithered * waveColor[2] * 255)

          const idx = (y * width + x) * 4
          data[idx] = r
          data[idx + 1] = g
          data[idx + 2] = b
          data[idx + 3] = 255
        }
      }

      ctx.putImageData(imageData, 0, 0)
    }

    const animate = () => {
      if (!disableAnimation) {
        timeRef.current += 0.016 // ~60fps
      }
      draw()
      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    const handleMouseMove = (e) => {
      if (!enableMouseInteraction) return
      const rect = canvas.getBoundingClientRect()
      mousePosRef.current.x = e.clientX - rect.left
      mousePosRef.current.y = e.clientY - rect.top
    }

    canvas.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('mousemove', handleMouseMove)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [waveColor, disableAnimation, enableMouseInteraction, mouseRadius, colorNum, waveAmplitude, waveFrequency, waveSpeed])

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 0
      }}
    />
  )
}

export default DitherSimple

