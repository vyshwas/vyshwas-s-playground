import { useEffect, useRef, useState, useCallback } from 'react'
import Magnetic from './Magnetic.jsx'

const commands = {
  whoami: 'vishwas — strategic designer & design engineer, bengaluru',
  'ls ./next': 'portfolio/  github/  experiments/',
  'cat manifesto.txt': `Systems before surfaces.
Code as craft, not commodity.
Local-first is not optional.
Curiosity compounds.`,
  'neofetch': `       .---.       vishwas@playground
      /     \\      ----------------
      \\.@-@./      OS: Local-First Linux
      /\\_/\\ \\     Kernel: Curiosity 1.0
     //_/_\\_\\\\    Uptime: ∞
    (  \\___/  )   Shell: zsh + wonder
   /_/'   \\_\\    Packages: 42 (and counting)
  (_/       \\_)  `,
  help: `Available commands:
  whoami          — identity
  ls ./next       — what's next
  cat manifesto   — the philosophy
  neofetch        — system info
  konami          — 🎮
  clear           — clean slate
  exit            — return to portfolio`,
  konami: `↑ ↑ ↓ ↓ ← → ← → B A

🎮 KONAMI CODE ACCEPTED

Unlocking: "infinite curiosity" mode
Particle intensity: MAX
Glitch intensity: MAX
Easter egg: terminal theme cycle enabled

Type 'theme' to cycle.`,
  theme: `Theme cycling enabled.
Available: void (default), amber, cyan, matrix, retro
Usage: theme <name>`,
  exit: 'Exiting playground... see you in the portfolio.',
  clear: '__CLEAR__',
}

const easterEggs = {
  'sudo make me a sandwich': 'Okay. 🥪',
  'vim': 'You are now in vim. Type :q to quit. (Just kidding — you are free.)',
  'hello world': 'Hello, world. 👋 Ready to build something?',
  'make it pop': 'Increasing contrast... ✨ Done. Everything pops now.',
  'dark mode': 'Already there. 🌑',
  'light mode': 'Retina damage inbound... ☀️ Just kidding. Stay in the void.',
}

const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA']

const commandList = Object.keys(commands).concat(Object.keys(easterEggs))

function highlightOutput(text) {
  return text
    .replace(/^(\$ .+)$/gm, '<span class="cmd">$1</span>')
    .replace(/^(vishwas@.+)$/gm, '<span class="prompt">$1</span>')
    .replace(/\b(ERROR|error|failed|not found)\b/g, '<span class="error">$&</span>')
    .replace(/\b(OK|ok|success|running|enabled|active)\b/g, '<span class="success">$&</span>')
    .replace(/\b(∞|42|v1\.0\.0)\b/g, '<span class="highlight">$&</span>')
    .replace(/(\/\/ .+)$/gm, '<span class="comment">$1</span>')
    .replace(/(\[ .+? \])/g, '<span class="bracket">$1</span>')
    .replace(/(🎮|🥪|👋|✨|🌑|☀️|◆)/g, '<span class="emoji">$1</span>')
}

export default function FooterExit() {
  const [history, setHistory] = useState([
    { type: 'output', text: 'playground v1.0.0 — type "help" for commands', raw: 'playground v1.0.0 — type "help" for commands' },
    { type: 'output', text: '', raw: '' },
  ])
  const [input, setInput] = useState('')
  const [theme, setTheme] = useState('void')
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [inputHistory, setInputHistory] = useState([])
  const [showMatrix, setShowMatrix] = useState(false)
  const [konamiFlash, setKonamiFlash] = useState(false)
  const inputRef = useRef(null)
  const konamiBuffer = useRef([])
  const [konamiActive, setKonamiActive] = useState(false)
  const matrixCanvasRef = useRef(null)
  const [copied, setCopied] = useState(false)

  const handleCopyEmail = (e) => {
    e?.preventDefault()
    e?.stopPropagation()
    navigator.clipboard?.writeText('vyommehta197@gmail.com')
    setCopied(true)
    setTimeout(() => setCopied(false), 2200)
  }

  const addOutput = useCallback((text, type = 'output') => {
    const raw = typeof text === 'string' ? text : String(text)
    const highlighted = highlightOutput(raw)
    setHistory(h => [...h, { type, text: highlighted, raw }])
  }, [])

  useEffect(() => {
    const onKeyDown = (e) => {
      if (document.activeElement === inputRef.current) return
      konamiBuffer.current.push(e.code)
      if (konamiBuffer.current.length > konamiSequence.length) konamiBuffer.current.shift()
      if (konamiBuffer.current.join(',') === konamiSequence.join(',')) {
        setKonamiActive(true)
        setKonamiFlash(true)
        document.body.classList.add('konami-mode')
        setTimeout(() => setKonamiFlash(false), 150)
        addOutput('$ konami', 'input')
        addOutput(commands.konami, 'output')
        konamiBuffer.current = []
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [addOutput])

  useEffect(() => {
    if (showMatrix) {
      const canvas = matrixCanvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      const fontSize = 14
      const columns = Math.floor(canvas.width / fontSize)
      const drops = new Array(columns).fill(1)
      const accent = document.documentElement.style.getPropertyValue('--accent') || '#121212'
      const accent2 = document.documentElement.style.getPropertyValue('--accent2') || '#444444'

      let frameId = 0
      function drawMatrix() {
        const isLowQuality = document.documentElement.classList.contains('low-quality')
        if (isLowQuality) {
          frameId = requestAnimationFrame(drawMatrix)
          return
        }
        ctx.fillStyle = 'rgba(6, 6, 7, 0.05)'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.font = `${fontSize}px monospace`
        for (let i = 0; i < drops.length; i++) {
          const char = chars[Math.floor(Math.random() * chars.length)]
          const x = i * fontSize
          const y = drops[i] * fontSize
          const hue = Math.random() > 0.7 ? accent : accent2
          ctx.fillStyle = hue
          ctx.fillText(char, x, y)
          if (y > canvas.height && Math.random() > 0.975) drops[i] = 0
          drops[i]++
        }
        frameId = requestAnimationFrame(drawMatrix)
      }
      drawMatrix()
      return () => cancelAnimationFrame(frameId)
    }
  }, [showMatrix])

  const execute = useCallback((cmd) => {
    const trimmed = cmd.trim()
    addOutput(`$ ${trimmed}`, 'input')
    if (inputHistory.length === 0 || inputHistory[inputHistory.length - 1] !== trimmed) {
      setInputHistory(h => [...h.slice(-49), trimmed])
    }
    setHistoryIndex(-1)

    if (!trimmed) return

    if (trimmed in easterEggs) {
      addOutput(easterEggs[trimmed], 'output')
      return
    }

    if (trimmed in commands) {
      if (trimmed === 'clear') {
        setHistory([{ type: 'output', text: 'playground v1.0.0 — type "help" for commands', raw: 'playground v1.0.0 — type "help" for commands' }, { type: 'output', text: '', raw: '' }])
        return
      }
      if (trimmed === 'exit') {
        addOutput(commands.exit, 'output')
        setTimeout(() => window.open('https://vyshwas.github.io/', '_blank'), 800)
        return
      }
      if (trimmed === 'konami') {
        setKonamiActive(true)
        setKonamiFlash(true)
        document.body.classList.add('konami-mode')
        setTimeout(() => setKonamiFlash(false), 150)
      }
      if (trimmed.startsWith('theme ')) {
        const t = trimmed.split(' ')[1]
        if (['void', 'amber', 'cyan', 'matrix', 'retro'].includes(t)) {
          setTheme(t)
          setShowMatrix(t === 'matrix')
          addOutput(`Theme switched to ${t}.${t === 'matrix' ? ' Matrix rain activated.' : ''}`, 'output')
        } else {
          addOutput(`Unknown theme: ${t}`, 'output')
        }
        return
      }
      addOutput(commands[trimmed], 'output')
      return
    }

    addOutput(`command not found: ${trimmed}`, 'error')
  }, [addOutput, inputHistory])

  const handleSubmit = (e) => {
    e.preventDefault()
    execute(input)
    setInput('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (inputHistory.length > 0) {
        const nextIndex = historyIndex === -1 ? inputHistory.length - 1 : Math.max(0, historyIndex - 1)
        setHistoryIndex(nextIndex)
        setInput(inputHistory[nextIndex])
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex !== -1) {
        const nextIndex = historyIndex === inputHistory.length - 1 ? -1 : historyIndex + 1
        setHistoryIndex(nextIndex)
        setInput(nextIndex === -1 ? '' : inputHistory[nextIndex])
      }
    } else if (e.key === 'Tab') {
      e.preventDefault()
      const matches = commandList.filter(c => c.startsWith(input.toLowerCase()))
      if (matches.length === 1) {
        setInput(matches[0])
      } else if (matches.length > 1) {
        addOutput(matches.join('  '), 'output')
      }
    }
  }

  useEffect(() => {
    inputRef.current?.focus()
  }, [history.length])

  return (
    <footer id="contact" className="relative z-10 w-full bg-void px-6 py-28 md:px-[8vw]">
      <div id="exit" className="absolute top-0 pointer-events-none" />
      <canvas ref={matrixCanvasRef} className={`matrix-rain ${showMatrix ? 'active' : ''}`} aria-hidden="true" />
      <div className={`konami-flash ${konamiFlash ? 'active' : ''}`} aria-hidden="true" />

      <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-black/10 bg-panel shadow-2xl">
        <div className="flex items-center gap-2 border-b border-black/10 bg-panel-2 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-black/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-black/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-cyan/70" />
          <span className="ml-3 font-mono text-[0.6rem] uppercase tracking-[0.25em] text-titanium-dim">
            playground — zsh
          </span>
          <span className="ml-auto font-mono text-[0.55rem] uppercase tracking-[0.2em] text-titanium-dim/50">
            {theme.toUpperCase()} MODE
          </span>
        </div>
        <div className="p-6 font-mono text-xs leading-relaxed md:p-8 md:text-sm max-h-[50vh] overflow-y-auto" style={{ fontFamily: 'var(--font-mono)' }}>
          {history.map((h, i) => (
            <div key={i} className={`whitespace-pre-wrap ${h.type === 'input' ? 'text-cyan' : h.type === 'error' ? 'text-red-400' : 'text-bone'}`} dangerouslySetInnerHTML={{ __html: h.text }} />
          ))}
          <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-2">
            <span className="text-cyan">$</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onSubmit={handleSubmit}
              className="flex-1 bg-transparent border-none outline-none text-bone font-mono text-xs md:text-sm"
              placeholder="type a command... (Tab: complete, ↑/↓: history)"
              spellCheck={false}
              autoComplete="off"
              data-cursor="text"
            />
            <span className="cursor" aria-hidden="true" />
          </form>
        </div>
      </div>

      <div className="mt-20 flex flex-col items-center gap-6 text-center">
        <span className="font-sans text-[0.68rem] font-medium uppercase tracking-[0.35em] text-titanium-dim" data-cursor="text">
          [ Chapter 06 — Contact & Terminal ]
        </span>
        <h2 className="max-w-2xl font-display text-4xl leading-[1.05] italic text-[#121212] md:text-5xl" data-cursor="text">
          Looking for a product designer who can carry an idea into interaction?
        </h2>
        <p className="max-w-md text-[0.75rem] font-sans leading-relaxed text-titanium/80 mb-2" data-cursor="text">
          I’m interested in product design and design-engineering roles where systems thinking, prototyping, and front-end judgment matter.<br/><br/>
          <span className="uppercase tracking-[0.1em] font-medium">Bengaluru · Open to remote or relocation</span>
        </p>

        {/* Harmonized Candidate Contact Suite */}
        <div className="mt-4 flex flex-col sm:flex-row items-center gap-4 z-10">
          <Magnetic as="div" strength={0.35}>
            <a
              href="mailto:vyommehta197@gmail.com?subject=Product%20Design%20%26%20Design%20Engineering%20Inquiry%20%E2%80%94%20Vishwas%20Mehta"
              className="group relative inline-flex items-center gap-3 rounded-full bg-[#121212] px-8 py-3.5 font-sans text-xs font-semibold tracking-[0.14em] uppercase text-[#f7f6f3] shadow-xl hover:scale-105 hover:bg-black transition-all duration-300"
              aria-label="Email Vishwas Mehta at vyommehta197@gmail.com"
              data-cursor="magnetic"
            >
              <span>Email Vishwas</span>
            </a>
          </Magnetic>

          <Magnetic as="div" strength={0.35}>
            <a
              href="./resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-black/15 bg-white/70 backdrop-blur-md px-6 py-3.5 font-sans text-xs font-medium uppercase tracking-[0.14em] text-[#121212] hover:border-black/35 hover:bg-white transition-all duration-300 shadow-sm"
              data-cursor="magnetic"
            >
              Résumé &nearr;
            </a>
          </Magnetic>
          
          <Magnetic as="div" strength={0.35}>
            <a
              href="https://linkedin.com/in/vyshwasmehta"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-black/15 bg-white/70 backdrop-blur-md px-6 py-3.5 font-sans text-xs font-medium uppercase tracking-[0.14em] text-[#121212] hover:border-black/35 hover:bg-white transition-all duration-300 shadow-sm"
              data-cursor="magnetic"
            >
              LinkedIn &nearr;
            </a>
          </Magnetic>
        </div>
        
        <div className="mt-16 flex flex-col items-center justify-center gap-3">
          <p className="font-sans text-[0.65rem] uppercase tracking-[0.3em] text-titanium font-semibold">
            DESIGNED AND BUILT BY VISHWAS MEHTA
          </p>
          <p className="font-sans text-[0.6rem] uppercase tracking-[0.2em] text-titanium-dim">
            BENGALURU, INDIA
            {konamiActive && <span className="ml-2 text-cyan animate-pulse"> ⚡ KONAMI ACTIVE ⚡</span>}
          </p>
          
          <div className="mt-4 flex flex-wrap justify-center items-center gap-6">
            {[
              { label: 'Email', href: 'mailto:vyommehta197@gmail.com' },
              { label: 'LinkedIn', href: 'https://linkedin.com/in/vyshwasmehta' },
              { label: 'Résumé', href: './resume.pdf' },
              { label: 'GitHub', href: 'https://github.com/vyshwas' },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-[0.6rem] font-medium uppercase tracking-[0.25em] text-titanium transition-colors hover:text-[#121212]"
                data-cursor="hover"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}