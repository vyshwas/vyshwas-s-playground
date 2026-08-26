import os

code = """import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Matter from 'matter-js'

export default function AboutSandbox() {
  const textRef = useRef(null)
  const canvasRef = useRef(null)
  const engineRef = useRef(null)
  const renderRef = useRef(null)

  useEffect(() => {
    // Kinetic Word-by-Word Text Reveal
    if (!textRef.current) return
    const words = textRef.current.querySelectorAll('.kinetic-word')
    
    const ctx = gsap.context(() => {
      gsap.fromTo(words, 
        { opacity: 0.1, y: 10, filter: 'blur(4px)' },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          stagger: 0.05,
          ease: 'power1.out',
          scrollTrigger: {
            trigger: textRef.current,
            start: 'top 80%',
            end: 'bottom 40%',
            scrub: 1
          }
        }
      )
    }, textRef)

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    // Matter.js Zero Gravity Sandbox
    if (!canvasRef.current) return

    const { Engine, Render, Runner, World, Bodies, Mouse, MouseConstraint, Events, Composite } = Matter

    const engine = Engine.create({
      gravity: { x: 0, y: 1, scale: 0.001 }
    })
    engineRef.current = engine

    const width = canvasRef.current.clientWidth
    const height = canvasRef.current.clientHeight

    const render = Render.create({
      canvas: canvasRef.current,
      engine: engine,
      options: {
        width,
        height,
        background: 'transparent',
        wireframes: false,
        pixelRatio: window.devicePixelRatio
      }
    })
    renderRef.current = render

    const wallOptions = { isStatic: true, render: { visible: false } }
    World.add(engine.world, [
      Bodies.rectangle(width / 2, -50, width, 100, wallOptions),
      Bodies.rectangle(width / 2, height + 50, width, 100, wallOptions),
      Bodies.rectangle(-50, height / 2, 100, height, wallOptions),
      Bodies.rectangle(width + 50, height / 2, 100, height, wallOptions)
    ])

    const labels = [
      'Design Systems', 'React', 'Motion', 'Python', 'Interaction',
      'System Architecture', 'Prototyping', 'Computer Science', 'Tailwind', 'GSAP',
      'Figma', 'Matter.js'
    ]

    const colors = ['#06b6d4', '#d97706', '#fefacd', '#475569']

    labels.forEach((label, i) => {
      const radius = Math.max(30, label.length * 4)
      const x = Math.random() * (width - 100) + 50
      const y = Math.random() * (height / 2)
      
      const body = Bodies.rectangle(x, y, label.length * 10 + 20, 40, {
        restitution: 0.8,
        friction: 0.005,
        render: {
          fillStyle: colors[i % colors.length],
          strokeStyle: '#000',
          lineWidth: 1
        },
        label: label
      })
      
      World.add(engine.world, body)
    })

    const mouse = Mouse.create(render.canvas)
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false }
      }
    })

    World.add(engine.world, mouseConstraint)
    render.mouse = mouse

    // Keep events from firing on scroll
    mouseConstraint.mouse.element.removeEventListener('mousewheel', mouseConstraint.mouse.mousewheel)
    mouseConstraint.mouse.element.removeEventListener('DOMMouseScroll', mouseConstraint.mouse.mousewheel)

    Events.on(render, 'afterRender', () => {
      const context = render.context
      context.font = '600 12px "JetBrains Mono", monospace'
      context.textAlign = 'center'
      context.textBaseline = 'middle'
      context.fillStyle = '#0f172a'

      Composite.allBodies(engine.world).forEach((body) => {
        if (body.label !== 'Rectangle Body' && body.label) {
          const { x, y } = body.position
          context.save()
          context.translate(x, y)
          context.rotate(body.angle)
          context.fillText(body.label.toUpperCase(), 0, 0)
          context.restore()
        }
      })
    })

    Runner.run(Runner.create(), engine)
    Render.run(render)

    return () => {
      Render.stop(render)
      World.clear(engine.world)
      Engine.clear(engine)
      if (render.canvas) render.canvas.remove()
      render.textures = {}
    }
  }, [])

  const handleZeroGravity = () => {
    if (engineRef.current) {
      engineRef.current.gravity.y = 0
      engineRef.current.gravity.x = 0
      
      // Give everything a tiny nudge so they float
      Matter.Composite.allBodies(engineRef.current.world).forEach(body => {
        if (!body.isStatic) {
          Matter.Body.applyForce(body, body.position, {
            x: (Math.random() - 0.5) * 0.05,
            y: (Math.random() - 0.5) * 0.05
          })
        }
      })
    }
  }

  const handleGravity = () => {
    if (engineRef.current) {
      engineRef.current.gravity.y = 1
    }
  }

  const handleExplode = () => {
    if (engineRef.current) {
      const bodies = Matter.Composite.allBodies(engineRef.current.world)
      const center = { 
        x: canvasRef.current.clientWidth / 2, 
        y: canvasRef.current.clientHeight / 2 
      }
      
      bodies.forEach(body => {
        if (!body.isStatic) {
          const forceMagnitude = 0.05 * body.mass
          Matter.Body.applyForce(body, body.position, {
            x: (body.position.x - center.x) * forceMagnitude * 0.01,
            y: (body.position.y - center.y) * forceMagnitude * 0.01
          })
        }
      })
    }
  }

  const text = "I started in computer science and moved into design to work on the decisions code alone cannot solve: what a product means, how it behaves, and why people should trust it. I now work across research, product, brand, and front-end prototyping—using systems thinking before visual polish."
  const words = text.split(' ')

  return (
    <section id="about" className="relative px-6 py-[16vh] md:px-[8vw] bg-void border-t border-white/5" aria-label="About and Sandbox">
      <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-center min-h-[60vh]">
        
        {/* Kinetic Text Column */}
        <div className="max-w-xl">
          <span className="font-mono text-[0.65rem] uppercase tracking-[0.35em] text-cyan mb-8 block" data-cursor="text">
            [ Chapter 04.5 — Context ]
          </span>
          <p 
            ref={textRef} 
            className="text-2xl md:text-4xl font-bold leading-tight md:leading-snug text-bone"
            data-cursor="text"
          >
            {words.map((word, i) => (
              <span key={i} className="kinetic-word inline-block mr-[0.3em] font-sans">
                {word === 'computer' || word === 'science' || word === 'systems' || word === 'thinking' ? (
                  <span className="text-amber">{word}</span>
                ) : (
                  word
                )}
              </span>
            ))}
          </p>
        </div>

        {/* Physics Sandbox Column */}
        <div className="relative h-[500px] w-full rounded-lg border border-cyan/20 bg-panel shadow-2xl overflow-hidden group">
          <div className="absolute top-4 left-4 z-10 flex gap-2">
            <span className="h-2 w-2 rounded-full bg-cyan animate-pulse"></span>
            <span className="font-mono text-[0.55rem] uppercase tracking-widest text-cyan/70">Interactive Space</span>
          </div>
          
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-4 w-max opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button 
              onClick={handleZeroGravity}
              className="px-4 py-2 font-mono text-xs uppercase tracking-widest text-cyan border border-cyan/40 rounded-full hover:bg-cyan hover:text-black transition-colors backdrop-blur-md bg-black/20"
              data-cursor="magnetic"
            >
              Zero Gravity
            </button>
            <button 
              onClick={handleGravity}
              className="px-4 py-2 font-mono text-xs uppercase tracking-widest text-amber border border-amber/40 rounded-full hover:bg-amber hover:text-black transition-colors backdrop-blur-md bg-black/20"
              data-cursor="magnetic"
            >
              Restore Gravity
            </button>
            <button 
              onClick={handleExplode}
              className="px-4 py-2 font-mono text-xs uppercase tracking-widest text-white border border-white/40 rounded-full hover:bg-white hover:text-black transition-colors backdrop-blur-md bg-black/20"
              data-cursor="magnetic"
            >
              Explode
            </button>
          </div>

          <canvas ref={canvasRef} className="w-full h-full cursor-grab active:cursor-grabbing" data-cursor="magnetic" />
        </div>
      </div>
    </section>
  )
}
"""
with open("src/components/AboutSandbox.jsx", "w", encoding="utf-8") as f:
    f.write(code)
print("AboutSandbox.jsx created.")
