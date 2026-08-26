import os

code = """import { useLayoutEffect, useRef, useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { reducedMotion } from '../App.jsx'

gsap.registerPlugin(ScrollTrigger)

const projects = [
  {
    no: '01',
    title: 'Nocturne',
    tag: 'Quick-Commerce Checkout',
    desc: 'A self-initiated quick-commerce checkout concept, and the design follow-on to a cart abandonment audit I ran at Katalyse.ai: the audit found where trust breaks, and this is where I tried to rebuild it.',
    prob: "Indian quick-commerce already fixed the friction Western cart research targets: saved addresses, saved payment, ETA up front, near-one-screen checkout. What's left is quieter, last-second hesitation at the moment of paying, and recovery after a failed UPI payment, which is common, not an edge case.",
    appr: "An observational teardown of three live checkouts, then a returning-user drawer aimed at the two moments that still lose people. The single surface holds item, total, and destination visible through payment via a receipt metaphor, stabilised by a skeleton loader so nothing shifts.",
    sys: "A clickable prototype where every state works, built around a first-class payment-failure screen ('the misprint') that absorbs blame and preserves the order instead of showing a generic red error, plus a market pass: UPI-first payment methods, an itemised bill with a permanent night-fee waiver, and a trust line at the exact moment of hesitation.",
    learn: "Recovery is the highest-leverage moment in this market. Absorbing blame on failure and keeping the user inside the flow matters more than shaving another step, and I have no local evidence for that yet, only an argument.",
    meta: ['checkout optimization', 'trust design', 'upi recovery'],
    img: '/assets/project_nocturne.png',
    proto: '/assets/nocturne-prototype.html?v=2'
  },
  {
    no: '02',
    title: 'Munim',
    tag: 'Delegated UPI Payments',
    desc: 'A speculative concept for delegated UPI payments, started the week NPCI confirmed it is developing a Unified Agent Protocol to let verified AI agents initiate UPI transactions within user-defined limits.',
    prob: "UPI has a property card networks do not: a push payment has no chargeback rail. On Visa or Mastercard an AI agent's mistake becomes a dispute; on UPI it is gone money. Consumer research puts trust as the gate, with 95% of consumers reporting at least one concern about AI-driven purchasing.",
    appr: "Three decisions carry the design. Per-merchant earned autonomy over day-one full delegation: every merchant starts supervised... A visible 10-minute hold over instant auto-payment, because UPI cannot be reversed... And narrated actions over a silent audit trail.",
    sys: "A fully clickable prototype of the whole delegation loop: the mandate, supervised asks with a UPI PIN sheet, the live countdown hold, a trust ladder, and a passbook ledger where every rupee is explained. Visual system built on the bahi-khata.",
    learn: "Delegation is not an automation problem, it is a trust-calibration problem. The interface's real job is teaching the user what the agent's judgment looks like, and refusals explain that better than successes.",
    meta: ['ai agents', 'payment delegation', 'trust calibration'],
    img: '/assets/project_munim.png',
    proto: '/assets/munim-prototype.html'
  },
  {
    no: '03',
    title: 'Awara',
    tag: 'Live-Adapting Itinerary',
    desc: 'A working prototype of a travel-itinerary app, built to treat trip planning as a system rather than a one-shot recommendation. Most itinerary tools ask for dates and a destination, hand you a list, and disappear from the trip once you land.',
    prob: "Generic AI trip-planners produce plans that look confident and travel badly. My research found 65% of travelers still plan manually across scattered tools despite AI options existing, and 66% have had a trip plan break mid-trip with no way to adapt.",
    appr: "Two decisions carried the build. A dual-path Create flow, 'With Awara' or 'By hand,' so the system assists instead of replacing the traveler's judgment. And a live itinerary instead of a fixed one: an Adjust sheet handles rain, a crowded stop, running late, or wanting a surprise.",
    sys: "A full clickable prototype: Welcome through Home, Create (manual vs. AI-assisted), a live three-day Jaipur itinerary, the Adjust sheet with proactive suggestions, and My Trips. Built on a vermilion-and-ink editorial system.",
    learn: "Trust in a travel app is won at the moment something goes wrong, not at the moment the plan is generated. Building the Adjust sheet taught me that an itinerary earns confidence by staying honest about disruption and giving the user an easy way back.",
    meta: ['real-time adaptation', 'travel system', 'ai assistance'],
    img: '/assets/project_awara.png',
    proto: '/assets/awara-prototype.html?v=3'
  }
]

function Drawer({ activeProject, isOpen, onClose }) {
  const drawerRef = useRef(null)
  const backdropRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      if (window.__lenis) window.__lenis.stop()
      
      gsap.to(backdropRef.current, { opacity: 1, duration: 0.4, ease: 'power2.out', display: 'block' })
      gsap.to(drawerRef.current, { x: '0%', duration: 0.6, ease: 'expo.out' })
    } else {
      document.body.style.overflow = ''
      if (window.__lenis) window.__lenis.start()
      
      gsap.to(backdropRef.current, { opacity: 0, duration: 0.4, ease: 'power2.in', display: 'none' })
      gsap.to(drawerRef.current, { x: '100%', duration: 0.5, ease: 'expo.in' })
    }
  }, [isOpen])

  if (!activeProject && !isOpen) return null

  const p = activeProject || projects[0]

  return createPortal(
    <div className="fixed inset-0 z-[10000] pointer-events-none" style={{ perspective: '2000px' }}>
      <div 
        ref={backdropRef}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 hidden pointer-events-auto cursor-pointer"
      />
      <div 
        ref={drawerRef}
        className="absolute top-0 right-0 h-full w-full md:w-[85vw] lg:w-[75vw] bg-void border-l border-amber/30 transform translate-x-full pointer-events-auto flex flex-col md:flex-row shadow-[-20px_0_60px_rgba(0,0,0,0.8)] overflow-hidden"
      >
        <div className="w-full md:w-[55%] h-[55vh] md:h-full overflow-y-auto p-8 md:p-16 custom-scrollbar relative z-10 bg-void">
          <div className="flex justify-between items-start mb-12">
            <div>
              <span className="font-mono text-[10px] text-amber uppercase tracking-[0.2em] mb-4 block">Project {p.no} of 03</span>
              <h2 className="text-4xl md:text-6xl font-extrabold tracking-[-0.03em] text-bone uppercase">{p.title}</h2>
            </div>
            <button onClick={onClose} className="text-amber hover:text-white transition-colors text-2xl px-4 py-2" data-cursor="magnetic">✕</button>
          </div>
          
          <div className="space-y-12">
            <section>
              <h3 className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-amber mb-3">Description</h3>
              <p className="text-base text-titanium leading-relaxed font-light">{p.desc}</p>
            </section>
            
            <section>
              <h3 className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-amber mb-3">The Problem</h3>
              <p className="text-base text-titanium leading-relaxed font-light">{p.prob}</p>
            </section>
            
            <section>
              <h3 className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-amber mb-3">Approach</h3>
              <p className="text-base text-titanium leading-relaxed font-light">{p.appr}</p>
            </section>
            
            <section>
              <h3 className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-amber mb-3">System Output</h3>
              <p className="text-base text-titanium leading-relaxed font-light">{p.sys}</p>
            </section>
            
            <section className="pt-8 border-t border-white/10">
              <h3 className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-amber mb-3">Learning</h3>
              <p className="text-base text-bone font-medium leading-relaxed">{p.learn}</p>
            </section>
          </div>
        </div>
        
        <div className="w-full md:w-[45%] h-[45vh] md:h-full bg-black relative border-t md:border-t-0 md:border-l border-amber/30 flex-shrink-0 z-0">
          {p.proto ? (
            <iframe 
              src={p.proto}
              className="w-full h-full border-0 absolute inset-0"
              title={`${p.title} prototype`}
              loading="lazy"
            />
          ) : (
            <img 
              src={p.img} 
              alt={p.title}
              className="w-full h-full object-cover absolute inset-0"
            />
          )}
        </div>
      </div>
    </div>,
    document.body
  )
}

function ProjectRow({ p, index, onClick }) {
  const row = useRef(null)
  const cardRef = useRef(null)
  const imgRef = useRef(null)
  const maskRef = useRef(null)
  const side = index % 2 === 0 ? 1 : -1
  const [hovered, setHovered] = useState(false)

  useLayoutEffect(() => {
    if (reducedMotion()) return
    const ctx = gsap.context(() => {
      const card = cardRef.current
      const img = imgRef.current
      const mask = maskRef.current
      if (!card || !img || !mask) return

      gsap.set(mask, { scaleX: 1, transformOrigin: side === 1 ? 'right' : 'left' })
      gsap.set(img, { scale: 1.15 })

      gsap.to(mask, {
        scaleX: 0,
        duration: 1.2,
        ease: 'power3.inOut',
        scrollTrigger: {
          trigger: row.current,
          start: 'top 80%',
          end: 'top 30%',
          scrub: 1,
        },
      })

      gsap.to(img, {
        scale: 1,
        duration: 1.4,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: row.current,
          start: 'top 80%',
          end: 'top 30%',
          scrub: 1,
        },
      })

      gsap.fromTo(
        img,
        { yPercent: -8 },
        {
          yPercent: 8,
          ease: 'none',
          scrollTrigger: {
            trigger: row.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        },
      )

      gsap.matchMedia().add('(min-width: 769px)', () => {
        gsap.fromTo(
          card,
          { rotateY: side * 12, x: side * 60 },
          {
            rotateY: side * -12,
            x: side * -60,
            transformPerspective: 1400,
            ease: 'none',
            scrollTrigger: {
              trigger: row.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1,
            },
          },
        )
      })

      gsap.fromTo(row.current.querySelectorAll('.proj-reveal'), {
        y: 44,
        opacity: 0,
      }, {
        y: 0,
        opacity: 1,
        stagger: 0.08,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: row.current,
          start: 'top 85%',
          once: true,
        },
      })
    }, row)
    return () => ctx.revert()
  }, [side])

  return (
    <article
      ref={row}
      className="grid items-center gap-10 md:grid-cols-2 md:gap-16 pb-[16vh] border-b border-white/5 last:border-b-0"
      style={{ perspective: '1400px' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-cursor={hovered ? 'magnetic' : 'default'}
    >
      <div
        ref={cardRef}
        className={`proj-card hw duotone relative aspect-[4/3] overflow-hidden rounded-sm border border-white/10 shadow-[0_40px_90px_-30px_rgba(0,0,0,0.8)] transition-all duration-500 ease-out cursor-pointer group ${side === -1 ? 'md:order-2' : ''}`}
        onClick={() => onClick(p)}
      >
        <div
          ref={maskRef}
          className="absolute inset-0 bg-void z-10 hw"
          style={{ transformOrigin: side === 1 ? 'left' : 'right' }}
        />
        <img
          ref={imgRef}
          className="proj-img cine-img absolute inset-[-12%_0] h-[124%] w-full object-cover hw transition-transform duration-700 group-hover:scale-105"
          src={p.img}
          alt={p.title}
          loading="lazy"
          decoding="async"
        />
        <span className="absolute left-4 top-4 z-20 font-mono text-[0.6rem] uppercase tracking-[0.25em] text-bone/80">
          EXP_{p.no} / RAW
        </span>
        
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-sm opacity-0 transition-opacity duration-300 group-hover:opacity-100" data-cursor="magnetic">
          <span className="font-mono text-sm uppercase tracking-[0.2em] text-amber border border-amber/30 px-6 py-3 rounded-full bg-black/50">View Project</span>
        </div>
      </div>

      <div className={side === -1 ? 'md:order-1' : ''}>
        <span className="proj-reveal block font-mono text-[0.65rem] uppercase tracking-[0.3em] text-amber" data-cursor="text">
          {p.tag}
        </span>
        <h3 className="proj-reveal mt-4 text-5xl font-extrabold tracking-[-0.03em] text-bone md:text-7xl" data-cursor="text">
          {p.title}
          <span className="text-amber">.</span>
        </h3>
        <p className="proj-reveal mt-6 max-w-md text-base font-light leading-relaxed text-titanium line-clamp-4" data-cursor="text">
          {p.desc}
        </p>
        <ul className="proj-reveal mt-8 space-y-2 border-t border-white/10 pt-6">
          {p.meta.map((m) => (
            <li
              key={m}
              className="flex items-center gap-3 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-titanium-dim"
            >
              <span className="h-1 w-1 rounded-full bg-amber" />
              {m}
            </li>
          ))}
        </ul>
        <button 
          onClick={() => onClick(p)}
          className="proj-reveal mt-10 font-mono text-[0.65rem] uppercase tracking-[0.25em] text-bone hover:text-amber transition-colors flex items-center gap-2"
          data-cursor="magnetic"
        >
          View Case Study <span className="text-amber">→</span>
        </button>
      </div>
    </article>
  )
}

export default function Projects() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [activeProject, setActiveProject] = useState(null)

  const handleOpenProject = (p) => {
    setActiveProject(p)
    setDrawerOpen(true)
  }

  return (
    <>
      <section id="experiments" className="relative px-6 py-[18vh] md:px-[8vw]" aria-label="Experiments">
        <header className="mb-24 flex flex-col gap-4 md:mb-36">
          <span className="font-mono text-[0.65rem] uppercase tracking-[0.35em] text-titanium-dim" data-cursor="text">
            [ Chapter 03 — Selected Works ]
          </span>
          <h2 className="max-w-3xl text-4xl font-bold tracking-[-0.03em] text-bone md:text-6xl" data-cursor="text">
            Working artifacts, not screenshots.
          </h2>
        </header>
        <div className="flex flex-col">
          {projects.map((p, i) => (
            <ProjectRow key={p.no} p={p} index={i} onClick={handleOpenProject} />
          ))}
        </div>
      </section>

      <Drawer 
        isOpen={drawerOpen} 
        activeProject={activeProject} 
        onClose={() => setDrawerOpen(false)} 
      />
    </>
  )
}
"""
with open("src/components/Projects.jsx", "w", encoding="utf-8") as f:
    f.write(code)
print("Projects.jsx rewritten with proper Drawer functionality, boundaries, and correct projects.")
