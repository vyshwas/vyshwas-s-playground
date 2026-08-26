import { scrollToTarget } from '../App.jsx'

const links = [
  { label: 'The Lab', href: '#lab' },
  { label: 'Work', href: '#experiments' },
  { label: 'Principles', href: '#system' },
  { label: 'About', href: '#about' },
]

export default function Nav() {
  return (
    <nav className="fixed inset-x-0 top-0 z-[80] border-b border-black/5 bg-[#f7f6f3]/85 backdrop-blur-md">
      <div className="flex items-center justify-between px-6 py-4 md:px-10">
        <button
          type="button"
          onClick={() => scrollToTarget(0)}
          className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-bone"
          data-cursor="magnetic"
        >
          VM<span className="text-black/30">/</span>23
        </button>
        <div className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <button
              key={l.href}
              type="button"
              onClick={() => scrollToTarget(l.href)}
              className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-titanium transition-colors duration-300 hover:text-bone"
              data-cursor="magnetic"
            >
              {l.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => scrollToTarget('#exit')}
            className="inline-flex items-center gap-2 rounded-full border border-black/15 bg-white/60 px-3.5 py-1.5 font-mono text-[0.55rem] uppercase tracking-[0.2em] text-bone transition-colors duration-300 hover:border-black/40"
            data-cursor="magnetic"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-bone opacity-50" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-bone" />
            </span>
            Open to work
          </button>
          <a
            href="https://vyshwas.github.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-bone underline-offset-4 transition-colors duration-300 hover:underline"
            data-cursor="magnetic"
          >
            Portfolio ↗
          </a>
        </div>
      </div>
    </nav>
  )
}