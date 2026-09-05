import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { scrollToTarget, reducedMotion } from '../App.jsx'

gsap.registerPlugin(ScrollTrigger)

const INK = '#121212'
const SLATE = '#555555'

/* ---- ink infographics (stroke art, draws itself on hover) ---- */

function DiagramStack() {
  return (
    <svg viewBox="0 0 280 180" className="absolute inset-0 block h-full w-full">
      <g fill="none" stroke={INK} strokeWidth="1.5">
        <path pathLength="1" className="draw" d="M60 120 L140 90 L220 120 L140 150 Z" />
        <path pathLength="1" className="draw" d="M60 90 L140 60 L220 90 L140 120 Z" opacity="0.65" />
        <path pathLength="1" className="draw" d="M60 60 L140 30 L220 60 L140 90 Z" opacity="0.35" />
        <path pathLength="1" className="draw" d="M140 90 L140 150" strokeDasharray="3 4" />
      </g>
      <g fill={INK}>
        <circle cx="140" cy="150" r="3" />
        <circle cx="140" cy="120" r="3" opacity="0.65" />
        <circle cx="140" cy="90" r="3" opacity="0.35" />
      </g>
      <text x="232" y="124" fontSize="8" fill={SLATE} fontFamily="JetBrains Mono, monospace">UI</text>
      <text x="232" y="94" fontSize="8" fill={SLATE} fontFamily="JetBrains Mono, monospace">LOGIC</text>
      <text x="232" y="64" fontSize="8" fill={SLATE} fontFamily="JetBrains Mono, monospace">DATA</text>
    </svg>
  )
}

function DiagramPipeline() {
  return (
    <svg viewBox="0 0 280 180" className="absolute inset-0 block h-full w-full">
      <g fill="none" stroke={INK} strokeWidth="1.5">
        <path pathLength="1" className="draw" d="M30 90 H250" strokeDasharray="4 5" />
        <circle pathLength="1" className="draw" cx="55" cy="90" r="9" />
        <circle pathLength="1" className="draw" cx="120" cy="90" r="9" />
        <path pathLength="1" className="draw" d="M175 78 L192 90 L175 102" />
        <rect pathLength="1" className="draw" x="205" y="72" width="40" height="36" rx="6" />
        <path pathLength="1" className="draw" d="M215 90 L223 98 L237 82" />
      </g>
      <text x="40" y="120" fontSize="8" fill={SLATE} fontFamily="JetBrains Mono, monospace">PROMPT v2.1</text>
      <text x="100" y="60" fontSize="8" fill={SLATE} fontFamily="JetBrains Mono, monospace">SCHEMA-CHECKED</text>
      <text x="196" y="130" fontSize="8" fill={SLATE} fontFamily="JetBrains Mono, monospace">EVAL PASS</text>
      <g fill={INK}>
        <circle cx="55" cy="90" r="3" />
        <circle cx="120" cy="90" r="3" />
      </g>
    </svg>
  )
}

function DiagramLocal() {
  return (
    <svg viewBox="0 0 280 180" className="absolute inset-0 block h-full w-full">
      <g fill="none" stroke={INK} strokeWidth="1.5">
        <rect pathLength="1" className="draw" x="70" y="70" width="110" height="66" rx="6" />
        <path pathLength="1" className="draw" d="M55 140 H195" />
        <rect pathLength="1" className="draw" x="112" y="92" width="26" height="20" rx="3" />
        <path pathLength="1" className="draw" d="M117 92 V86 a8 8 0 0 1 16 0 V92" />
        <path pathLength="1" className="draw" d="M215 55 a16 16 0 0 1 30 6 a12 12 0 0 1 -2 24 H212 a14 14 0 0 1 3 -30" opacity="0.5" strokeDasharray="4 4" />
        <path pathLength="1" className="draw" d="M208 48 L252 92" strokeWidth="2" />
      </g>
      <text x="60" y="164" fontSize="8" fill={SLATE} fontFamily="JetBrains Mono, monospace">0 BYTES OUT</text>
      <text x="204" y="40" fontSize="8" fill={SLATE} fontFamily="JetBrains Mono, monospace">NO CLOUD</text>
    </svg>
  )
}

function DiagramArch() {
  return (
    <svg viewBox="0 0 280 180" className="absolute inset-0 block h-full w-full">
      <g fill="none" stroke={INK} strokeWidth="1.5">
        <rect pathLength="1" className="draw" x="24" y="70" width="52" height="40" rx="6" />
        <circle pathLength="1" className="draw" cx="50" cy="90" r="10" />
        <circle pathLength="1" className="draw" cx="50" cy="90" r="3" fill={INK} stroke="none" />
        <path pathLength="1" className="draw" d="M76 90 H120" strokeDasharray="3 4" />
        <rect pathLength="1" className="draw" x="120" y="70" width="52" height="40" rx="6" />
        <path pathLength="1" className="draw" d="M172 90 H216" strokeDasharray="3 4" />
        <path pathLength="1" className="draw" d="M216 74 a20 20 0 1 1 -6 22" />
        <path pathLength="1" className="draw" d="M212 66 L216 76 L206 78" />
      </g>
      <text x="30" y="130" fontSize="8" fill={SLATE} fontFamily="JetBrains Mono, monospace">SEE</text>
      <text x="128" y="130" fontSize="8" fill={SLATE} fontFamily="JetBrains Mono, monospace">ACT</text>
      <text x="212" y="130" fontSize="8" fill={SLATE} fontFamily="JetBrains Mono, monospace">REPLAY</text>
    </svg>
  )
}

function DiagramBuilding() {
  return (
    <svg viewBox="0 0 280 180" className="absolute inset-0 block h-full w-full">
      <g fill="none" stroke={INK} strokeWidth="1.5">
        <rect pathLength="1" className="draw" x="60" y="50" width="26" height="90" />
        <rect pathLength="1" className="draw" x="120" y="50" width="26" height="90" />
        <rect pathLength="1" className="draw" x="180" y="50" width="26" height="90" />
      </g>
      <g fill={INK}>
        <rect x="60" y="96" width="26" height="44" opacity="0.9" />
        <rect x="120" y="76" width="26" height="64" opacity="0.55" />
        <rect x="180" y="120" width="26" height="20" opacity="0.3" />
      </g>
      <text x="52" y="164" fontSize="8" fill={SLATE} fontFamily="JetBrains Mono, monospace">SHIPPED</text>
      <text x="112" y="164" fontSize="8" fill={SLATE} fontFamily="JetBrains Mono, monospace">BUILDING</text>
      <text x="172" y="164" fontSize="8" fill={SLATE} fontFamily="JetBrains Mono, monospace">NEXT</text>
    </svg>
  )
}

const principles = [
  {
    n: '01', title: 'Engineering is the design material.',
    support: 'I prototype in the real medium — motion, latency, and edge cases are design decisions.',
    chips: ['React A Vite', 'GSAP A Three.js'], Diagram: DiagramStack, flip: false,
  },
  {
    n: '02', title: 'Prompts are product logic.',
    support: 'They get versioned, schema-checked, and regression-tested exactly like code.',
    chips: ['git-backed registry', 'evals on merge'], Diagram: DiagramPipeline, flip: true,
  },
  {
    n: '03', title: 'Personal data stays home.',
    support: 'On-device before API. Offline by default. Zero telemetry — ever.',
    chips: ['local inference', '0 bytes out'], Diagram: DiagramLocal, flip: false,
  },
  {
    n: '04', title: 'No API? The interface is the API.',
    support: 'Vision maps the screen like a person would; actions replay deterministically.',
    chips: ['see → act → replay', 'auditable'], Diagram: DiagramArch, flip: true,
  },
  {
    n: '05', title: 'Shipped beats perfect.',
    support: 'Veronica vNext and the Gamut pipeline are in the world, learning from users.',
    chips: ['Veronica vNext', 'Gamut CI/CD'], Diagram: DiagramBuilding, flip: false,
  },
]

function PrincipleCard({ p }) {
  return (
    <article
      className="prow group relative flex h-full flex-col overflow-hidden rounded-xl border border-black/10 bg-panel transition-colors duration-500 hover:border-black/25"
      data-cursor="default"
    >
      <div className="relative aspect-[280/110] border-b border-black/10">
        <p.Diagram />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-3 top-1 select-none font-display text-5xl leading-none text-black/[0.07]"
        >
          {p.n}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <span className="font-sans text-[0.6rem] uppercase tracking-[0.35em] text-titanium-dim">
          Principle {p.n}
        </span>
        <h3
          className="mt-2 font-display text-2xl leading-[1.1] text-bone"
          data-cursor="text"
        >
          {p.title}
        </h3>
        <p className="mt-3 text-sm font-light leading-relaxed text-titanium" data-cursor="text">
          {p.support}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {p.chips.map((c) => (
            <span key={c} className="rounded-full border border-black/20 px-3 py-1 font-sans text-[0.55rem] uppercase tracking-[0.18em] text-titanium">
              {c}
            </span>
          ))}
        </div>
      </div>
    </article>
  )
}

export default function Bento() {
  const root = useRef(null)

  useLayoutEffect(() => {
    if (reducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.from(root.current.querySelectorAll('.pcard'), {
        y: 24, opacity: 0, stagger: 0.06, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: root.current, start: 'top 80%', once: true },
      })
    }, root.current)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} id="system" className="relative bg-void px-6 py-20 md:px-[8vw] md:py-28" aria-label="How I think — principles">
      <header className="mb-8 flex flex-col gap-4">
        <span className="font-sans text-[0.65rem] uppercase tracking-[0.35em] text-titanium-dim" data-cursor="text">
          [ Chapter 05 — Principles ]
        </span>
        <h2 className="max-w-3xl font-display text-4xl leading-[1.02] text-bone md:text-6xl" data-cursor="text">
          Five beliefs, drawn in ink.
        </h2>
        <p className="max-w-xl text-base font-light leading-relaxed text-titanium" data-cursor="text">
          No filler cards. Each principle ships with its diagram — hover one and watch it explain itself.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {principles.map((p) => (
          <div key={p.n} className="pcard">
            <PrincipleCard p={p} />
          </div>
        ))}

        {/* sixth cell — availability */}
        <div className="pcard">
          <div className="flex h-full flex-col justify-between gap-6 rounded-xl bg-bone p-6" data-cursor="default">
            <span className="font-sans text-[0.6rem] uppercase tracking-[0.35em] text-void/50">
              Currently
            </span>
            <p className="font-display text-2xl leading-[1.1] text-void" data-cursor="text">
              Building daily. Open to product design & design engineering roles.
            </p>
            <button
              type="button"
              onClick={() => scrollToTarget('#contact')}
              className="inline-flex w-fit items-center gap-2 rounded-full bg-void px-5 py-2.5 font-sans text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-bone transition-transform duration-300 hover:scale-105"
              data-cursor="magnetic"
              aria-label="Jump to contact"
            >
              Start a conversation
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
                <path d="M5 12h14" strokeLinecap="round" />
                <path d="M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* status strip */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-black/10 py-8 font-sans text-[0.6rem] uppercase tracking-[0.25em] text-titanium">
        <span className="flex items-center gap-2.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-bone opacity-50" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-bone" />
          </span>
          status — building daily
        </span>
        <span>telemetry off</span>
        <span>curiosity unlimited</span>
      </div>

      {/* ink CTA band */}
      <button
        type="button"
        onClick={() => scrollToTarget('#experiments')}
        className="group mt-4 flex w-full items-center justify-between gap-6 rounded-2xl bg-bone px-6 py-6 text-left transition-transform duration-300 hover:-translate-y-0.5 md:px-10 md:py-8"
        data-cursor="magnetic"
        aria-label="Jump to selected work"
      >
        <span>
          <span className="block font-sans text-[0.55rem] uppercase tracking-[0.3em] text-bone/50">See it applied</span>
          <span className="mt-3 block max-w-xl font-display text-2xl leading-tight text-void md:text-3xl" data-cursor="text">
            Every principle above shows up in the shipped work.
          </span>
        </span>
        <span className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full border border-void/30 text-void transition-transform duration-300 group-hover:translate-x-1.5 md:h-16 md:w-16">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
            <path d="M5 12h14" strokeLinecap="round" />
            <path d="M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>
    </section>
  )
}