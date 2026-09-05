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

  // Exact CRT Glass bounds calibration based on 1376x768 native image
  // Bounding box of inner CRT glass: x=639.5, y=336, w=105, h=89
  // cx = 692.0 (50.29%), cy = 380.5 (49.54%)
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

  // Animated CRT static noise on the TV screen
  useEffect(() => {
    if (reducedMotion() || !canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animId
    const w = (canvas.width = 180)
    const h = (canvas.height = 140)
    const imgData = ctx.createImageData(w, h)
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

      // 1. Fade out the top editorial positioning statement as scroll begins
      tl.to('.hero-editorial-copy', {
        opacity: 0,
        y: -30,
        duration: 0.25,
        ease: 'power2.inOut',
      }, 0)

      // 2. Fade out the bottom watermark and subtle scroll cue early
      tl.to(['.hero-watermark', '.hero-scroll-cue'], {
        opacity: 0,
        y: 15,
        duration: 0.2,
        ease: 'power2.inOut',
      }, 0)

      // 3. Zoom the unified stage directly into the monitor screen center
      // Total duration 1.0 maps across the full scroll distance
      tl.to('.hero-zoom-stage', {
        scale: FINAL_SCALE,
        transformOrigin: '50.29% 49.54%',
        duration: 1.0,
        ease: 'power2.inOut',
      }, 0)

      // 4. As zoom starts, fade out the initial small HUD
      tl.to('.hero-screen-hud', {
        opacity: 0,
        duration: 0.15,
        ease: 'power1.in',
      }, 0.05)

      // 5. Reveal statement right as the CRT begins expanding
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

      // 6. Fade statement out as screen completes filling viewport
      tl.to('.hero-screen-statement', {
        opacity: 0,
        scale: 1.3,
        duration: 0.2,
        ease: 'power1.in',
      }, 0.70)

      // 7. Seamlessly dissolve the hero container as the screen reaches 100vw
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
      {/* ─── 1. Unified Zoom Stage (Background Image + Monitor Screen locked in exact unison) ─── */}
      <div
        className="hero-zoom-stage absolute inset-0 hw pointer-events-none"
        style={{
          transformOrigin: '50.29% 49.54%',
          willChange: 'transform',
        }}
      >
        {/* Background Image: Museum Gallery with Vintage Monitor on Concrete Plinth */}
        <div
          className="hero-bg absolute inset-0 bg-cover bg-center bg-no-repeat hw"
          style={{
            backgroundImage: 'url(./assets/hero-tv.jpg)',
          }}
        />

        {/* Subtle Museum Room Vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 70% 70% at 50.29% 49.54%, transparent 0%, rgba(18,18,18,0.18) 100%)',
          }}
        />

        {/* Vintage Monitor Screen Overlay (Locked to Glass Center inside the Stage) */}
        <div
          className="hero-screen-frame absolute z-10 pointer-events-none -translate-x-1/2 -translate-y-1/2"
          style={{
            left: glassStyle.left,
            top: glassStyle.top,
            width: glassStyle.width,
            height: glassStyle.height,
          }}
        >
        {/* Animated CRT Screen Phosphor & Noise with strict bezel clipping */}
        <div className="hero-screen-portal absolute inset-0 overflow-hidden rounded-[8px] sm:rounded-[10px] shadow-[inset_0_0_12px_rgba(0,0,0,0.9)] bg-[#070d09]">
          {/* Procedural CRT Noise Canvas */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full object-cover opacity-35 mix-blend-screen crt-flicker"
            aria-hidden="true"
          />

          {/* CRT Horizontal Scanlines */}
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

          {/* Moving CRT Sweep Beam */}
          <div className="crt-sweep-line" />

          {/* State A: Initial Unzoomed Screen Status HUD (Crisp, high-contrast, perfectly sized for 105x89 CRT) */}
          <div className="hero-screen-hud absolute inset-0 z-[4] flex flex-col items-center justify-between p-1.5 select-none pointer-events-none">
            {/* Top Status Telemetry */}
            <div className="w-full flex items-center justify-between border-b border-[#39ff14]/30 pb-0.5 px-0.5">
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#39ff14] shadow-[0_0_6px_#39ff14] animate-pulse" />
                <span className="font-mono text-[7px] font-bold tracking-widest text-[#39ff14] uppercase">
                  LIVE
                </span>
              </div>
              <span className="font-mono text-[6.5px] font-medium text-[#39ff14]/80 tracking-wider">
                SYS.01
              </span>
            </div>

            {/* Center: Authoritative Identity */}
            <div className="flex flex-col items-center my-auto text-center px-1">
              <span className="font-mono text-[8.5px] font-bold tracking-[0.16em] uppercase text-[#e6fced] drop-shadow-[0_0_5px_rgba(57,255,20,0.7)]">
                VISHWAS
              </span>
              <span className="font-mono text-[6.5px] font-semibold tracking-[0.12em] uppercase text-[#39ff14] mt-0.5">
                DESIGN &bull; CODE
              </span>
            </div>

            {/* Bottom Terminal Prompt */}
            <div className="w-full flex items-center justify-center border-t border-[#39ff14]/25 pt-0.5">
              <span className="font-mono text-[6.5px] font-medium tracking-wider text-[#39ff14]/95 flex items-center gap-0.5">
                <span className="animate-pulse">&gt;</span> scroll to enter
              </span>
            </div>
          </div>

          {/* State B: Zoom-In Luminous Positioning Statement (Emerges during camera flight) */}
          <div className="hero-screen-statement absolute inset-0 z-[5] flex flex-col items-center justify-center p-2 text-center select-none pointer-events-none opacity-0">
            <span className="font-mono text-[5.5px] uppercase tracking-[0.25em] text-[#39ff14] mb-1 font-bold">
              [ POSITIONING ]
            </span>
            <h2 className="font-display italic text-[#f7f6f3] text-[8.5px] leading-[1.12] tracking-tight max-w-[86%] drop-shadow-[0_0_8px_rgba(255,255,255,0.85)]">
              &ldquo;I turn complex ideas into products people understand, trust, and remember.&rdquo;
            </h2>
            <p className="font-mono text-[4.8px] uppercase tracking-[0.18em] text-[#a8ffb2] mt-1 font-semibold">
              Systems Thinking Before Visual Polish
            </p>
          </div>
        </div>
      </div>
      </div>

      {/* ─── 2. Top Section: Architectural Identity & Refined Typographic Hierarchy ─── */}
      <div className="hero-editorial-copy absolute top-[8.5vh] sm:top-[9.5vh] inset-x-0 z-10 flex flex-col items-center text-center px-6 pointer-events-none">
        <div className="flex items-center gap-2 mb-2.5">
          <span className="w-1.5 h-1.5 rounded-full bg-bone opacity-60" />
          <p className="font-sans text-[0.68rem] sm:text-[0.74rem] font-semibold tracking-[0.26em] uppercase text-bone">
            Strategic Product Designer &amp; Design Engineer
          </p>
        </div>
        <h1 className="max-w-4xl font-display italic text-3xl sm:text-4xl md:text-5xl lg:text-[3.6rem] leading-[1.05] text-bone tracking-tight font-normal drop-shadow-sm">
          Design that ships. Code that feels.
        </h1>
        <p className="mt-3 max-w-lg font-sans text-xs sm:text-sm md:text-[0.92rem] font-normal leading-relaxed text-[#444444] tracking-wide">
          Designing &amp; engineering local-first AI tools, enterprise software systems,
          and tactile interactive prototypes in Bengaluru.
        </p>
      </div>

      {/* ─── 3. Shaded Editorial Watermark: Studio Archive Telemetry ─── */}
      <h2
        className="hero-watermark font-mono absolute z-[5] pointer-events-none select-none text-left whitespace-nowrap text-bone uppercase"
        style={{
          bottom: '2.2vh',
          left: '2.5rem',
          width: 'auto',
          fontSize: 'clamp(0.42rem, 0.78vw, 0.68rem)',
          lineHeight: 1.2,
          letterSpacing: '0.13em',
          opacity: 0.45,
        }}
      >
        12°58'N 77°35'E — STUDIO ARCHIVE — BENGALURU, IN
      </h2>

      {/* ─── 4. Subtle Minimalist Scroll Indicator (Whisper-quiet hairline, no pill) ─── */}
      <div className="hero-scroll-cue absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center pointer-events-none opacity-45">
        <div className="w-[1px] h-6 bg-bone/25 relative overflow-hidden rounded-full">
          <div className="w-full h-2.5 bg-bone animate-scroll-drop absolute top-0" />
        </div>
        <span className="font-sans text-[0.52rem] tracking-[0.3em] uppercase text-bone mt-2 select-none">
          scroll
        </span>
      </div>
    </section>
  )
}
