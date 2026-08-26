import os

code = """import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import Nav from './components/Nav.jsx'
import Hero from './components/Hero.jsx'
import LabReveal from './components/LabReveal.jsx'
import Projects from './components/Projects.jsx'
import Bento from './components/Bento.jsx'
import FooterExit from './components/FooterExit.jsx'
import AmbientCanvas from './components/AmbientCanvas.jsx'
import MagneticCursor from './components/MagneticCursor.jsx'

gsap.registerPlugin(ScrollTrigger)

export const reducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function scrollToTarget(target) {
  const lenis = window.__lenis
  if (lenis) {
    lenis.scrollTo(target, { duration: 1.6 })
  } else if (typeof target === 'string') {
    document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' })
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const chapters = [
  { id: 'hero', label: 'Sandbox' },
  { id: 'lab', label: 'Lab' },
  { id: 'experiments', label: 'Experiments' },
  { id: 'system', label: 'System' },
  { id: 'exit', label: 'Exit' },
]

export default function App() {
  useEffect(() => {
    let lenis
    let raf
    if (!reducedMotion()) {
      lenis = new Lenis({ lerp: 0.09, smoothWheel: true })
      lenis.on('scroll', ScrollTrigger.update)
      raf = (time) => lenis.raf(time * 1000)
      gsap.ticker.add(raf)
      gsap.ticker.lagSmoothing(0)
      window.__lenis = lenis
    }
    return () => {
      if (raf) gsap.ticker.remove(raf)
      lenis?.destroy()
      delete window.__lenis
    }
  }, [])

  useEffect(() => {
    const bar = document.getElementById('progress-bar')
    if (!bar || reducedMotion()) return
    const st = ScrollTrigger.create({
      start: 0,
      end: () => document.documentElement.scrollHeight - window.innerHeight,
      onUpdate: (self) => {
        bar.style.transform = `scaleX(${self.progress})`
      },
    })
    return () => st.kill()
  }, [])

  useEffect(() => {
    if (reducedMotion()) return
    const dots = document.querySelectorAll('.chapter-dot')
    const sections = chapters.map(c => document.getElementById(c.id)).filter(Boolean)
    const update = () => {
      const scrollY = window.scrollY + window.innerHeight * 0.4
      sections.forEach((sec, i) => {
        if (!sec) return
        const top = sec.offsetTop
        const bottom = top + sec.offsetHeight
        dots[i]?.classList.toggle('active', scrollY >= top && scrollY < bottom)
      })
    }
    window.addEventListener('scroll', update, { passive: true })
    update()
    return () => window.removeEventListener('scroll', update)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => { ScrollTrigger.refresh() }, 200)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="relative">
      <AmbientCanvas />
      <MagneticCursor />
      <div
        id="progress-bar"
        aria-hidden="true"
        className="fixed top-0 left-0 z-[100] h-px w-full origin-left scale-x-0 bg-amber hw"
      />
      <nav className="chapter-indicator" aria-label="Chapter navigation" role="navigation">
        {chapters.map((c) => (
          <div key={c.id} className="chapter-dot" data-label={c.label} data-target={c.id} />
        ))}
      </nav>
      <Nav />
      <main>
        <Hero />
        <LabReveal />
        <Projects />
        <Bento />
        <FooterExit />
      </main>
    </div>
  )
}
"""
with open("src/App.jsx", "w", encoding="utf-8") as f:
    f.write(code)
print("App.jsx restored.")
