import { useLayoutEffect, useRef, useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { reducedMotion } from '../App.jsx'

gsap.registerPlugin(ScrollTrigger)

export default function Hero() {
  const root = useRef(null)
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

      // Initialize the sharp text overlay
      gsap.set('.hero-statement-overlay', { xPercent: -50, yPercent: -50, scale: 1/12 })

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

      // 4. Scale the statement overlay perfectly in sync with the zoom
      tl.to('.hero-statement-overlay', {
        scale: 1.0,
        duration: 1.0,
        ease: 'power2.inOut',
      }, 0)

      // 5. Stagger reveal the statement text as we zoom in
      tl.fromTo('.hero-statement-overlay > *', 
        { opacity: 0, y: 8 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.15,
          duration: 0.4,
          ease: 'power2.out',
        }, 
        0.25
      )

      // 6. Dissolve hero as screen fills viewport
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
          Strategic product designer and creative technologist bridging the gap between design vision and front-end execution. I craft interfaces that feel inevitable.
        </p>
      </div>

      {/* ─── 3. Sharp Second Positioning Statement ─── */}
      {/* Placed outside the 12x zoom stage to prevent rasterization blur. GSAP will scale it from 1/12 to 1.0 */}
      <div 
        className="hero-statement-overlay absolute z-[30] pointer-events-none flex flex-col items-center justify-center text-center"
        style={{
          left: '50.29%',
          top: '49.54%',
          width: '100vw',
          height: '100vh',
        }}
      >
        <span className="font-mono uppercase tracking-[0.25em] text-cyan font-bold mb-6 drop-shadow-md"
          style={{ fontSize: 'clamp(0.8rem, 1.2vw, 1rem)' }}
        >
          [ POSITIONING ]
        </span>
        <h2 className="statement-word font-display italic text-bone leading-[1.15] tracking-tight drop-shadow-[0_0_12px_rgba(255,255,255,0.4)] mb-8 max-w-4xl"
          style={{ fontSize: 'clamp(3rem, 6vw, 5rem)' }}
        >
          &ldquo;I turn complex ideas into products people understand, trust, and remember.&rdquo;
        </h2>
        <p className="statement-word font-mono uppercase tracking-[0.18em] text-cyan/80 font-semibold drop-shadow-sm"
          style={{ fontSize: 'clamp(0.8rem, 1vw, 1rem)' }}
        >
          Systems Thinking Before Visual Polish
        </p>
      </div>

      {/* ─── 4. Watermark & Scroll Cue ─── */}
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
