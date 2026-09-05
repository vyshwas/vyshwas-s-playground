import { useLayoutEffect, useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { reducedMotion, scrollToTarget } from '../App.jsx'

gsap.registerPlugin(ScrollTrigger)

export default function Hero() {
  const root = useRef(null)
  const canvasRef = useRef(null)

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
        // Soft amber-white phosphor noise matching the museum CRT screen
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
      // 16:9 Museum Skylight TV exact screen coordinates:
      // Center X = 48.7%, Center Y = 65.1%
      const TV_X = '48.7%'
      const TV_Y = '65.1%'
      const FINAL_SCALE = 11.2

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

      // 2. Fade out the bottom watermark and high-contrast scroll cue early
      tl.to(['.hero-watermark', '.hero-scroll-cue'], {
        opacity: 0,
        y: 15,
        duration: 0.2,
        ease: 'power2.inOut',
      }, 0)

      // 3. Zoom the museum background image directly into the TV screen center
      tl.to('.hero-bg', {
        scale: FINAL_SCALE,
        ease: 'power2.in',
      }, 0)

      // 4. Scale the TV screen frame in exact lockstep
      tl.to('.hero-screen-frame', {
        scale: FINAL_SCALE,
        ease: 'power2.in',
      }, 0)

      // 5. Fade out the screen text early as the camera approaches the glass
      tl.to('.hero-screen-text', {
        opacity: 0,
        scale: 1.5,
        duration: 0.35,
        ease: 'power1.in',
      }, 0.08)

      // 6. As the TV screen expands to fill 100% of the viewport (progress 0.78 -> 1.0),
      // seamlessly dissolve the hero container so the camera enters directly into Chapter 02 (The Lab)
      tl.to(root.current, {
        opacity: 0,
        duration: 0.22,
        ease: 'power1.inOut',
      }, 0.78)

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
      {/* ─── 1. Museum Gallery Background Image (16:9 Widescreen) ─── */}
      <div
        className="hero-bg absolute inset-0 bg-cover bg-center bg-no-repeat hw"
        style={{
          backgroundImage: 'url(./assets/hero-tv.jpg)',
          transformOrigin: '48.7% 65.1%',
          willChange: 'transform',
        }}
      />

      {/* ─── 2. Subtle Museum Room Vignette ─── */}
      <div
        className="absolute inset-0 z-[4] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 70% at 48.7% 65.1%, transparent 0%, rgba(18,18,18,0.22) 100%)',
        }}
      />

      {/* ─── 3. Top Section: Prominent Editorial Positioning Statement ─── */}
      <div className="hero-editorial-copy absolute top-[12vh] inset-x-0 z-10 flex flex-col items-center text-center px-6 pointer-events-none">
        {/* Recruiter Role Eyebrow Tag */}
        <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-white/80 backdrop-blur-md border border-black/10 shadow-[0_2px_10px_rgba(0,0,0,0.04)]">
          <span className="w-1.5 h-1.5 rounded-full bg-bone animate-pulse" />
          <span className="font-sans text-[0.68rem] md:text-[0.74rem] font-semibold tracking-[0.25em] uppercase text-bone">
            [ PRODUCT DESIGNER &amp; DESIGN ENGINEER ]
          </span>
        </div>

        {/* Primary Positioning Statement (Bold, Confident, Immediate Recruiter Clarity) */}
        <h1 className="max-w-4xl font-display text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] leading-[1.08] text-bone tracking-tight drop-shadow-sm">
          I turn complex ideas into products people understand, trust, and remember.
        </h1>

        {/* Supporting Subheading */}
        <p className="mt-3 max-w-xl font-sans text-xs sm:text-sm md:text-[0.92rem] font-normal leading-relaxed text-[#444444] tracking-wide">
          Systems thinking before visual polish. Designing &amp; building local-first AI tools,
          production systems, and interactive prototypes in Bengaluru.
        </p>
      </div>

      {/* ─── 4. TV Screen Overlay (Positioned directly over the 1970s CRT tube) ─── */}
      <div
        className="hero-screen-frame absolute z-10 pointer-events-none"
        style={{
          left: '48.7%',
          top: '65.1%',
          width: 'clamp(120px, 10.9vw, 210px)',
          height: 'clamp(80px, 7.3vw, 140px)',
          transform: 'translate(-50%, -50%)',
          transformOrigin: 'center center',
          willChange: 'transform',
        }}
      >
        {/* Animated CRT Screen Phosphor & Noise */}
        <div className="hero-screen-portal absolute inset-0 overflow-hidden rounded-[6px] shadow-[inset_0_0_14px_rgba(0,0,0,0.8)]">
          {/* Procedural CRT Noise Canvas */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full object-cover opacity-45 mix-blend-screen"
            aria-hidden="true"
          />

          {/* CRT Horizontal Scanlines */}
          <div
            className="absolute inset-0 pointer-events-none opacity-40"
            style={{
              backgroundImage: `repeating-linear-gradient(
                to bottom,
                transparent 0px,
                transparent 2px,
                rgba(0, 0, 0, 0.4) 2px,
                rgba(0, 0, 0, 0.4) 4px
              )`,
            }}
          />

          {/* Moving CRT Sweep Beam */}
          <div className="crt-sweep-line" />
        </div>

        {/* Screen Text Content (Strict Monochrome CRT Interface) */}
        <div className="hero-screen-text absolute inset-0 z-[3] flex flex-col items-center justify-center p-2 text-center crt-flicker">
          <span className="font-sans text-[0.4rem] font-bold tracking-[0.25em] uppercase text-white/70 mb-1">
            [ SIGNAL: LIVE ]
          </span>

          <h2
            className="font-display text-white text-center leading-[1.08] tracking-tight"
            style={{
              fontSize: 'clamp(0.6rem, 0.85vw, 1.1rem)',
              textShadow: '0 0 8px rgba(255,255,255,0.6)',
            }}
          >
            Design that ships.
            <br />
            Code that feels.
          </h2>

          <p
            className="mt-1 font-sans text-white/80 font-medium tracking-[0.16em] uppercase text-center"
            style={{
              fontSize: 'clamp(0.32rem, 0.42vw, 0.52rem)',
              textShadow: '0 0 6px rgba(255,255,255,0.4)',
            }}
          >
            Local-First AI • Interactive Systems
          </p>
        </div>
      </div>

      {/* ─── 5. Shaded Editorial Watermark: Studio Archive Telemetry ─── */}
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

      {/* ─── 6. High-Contrast "Scroll to Explore" Navigation Capsule ─── */}
      <div className="hero-scroll-cue absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
        <button
          type="button"
          onClick={() => scrollToTarget('#lab')}
          className="group pointer-events-auto flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/95 backdrop-blur-md border border-black/20 shadow-[0_6px_20px_rgba(0,0,0,0.12)] hover:border-black/50 hover:shadow-[0_8px_28px_rgba(0,0,0,0.18)] transition-all duration-300 focus:outline-none"
          data-cursor="magnetic"
          aria-label="Scroll to enter the Lab"
        >
          {/* Animated Downward Indicator */}
          <div className="w-3.5 h-5 rounded-full border border-black/50 flex justify-center pt-1">
            <span className="w-1 h-1.5 rounded-full bg-bone animate-bounce" />
          </div>

          <span className="font-sans text-[0.68rem] font-semibold tracking-[0.22em] uppercase text-bone">
            Scroll to explore
          </span>

          <span className="font-sans text-[0.72rem] text-black/50 group-hover:translate-y-0.5 transition-transform">
            ↓
          </span>
        </button>
      </div>
    </section>
  )
}
