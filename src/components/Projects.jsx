import { useLayoutEffect, useState, useRef, useEffect, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { reducedMotion } from '../App.jsx'

gsap.registerPlugin(ScrollTrigger)

const projects = [
  {
    no: '01',
    title: 'Nocturne',
    tagline: 'A checkout concept that absorbs blame and preserves trust.',
    year: '2024',
    role: 'Product Design & Prototyping',
    context: 'Late-night checkout flows for food delivery often suffer from high cart abandonment due to last-minute fees and payment anxiety.',
    problem: 'When a payment fails or extra fees are added at the very end, generic red error messages and sudden price jumps destroy trust. Users feel cheated, resulting in high abandonment at the highest-friction step of the funnel.',
    approach: 'I designed a checkout experience optimized to preserve trust. The UI actively absorbs blame for failures with empathetic error states, proactively explains late-night surges ("Night owl fee waived"), and highlights UPI-first payment methods with clear, contextual trust cues right above the CTA.',
    outcome: [
      'Itemised transparency with proactive fee waivers',
      '"Blame-absorbing" failure states that guide recovery',
      'Strategic trust markers at peak hesitation moments'
    ],
    stack: ['Figma', 'Protopie'],
    protoUrl: './assets/nocturne-prototype.html?v=2',
    protoScale: 0.65,
    preview: './assets/project_nocturne.png',
    previewAlt: 'Nocturne night-mode storefront with surge timer and UPI-first search',
    pos: { top: '26%', left: '5%', rotate: '-8deg' },
    size: 'w-[260px] h-[310px] md:w-[300px] md:h-[370px] lg:w-[320px] lg:h-[400px]',
  },
  {
    no: '02',
    title: 'Munim',
    tagline: 'Supervised delegation and transparent ledger loops.',
    year: '2024',
    role: 'Product Design & Prototyping',
    context: 'Small businesses and households often need to delegate digital payments to staff or family members without handing over full banking access.',
    problem: 'Current delegation relies on sharing OTPs, physical cards, or screenshots. These workarounds are highly insecure, unscalable, and lack accountability, forcing users to choose between convenience and security.',
    approach: 'Munim introduces a "supervised delegation" model inspired by the traditional \'bahi-khata\' (ledger). It features a robust mandate system, supervised payment requests via a secure UPI PIN sheet, and a live countdown hold mechanism for high-risk transactions.',
    outcome: [
      'Trusted merchant price jumps are automatically held',
      'Mid-hold cancellation prevents unauthorized clearing',
      'Transparent ledger loops for real-time auditability'
    ],
    stack: ['Figma', 'Protopie'],
    protoUrl: './assets/munim-prototype.html',
    protoScale: 0.65,
    preview: './assets/project_munim.png',
    previewAlt: 'Munim ledger showing spend against a fixed NPCI delegation ceiling',
    pos: { bottom: '6%', left: '30%', rotate: '6deg' },
    size: 'w-[250px] h-[300px] md:w-[280px] md:h-[350px] lg:w-[300px] lg:h-[380px]',
  },
  {
    no: '03',
    title: 'Awara',
    tagline: 'A living itinerary system that adapts as your day changes.',
    year: '2024',
    role: 'Product Design & Prototyping',
    context: 'Travel planning apps treat itineraries as static documents that are generated once before the trip and rarely updated.',
    problem: 'Once a traveler arrives, plans inevitably change due to weather, delays, or spontaneity. Most tools fail to adapt, leaving users with a broken schedule and forcing them back to manual searching in maps and browsers.',
    approach: 'Awara acts as an active travel companion. It continuously adapts the schedule as the day unfolds. If a user spends too long at a museum, the app proactively suggests adjusting the next activity, seamlessly recalculating travel times and options.',
    outcome: [
      'Live, context-aware itinerary that heals itself',
      'Adjust sheet with proactive, localized alternatives',
      'Striking vermilion-and-ink editorial visual system'
    ],
    stack: ['Figma', 'Protopie'],
    protoUrl: './assets/awara-prototype.html',
    protoScale: 1.0,
    preview: './assets/project_awara.png',
    previewAlt: 'Awara identity card — awara, wanderer; a free-spirited traveler',
    pos: { top: '28%', right: '5%', rotate: '5deg' },
    size: 'w-[270px] h-[320px] md:w-[310px] md:h-[380px] lg:w-[340px] lg:h-[420px]',
  }
]

export default function Projects() {
  const containerRef = useRef(null)
  const [activeProto, setActiveProto] = useState(null)
  const drawerRef = useRef(null)

  // Close drawer on Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && activeProto) {
        setActiveProto(null)
      }
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [activeProto])

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (activeProto) {
      document.body.style.overflow = 'hidden'
      // Also pause Lenis smooth scroll
      window.__lenis?.stop()
    } else {
      document.body.style.overflow = ''
      window.__lenis?.start()
    }
    return () => {
      document.body.style.overflow = ''
      window.__lenis?.start()
    }
  }, [activeProto])

  // Floating animation for cards (desktop only — mobile uses static stacked layout)
  useLayoutEffect(() => {
    if (reducedMotion()) return
    const isMobile = window.innerWidth < 768
    if (isMobile) return // No float on mobile

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray('.plnty-card')
      cards.forEach((card, i) => {
        gsap.to(card, {
          y: 'random(-12, 12)',
          x: 'random(-8, 8)',
          rotation: '+=random(-2, 2)',
          duration: 'random(3, 5)',
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: i * 0.3,
          force3D: true,
        })
      })
    }, containerRef.current)
    return () => ctx.revert()
  }, [])

  // Drawer slide animation
  useLayoutEffect(() => {
    if (!drawerRef.current) return
    if (activeProto) {
      gsap.to(drawerRef.current, { x: '0%', duration: 0.6, ease: 'expo.out' })
    } else {
      gsap.to(drawerRef.current, { x: '100%', duration: 0.5, ease: 'expo.in' })
    }
  }, [activeProto])

  const openDrawer = useCallback((p) => setActiveProto(p), [])
  const closeDrawer = useCallback(() => setActiveProto(null), [])

  return (
    <>
      <section
        id="experiments"
        ref={containerRef}
        className="relative z-10 w-full bg-[#fdfdfc] overflow-hidden font-sans"
      >
        {/* ─── DESKTOP LAYOUT: Scattered plnty-style canvas ─── */}
        <div className="hidden md:flex relative min-h-[900px] h-[100vh] items-center justify-center">
          
          {/* Isometric Grid Background */}
          <div className="absolute inset-0 z-0 overflow-hidden opacity-25 pointer-events-none flex items-center justify-center">
            <div 
              className="absolute w-[200vw] h-[200vh]"
              style={{
                backgroundImage: `linear-gradient(45deg, #e0e0e0 25%, transparent 25%, transparent 75%, #e0e0e0 75%, #e0e0e0), linear-gradient(45deg, #e0e0e0 25%, transparent 25%, transparent 75%, #e0e0e0 75%, #e0e0e0)`,
                backgroundSize: `80px 80px`,
                backgroundPosition: `0 0, 40px 40px`,
                transform: `rotateX(60deg) rotateZ(-45deg)`,
                transformOrigin: `center center`
              }}
            />
          </div>

          {/* Chapter title — anchored clear of the scattered card zone */}
          <div className="absolute top-[9vh] left-1/2 -translate-x-1/2 z-30 pointer-events-none text-center w-full px-6">
            <p className="font-sans text-[0.65rem] uppercase tracking-[0.35em] text-titanium mb-4">
              [ Chapter 03 — Selected Works ]
            </p>
            <h2 className="font-display italic text-[#121212] text-5xl md:text-7xl tracking-tight m-0 leading-[0.95]">
              Selected Works
            </h2>
            <p className="font-sans text-[0.7rem] uppercase tracking-[0.3em] text-titanium mt-4">
              2024 &ndash; 2026
            </p>
            <p className="font-sans text-[0.75rem] text-titanium/80 mt-3 max-w-[26rem] mx-auto leading-relaxed">
              Each project ships with a fully clickable prototype. Select any card.
            </p>
          </div>

          {/* Scattered Project Cards (desktop) */}
          <div className="absolute inset-0 z-20 w-full h-full max-w-[1600px] mx-auto pointer-events-none">
            {projects.map((p) => (
              <div
                key={p.no}
                className={`plnty-card absolute ${p.size} rounded-[2.5rem] shadow-2xl p-6 md:p-8 flex flex-col justify-between overflow-hidden cursor-pointer pointer-events-auto group`}
                style={{ ...p.pos, boxShadow: '0 20px 40px -10px rgba(0,0,0,0.2)' }}
                onClick={() => openDrawer(p)}
                data-cursor="hover"
              >
                {/* Obsidian ink surface */}
                <div className="absolute inset-0 bg-[#141414]" />

                {/* Real interface proof */}
                <img
                  src={p.preview}
                  alt={p.previewAlt}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-x-0 top-0 h-[62%] w-full object-cover object-top opacity-90 transition-opacity duration-500 group-hover:opacity-100"
                />
                {/* Scrim: keeps the title legible over any screenshot */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#141414]/88 to-[#141414]" />
                <div className="absolute inset-0 rounded-[2.5rem] border border-white/10" />

                <div className="relative z-10 flex justify-between items-start">
                  <span className="bg-black/60 text-[#f7f6f3] px-4 py-1.5 rounded-full font-sans text-xs tracking-[0.2em] uppercase border border-white/10 backdrop-blur-sm">
                    {p.no}
                  </span>
                  <div className="w-10 h-10 rounded-full bg-black/60 flex items-center justify-center border border-white/10 backdrop-blur-sm transition-transform group-hover:scale-110">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f7f6f3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </div>
                </div>

                <div className="relative z-10 mt-auto">
                  <h3 className="font-display italic text-[#f7f6f3] text-3xl md:text-4xl lg:text-5xl tracking-tight mb-2">
                    {p.title}
                  </h3>
                  <p className="text-[#f7f6f3]/70 text-sm max-w-[90%] leading-snug mb-4">
                    {p.tagline}
                  </p>
                  <span className="inline-flex items-center gap-2 text-[#f7f6f3] text-[0.65rem] uppercase tracking-[0.25em] opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    View Prototype
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </span>
                </div>
              </div>
            ))}

          </div>
        </div>

        {/* ─── MOBILE LAYOUT: Stacked scrollable cards ─── */}
        <div className="md:hidden px-5 py-16">
          <div className="mb-10 text-center">
            <p className="font-sans text-[0.6rem] uppercase tracking-[0.35em] text-titanium mb-3">
              [ Chapter 03 — Selected Works ]
            </p>
            <h2 className="font-display italic text-[#121212] text-4xl tracking-tight leading-[0.95] m-0">
              Selected Works
            </h2>
            <p className="font-sans text-[0.65rem] uppercase tracking-[0.3em] text-titanium mt-3">
              2024 &ndash; 2026
            </p>
          </div>
          
          <div className="flex flex-col gap-6">
            {projects.map((p) => (
              <div
                key={p.no}
                className={`relative w-full rounded-[2rem] shadow-xl p-6 flex flex-col justify-between overflow-hidden cursor-pointer min-h-[280px] active:scale-[0.98] transition-transform`}
                onClick={() => openDrawer(p)}
                data-cursor="hover"
              >
                <div className="absolute inset-0 bg-[#141414]" />
                <img
                  src={p.preview}
                  alt={p.previewAlt}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-x-0 top-0 h-[54%] w-full object-cover object-top opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#141414]/88 to-[#141414]" />
                <div className="absolute inset-0 rounded-[2rem] border border-white/10" />

                <div className="relative z-10 flex justify-between items-start">
                  <span className="bg-black/60 text-[#f7f6f3] px-3 py-1 rounded-full font-sans text-[0.65rem] tracking-[0.2em] uppercase border border-white/10 backdrop-blur-sm">
                    {p.no}
                  </span>
                  <div className="w-9 h-9 rounded-full bg-black/60 flex items-center justify-center border border-white/10 backdrop-blur-sm">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#f7f6f3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </div>
                </div>

                <div className="relative z-10 mt-auto">
                  <h3 className="font-display italic text-[#f7f6f3] text-3xl tracking-tight mb-1.5">
                    {p.title}
                  </h3>
                  <p className="text-[#f7f6f3]/70 text-sm leading-snug mb-3">
                    {p.tagline}
                  </p>
                  <span className="inline-flex items-center gap-2 text-[#f7f6f3] text-[0.65rem] uppercase tracking-[0.25em]">
                    View Prototype →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PROTOTYPE DRAWER ─── */}
      <div
        ref={drawerRef}
        className="fixed inset-0 z-[99999] flex justify-end pointer-events-none"
        style={{ transform: 'translateX(100%)' }}
      >
        {/* Scrim */}
        <div
          className="absolute inset-0 bg-black/50 pointer-events-auto"
          onClick={closeDrawer}
        />
        
        {/* Drawer panel */}
        <div className="relative w-full md:w-[92vw] lg:w-[88vw] max-w-7xl h-full bg-[#121212] pointer-events-auto shadow-2xl flex flex-col md:flex-row border-l border-white/10 overflow-hidden">
          
          {/* Close button (always visible) */}
          <button
            onClick={closeDrawer}
            className="absolute top-5 right-5 z-50 flex h-11 items-center gap-2.5 rounded-full border border-white/15 bg-black/60 px-4 font-sans text-[0.65rem] uppercase tracking-[0.25em] text-[#f7f6f3] backdrop-blur-md transition-colors hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f7f6f3]"
            aria-label="Close drawer"
            data-cursor="hover"
          >
            Esc
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          {/* Left Panel: Project Write-up */}
          <div className="w-full h-[45vh] md:h-full md:w-[380px] lg:w-[460px] bg-[#1a1a1a] flex-shrink-0 border-b md:border-b-0 md:border-r border-white/10 overflow-y-auto overscroll-contain p-6 md:p-10 block">
            {activeProto && (
              <div className="space-y-7 pb-10">
                {/* Header */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="font-sans text-xs text-white/40 uppercase tracking-widest">
                      {activeProto.no}
                    </span>
                    <span className="w-px h-3 bg-white/20" />
                    <span className="font-sans text-xs text-white/40 uppercase tracking-widest">
                      {activeProto.year}
                    </span>
                  </div>
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 tracking-tight">
                    {activeProto.title}
                  </h2>
                  <p className="text-white/70 text-sm md:text-base leading-relaxed">
                    {activeProto.tagline}
                  </p>
                </div>

                {/* Meta */}
                <div className="flex gap-8">
                  <div className="flex flex-col gap-1">
                    <span className="font-sans text-[10px] uppercase tracking-widest text-white/35">Role</span>
                    <span className="text-white/85 text-sm">{activeProto.role}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="font-sans text-[10px] uppercase tracking-widest text-white/35">Stack</span>
                    <span className="text-white/85 text-sm">{activeProto.stack.join(', ')}</span>
                  </div>
                </div>

                <hr className="border-white/8" />

                {/* Context */}
                {activeProto.context && (
                  <div>
                    <h4 className="font-sans text-[10px] uppercase tracking-widest text-white/35 mb-3">Context</h4>
                    <p className="text-white/75 text-sm leading-relaxed">{activeProto.context}</p>
                  </div>
                )}

                {/* Problem */}
                <div>
                  <h4 className="font-sans text-[10px] uppercase tracking-widest text-white/35 mb-3">The Problem</h4>
                  <p className="text-white/75 text-sm leading-relaxed">{activeProto.problem}</p>
                </div>

                {/* Solution */}
                <div>
                  <h4 className="font-sans text-[10px] uppercase tracking-widest text-white/35 mb-3">The Solution</h4>
                  <p className="text-white/75 text-sm leading-relaxed">{activeProto.approach}</p>
                </div>

                {/* Outcome */}
                <div>
                  <h4 className="font-sans text-[10px] uppercase tracking-widest text-white/35 mb-3">Impact & Outcomes</h4>
                  <ul className="flex flex-col gap-2">
                    {activeProto.outcome.map((item, i) => (
                      <li key={i} className="flex gap-2.5 text-sm text-white/75 leading-relaxed">
                        <span className="text-white/30 mt-0.5">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Scroll indicator for mobile — tells user the prototype is below */}
                <div className="md:hidden text-center pt-4 border-t border-white/8">
                  <span className="font-sans text-[10px] uppercase tracking-widest text-white/40">
                    ↓ Scroll down for interactive prototype
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel: Interactive Prototype */}
          <div className="flex-1 w-full h-[55vh] md:h-full bg-black relative flex items-center justify-center p-4 overflow-hidden">
            <div className="absolute inset-0 bg-void duotone" />
            
            {/* Ambient glows behind the prototype */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[80%] rounded-full bg-white blur-[120px] opacity-[0.07]" />

            {activeProto && (
              <div className="relative z-10 w-full h-full max-w-[440px] max-h-[900px] flex items-center justify-center mx-auto">
                <iframe
                  src={activeProto.protoUrl}
                  title={`${activeProto.title} Prototype`}
                  className="w-full h-full rounded-[3rem] shadow-2xl border-[6px] border-white/5 bg-black hw origin-center transition-transform duration-500"
                  style={{
                    transform: `scale(${activeProto.protoScale || 1})`,
                    clipPath: 'inset(0 round 3rem)'
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
