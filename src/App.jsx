import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import Nav from './components/Nav.jsx'
import Hero from './components/Hero.jsx'
import LabReveal from './components/LabReveal.jsx'
import Projects from './components/Projects.jsx'
import Bento from './components/Bento.jsx'
import AboutSandbox from './components/AboutSandbox.jsx'
import FooterExit from './components/FooterExit.jsx'
import AmbientWebGL from './components/AmbientWebGL.jsx'
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
  { id: 'hero', label: 'Sandbox', key: '1' },
  { id: 'lab', label: 'Lab', key: '2' },
  { id: 'experiments', label: 'Experiments', key: '3' },
  { id: 'system', label: 'System', key: '4' },
  { id: 'exit', label: 'Exit', key: '5' },
]

const wowMoments = [
  { chapter: 'hero', progress: 0.1, label: 'Video scale + headline split', fn: () => {} },
  { chapter: 'hero', progress: 0.45, label: '3D particle burst', fn: () => {} },
  { chapter: 'hero', progress: 0.72, label: 'Color grading peak', fn: () => {} },
  { chapter: 'lab', progress: 0.15, label: 'Core sphere unlocks', fn: () => {} },
  { chapter: 'lab', progress: 0.4, label: 'Rings begin rotation', fn: () => {} },
  { chapter: 'lab', progress: 0.75, label: 'Light shafts activate', fn: () => {} },
  { chapter: 'experiments', progress: 0.25, label: 'Mask sweep reveal', fn: () => {} },
  { chapter: 'experiments', progress: 0.6, label: '3D carousel depth', fn: () => {} },
  { chapter: 'system', progress: 0.3, label: 'Flip card hover', fn: () => {} },
  { chapter: 'system', progress: 0.65, label: 'Magnetic tilt peak', fn: () => {} },
  { chapter: 'exit', progress: 0.1, label: 'Terminal appears', fn: () => {} },
  { chapter: 'exit', progress: 0.45, label: 'Konami unlocks', fn: () => {} },
  { chapter: 'exit', progress: 0.8, label: 'Theme cycle peak', fn: () => {} },
]

export default function App() {
  const fpsRef = useRef({ frames: 0, lastTime: 0, fps: 60 })
  const qualityRef = useRef('high')

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
    window.scrollTo(0, 0)
    fpsRef.current.lastTime = performance.now()
  }, [])

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
        wowMoments.forEach((moment) => {
          if (Math.abs(self.progress - moment.progress) < 0.02 && moment.fn) {
            moment.fn()
            moment.fn = null
          }
        })
      },
    })
    return () => st.kill()
  }, [])

  useEffect(() => {
    const handleLoad = () => {
      ScrollTrigger.sort()
      ScrollTrigger.refresh()
    }
    
    // If already loaded
    if (document.readyState === 'complete') {
      handleLoad()
    } else {
      window.addEventListener('load', handleLoad)
    }
    
    // Also do a few delayed refreshes just in case fonts/components mount late
    const t1 = setTimeout(handleLoad, 500)
    const t2 = setTimeout(handleLoad, 1500)
    const t3 = setTimeout(handleLoad, 3000)

    return () => {
      window.removeEventListener('load', handleLoad)
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return
      if (e.key >= '1' && e.key <= '5') {
        e.preventDefault()
        const idx = parseInt(e.key, 10) - 1
        if (chapters[idx]) scrollToTarget(`#${chapters[idx].id}`)
      } else if (e.key === ' ' || e.key === 'Space') {
        e.preventDefault()
        if (window.__lenis) {
          window.__lenis.stop()
          setTimeout(() => window.__lenis?.start(), 2000)
        }
      } else if (e.key === 'k' || e.key === 'K') {
        const konami = new KeyboardEvent('keydown', { code: 'KeyK' })
        document.dispatchEvent(konami)
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        const currentIdx = chapters.findIndex(c => {
          const sec = document.getElementById(c.id)
          if (!sec) return false
          const rect = sec.getBoundingClientRect()
          return rect.top <= 100 && rect.bottom > 100
        })
        const nextIdx = Math.min(Math.max(currentIdx + (e.key === 'ArrowDown' ? 1 : -1), 0), chapters.length - 1)
        if (nextIdx !== currentIdx) scrollToTarget(`#${chapters[nextIdx].id}`)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    let frameId = 0
    function measureFPS(now) {
      fpsRef.current.frames++
      if (now - fpsRef.current.lastTime >= 1000) {
        fpsRef.current.fps = fpsRef.current.frames
        fpsRef.current.frames = 0
        fpsRef.current.lastTime = now
        if (fpsRef.current.fps < 30 && qualityRef.current === 'high') {
          qualityRef.current = 'low'
          document.documentElement.classList.add('low-quality')
        } else if (fpsRef.current.fps > 50 && qualityRef.current === 'low') {
          qualityRef.current = 'high'
          document.documentElement.classList.remove('low-quality')
        }
      }
      frameId = requestAnimationFrame(measureFPS)
    }
    frameId = requestAnimationFrame(measureFPS)
    return () => cancelAnimationFrame(frameId)
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      chapters.forEach((c, i) => {
        ScrollTrigger.create({
          trigger: `#${c.id}`,
          start: 'top top',
          end: i < chapters.length - 1 ? `#${chapters[i + 1].id} top` : '+=100%',
          onEnter: () => {
            document.body.dataset.chapter = c.id
          },
          onLeave: () => {
            document.body.dataset.chapter = ''
          },
          onEnterBack: () => {
            document.body.dataset.chapter = c.id
          },
        })
      })
    }, document.body)
    return () => ctx.revert()
  }, [])

  return (
    <div className="relative min-h-screen">
      <AmbientWebGL />
      <MagneticCursor />
      <div className="paper-grain" aria-hidden="true" />
      <div
        id="progress-bar"
        aria-hidden="true"
        className="fixed top-0 left-0 z-[100] h-px w-full origin-left scale-x-0 bg-cyan hw"
      />
      <Nav />
      <main>
        <Hero />
        <LabReveal />
        <Projects />
        <Bento />
        <AboutSandbox />
        <FooterExit />
      </main>
    </div>
  )
}