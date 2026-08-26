import os

code = """import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { reducedMotion } from '../App.jsx'

gsap.registerPlugin(ScrollTrigger)

const IMG = (id) =>
  `https://images.unsplash.com/photo-${id}?w=1600&q=80&auto=format&fit=crop`

const projects = [
  {
    no: '01',
    title: 'Gamut',
    tag: 'Design System Engine',
    desc: 'A color-and-type systems engine that encodes 60-30-10 color roles, archetype-driven psychology, and contrast checks in both light and dark before anything exports. Design decisions become reusable tokens instead of one-off judgment calls.',
    meta: ['css • tailwind • json token export', 'palette fixer + generator'],
    img: IMG('1622396481322-3b83d186701b'),
  },
  {
    no: '02',
    title: 'YapaYapa',
    tag: 'Local-First Dictation',
    desc: 'Dictation that treats your voice as data worth keeping at home. Speech becomes structured text on-device, built around the belief that the fastest input method should not require shipping your sentences to someone else\\'s server.',
    meta: ['on-device inference', 'zero telemetry by default'],
    img: IMG('1543829285-a3b7157052a7'),
  },
  {
    no: '03',
    title: 'Veronica',
    tag: 'Vision-Based GUI Automation',
    desc: 'Automation that sees. Veronica watches the screen with computer vision, locates the interface like a person would, and acts on it — for workflows that have no API and never will. The GUI is the API.',
    meta: ['screen understanding', 'no-API workflows'],
    img: IMG('1620822569161-2a6bee3d8df3'),
  },
]

function ProjectRow({ p, index }) {
  const row = useRef(null)
  const cardRef = useRef(null)
  const imgRef = useRef(null)
  const maskRef = useRef(null)
  const side = index % 2 === 0 ? 1 : -1
  const [hovered, setHovered] = useState(false)
  const [expanded, setExpanded] = useState(false)

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
          start: 'top 78%',
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
          start: 'top 78%',
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

  const onMouseEnter = () => setHovered(true)
  const onMouseLeave = () => setHovered(false)
  const onClick = () => setExpanded(!expanded)

  return (
    <article
      ref={row}
      className="grid items-center gap-10 md:grid-cols-2 md:gap-16"
      style={{ perspective: '1400px' }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      data-cursor={hovered ? 'magnetic' : 'default'}
    >
      <div
        ref={cardRef}
        className={`proj-card hw duotone relative aspect-[4/3] overflow-hidden rounded-sm border border-white/10 shadow-[0_40px_90px_-30px_rgba(0,0,0,0.8)] transition-all duration-500 ease-out ${side === -1 ? 'md:order-2' : ''} ${expanded ? 'md:col-span-2 z-20 scale-[1.02]' : ''}`}
        onClick={onClick}
      >
        <div
          ref={maskRef}
          className="absolute inset-0 bg-void z-10 hw"
          style={{ transformOrigin: side === 1 ? 'left' : 'right' }}
        />
        <img
          ref={imgRef}
          className="proj-img cine-img absolute inset-[-12%_0] h-[124%] w-full object-cover hw"
          src={p.img}
          alt=""
          loading="lazy"
          decoding="async"
        />
        <span className="absolute left-4 top-4 z-20 font-mono text-[0.6rem] uppercase tracking-[0.25em] text-bone/80">
          EXP_{p.no} / RAW
        </span>
        {hovered && !expanded && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-sm opacity-0 animate-in fade-in duration-300" data-cursor="magnetic">
            <span className="font-mono text-sm uppercase tracking-[0.2em] text-amber">Click to expand</span>
          </div>
        )}
      </div>

      <div className={side === -1 ? 'md:order-1' : ''}>
        <span className="proj-reveal block font-mono text-[0.65rem] uppercase tracking-[0.3em] text-amber" data-cursor="text">
          {p.tag}
        </span>
        <h3 className="proj-reveal mt-4 text-5xl font-extrabold tracking-[-0.03em] text-bone md:text-7xl" data-cursor="text">
          {p.title}
          <span className="text-amber">.</span>
        </h3>
        <p className="proj-reveal mt-6 max-w-md text-base font-light leading-relaxed text-titanium" data-cursor="text">
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
      </div>
    </article>
  )
}

export default function Projects() {
  return (
    <section id="experiments" className="relative px-6 py-[18vh] md:px-[8vw]" aria-label="Experiments">
      <header className="mb-24 flex flex-col gap-4 md:mb-36">
        <span className="font-mono text-[0.65rem] uppercase tracking-[0.35em] text-titanium-dim" data-cursor="text">
          [ Chapter 03 — Experiments ]
        </span>
        <h2 className="max-w-3xl text-4xl font-bold tracking-[-0.03em] text-bone md:text-6xl" data-cursor="text">
          Working artifacts, not screenshots.
        </h2>
      </header>
      <div className="flex flex-col gap-[22vh] md:gap-[26vh]">
        {projects.map((p, i) => (
          <ProjectRow key={p.no} p={p} index={i} />
        ))}
      </div>
    </section>
  )
}
"""
with open("src/components/Projects.jsx", "w", encoding="utf-8") as f:
    f.write(code)
print("Projects.jsx correctly restored with fixes.")
