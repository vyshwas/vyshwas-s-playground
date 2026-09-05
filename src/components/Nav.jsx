import { useState, useEffect, useRef } from 'react'
import { scrollToTarget } from '../App.jsx'

const links = [
  { id: 'about', label: 'About', href: '#about' },
  { id: 'lab', label: 'Lab', href: '#lab' },
  { id: 'experiments', label: 'Work', href: '#experiments' },
  { id: 'system', label: 'Principles', href: '#system' },
  { id: 'exit', label: 'Contact', href: '#exit' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const navRef = useRef(null)

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY
      setScrolled(scrollY > 50)

      // Active section detection
      const triggerY = window.innerHeight * 0.35 // Detect based on what's in the top 35% of screen
      let current = ''
      for (const link of links) {
        const el = document.getElementById(link.id)
        if (el) {
          const rect = el.getBoundingClientRect()
          // If the element's top is above the trigger point AND its bottom is below the trigger point
          if (rect.top <= triggerY && rect.bottom > triggerY) {
            current = link.id
            break
          }
        }
      }
      setActiveSection(current)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleNav = (href) => {
    setMenuOpen(false)
    scrollToTarget(href)
  }

  return (
    <header
      ref={navRef}
      className="fixed top-5 left-0 right-0 z-[1000] flex justify-center pointer-events-none px-4 md:px-6"
    >
      <div
        className={`
          pointer-events-auto flex items-center justify-between h-12 px-4 md:px-6 rounded-full
          backdrop-blur-xl border transition-all duration-300 max-w-[840px] w-full
          ${scrolled
            ? 'bg-[#f7f6f3]/90 border-black/10 shadow-[0_12px_32px_rgba(0,0,0,0.06)]'
            : 'bg-[#f7f6f3]/75 border-black/[0.06] shadow-[0_4px_16px_rgba(0,0,0,0.02)]'
          }
        `}
      >
        {/* Logo — Monochrome Trapezoid Mark */}
        <button
          type="button"
          onClick={() => scrollToTarget(0)}
          className="flex items-center gap-2 shrink-0 group focus:outline-none"
          data-cursor="magnetic"
          aria-label="Back to top"
        >
          <img
            src="./assets/logo.svg"
            alt="Vishwas Mehta"
            className="h-4 w-4 transition-transform duration-300 group-hover:scale-110"
          />
          <span className="font-sans text-[0.7rem] font-semibold tracking-[0.2em] uppercase text-bone opacity-90 group-hover:opacity-100">
            VISHWAS
          </span>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          {links.map((l) => {
            const isActive = activeSection === l.id
            return (
              <button
                key={l.href}
                type="button"
                onClick={() => handleNav(l.href)}
                className={`
                  nav-pill-link font-sans text-[0.72rem] tracking-[0.14em] uppercase transition-colors duration-200
                  ${isActive ? 'text-bone font-medium active' : 'text-titanium hover:text-bone'}
                `}
                data-cursor="magnetic"
              >
                {l.label}
              </button>
            )
          })}

          {/* Divider */}
          <span className="text-black/15 text-xs select-none">|</span>

          {/* Resume CTA Pill */}
          <a
            href="./resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-backyard-btn"
            data-cursor="magnetic"
          >
            Resume ↗
          </a>
        </nav>

        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          className="md:hidden flex flex-col justify-center items-center gap-[5px] p-2 z-[101] focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
        >
          <span
            className={`block w-[20px] h-[1.5px] bg-bone transition-all duration-300 ${
              menuOpen ? 'rotate-45 translate-y-[6.5px]' : ''
            }`}
          />
          <span
            className={`block w-[20px] h-[1.5px] bg-bone transition-all duration-300 ${
              menuOpen ? '-rotate-45 -translate-y-[0px]' : ''
            }`}
          />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div className="pointer-events-auto fixed inset-0 z-[999] bg-[#f7f6f3]/98 backdrop-blur-2xl flex flex-col items-center justify-center gap-7 px-8">
          <button
            type="button"
            className="absolute top-6 right-6 p-3 focus:outline-none"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            <span className="block w-[22px] h-[1.5px] bg-bone rotate-45 translate-y-[1px]" />
            <span className="block w-[22px] h-[1.5px] bg-bone -rotate-45 -translate-y-[0.5px]" />
          </button>

          <div className="mb-4 flex items-center gap-2">
            <img src="./assets/logo.svg" alt="Logo" className="h-5 w-5" />
            <span className="font-sans text-xs font-semibold tracking-[0.25em] uppercase text-bone">
              Vishwas Mehta
            </span>
          </div>

          {links.map((l) => (
            <button
              key={l.href}
              type="button"
              onClick={() => handleNav(l.href)}
              className="font-sans text-xl font-medium tracking-[0.16em] uppercase text-bone hover:text-black/60 transition-colors"
            >
              {l.label}
            </button>
          ))}

          <a
            href="./resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center justify-center gap-2 rounded-full border border-black/20 bg-black/5 px-6 py-3 font-sans text-xs uppercase tracking-[0.2em] text-bone transition-colors hover:bg-bone hover:text-white"
          >
            Download Resume ↗
          </a>
        </div>
      )}
    </header>
  )
}