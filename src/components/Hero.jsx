import { useLayoutEffect, useRef, useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { reducedMotion } from '../App.jsx'

gsap.registerPlugin(ScrollTrigger)

export default function Hero() {
  const root = useRef(null)
  const canvasRef = useRef(null)
  const [glassStyle, setGlassStyle] = useState({
    left: '50.29%',
    top: '49.54%',
    width: '105px',
    height: '89px',
  })

  // ─── CRT Glass Calibration ───
  // Native image: 1376×768. Inner CRT glass bounding box: x=639.5, y=336, w=105, h=89
  // Center of glass: cx = 692.0 (50.29%), cy = 380.5 (49.54%)
  useLayoutEffect(() => {
    function updateGlass() {
      if (!root.current) return
      const w = root.current.clientWidth
      const h = root.current.clientHeight
      const imgAspect = 1376 / 768
      const boxAspect = w / h
      let rw, rh, ox, oy
      if (boxAspect > imgAspect) {
        rw = w
        rh = w / imgAspect
        ox = 0
        oy = (h - rh) / 2
      } else {
        rh = h
        rw = h * imgAspect
        ox = (w - rw) / 2
        oy = 0
      }
      const cx = ox + rw * (692.0 / 1376)
      const cy = oy + rh * (380.5 / 768)
      const gw = rw * (105.0 / 1376)
      const gh = rh * (89.0 / 768)
      setGlassStyle({
        left: `${cx}px`,
        top: `${cy}px`,
        width: `${gw}px`,
        height: `${gh}px`,
      })
    }
    updateGlass()
    window.addEventListener('resize', updateGlass)
    return () => window.removeEventListener('resize', updateGlass)
  }, [])

  // ─── CRT Static Noise Canvas ───
  useEffect(() => {
    if (reducedMotion() || !canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animId
    const cw = (canvas.width = 180)
    const ch = (canvas.height = 140)
    const imgData = ctx.createImageData(cw, ch)
    const buffer32 = new Uint32Array(imgData.data.buffer)

    const drawNoise = () => {
      const len = buffer32.length
      for (let i = 0; i < len; i++) {
        const gray = (Math.random() * 55 + 20) | 0
        const tintR = Math.min(255, gray + 28)
        const tintG = Math.min(255, gray + 18)
        buffer32[i] = (230 << 24) | (gray << 16) | (tintG << 8) | tintR
      }
      ctx.putImageData(imgData, 0, 0)
      animId = requestAnimationFrame(drawNoise)
    }

    drawNoise()
    return () => cancelAnimationFrame(animId)
  }, [])

  // ─── Scroll-Driven Zoom Animation ───
  useLayoutEffect(() => {
    if (reducedMotion()) return

    const ctx = gsap.context(() => {
      const FINAL_SCALE = 12.0

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: '+=100%',
          scrub: 0.6,
          pin: true,
          pinSpacing: false,
          anticipatePin: 1,
        },
      })

      // 1. Editorial copy fades up and out
      tl.to('.hero-editorial-copy', {
        opacity: 0,
        y: -40,
        duration: 0.25,
        ease: 'power2.inOut',
      }, 0)

      // 2. Bottom elements fade out
      tl.to(['.hero-watermark', '.hero-scroll-cue'], {
        opacity: 0,
        y: 15,
        duration: 0.2,
        ease: 'power2.inOut',
      }, 0)

      // 3. Zoom into CRT monitor
      tl.to('.hero-zoom-stage', {
        scale: FINAL_SCALE,
        transformOrigin: '50.29% 49.54%',
        duration: 1.0,
        ease: 'power2.inOut',
      }, 0)

      // 4. Fade out HUD as zoom starts
      tl.to('.hero-screen-hud', {
        opacity: 0,
        duration: 0.15,
        ease: 'power1.in',
      }, 0.05)

      // 5. Reveal positioning statement during zoom
      tl.fromTo('.hero-screen-statement',
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1.0,
          duration: 0.35,
          ease: 'power2.out',
        },
        0.15
      )

      // 6. Fade statement out as screen fills viewport
      tl.to('.hero-screen-statement', {
        opacity: 0,
        scale: 1.3,
        duration: 0.2,
        ease: 'power1.in',
      }, 0.70)

      // 7. Dissolve hero
      tl.to(root.current, {
        opacity: 0,
        duration: 0.18,
        ease: 'power1.inOut',
      }, 0.82)

    }, root.current)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={root}
      id="hero"
      className="relative z-20 h-screen w-full overflow-hidden bg-void hw pointer-events-auto"
      aria-label="Vishwas Mehta — Strategic Product Designer & Design Engineer"
    >
      {/* ─── 1. Unified Zoom Stage ─── */}
      <div
        className="hero-zoom-stage absolute inset-0 hw pointer-events-none"
        style={{
          transformOrigin: '50.29% 49.54%',
          willChange: 'transform',
        }}
      >
        {/* Background Image */}
        <div
          className="hero-bg absolute inset-0 bg-cover bg-center bg-no-repeat hw"
          style={{
            backgroundImage: 'url(./assets/hero-tv.jpg)',
          }}
        />

        {/* Dark Gradient Scrim — anchors text contrast against bright gallery walls */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              linear-gradient(
                to bottom,
                rgba(18, 18, 18, 0.55) 0%,
                rgba(18, 18, 18, 0.18) 30%,
                transparent 48%,
                rgba(18, 18, 18, 0.06) 70%,
                rgba(18, 18, 18, 0.45) 100%
              )
            `,
          }}
        />

        {/* Subtle Radial Vignette — draws eye toward the CRT */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 65% 60% at 50.29% 49.54%, transparent 0%, rgba(18,18,18,0.22) 100%)',
          }}
        />

        {/* ─── CRT Monitor Screen Overlay ─── */}
        <div
          className="hero-screen-frame absolute z-10 pointer-events-none -translate-x-1/2 -translate-y-1/2"
          style={{
            left: glassStyle.left,
            top: glassStyle.top,
            width: glassStyle.width,
            height: glassStyle.height,
          }}
        >
          {/* CRT Phosphor Viewport — strict clipping with tight radius matching the real glass corners */}
          <div className="hero-screen-portal absolute inset-0 overflow-hidden rounded-[3px] sm:rounded-[4px] shadow-[inset_0_0_12px_rgba(0,0,0,0.9)] bg-[#070d09]">
            {/* Procedural CRT Noise */}
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full object-cover opacity-35 mix-blend-screen crt-flicker"
              aria-hidden="true"
            />

            {/* Horizontal Scanlines */}
            <div
              className="absolute inset-0 pointer-events-none opacity-30"
              style={{
                backgroundImage: `repeating-linear-gradient(
                  to bottom,
                  transparent 0px,
                  transparent 2px,
                  rgba(0, 0, 0, 0.5) 2px,
                  rgba(0, 0, 0, 0.5) 4px
                )`,
              }}
            />

            {/* CRT Sweep Beam */}
            <div className="crt-sweep-line" />

            {/* State A: Initial HUD — monospace telemetry, proportionally sized to CRT glass */}
            <div className="hero-screen-hud absolute inset-0 z-[4] flex flex-col items-center justify-between select-none pointer-events-none"
              style={{ padding: '6%' }}
            >
              {/* Top Status */}
              <div className="w-full flex items-center justify-between"
                style={{ borderBottom: '1px solid rgba(57,255,20,0.3)', paddingBottom: '4%' }}
              >
                <div className="flex items-center" style={{ gap: '4%' }}>
                  <span className="rounded-full bg-[#39ff14] shadow-[0_0_6px_#39ff14] animate-pulse"
                    style={{ width: 'clamp(3px, 6%, 6px)', height: 'clamp(3px, 6%, 6px)' }}
                  />
                  <span className="font-mono font-bold tracking-widest text-[#39ff14] uppercase"
                    style={{ fontSize: 'clamp(5px, 7%, 8px)', lineHeight: 1 }}
                  >
                    LIVE
                  </span>
                </div>
                <span className="font-mono font-medium text-[#39ff14]/80 tracking-wider"
                  style={{ fontSize: 'clamp(4.5px, 6%, 7px)', lineHeight: 1 }}
                >
                  SYS.01
                </span>
              </div>

              {/* Center: Identity */}
              <div className="flex flex-col items-center my-auto text-center" style={{ padding: '0 4%' }}>
                <span className="font-mono font-bold tracking-[0.16em] uppercase text-[#e6fced] drop-shadow-[0_0_5px_rgba(57,255,20,0.7)]"
                  style={{ fontSize: 'clamp(7px, 9%, 10px)', lineHeight: 1 }}
                >
                  VISHWAS
                </span>
                <span className="font-mono font-semibold tracking-[0.12em] uppercase text-[#39ff14]"
                  style={{ fontSize: 'clamp(5px, 6.5%, 8px)', lineHeight: 1, marginTop: '4%' }}
                >
                  DESIGN &bull; CODE
                </span>
              </div>

              {/* Bottom Prompt */}
              <div className="w-full flex items-center justify-center"
                style={{ borderTop: '1px solid rgba(57,255,20,0.25)', paddingTop: '4%' }}
              >
                <span className="font-mono font-medium tracking-wider text-[#39ff14]/95 flex items-center"
                  style={{ fontSize: 'clamp(5px, 6.5%, 8px)', lineHeight: 1, gap: '3%' }}
                >
                  <span className="animate-pulse">&gt;</span> scroll to enter
                </span>
              </div>
            </div>

            {/* State B: Positioning Statement — revealed during zoom flight */}
            <div className="hero-screen-statement absolute inset-0 z-[5] flex flex-col items-center justify-center text-center select-none pointer-events-none opacity-0"
              style={{ padding: '8%' }}
            >
              <span className="font-mono uppercase tracking-[0.25em] text-[#39ff14] font-bold"
                style={{ fontSize: 'clamp(4.5px, 5.5%, 7px)', lineHeight: 1, marginBottom: '6%' }}
              >
                [ POSITIONING ]
              </span>
              <h2 className="font-display italic text-[#f7f6f3] leading-[1.12] tracking-tight drop-shadow-[0_0_8px_rgba(255,255,255,0.85)]"
                style={{ fontSize: 'clamp(7px, 9%, 11px)', maxWidth: '88%' }}
              >
                &ldquo;I turn complex ideas into products people understand, trust, and remember.&rdquo;
              </h2>
              <p className="font-mono uppercase tracking-[0.18em] text-[#a8ffb2] font-semibold"
                style={{ fontSize: 'clamp(4px, 5%, 6px)', lineHeight: 1, marginTop: '6%' }}
              >
                Systems Thinking Before Visual Polish
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 2. Editorial Copy — Generous breathing room from nav, centered in upper golden zone ─── */}
      {/*
        LAYOUT MATH:
        Nav bar: fixed top-5 (20px) + h-12 (48px) = bottom at 68px.
        Using clamp(110px, 16vh, 170px) for top offset → minimum 42px clearance from nav.
        On 900px viewport: 16vh = 144px → 76px clearance. Luxurious.
        Text is #f7f6f3 on dark gradient scrim → guaranteed contrast > 7:1 WCAG AAA.
      */}
      <div className="hero-editorial-copy absolute inset-x-0 z-10 flex flex-col items-center text-center px-6 pointer-events-none"
        style={{ top: 'clamp(108px, 15vh, 155px)' }}
      >
        {/* Eyebrow */}
        <div className="flex items-center gap-2.5 mb-4">
          <span className="w-[5px] h-[5px] rounded-full shadow-[0_0_4px_rgba(247,246,243,0.6)]"
            style={{ backgroundColor: '#f7f6f3' }}
          />
          <p className="font-sans font-semibold tracking-[0.28em] uppercase drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]"
            style={{
              fontSize: 'clamp(0.6rem, 0.78vw, 0.76rem)',
              color: '#f7f6f3',
            }}
          >
            Strategic Product Designer &amp; Design Engineer
          </p>
        </div>

        {/* H1 — Big, confident, no apology */}
        <h1 className="max-w-4xl font-display italic leading-[1.0] tracking-tight font-normal drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)]"
          style={{
            fontSize: 'clamp(2.4rem, 5.6vw, 4.6rem)',
            color: '#f7f6f3',
          }}
        >
          Design that ships.<br className="hidden sm:block" /> Code that feels.
        </h1>

        {/* Subtitle */}
        <p className="mt-3 max-w-md font-sans font-normal leading-relaxed tracking-wide drop-shadow-[0_1px_4px_rgba(0,0,0,0.4)]"
          style={{
            fontSize: 'clamp(0.75rem, 0.95vw, 0.9rem)',
            color: 'rgba(247, 246, 243, 0.78)',
          }}
        >
          Designing &amp; engineering local-first AI tools, enterprise software systems,
          and tactile interactive prototypes in Bengaluru.
        </p>
      </div>

      {/* ─── 3. Studio Archive Watermark ─── */}
      <h2
        className="hero-watermark font-mono absolute z-[5] pointer-events-none select-none text-left whitespace-nowrap uppercase drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)]"
        style={{
          bottom: '2.2vh',
          left: '2.5rem',
          width: 'auto',
          fontSize: 'clamp(0.42rem, 0.78vw, 0.68rem)',
          lineHeight: 1.2,
          letterSpacing: '0.13em',
          color: 'rgba(247, 246, 243, 0.55)',
        }}
      >
        12°58'N 77°35'E — STUDIO ARCHIVE — BENGALURU, IN
      </h2>

      {/* ─── 4. Subtle Scroll Indicator ─── */}
      <div className="hero-scroll-cue absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center pointer-events-none"
        style={{ opacity: 0.5 }}
      >
        <div className="w-[1px] h-6 relative overflow-hidden rounded-full"
          style={{ backgroundColor: 'rgba(247, 246, 243, 0.2)' }}
        >
          <div className="w-full h-2.5 absolute top-0 animate-scroll-drop"
            style={{ backgroundColor: 'rgba(247, 246, 243, 0.7)' }}
          />
        </div>
        <span className="font-sans text-[0.52rem] tracking-[0.3em] uppercase mt-2 select-none"
          style={{ color: 'rgba(247, 246, 243, 0.5)' }}
        >
          scroll
        </span>
      </div>
    </section>
  )
}
