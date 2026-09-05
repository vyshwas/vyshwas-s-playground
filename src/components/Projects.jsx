import { useLayoutEffect, useState, useRef, useEffect, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { reducedMotion } from '../App.jsx'

gsap.registerPlugin(ScrollTrigger)

const projects = [
  {
    no: '01',
    title: 'Nocturne',
    tagline: 'Designing checkout trust at the point of highest hesitation.',
    year: '2024',
    role: 'CONCEPT · PRODUCT STRATEGY + INTERACTION',
    context: 'Late-night checkout flows for food delivery often suffer from high cart abandonment due to last-minute fees and payment anxiety.',
    problem: 'When a payment fails or extra fees are added at the very end, generic red error messages and sudden price jumps destroy trust. Users feel cheated, resulting in high abandonment at the highest-friction step of the funnel.',
    approach: 'I designed a checkout experience optimized to preserve trust. The UI actively absorbs blame for failures with empathetic error states, proactively explains late-night surges ("Night owl fee waived"), and highlights UPI-first payment methods with clear, contextual trust cues right above the CTA.',
    outcome: [
      'Itemised transparency with proactive fee waivers',
      '"Blame-absorbing" failure states that guide recovery',
      'Strategic trust markers at peak hesitation moments'
    ],
    stack: ['Figma', 'Protopie'],
    protoUrl: './assets/nocturne-prototype.html',
    preview: './assets/project_nocturne_checkout.png',
    previewAlt: 'Nocturne blame-absorbing checkout error receipt with saved order and state recovery',
    previewPos: 'object-[center_42%]',
    pos: { top: '26%', left: '4%', rotate: '-6deg' },
    size: 'w-[260px] h-[340px] md:w-[280px] md:h-[360px] lg:w-[290px] lg:h-[380px]',
  },
  {
    no: '02',
    title: 'Munim',
    tagline: 'Making agentic finance understandable without hiding control.',
    year: '2024',
    role: 'ACADEMIC · PRODUCT SYSTEMS + PROTOTYPING',
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
    preview: './assets/project_munim.png',
    previewAlt: 'Munim ledger showing spend against a fixed NPCI delegation ceiling',
    previewPos: 'object-top',
    pos: { bottom: '6%', left: '23%', rotate: '4deg' },
    size: 'w-[250px] h-[330px] md:w-[270px] md:h-[350px] lg:w-[280px] lg:h-[370px]',
  },
  {
    no: '03',
    title: 'Awara',
    tagline: 'Turning research into a product system—not a collection of screens.',
    year: '2025',
    role: 'CLIENT · RESEARCH + SYSTEMS DESIGN',
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
    preview: './assets/project_awara_itinerary.png',
    previewAlt: 'Awara living adaptive itinerary timeline showing Day 1 Old City Jaipur schedule and adjust sheets',
    previewPos: 'object-[center_12%]',
    pos: { top: '29%', left: 'calc(50% - 145px)', rotate: '-1deg' },
    size: 'w-[260px] h-[340px] md:w-[280px] md:h-[360px] lg:w-[290px] lg:h-[380px]',
  },
  {
    no: '04',
    title: 'The Whole Fruit',
    tagline: 'Brand strategy and packaging system built on restraint.',
    year: '2024',
    role: 'Strategist & Brand Designer',
    context: 'Wellness and consumer goods rely on loud claims and generic "premium" tropes that erode consumer trust.',
    problem: 'How can a product communicate distinct value at a glance—then continue delivering on that promise through every brand decision without relying on empty marketing claims?',
    approach: 'My M.Des dissertation project. The brief: build a wellness brand confident enough to look expensive without saying "premium" anywhere on the pack. I engineered a type-led system (bespoke mark, disciplined palette, packaging architecture) documented as a strategic positioning framework to demonstrate restraint as a design decision.',
    outcome: [
      'Comprehensive brand architecture & packaging system',
      'Documented strategic positioning framework for restraint',
      'M.Des dissertation project awarded top academic honors'
    ],
    stack: ['Figma', 'Illustrator', 'Packaging'],
    protoUrl: '',
    preview: './assets/project_wholefruit.png',
    previewAlt: 'The Whole Fruit packaging architecture and brand identity system',
    previewPos: 'object-center',
    link: 'https://www.behance.net/vishwashmehta',
    linkLabel: 'See Brand System ↗',
    pos: { bottom: '6%', right: '23%', rotate: '4deg' },
    size: 'w-[250px] h-[330px] md:w-[270px] md:h-[350px] lg:w-[280px] lg:h-[370px]',
  },
  {
    no: '05',
    title: 'Gamut',
    tagline: 'A color-and-type systems engine encoding design judgment into tokens.',
    year: '2025',
    role: 'Founder & Systems Designer',
    context: 'Product designers and frontend engineers frequently struggle with color accessibility and token architecture, relying on manual calculations or trial-and-error across themes.',
    problem: 'How might design tooling help teams reuse systematic judgment—not just raw hex codes—across growing design systems and themes?',
    approach: 'A color-and-type systems engine built from my resource, The Brand Color Bible. Encoded 60-30-10 color rules, ten laws of color, and archetype-driven harmonies directly into the engine so every palette is contrast-checked (WCAG 2.1) in both light and dark before export. Includes a generator, real-time fixer, and design token exporter.',
    outcome: [
      'Automated dual-mode light/dark contrast verification',
      'Production token export for Tailwind, CSS & JSON',
      'Live engine actively used by designers worldwide'
    ],
    stack: ['React', 'Design Tokens', 'Tailwind', 'Color Science'],
    protoUrl: '',
    preview: './assets/project_gamut.png',
    previewAlt: 'Gamut color-and-type design token engine interface',
    previewPos: 'object-top',
    link: 'https://vyshwas.github.io/gamut/',
    linkLabel: 'Launch Token Engine ↗',
    pos: { top: '26%', right: '4%', rotate: '-5deg' },
    size: 'w-[250px] h-[330px] md:w-[270px] md:h-[350px] lg:w-[280px] lg:h-[370px]',
  }
]

export default function Projects() {
  const containerRef = useRef(null)
  const [activeProto, setActiveProto] = useState(null)
  const [modalMode, setModalMode] = useState('prototype') // 'prototype' | 'spec'
  const [hudOpen, setHudOpen] = useState(false)
  const drawerRef = useRef(null)

  const openDrawer = useCallback((p) => {
    setActiveProto(p)
    setModalMode(p.protoUrl ? 'prototype' : 'spec')
    setHudOpen(false)
  }, [])

  const closeDrawer = useCallback(() => {
    setActiveProto(null)
    setHudOpen(false)
  }, [])

  // Robust Capture-Phase Escape Listener & Full-Tree Scroll Lock
  useEffect(() => {
    if (!activeProto) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        e.stopPropagation()
        closeDrawer()
      }
    }

    // Capture phase ensures Escape fires even if focus is inside the iframe
    window.addEventListener('keydown', handleKeyDown, { capture: true })

    const prevBodyOverflow = document.body.style.overflow
    const prevHtmlOverflow = document.documentElement.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    window.__lenis?.stop()

    return () => {
      window.removeEventListener('keydown', handleKeyDown, { capture: true })
      document.body.style.overflow = prevBodyOverflow
      document.documentElement.style.overflow = prevHtmlOverflow
      window.__lenis?.start()
    }
  }, [activeProto, closeDrawer])

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
      gsap.to(drawerRef.current, { x: '0%', duration: 0.5, ease: 'expo.out' })
    } else {
      gsap.to(drawerRef.current, { x: '100%', duration: 0.4, ease: 'expo.in' })
    }
  }, [activeProto])

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
              [ Chapter 04 — Selected Works ]
            </p>
            <h2 className="font-display italic text-[#121212] text-5xl md:text-7xl tracking-tight m-0 leading-[0.95]">
              Selected Works
            </h2>
            <p className="font-sans text-[0.7rem] uppercase tracking-[0.3em] text-titanium mt-4">
              2024 &ndash; 2026
            </p>
            <p className="font-sans text-[0.75rem] text-titanium/80 mt-3 max-w-[28rem] mx-auto leading-relaxed">
              Interactive systems, prototypes, and documented case studies. Select any card.
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
                  className={`absolute inset-x-0 top-0 h-[62%] w-full object-cover ${p.previewPos || 'object-top'} opacity-90 transition-opacity duration-500 group-hover:opacity-100`}
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
                    {p.protoUrl ? 'View Prototype' : (p.linkLabel ? p.linkLabel.replace(' ↗', '') : 'View System')}
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
              [ Chapter 04 — Selected Works ]
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
                  className={`absolute inset-x-0 top-0 h-[54%] w-full object-cover ${p.previewPos || 'object-top'} opacity-90`}
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
                  <h3 className="font-display italic text-[#f7f6f3] text-3xl tracking-tight mb-2">
                    {p.title}
                  </h3>
                  <p className="text-[#f7f6f3]/70 text-xs leading-snug mb-3">
                    {p.tagline}
                  </p>
                  <span className="inline-flex items-center gap-2 text-[#f7f6f3] text-[0.65rem] uppercase tracking-[0.25em]">
                    {p.protoUrl ? 'View Prototype →' : `${p.linkLabel ? p.linkLabel.replace(' ↗', '') : 'View System'} →`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── DUAL-MODE CASE STUDY & PROTOTYPE WORKSPACE ─── */}
      <div
        ref={drawerRef}
        className="fixed inset-0 z-[99999] pointer-events-none flex flex-col bg-[#0d0d0d]"
        style={{ transform: 'translateX(100%)' }}
      >
        {/* Top Header Bar */}
        <div className="w-full h-14 px-4 sm:px-6 flex items-center justify-between border-b border-white/10 bg-[#141414] pointer-events-auto flex-shrink-0 z-50">
          <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
            <span className="font-sans text-xs uppercase tracking-[0.2em] text-white/40 flex-shrink-0">
              {activeProto?.no}
            </span>
            <span className="w-px h-3 bg-white/20 flex-shrink-0" />
            <h3 className="font-display italic text-lg md:text-xl text-[#f7f6f3] truncate">
              {activeProto?.title}
            </h3>
            <span className="hidden lg:inline-block px-2.5 py-0.5 rounded-full bg-white/10 text-[0.62rem] font-sans uppercase tracking-[0.18em] text-white/70 border border-white/10 flex-shrink-0">
              {activeProto?.protoUrl ? 'Interactive Prototype' : 'Design System'}
            </span>
          </div>

          {/* Segmented Mode Switcher (for interactive prototypes) */}
          {activeProto?.protoUrl && (
            <div className="flex items-center p-0.5 rounded-full bg-white/5 border border-white/10 flex-shrink-0">
              <button
                type="button"
                onClick={() => setModalMode('prototype')}
                className={`px-3 py-1 rounded-full font-sans text-[0.65rem] uppercase tracking-[0.16em] transition-all ${
                  modalMode === 'prototype'
                    ? 'bg-[#f7f6f3] text-[#121212] font-semibold shadow'
                    : 'text-white/60 hover:text-white'
                }`}
                data-cursor="hover"
              >
                ⦿ Live Prototype
              </button>
              <button
                type="button"
                onClick={() => setModalMode('spec')}
                className={`px-3 py-1 rounded-full font-sans text-[0.65rem] uppercase tracking-[0.16em] transition-all ${
                  modalMode === 'spec'
                    ? 'bg-[#f7f6f3] text-[#121212] font-semibold shadow'
                    : 'text-white/60 hover:text-white'
                }`}
                data-cursor="hover"
              >
                ☵ Case Study Spec
              </button>
            </div>
          )}

          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {activeProto?.protoUrl && modalMode === 'prototype' && (
              <button
                type="button"
                onClick={() => setHudOpen(!hudOpen)}
                className={`hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[0.65rem] font-sans uppercase tracking-[0.16em] transition-all ${
                  hudOpen
                    ? 'bg-white text-[#121212] border-white font-semibold'
                    : 'border-white/20 bg-white/5 hover:bg-white/15 text-white/80 hover:text-white'
                }`}
                data-cursor="hover"
              >
                {hudOpen ? '✕ Close Intel' : '◧ Quick Spec & Metrics'}
              </button>
            )}

            {activeProto?.protoUrl && (
              <a
                href={activeProto.protoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-white/15 bg-white/5 hover:bg-white/15 text-white/80 hover:text-white font-sans text-[0.65rem] uppercase tracking-[0.16em] transition-colors"
                data-cursor="hover"
              >
                Open in new tab ↗
              </a>
            )}
            {activeProto?.link && (
              <a
                href={activeProto.link}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-white/15 bg-white/5 hover:bg-white/15 text-white/80 hover:text-white font-sans text-[0.65rem] uppercase tracking-[0.16em] transition-colors"
                data-cursor="hover"
              >
                {activeProto.linkLabel || 'Open System ↗'}
              </a>
            )}
            <button
              onClick={closeDrawer}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 text-[#f7f6f3] font-sans text-xs uppercase tracking-[0.2em] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
              aria-label="Close modal"
              data-cursor="hover"
            >
              Esc Close ×
            </button>
          </div>
        </div>

        {/* Modal Body Container */}
        <div 
          data-lenis-prevent="true"
          className="flex-1 w-full h-[calc(100vh-56px)] bg-black relative pointer-events-auto overflow-hidden"
        >
          {activeProto && (
            modalMode === 'prototype' && activeProto.protoUrl ? (
              /* Full-Bleed Standalone Embedded Prototype View */
              <div className="w-full h-full relative">
                <iframe
                  src={activeProto.protoUrl}
                  title={`${activeProto.title} Interactive Prototype`}
                  className="w-full h-full border-none bg-black hw"
                  loading="eager"
                />

                {/* Mobile Quick Intel HUD trigger pill */}
                <button
                  type="button"
                  onClick={() => setHudOpen(!hudOpen)}
                  className="md:hidden absolute bottom-5 right-5 z-40 px-3.5 py-2 rounded-full bg-[#141414]/90 backdrop-blur-md border border-white/20 text-[#f7f6f3] font-sans text-[0.62rem] uppercase tracking-[0.18em] shadow-2xl flex items-center gap-1.5"
                  data-cursor="hover"
                >
                  {hudOpen ? '✕ Close Intel' : '◧ Quick Spec'}
                </button>

                {/* Collapsible Quick Intel HUD drawer overlay */}
                {hudOpen && (
                  <div
                    className="absolute top-0 right-0 bottom-0 w-full sm:w-[420px] md:w-[460px] bg-[#121212]/95 backdrop-blur-2xl border-l border-white/15 p-6 md:p-8 flex flex-col justify-between overflow-y-auto z-40 text-[#f7f6f3] shadow-2xl"
                    data-lenis-prevent="true"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                        <div className="flex items-center gap-3">
                          <span className="font-sans text-[0.65rem] uppercase tracking-[0.25em] text-white/50">
                            {activeProto.no} // Quick Spec
                          </span>
                          <span className="w-px h-3 bg-white/20" />
                          <span className="font-sans text-[0.65rem] uppercase tracking-[0.2em] text-white/50">
                            {activeProto.role}
                          </span>
                        </div>
                        <button
                          onClick={() => setHudOpen(false)}
                          className="p-1 rounded-full text-white/50 hover:text-white transition-colors text-xs font-sans uppercase tracking-[0.2em]"
                          data-cursor="hover"
                        >
                          ✕ Close
                        </button>
                      </div>

                      <h3 className="font-display italic text-2xl md:text-3xl mb-2 text-[#f7f6f3]">
                        {activeProto.title}
                      </h3>
                      <p className="font-sans text-xs text-white/70 leading-relaxed mb-6 italic">
                        "{activeProto.tagline}"
                      </p>

                      <div className="space-y-5 text-xs font-sans leading-relaxed text-white/80">
                        <div>
                          <span className="block font-sans text-[0.6rem] uppercase tracking-[0.25em] text-white/40 mb-1.5">
                            [ 01 / Strategic Context ]
                          </span>
                          <p className="text-white/75">{activeProto.context}</p>
                        </div>

                        <div>
                          <span className="block font-sans text-[0.6rem] uppercase tracking-[0.25em] text-white/40 mb-1.5">
                            [ 02 / The Problem & Friction ]
                          </span>
                          <p className="text-white/75">{activeProto.problem}</p>
                        </div>

                        <div>
                          <span className="block font-sans text-[0.6rem] uppercase tracking-[0.25em] text-white/40 mb-1.5">
                            [ 03 / Interaction Architecture ]
                          </span>
                          <p className="text-white/75">{activeProto.approach}</p>
                        </div>

                        <div>
                          <span className="block font-sans text-[0.6rem] uppercase tracking-[0.25em] text-white/40 mb-2">
                            [ 04 / Measurable Outcomes ]
                          </span>
                          <div className="space-y-2">
                            {activeProto.outcome?.map((out, idx) => (
                              <div key={idx} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/5">
                                <span className="text-white/40 mt-0.5 text-[0.7rem]">✓</span>
                                <span className="text-white/90 text-[0.72rem]">{out}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="pt-2">
                          <span className="block font-sans text-[0.6rem] uppercase tracking-[0.25em] text-white/40 mb-2">
                            [ 05 / Tools & Stack ]
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {activeProto.stack?.map((tool, idx) => (
                              <span key={idx} className="px-2.5 py-1 rounded-full bg-white/10 text-[0.62rem] font-sans uppercase tracking-[0.15em] text-white/70 border border-white/10">
                                {tool}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => {
                          setHudOpen(false)
                          setModalMode('spec')
                        }}
                        className="text-[0.65rem] font-sans uppercase tracking-[0.2em] text-white/70 hover:text-white underline underline-offset-4"
                        data-cursor="hover"
                      >
                        Open Full Spec View →
                      </button>
                      <button
                        type="button"
                        onClick={() => setHudOpen(false)}
                        className="px-4 py-2 rounded-full bg-white text-[#121212] font-sans text-[0.65rem] font-bold uppercase tracking-[0.18em]"
                        data-cursor="hover"
                      >
                        Keep Interacting
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Case Study Specification View (Deep Strategic Rationale) */
              <div 
                data-lenis-prevent="true"
                className="w-full h-full overflow-y-auto px-6 py-10 md:px-16 md:py-16 flex flex-col items-center bg-[#0d0d0d] text-[#f7f6f3]"
              >
                <div className="max-w-4xl w-full mx-auto">
                  {/* Meta eyebrow bar */}
                  <div className="flex flex-wrap items-center gap-3 mb-6 pb-4 border-b border-white/10">
                    <span className="font-sans text-xs uppercase tracking-[0.25em] text-white/40">
                      Case Study {activeProto.no}
                    </span>
                    <span className="w-px h-3 bg-white/20" />
                    <span className="font-sans text-xs uppercase tracking-[0.25em] text-white/40">
                      {activeProto.year}
                    </span>
                    <span className="w-px h-3 bg-white/20" />
                    <span className="font-sans text-xs uppercase tracking-[0.25em] text-white/70">
                      {activeProto.role}
                    </span>
                    {activeProto.protoUrl && (
                      <button
                        type="button"
                        onClick={() => setModalMode('prototype')}
                        className="ml-auto inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#f7f6f3] text-[#121212] font-sans text-[0.68rem] font-bold uppercase tracking-[0.18em] hover:scale-105 active:scale-95 transition-transform shadow-xl"
                        data-cursor="hover"
                      >
                        ⦿ Run Live Prototype ↗
                      </button>
                    )}
                  </div>

                  {/* Title and Strategic Tagline */}
                  <h2 className="font-display italic text-4xl sm:text-6xl md:text-7xl text-[#f7f6f3] mb-4 tracking-tight leading-[0.95]">
                    {activeProto.title}
                  </h2>
                  <p className="max-w-2xl font-sans text-base sm:text-lg text-white/70 leading-relaxed mb-10">
                    {activeProto.tagline}
                  </p>

                  {/* Visual Interface Preview */}
                  <div className="w-full max-h-[55vh] rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-[#141414] mb-12 flex items-center justify-center relative group">
                    <img
                      src={activeProto.preview}
                      alt={activeProto.previewAlt || activeProto.title}
                      className="w-full h-full object-contain max-h-[52vh]"
                    />
                    {activeProto.protoUrl && (
                      <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => setModalMode('prototype')}
                          className="px-6 py-3 rounded-full bg-white text-[#121212] font-sans text-xs font-bold uppercase tracking-[0.2em] shadow-2xl transition-transform hover:scale-105"
                          data-cursor="hover"
                        >
                          ⦿ Run Live Interactive Prototype
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Two-column brutalist design specification */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 mb-14 text-sm font-sans leading-relaxed">
                    <div className="space-y-8">
                      <div>
                        <span className="block font-sans text-[0.65rem] uppercase tracking-[0.3em] text-white/40 mb-3">
                          [ 01 / Strategic Context ]
                        </span>
                        <p className="text-white/80 leading-relaxed text-sm md:text-base">
                          {activeProto.context}
                        </p>
                      </div>

                      <div>
                        <span className="block font-sans text-[0.65rem] uppercase tracking-[0.3em] text-white/40 mb-3">
                          [ 02 / The Problem & Friction ]
                        </span>
                        <p className="text-white/80 leading-relaxed text-sm md:text-base">
                          {activeProto.problem}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-8">
                      <div>
                        <span className="block font-sans text-[0.65rem] uppercase tracking-[0.3em] text-white/40 mb-3">
                          [ 03 / Interaction Architecture ]
                        </span>
                        <p className="text-white/80 leading-relaxed text-sm md:text-base">
                          {activeProto.approach}
                        </p>
                      </div>

                      <div>
                        <span className="block font-sans text-[0.65rem] uppercase tracking-[0.3em] text-white/40 mb-3">
                          [ 04 / Core Outcomes & Impact ]
                        </span>
                        <div className="space-y-2.5">
                          {activeProto.outcome?.map((out, idx) => (
                            <div key={idx} className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#141414] border border-white/10">
                              <span className="text-white/50 mt-0.5 text-xs">✓</span>
                              <span className="text-white/90 text-xs sm:text-sm font-medium">{out}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer Action Strip */}
                  <div className="pt-8 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-sans text-[0.65rem] uppercase tracking-[0.2em] text-white/40 mr-2">
                        Stack:
                      </span>
                      {activeProto.stack?.map((tool, idx) => (
                        <span key={idx} className="px-3 py-1 rounded-full bg-white/5 text-[0.65rem] font-sans uppercase tracking-[0.16em] text-white/70 border border-white/10">
                          {tool}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-3">
                      {activeProto.protoUrl && (
                        <button
                          type="button"
                          onClick={() => setModalMode('prototype')}
                          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#f7f6f3] text-[#121212] font-sans text-xs font-bold uppercase tracking-[0.2em] transition-transform hover:scale-105 active:scale-95 shadow-2xl"
                          data-cursor="hover"
                        >
                          ⦿ Run Live Prototype ↗
                        </button>
                      )}
                      {activeProto.link && (
                        <a
                          href={activeProto.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#f7f6f3] text-[#121212] font-sans text-xs font-bold uppercase tracking-[0.2em] transition-transform hover:scale-105 active:scale-95 shadow-2xl"
                          data-cursor="hover"
                        >
                          {activeProto.linkLabel || 'Explore System ↗'}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </>
  )
}
