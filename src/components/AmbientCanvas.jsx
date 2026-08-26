import { useEffect, useRef } from 'react'
import { reducedMotion } from '../App.jsx'

export default function AmbientCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (reducedMotion()) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d', { alpha: true })
    let width = 0
    let height = 0
    let animationId = 0
    let scrollY = 0
    let scrollVelocity = 0
    let lastScrollY = 0
    let mouseX = -9999
    let mouseY = -9999
    let mouseInfluence = 0

    const themes = {
      hero: { base: '#060607', accent: '#06b6d4', accent2: '#22d3ee', density: 1.0, speed: 0.3 },
      lab: { base: '#060607', accent: '#06b6d4', accent2: '#67e8f9', density: 1.3, speed: 0.5 },
      experiments: { base: '#060607', accent: '#06b6d4', accent2: '#67e8f9', density: 0.9, speed: 0.25 },
      system: { base: '#060607', accent: '#06b6d4', accent2: '#22d3ee', density: 1.1, speed: 0.35 },
      exit: { base: '#060607', accent: '#06b6d4', accent2: '#67e8f9', density: 0.7, speed: 0.2 },
    }

    let currentTheme = themes.hero

    const particles = []
    const PARTICLE_COUNT = 180

    class Particle {
      constructor() {
        this.reset(true)
      }
      reset(init = false) {
        const spread = init ? 1.5 : 0
        this.x = Math.random() * width * spread - width * 0.25
        this.y = Math.random() * height * spread - height * 0.25
        this.baseX = this.x
        this.baseY = this.y
        this.vx = (Math.random() - 0.5) * 0.3
        this.vy = (Math.random() - 0.5) * 0.3
        this.size = Math.random() * 1.8 + 0.4
        this.opacity = Math.random() * 0.4 + 0.1
        this.hue = Math.random() > 0.7 ? 42 : 200
        this.phase = Math.random() * Math.PI * 2
        this.life = 0
        this.maxLife = Math.random() * 300 + 200
      }
      update(dt, flowX, flowY) {
        this.life++
        if (this.life > this.maxLife) { this.reset(); return }

        const dx = this.x - mouseX
        const dy = this.y - mouseY
        const dist = Math.hypot(dx, dy)
        const influenceRadius = 280

        let fx = flowX * 0.02
        let fy = flowY * 0.02

        if (dist < influenceRadius && mouseInfluence > 0.1) {
          const force = (1 - dist / influenceRadius) * mouseInfluence * 1.5
          fx += (dx / dist) * force
          fy += (dy / dist) * force
        }

        this.vx += (fx - this.vx) * 0.02
        this.vy += (fy - this.vy) * 0.02

        this.x += this.vx * dt
        this.y += this.vy * dt

        if (this.x < -100) this.x = width + 100
        if (this.x > width + 100) this.x = -100
        if (this.y < -100) this.y = height + 100
        if (this.y > height + 100) this.y = -100

        this.phase += dt * 0.001
      }
      draw() {
        const pulse = Math.sin(this.phase) * 0.3 + 0.7
        const alpha = this.opacity * pulse * Math.min(1, this.life / 30) * Math.min(1, (this.maxLife - this.life) / 30)
        if (alpha <= 0.02) return

        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size * pulse, 0, Math.PI * 2)
        const isAccent = this.hue === 42
        const color = isAccent ? currentTheme.accent : currentTheme.accent2
        ctx.fillStyle = `rgba(${this.hexToRgb(color).join(',')}, ${alpha * 0.6})`
        ctx.fill()

        if (isAccent && alpha > 0.15) {
          ctx.shadowColor = color
          ctx.shadowBlur = 8 * pulse
          ctx.fill()
          ctx.shadowBlur = 0
        }
      }
      hexToRgb(hex) {
        const h = hex.replace('#', '')
        return [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)]
      }
    }

    function resize() {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
      if (particles.length !== PARTICLE_COUNT) {
        while (particles.length < PARTICLE_COUNT) particles.push(new Particle())
        while (particles.length > PARTICLE_COUNT) particles.pop()
      }
    }

    function hexToRgb(hex) {
      const h = hex.replace('#', '')
      return [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)]
    }

    function setTheme(themeName) {
      if (themes[themeName]) currentTheme = themes[themeName]
    }

    function onScroll() {
      scrollY = window.scrollY
      scrollVelocity = (scrollY - lastScrollY) * 0.15
      lastScrollY = scrollY

      const total = document.documentElement.scrollHeight - window.innerHeight
      const progress = Math.min(1, Math.max(0, scrollY / total))

      if (progress < 0.12) setTheme('hero')
      else if (progress < 0.3) setTheme('lab')
      else if (progress < 0.55) setTheme('experiments')
      else if (progress < 0.8) setTheme('system')
      else setTheme('exit')
    }

    function onMouseMove(e) {
      mouseX = e.clientX
      mouseY = e.clientY
      mouseInfluence = 1
    }

    function onMouseLeave() {
      mouseInfluence = 0
      mouseX = -9999
      mouseY = -9999
    }

    let lastTime = performance.now()
    function loop(now) {
      const dt = Math.min(33, now - lastTime)
      lastTime = now

      const isLowQuality = document.documentElement.classList.contains('low-quality')
      if (isLowQuality) {
        animationId = requestAnimationFrame(loop)
        return
      }

      ctx.clearRect(0, 0, width, height)

      const flowX = Math.sin(now * 0.0003) * 40 + scrollVelocity * 2
      const flowY = Math.cos(now * 0.0002) * 30 + scrollVelocity * 1.5

      particles.forEach(p => {
        p.update(dt, flowX, flowY)
        p.draw()
      })

      const connections = 12
      for (let i = 0; i < particles.length; i += connections) {
        const p1 = particles[i]
        const p2 = particles[(i + Math.floor(particles.length/3)) % particles.length]
        const dx = p2.x - p1.x
        const dy = p2.y - p1.y
        const dist = Math.hypot(dx, dy)
        if (dist < 180) {
          ctx.beginPath()
          ctx.moveTo(p1.x, p1.y)
          ctx.lineTo(p2.x, p2.y)
          ctx.strokeStyle = `rgba(${hexToRgb(currentTheme.accent).join(',')}, ${0.04 * (1 - dist/180)})`
          ctx.lineWidth = 0.5
          ctx.stroke()
        }
      }

      animationId = requestAnimationFrame(loop)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('mouseleave', onMouseLeave)
    window.addEventListener('resize', resize)

    resize()
    onScroll()
    loop(performance.now())

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseleave', onMouseLeave)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none hw"
      aria-hidden="true"
      style={{ background: 'transparent' }}
    />
  )
}