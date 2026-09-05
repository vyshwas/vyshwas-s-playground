import { useState, useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { scrollToTarget, reducedMotion } from '../App.jsx'

gsap.registerPlugin(ScrollTrigger)

const LENSES = [
  { id: 'trajectory', number: '01', title: 'TRAJECTORY & ETHOS' },
  { id: 'superpower', number: '02', title: 'DUAL SUPERPOWER (DESIGN × CODE)' },
  { id: 'impact', number: '03', title: 'PROVEN IMPACT & METRICS' },
]

const TENETS = [
  {
    num: '01',
    title: 'Local-First & Zero Latency',
    body: 'Software should respond instantaneously. Shifting compute and state to the client makes interfaces feel tactile, resilient, and fundamentally trustworthy.',
    tag: 'ARCHITECTURE',
  },
  {
    num: '02',
    title: 'Code as Design Medium',
    body: 'Static Figma frames conceal state explosions, layout reflows, and inertial physics. Writing production code allows me to design what humans actually experience.',
    tag: 'METHODOLOGY',
  },
  {
    num: '03',
    title: 'Systemic Cohesion Over Decoration',
    body: 'Micro-interactions without overarching architectural discipline is noise. Every token, variant, and motion curve must stem from a coherent mental model.',
    tag: 'DISCIPLINE',
  },
]

const DESIGN_PILLARS = [
  { title: 'Foundational Discovery', desc: 'Cognitive load analysis, journey topology, and user mental model synthesis.' },
  { title: 'Design Systems Architecture', desc: 'Multi-brand token topologies, strict WCAG AAA contrast, and component lifecycle governance.' },
  { title: 'Information Architecture', desc: 'High-density enterprise dashboards, semantic hierarchies, and complex state management.' },
  { title: 'Spatial & Kinetic Craft', desc: 'Typographic rhythm (Instrument Serif × Inter), chiaroscuro contrast, and motion choreography.' },
]

const ENG_PILLARS = [
  { title: 'Modern Frontend Stack', desc: 'React 19, TypeScript, Next.js, Vite, Tailwind CSS, semantic HTML5.' },
  { title: 'Creative Coding & WebGL', desc: 'Three.js custom GLSL shaders, GPU particle fields, procedural geometry generation.' },
  { title: 'Choreographed Motion', desc: 'GSAP ScrollTrigger pipelines, Lenis inertial smoothing, micro-interaction physics.' },
  { title: 'Local-First Infrastructure', desc: 'Client-side caching, optimistic UI updates, offline resilience, and Web Workers.' },
]

const METRICS = [
  {
    metric: '98.4%',
    label: 'LATENCY REDUCTION',
    context: 'Optimistic local caching architecture',
    desc: 'Eliminated network spinners across core workflows, dropping perceived interaction delay from 1.8s to sub-16ms.',
  },
  {
    metric: '120+',
    label: 'PRODUCTION TOKENS',
    context: 'Enterprise design system scale',
    desc: 'Architected unified multi-platform component system deployed across 4 product suites with zero regression.',
  },
  {
    metric: '100%',
    label: 'PROTOTYPE FIDELITY',
    context: 'Zero design-to-eng translation loss',
    desc: 'Delivered fully interactive, runnable code prototypes directly into stakeholder reviews and user test cohorts.',
  },
  {
    metric: '05',
    label: 'SHIPPED PRODUCTS',
    context: 'Blank canvas to production live users',
    desc: 'Sole or lead product designer and front-end architect for 5 comprehensive applications in enterprise AI, finance, and creative tech.',
  },
]

export default function About() {
  const rootRef = useRef(null)
  const [activeLens, setActiveLens] = useState('trajectory')
  const [dualView, setDualView] = useState('both') // 'design' | 'both' | 'code'

  useEffect(() => {
    if (reducedMotion() || !rootRef.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.about-header-item',
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: rootRef.current,
            start: 'top 80%',
          },
        }
      )
    }, rootRef.current)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={rootRef}
      id="about"
      className="relative z-10 w-full min-h-screen bg-void py-24 md:py-32 px-6 sm:px-10 lg:px-16 border-t border-black/10"
      aria-label="About Vishwas Mehta — Architectural Dossier"
    >
      <div className="max-w-6xl mx-auto">
        {/* ─── 1. Header & Chapter Index ─── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-black/15 pb-8 mb-12">
          <div>
            <div className="about-header-item flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-bone" />
              <span className="font-mono text-xs md:text-sm font-semibold tracking-[0.25em] uppercase text-titanium">
                [ 02 // ARCHITECTURAL DOSSIER ]
              </span>
            </div>
            <h2 className="about-header-item font-display italic text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-bone leading-[1.08] tracking-tight max-w-3xl">
              Building at the exact seam where human psychology meets production systems.
            </h2>
          </div>

          <div className="about-header-item mt-6 md:mt-0 text-left md:text-right shrink-0">
            <span className="font-mono text-xs text-titanium uppercase tracking-widest block">
              LOCATION &bull; TIMEZONE
            </span>
            <span className="font-sans text-sm font-medium text-bone">
              Bengaluru, IN (IST / UTC+5:30)
            </span>
          </div>
        </div>

        {/* ─── 2. Interactive 3-Lens Selector Tabs ─── */}
        <div className="flex flex-wrap gap-2 md:gap-3 mb-10 border-b border-black/10 pb-4">
          {LENSES.map((lens) => {
            const isActive = activeLens === lens.id
            return (
              <button
                key={lens.id}
                type="button"
                onClick={() => setActiveLens(lens.id)}
                data-cursor="magnetic"
                className={`
                  flex items-center gap-2 px-4 py-2.5 rounded-full font-mono text-xs tracking-wider uppercase transition-all duration-200
                  ${isActive
                    ? 'bg-bone text-void shadow-md font-semibold'
                    : 'bg-black/5 hover:bg-black/10 text-titanium hover:text-bone'
                  }
                `}
              >
                <span className={`text-[10px] ${isActive ? 'text-void/70' : 'text-titanium'}`}>
                  {lens.number}
                </span>
                <span>{lens.title}</span>
              </button>
            )
          })}
        </div>

        {/* ─── 3. Lens Content Panes ─── */}
        <div className="min-h-[420px] transition-opacity duration-300">
          {/* ──── LENS 01: TRAJECTORY & ETHOS ──── */}
          {activeLens === 'trajectory' && (
            <div className="space-y-10 animate-fade-in">
              {/* Primary Narrative Manifesto */}
              <div className="bg-bone/[0.03] border border-black/10 rounded-2xl p-6 sm:p-8 md:p-10">
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-titanium mb-3 block">
                  CORE PHILOSOPHY
                </span>
                <p className="font-display italic text-xl sm:text-2xl md:text-3xl text-bone leading-relaxed max-w-4xl">
                  &ldquo;Most digital products fail not because the code was buggy or the UI lacked polish,
                  but because the underlying mental model was fractured. I design from the user&rsquo;s cognitive core
                  outward&mdash;validating value with runnable, tactile code before committing months of engineering roadmap.&rdquo;
                </p>
                <div className="mt-6 pt-6 border-t border-black/10 flex flex-wrap items-center justify-between gap-4">
                  <p className="font-sans text-xs sm:text-sm text-[#444444] max-w-2xl leading-relaxed">
                    With an academic foundation in computer science and a deep obsession with editorial graphic design,
                    I eliminate the friction between product vision and technical feasibility.
                  </p>
                  <button
                    type="button"
                    onClick={() => scrollToTarget('#experiments')}
                    data-cursor="magnetic"
                    className="font-mono text-xs uppercase tracking-wider text-bone hover:underline flex items-center gap-1.5"
                  >
                    <span>View Case Studies</span>
                    <span>&rarr;</span>
                  </button>
                </div>
              </div>

              {/* 3 Core Tenets */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {TENETS.map((tenet) => (
                  <div
                    key={tenet.num}
                    className="group bg-bone/[0.02] hover:bg-bone/[0.05] border border-black/10 hover:border-black/25 rounded-xl p-6 transition-all duration-200 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-mono text-xs font-bold text-titanium group-hover:text-bone transition-colors">
                          {tenet.num}
                        </span>
                        <span className="font-mono text-[10px] tracking-widest uppercase px-2 py-0.5 rounded bg-black/5 text-titanium">
                          {tenet.tag}
                        </span>
                      </div>
                      <h3 className="font-sans text-base sm:text-lg font-semibold text-bone mb-2">
                        {tenet.title}
                      </h3>
                      <p className="font-sans text-xs sm:text-sm text-[#444444] leading-relaxed">
                        {tenet.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ──── LENS 02: DUAL SUPERPOWER (DESIGN × CODE) ──── */}
          {activeLens === 'superpower' && (
            <div className="space-y-8 animate-fade-in">
              {/* Dual Filter Controls */}
              <div className="flex items-center justify-between flex-wrap gap-4 bg-bone/[0.03] border border-black/10 rounded-xl px-5 py-3.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-titanium uppercase tracking-wider">
                    INSPECT DISCIPLINE:
                  </span>
                </div>
                <div className="flex items-center gap-1 bg-black/5 p-1 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setDualView('design')}
                    className={`px-3 py-1 rounded font-mono text-xs uppercase transition-all ${
                      dualView === 'design' ? 'bg-bone text-void font-bold shadow-sm' : 'text-titanium hover:text-bone'
                    }`}
                  >
                    Product Design
                  </button>
                  <button
                    type="button"
                    onClick={() => setDualView('both')}
                    className={`px-3 py-1 rounded font-mono text-xs uppercase transition-all ${
                      dualView === 'both' ? 'bg-bone text-void font-bold shadow-sm' : 'text-titanium hover:text-bone'
                    }`}
                  >
                    Intersection (All)
                  </button>
                  <button
                    type="button"
                    onClick={() => setDualView('code')}
                    className={`px-3 py-1 rounded font-mono text-xs uppercase transition-all ${
                      dualView === 'code' ? 'bg-bone text-void font-bold shadow-sm' : 'text-titanium hover:text-bone'
                    }`}
                  >
                    Design Engineering
                  </button>
                </div>
              </div>

              {/* Comparative Split Matrix */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Column A: Strategic Product Design */}
                {(dualView === 'both' || dualView === 'design') && (
                  <div className={`space-y-4 ${dualView === 'design' ? 'md:col-span-2' : ''}`}>
                    <div className="border-b border-black/15 pb-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded bg-bone" />
                        <h3 className="font-sans text-base font-bold text-bone uppercase tracking-wider">
                          Strategic Product Designer
                        </h3>
                      </div>
                      <span className="font-mono text-xs text-titanium">HUMAN INTERFACE</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {DESIGN_PILLARS.map((p, i) => (
                        <div key={i} className="bg-bone/[0.02] border border-black/10 rounded-xl p-5 hover:border-black/25 transition-all">
                          <span className="font-mono text-[10px] text-titanium block mb-1">P.0{i + 1}</span>
                          <h4 className="font-sans text-sm font-semibold text-bone mb-1.5">{p.title}</h4>
                          <p className="font-sans text-xs text-[#444444] leading-relaxed">{p.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Column B: Design Engineer */}
                {(dualView === 'both' || dualView === 'code') && (
                  <div className={`space-y-4 ${dualView === 'code' ? 'md:col-span-2' : ''}`}>
                    <div className="border-b border-black/15 pb-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded bg-bone" />
                        <h3 className="font-sans text-base font-bold text-bone uppercase tracking-wider">
                          Design Engineer
                        </h3>
                      </div>
                      <span className="font-mono text-xs text-titanium">PRODUCTION CODE</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {ENG_PILLARS.map((p, i) => (
                        <div key={i} className="bg-bone/[0.02] border border-black/10 rounded-xl p-5 hover:border-black/25 transition-all">
                          <span className="font-mono text-[10px] text-titanium block mb-1">E.0{i + 1}</span>
                          <h4 className="font-sans text-sm font-semibold text-bone mb-1.5">{p.title}</h4>
                          <p className="font-sans text-xs text-[#444444] leading-relaxed">{p.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Recruiter Bottom Takeaway */}
              <div className="border-t border-black/10 pt-5 flex items-center justify-between text-xs font-mono text-titanium">
                <span>BRIDGING THE VALLEY BETWEEN FIGMA SPEC &amp; PRODUCTION MERGE</span>
                <span className="text-bone font-medium">ZERO SPECULATION &bull; 100% EXECUTABLE</span>
              </div>
            </div>
          )}

          {/* ──── LENS 03: PROVEN IMPACT & METRICS ──── */}
          {activeLens === 'impact' && (
            <div className="space-y-8 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {METRICS.map((m, i) => (
                  <div
                    key={i}
                    className="bg-bone/[0.02] hover:bg-bone/[0.05] border border-black/10 hover:border-black/30 rounded-xl p-6 transition-all duration-200 flex flex-col justify-between"
                  >
                    <div>
                      <span className="font-display italic text-4xl sm:text-5xl text-bone block mb-2">
                        {m.metric}
                      </span>
                      <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-bone block mb-1">
                        {m.label}
                      </span>
                      <span className="font-mono text-[10px] text-titanium tracking-wide block mb-3">
                        {m.context}
                      </span>
                      <p className="font-sans text-xs text-[#444444] leading-relaxed">
                        {m.desc}
                      </p>
                    </div>
                    <div className="mt-6 pt-4 border-t border-black/10 flex items-center justify-between">
                      <span className="font-mono text-[10px] text-titanium">VERIFIED</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#121212]" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Callout Box */}
              <div className="bg-bone/[0.03] border border-black/10 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                  <h4 className="font-sans text-lg font-bold text-bone mb-1">
                    Ready to evaluate case studies and live interactive builds?
                  </h4>
                  <p className="font-sans text-sm text-[#444444] max-w-xl">
                    Every project in the archive includes a runnable prototype alongside full architectural specifications.
                  </p>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <button
                    type="button"
                    onClick={() => scrollToTarget('#experiments')}
                    data-cursor="magnetic"
                    className="px-5 py-2.5 rounded-full bg-bone text-void font-mono text-xs font-bold uppercase tracking-wider hover:bg-bone/90 transition-all"
                  >
                    Explore Projects &rarr;
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollToTarget('#exit')}
                    data-cursor="magnetic"
                    className="px-5 py-2.5 rounded-full border border-black/20 text-bone font-mono text-xs font-bold uppercase tracking-wider hover:bg-black/5 transition-all"
                  >
                    Direct Contact
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
