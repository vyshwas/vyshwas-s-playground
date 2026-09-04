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
    role: 'Product Design & Prototype',
    problem: 'Cart abandonment spikes when payment fails. Generic red error messages destroy trust and force the user to start over.',
    approach: 'Redesigning checkout trust cues to reduce hesitation at the highest-friction moment. First-class payment failure screens that absorb blame.',
    outcome: [
      'UPI-first payment methods',
      'Itemised bill with permanent night-fee waiver',
      'Trust line at the exact moment of hesitation'
    ],
    stack: ['Figma', 'Protopie'],
    protoUrl: './assets/nocturne-prototype.html?v=2',
    color: 'from-blue-500 to-blue-700',
    pos: { top: '12%', left: '6%', rotate: '-8deg' },
    size: 'w-[260px] h-[310px] md:w-[300px] md:h-[370px] lg:w-[320px] lg:h-[400px]',
  },
  {
    no: '02',
    title: 'Munim',
    tagline: 'Supervised delegation and transparent ledger loops.',
    year: '2024',
    role: 'Product Design & Prototype',
    problem: 'Delegating payments requires giving up control. Existing solutions are either too rigid or too insecure.',
    approach: 'A fully clickable prototype of the whole delegation loop: the mandate, supervised asks with a UPI PIN sheet, the live countdown hold.',
    outcome: [
      'Trusted merchant price jumps get held',
      'Cancel works mid-hold',
      'Visual system built on the bahi-khata'
    ],
    stack: ['Figma', 'Protopie'],
    protoUrl: './assets/munim-prototype.html',
    color: 'from-orange-500 to-red-500',
    pos: { bottom: '8%', left: '28%', rotate: '6deg' },
    size: 'w-[250px] h-[300px] md:w-[280px] md:h-[350px] lg:w-[300px] lg:h-[380px]',
  },
  {
    no: '03',
    title: 'Awara',
    tagline: 'A living itinerary system that adapts as your day changes.',
    year: '2024',
    role: 'Product Design & Prototype',
    problem: 'Most itinerary tools ask for dates and a destination, hand you a list, and disappear from the trip once you land.',
    approach: 'Awara keeps the plan live: it adapts as the day changes, instead of assuming the itinerary you left with is the one you actually follow.',
    outcome: [
      'Live three-day itinerary',
      'Adjust sheet with proactive suggestions',
      'Vermilion-and-ink editorial system'
    ],
    stack: ['Figma', 'Protopie'],
    protoUrl: './assets/awara-prototype.html?v=3',
    color: 'from-green-400 to-emerald-600',
    pos: { top: '18%', right: '6%', rotate: '10deg' },
    size: 'w-[260px] h-[310px] md:w-[300px] md:h-[370px] lg:w-[330px] lg:h-[420px]',
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
    }, containerRef)
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

          {/* Center Pill */}
          <div className="relative z-30 pointer-events-none">
            <div className="rounded-[2.5rem] border-[4px] border-dashed border-[#ff2a00] p-1.5 shadow-[0_0_20px_rgba(255,42,0,0.3)] bg-[#ff2a00]/10">
              <div className="bg-[#181818] rounded-[2rem] px-10 py-4 md:px-12 md:py-5 flex items-center justify-center">
                <h2 className="text-white text-4xl md:text-6xl font-bold tracking-tight m-0 leading-none">
                  Selected Work!
                </h2>
              </div>
            </div>
            


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
                {/* Gradient background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${p.color} opacity-90 transition-opacity group-hover:opacity-100`} />
                <div className="absolute inset-0 bg-white/10" />
                <div className="absolute inset-0 border-[3px] border-white/20 rounded-[2.5rem]" />

                <div className="relative z-10 flex justify-between items-start">
                  <span className="bg-black/20 text-white px-4 py-1.5 rounded-full font-mono text-sm tracking-widest uppercase border border-white/10">
                    {p.no}
                  </span>
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center border border-white/10 transition-transform group-hover:scale-110">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </div>
                </div>

                <div className="relative z-10 mt-auto">
                  <h3 className="text-white text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-2 drop-shadow-sm">
                    {p.title}
                  </h3>
                  <p className="text-white/80 text-sm font-medium max-w-[90%] leading-snug mb-4">
                    {p.tagline}
                  </p>
                  <span className="inline-flex items-center gap-2 text-white text-xs font-bold uppercase tracking-widest opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    View Prototype
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </span>
                </div>
              </div>
            ))}

            {/* Decorative sticky note */}
            <div className="absolute bottom-[22%] left-[6%] rotate-[-6deg] bg-[#4facfe] text-black p-4 rounded-xl shadow-lg w-48 font-medium text-sm border border-blue-300 z-30">
              Every project ships with a fully clickable interactive prototype.
              <div className="mt-3 text-xs opacity-50 text-right">@vyshwas</div>
            </div>

            {/* Decorative yellow label */}
            <div className="absolute top-[18%] right-[22%] rotate-[8deg] bg-[#ffd54f] text-black px-4 py-2 rounded-md shadow-md font-bold text-sm z-30" style={{ borderColor: 'rgba(0,0,0,0.1)' }}>
              Click any card →
            </div>
            
            {/* Decorative purple dashed box */}
            <div className="absolute bottom-[12%] right-[12%] rotate-[-15deg] w-36 h-36 bg-[#8b5cf6] border-[6px] border-dashed border-[#1a1a1a] rounded-3xl shadow-xl z-10 hidden lg:block opacity-85" />
          </div>
        </div>

        {/* ─── MOBILE LAYOUT: Stacked scrollable cards ─── */}
        <div className="md:hidden px-5 py-16">
          <div className="mb-10 text-center">
            <div className="inline-block rounded-[1.5rem] border-[3px] border-dashed border-[#ff2a00] p-1 bg-[#ff2a00]/10">
              <div className="bg-[#181818] rounded-[1.2rem] px-6 py-3">
                <h2 className="text-white text-2xl font-bold tracking-tight leading-none">
                  Selected Work!
                </h2>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-6">
            {projects.map((p) => (
              <div
                key={p.no}
                className={`relative w-full rounded-[2rem] shadow-xl p-6 flex flex-col justify-between overflow-hidden cursor-pointer min-h-[280px] active:scale-[0.98] transition-transform`}
                onClick={() => openDrawer(p)}
                data-cursor="hover"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${p.color} opacity-90`} />
                <div className="absolute inset-0 bg-white/10" />
                <div className="absolute inset-0 border-[3px] border-white/20 rounded-[2rem]" />

                <div className="relative z-10 flex justify-between items-start">
                  <span className="bg-black/20 text-white px-3 py-1 rounded-full font-mono text-xs tracking-widest uppercase border border-white/10">
                    {p.no}
                  </span>
                  <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center border border-white/10">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </div>
                </div>

                <div className="relative z-10 mt-auto">
                  <h3 className="text-white text-3xl font-bold tracking-tight mb-1.5 drop-shadow-sm">
                    {p.title}
                  </h3>
                  <p className="text-white/80 text-sm font-medium leading-snug mb-3">
                    {p.tagline}
                  </p>
                  <span className="inline-flex items-center gap-2 text-white text-xs font-bold uppercase tracking-widest">
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
            className="absolute top-4 right-4 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors border border-white/10"
            aria-label="Close drawer"
            data-cursor="hover"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          {/* Left Panel: Project Write-up */}
          <div className="w-full h-[45vh] md:h-full md:w-[380px] lg:w-[460px] bg-[#1a1a1a] flex-shrink-0 border-b md:border-b-0 md:border-r border-white/10 overflow-y-auto p-6 md:p-10 flex flex-col">
            {activeProto && (
              <div className="space-y-7 pb-10">
                {/* Header */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="font-mono text-xs text-white/40 uppercase tracking-widest">
                      {activeProto.no}
                    </span>
                    <span className="w-px h-3 bg-white/20" />
                    <span className="font-mono text-xs text-white/40 uppercase tracking-widest">
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
                    <span className="font-mono text-[10px] uppercase tracking-widest text-white/35">Role</span>
                    <span className="text-white/85 text-sm">{activeProto.role}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-white/35">Stack</span>
                    <span className="text-white/85 text-sm">{activeProto.stack.join(', ')}</span>
                  </div>
                </div>

                <hr className="border-white/8" />

                {/* Problem */}
                <div>
                  <h4 className="font-mono text-[10px] uppercase tracking-widest text-white/35 mb-3">The Problem</h4>
                  <p className="text-white/75 text-sm leading-relaxed">{activeProto.problem}</p>
                </div>

                {/* Approach */}
                <div>
                  <h4 className="font-mono text-[10px] uppercase tracking-widest text-white/35 mb-3">The Approach</h4>
                  <p className="text-white/75 text-sm leading-relaxed">{activeProto.approach}</p>
                </div>

                {/* Outcomes */}
                <div>
                  <h4 className="font-mono text-[10px] uppercase tracking-widest text-white/35 mb-3">Outcomes</h4>
                  <ul className="space-y-2">
                    {activeProto.outcome.map(item => (
                      <li key={item} className="flex items-start gap-2.5 text-white/75 text-sm leading-relaxed">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-white/30 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Scroll indicator for mobile — tells user the prototype is below */}
                <div className="md:hidden text-center pt-4 border-t border-white/8">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-white/40">
                    ↓ Scroll down for interactive prototype
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel: Interactive Prototype */}
          <div className="flex-1 w-full h-[55vh] md:h-full bg-black relative">
            {activeProto && (
              <iframe 
                src={activeProto.protoUrl} 
                className="w-full h-full border-none"
                title={`${activeProto.title} Prototype`}
                loading="lazy"
              />
            )}
          </div>
        </div>
      </div>
    </>
  )
}
