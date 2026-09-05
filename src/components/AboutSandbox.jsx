import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Matter from 'matter-js'
import { reducedMotion } from '../App.jsx'

gsap.registerPlugin(ScrollTrigger)

const PALETTE = ['#121212', '#3a3a3a', '#000000', '#666666']
const CHIP_TEXT = '#121212'

const SKILLS = [
  'Design Systems', 'React', 'Motion Design', 'Python', 'Interaction',
  'Architecture', 'Prototyping', 'Computer Vision', 'Tailwind', 'GSAP',
  'Figma', 'Three.js',
]

const MODES = {
  gravity: { label: 'Gravity', hint: 'chips fall — stack them' },
  zero: { label: 'Zero-G', hint: 'everything drifts' },
  boom: { label: 'Boom', hint: 'radial impulse' },
}

export default function AboutSandbox() {
  const textRef = useRef(null)
  const canvasRef = useRef(null)
  const engineRef = useRef(null)
  const [mode, setMode] = useState('gravity')
  const modeRef = useRef('gravity')
  const dimsRef = useRef({ w: 0, h: 0 })

  // ---- kinetic text reveal ----
  useEffect(() => {
    if (reducedMotion() || !textRef.current) return
    const words = textRef.current.querySelectorAll('.kinetic-word')
    const ctx = gsap.context(() => {
      gsap.fromTo(
        words,
        { opacity: 0.12, y: 12 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.04,
          ease: 'power1.out',
          scrollTrigger: {
            trigger: textRef.current,
            start: 'top 80%',
            end: 'bottom 45%',
            scrub: 0.8,
          },
        },
      )
    }, textRef.current)
    return () => ctx.revert()
  }, [])

  // ---- physics sandbox ----
  useEffect(() => {
    if (reducedMotion() || !canvasRef.current) return

    const { Engine, Render, Runner, World, Bodies, Mouse, MouseConstraint, Events, Composite, Body } = Matter

    const canvas = canvasRef.current
    const width = canvas.clientWidth || 600
    const height = canvas.clientHeight || 500
    dimsRef.current = { w: width, h: height }

    const engine = Engine.create({ gravity: { x: 0, y: 1, scale: 0.001 } })
    engineRef.current = engine

    const render = Render.create({
      canvas,
      engine,
      options: {
        width,
        height,
        background: 'transparent',
        wireframes: false,
        pixelRatio: Math.min(window.devicePixelRatio, 2),
      },
    })

    // walls
    const wallOpts = { isStatic: true, friction: 0.3, restitution: 0.4 }
    const walls = [
      Bodies.rectangle(width / 2, -40, width * 2, 80, wallOpts),
      Bodies.rectangle(width / 2, height + 40, width * 2, 80, wallOpts),
      Bodies.rectangle(-40, height / 2, 80, height * 2, wallOpts),
      Bodies.rectangle(width + 40, height / 2, 80, height * 2, wallOpts),
    ]
    World.add(engine.world, walls)

    // skill chips — spawn INSIDE the box so they are always visible
    SKILLS.forEach((label, i) => {
      const w = label.length * 9.2 + 34
      const body = Bodies.rectangle(
        width * 0.15 + Math.random() * width * 0.7,
        height * 0.1 + Math.random() * height * 0.5,
        w,
        38,
        {
          restitution: 0.55,
          friction: 0.12,
          frictionAir: 0.012,
          chamfer: { radius: 19 },
          label,
          render: { fillStyle: 'transparent', strokeStyle: 'transparent', lineWidth: 0 },
          plugin: { accent: PALETTE[i % PALETTE.length] },
        },
      )
      Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.08)
      World.add(engine.world, body)
    })

    // pull any stray body back into the box
    const ensureInside = () => {
      const { w, h } = dimsRef.current
      Composite.allBodies(engine.world).forEach((b) => {
        if (b.isStatic) return
        const out =
          b.position.x < -b.bounds.max.x + b.bounds.min.x ||
          b.position.x > w + 80 ||
          b.position.y < -80 ||
          b.position.y > h + 80
        if (out) {
          Body.setPosition(b, {
            x: w * 0.15 + Math.random() * w * 0.7,
            y: h * 0.1 + Math.random() * h * 0.5,
          })
          Body.setVelocity(b, { x: 0, y: 0 })
          Body.setAngularVelocity(b, 0)
        }
      })
    }
    engineRef.current.ensureInside = ensureInside

    // drag-to-throw
    const mouse = Mouse.create(render.canvas)
    const mc = MouseConstraint.create(engine, {
      mouse,
      constraint: { stiffness: 0.2, render: { visible: false } },
    })
    World.add(engine.world, mc)
    mouse.element.removeEventListener('wheel', mouse.mousewheel)
    mouse.element.removeEventListener('mousewheel', mouse.mousewheel)
    mouse.element.removeEventListener('DOMMouseScroll', mouse.mousewheel)

    // custom chip rendering — glass pills with accent ring + glow
    Events.on(render, 'afterRender', () => {
      const c = render.context
      c.font = '600 11px "JetBrains Mono", monospace'
      c.textAlign = 'center'
      c.textBaseline = 'middle'

      Composite.allBodies(engine.world).forEach((body) => {
        if (body.isStatic || !body.label || body.label === 'Rectangle Body') return
        const { x, y } = body.position
        const w = body.bounds.max.x - body.bounds.min.x
        const h = body.bounds.max.y - body.bounds.min.y
        const accent = body.plugin?.accent || PALETTE[0]

        c.save()
        c.translate(x, y)
        c.rotate(body.angle)
        c.beginPath()
        c.roundRect(-w / 2, -h / 2, w, h, 19)
        c.fillStyle = 'rgba(252, 251, 249, 0.94)'
        c.fill()
        c.shadowColor = accent
        c.shadowBlur = 14
        c.strokeStyle = accent
        c.lineWidth = 1.4
        c.stroke()
        c.shadowBlur = 0
        c.fillStyle = CHIP_TEXT
        c.fillText(body.label.toUpperCase(), 0, 0.5)
        c.restore()
      })
    })

    const runner = Runner.create()
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          ensureInside()
          Runner.run(runner, engine)
          Render.run(render)
        } else {
          Runner.stop(runner)
          Render.stop(render)
        }
      },
      { threshold: 0 },
    )
    io.observe(canvas)

    const onResize = () => {
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      if (!w || !h) return
      dimsRef.current = { w, h }
      render.bounds.min.x = 0
      render.bounds.min.y = 0
      render.bounds.max.x = w
      render.bounds.max.y = h
      render.options.width = w
      render.options.height = h
      render.canvas.width = w * render.options.pixelRatio
      render.canvas.height = h * render.options.pixelRatio
      Body.setPosition(walls[0], { x: w / 2, y: -40 })
      Body.setPosition(walls[1], { x: w / 2, y: h + 40 })
      Body.setPosition(walls[2], { x: -40, y: h / 2 })
      Body.setPosition(walls[3], { x: w + 40, y: h / 2 })
      ensureInside()
    }
    window.addEventListener('resize', onResize)

    return () => {
      io.disconnect()
      window.removeEventListener('resize', onResize)
      Runner.stop(runner)
      Render.stop(render)
      World.clear(engine.world, false)
      Engine.clear(engine)
      render.textures = {}
    }
  }, [])

  // ---- zero-g drift: gentle centering so chips keep floating mid-box ----
  useEffect(() => {
    if (reducedMotion()) return
    const id = setInterval(() => {
      const engine = engineRef.current
      if (!engine || modeRef.current !== 'zero') return
      const { w, h } = dimsRef.current
      if (!w) return
      Matter.Composite.allBodies(engine.world).forEach((b) => {
        if (b.isStatic) return
        const dx = w / 2 - b.position.x
        const dy = h / 2 - b.position.y
        Matter.Body.applyForce(b, b.position, {
          x: dx * 0.0000022 * b.mass,
          y: dy * 0.0000022 * b.mass,
        })
      })
    }, 60)
    return () => clearInterval(id)
  }, [])

  // ---- mode controls ----
  const applyMode = (next) => {
    const engine = engineRef.current
    if (!engine) return
    modeRef.current = next
    setMode(next)
    engineRef.current.ensureInside?.()

    const bodies = Matter.Composite.allBodies(engine.world).filter((b) => !b.isStatic)

    if (next === 'zero') {
      engine.gravity.x = 0
      engine.gravity.y = 0
      bodies.forEach((b) => {
        Matter.Body.setVelocity(b, {
          x: b.velocity.x * 0.3 + (Math.random() - 0.5) * 2.2,
          y: b.velocity.y * 0.3 + (Math.random() - 0.5) * 2.2,
        })
        Matter.Body.setAngularVelocity(b, (Math.random() - 0.5) * 0.06)
      })
    } else if (next === 'gravity') {
      engine.gravity.x = 0
      engine.gravity.y = 1
    } else if (next === 'boom') {
      const { w, h } = dimsRef.current
      bodies.forEach((b) => {
        const dx = b.position.x - w / 2
        const dy = b.position.y - h / 2
        const dist = Math.max(Math.hypot(dx, dy), 40)
        const mag = (0.9 / dist) * b.mass * 0.03
        Matter.Body.applyForce(b, b.position, { x: (dx / dist) * mag, y: (dy / dist) * mag })
        Matter.Body.setAngularVelocity(b, (Math.random() - 0.5) * 0.5)
      })
    }
  }

  const text =
    'I started in computer science and moved into design to work on the decisions code alone cannot solve: what a product means, how it behaves, and why people should trust it. I work across research, product, brand, and front-end prototyping — systems thinking before visual polish.'

  return (
    <section id="about" className="relative border-t border-black/5 bg-void px-6 py-[16vh] md:px-[8vw]" aria-label="About and skill sandbox">
      <div className="grid items-center gap-16 md:grid-cols-2 md:gap-20">

        <div className="max-w-xl">
          <span className="mb-8 block font-sans text-[0.65rem] uppercase tracking-[0.35em] text-cyan" data-cursor="text">
            [ Chapter 04.5 — Context ]
          </span>
          <p
            ref={textRef}
            className="text-2xl font-bold leading-tight text-bone md:text-[2.6rem] md:leading-snug"
            data-cursor="text"
          >
            {text.split(' ').map((word, i) => {
              const accent = ['computer', 'science', 'systems', 'thinking.'].includes(word)
              const italic = ['design,', 'trust'].includes(word.replace(/[^a-z,]/gi, ''))
              return (
                <span key={i} className="kinetic-word mr-[0.28em] inline-block">
                  {accent ? <span className="text-cyan">{word}</span> : italic ? <em className="font-display text-bone/90">{word}</em> : word}
                </span>
              )
            })}
          </p>
          <p className="mt-8 font-sans text-[0.6rem] uppercase tracking-[0.25em] text-titanium-dim" data-cursor="text">
            grab a chip — throw it — break the laws of physics
          </p>
        </div>

        <div className="relative h-[500px] w-full overflow-hidden rounded-xl border border-black/15 bg-panel shadow-[0_50px_100px_-40px_rgba(0,0,0,0.9)]">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(18,18,18,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(18,18,18,0.35) 1px, transparent 1px)',
              backgroundSize: '44px 44px',
            }}
            aria-hidden="true"
          />

          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between border-b border-black/5 bg-gradient-to-b from-black/[0.03] to-transparent px-4 py-3">
            <span className="flex items-center gap-2 font-sans text-[0.55rem] uppercase tracking-[0.25em] text-cyan/80">
              <span className={`h-1.5 w-1.5 rounded-full ${mode === 'zero' ? 'bg-cyan-bright' : 'bg-cyan'} animate-pulse`} />
              Interactive Space — {SKILLS.length} skills in orbit
            </span>
            <span
              className="rounded-full border px-2.5 py-1 font-sans text-[0.5rem] uppercase tracking-[0.2em] transition-colors duration-300"
              style={{
                borderColor: `${PALETTE[Object.keys(MODES).indexOf(mode)]}66`,
                color: PALETTE[Object.keys(MODES).indexOf(mode)],
              }}
            >
              {MODES[mode].label}
            </span>
          </div>

          <canvas ref={canvasRef} className="h-full w-full cursor-grab active:cursor-grabbing" data-cursor="magnetic" />

          <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-center gap-2 border-t border-black/5 bg-gradient-to-t from-black/[0.03] to-transparent px-4 pb-4 pt-6">
            <div className="flex gap-2.5">
              {[
                { key: 'zero', label: 'Zero Gravity' },
                { key: 'gravity', label: 'Restore Gravity' },
                { key: 'boom', label: 'Explode' },
              ].map((b) => {
                const active = mode === b.key
                return (
                  <button
                    key={b.key}
                    type="button"
                    onClick={() => applyMode(b.key)}
                    aria-pressed={active}
                    className={`rounded-full border px-4 py-2 font-sans text-[0.6rem] uppercase tracking-[0.18em] backdrop-blur-md transition-all duration-300 ${
                      active
                        ? 'border-cyan bg-cyan text-void'
                        : 'border-black/20 bg-white/70 text-bone hover:border-cyan/60 hover:text-cyan'
                    }`}
                    data-cursor="magnetic"
                  >
                    {b.label}
                  </button>
                )
              })}
            </div>
            <span className="font-sans text-[0.5rem] uppercase tracking-[0.25em] text-titanium-dim">
              {MODES[mode].hint}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}