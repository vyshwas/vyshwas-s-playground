import os

new_code = """
const projects = [
  {
    no: '01',
    title: 'Nocturne',
    tagline: 'A checkout concept that absorbs blame and preserves trust.',
    year: '2024',
    role: 'Product Design & Prototype',
    status: 'Concept',
    statusStyle: 'outline',
    problem: 'Cart abandonment spikes when payment fails. Generic red error messages destroy trust and force the user to start over.',
    approach: 'Redesigning checkout trust cues to reduce hesitation at the highest-friction moment. First-class payment failure screens that absorb blame.',
    outcome: [
      'UPI-first payment methods',
      'Itemised bill with permanent night-fee waiver',
      'Trust line at the exact moment of hesitation'
    ],
    stack: ['Figma', 'Protopie'],
    link: '#',
    protoUrl: 'https://vyshwas.github.io/assets/nocturne-prototype.html?v=2',
    cover: { accent: '#121212', motif: 'rings', spec: 'checkout · trust' },
  },
  {
    no: '02',
    title: 'Munim',
    tagline: 'Supervised delegation and transparent ledger loops.',
    year: '2024',
    role: 'Product Design & Prototype',
    status: 'Concept',
    statusStyle: 'outline',
    problem: 'Delegating payments requires giving up control. Existing solutions are either too rigid or too insecure.',
    approach: 'A fully clickable prototype of the whole delegation loop: the mandate, supervised asks with a UPI PIN sheet, the live countdown hold.',
    outcome: [
      'Trusted merchant price jumps get held',
      'Cancel works mid-hold',
      'Visual system built on the bahi-khata'
    ],
    stack: ['Figma', 'Protopie'],
    link: '#',
    protoUrl: 'https://vyshwas.github.io/assets/munim-prototype.html',
    cover: { accent: '#a3b18a', motif: 'wave', spec: 'ledger · delegation' },
  },
  {
    no: '03',
    title: 'Awara',
    tagline: 'A living itinerary system that adapts as your day changes.',
    year: '2024',
    role: 'Product Design & Prototype',
    status: 'Concept',
    statusStyle: 'outline',
    problem: 'Most itinerary tools ask for dates and a destination, hand you a list, and disappear from the trip once you land.',
    approach: 'Awara keeps the plan live: it adapts as the day changes, instead of assuming the itinerary you left with is the one you actually follow.',
    outcome: [
      'Live three-day itinerary',
      'Adjust sheet with proactive suggestions',
      'Vermilion-and-ink editorial system'
    ],
    stack: ['Figma', 'Protopie'],
    link: '#',
    protoUrl: 'https://vyshwas.github.io/assets/awara-prototype.html?v=3',
    cover: { accent: '#ca6143', motif: 'grid', spec: 'travel · systems' },
  },
]

export default function Projects() {
  const containerRef = useRef(null)
  const [activeProto, setActiveProto] = useState(null)
  const drawerRef = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth < 768
      const projectEls = gsap.utils.toArray('.project-row')
      
      projectEls.forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: isMobile ? 30 : 60 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: el,
              start: isMobile ? 'top 95%' : 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        )
      })
    }, containerRef)
    return () => ctx.revert()
  }, [])

  // Drawer Animation
  useLayoutEffect(() => {
    if (!drawerRef.current) return
    if (activeProto) {
      gsap.to(drawerRef.current, { x: '0%', duration: 0.6, ease: 'expo.out' })
    } else {
      gsap.to(drawerRef.current, { x: '100%', duration: 0.5, ease: 'expo.in' })
    }
  }, [activeProto])

  return (
    <>
    <section
      id="experiments"
      ref={containerRef}
      className="relative z-10 w-full bg-[#f7f6f3] px-6 py-[10vh] md:px-[8vw]"
    >
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-16 md:mb-24 flex items-center justify-between border-b border-black/10 pb-6">
          <h2 className="font-mono text-[0.65rem] uppercase tracking-[0.25em] text-titanium-dim">
            Selected Work [03]
          </h2>
          <span className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-titanium-dim/60">
            Systems & Interfaces
          </span>
        </div>

        <div className="flex flex-col">
          {projects.map((p, i) => {
            const last = i === projects.length - 1
            return (
              <div
                key={p.title}
                className={`project-row grid grid-cols-1 gap-12 py-16 md:grid-cols-[1.5fr_2fr] md:gap-24 md:py-24 ${
                  last ? '' : 'border-b border-black/10'
                }`}
              >
                {/* Left: Metadata & Context */}
                <div className="flex flex-col">
                  <div className="mb-6 flex items-baseline justify-between md:mb-12">
                    <span className="font-mono text-xs text-titanium-dim/50">
                      {p.no}
                    </span>
                    <span
                      className={`rounded-full border px-2.5 py-0.5 font-mono text-[0.55rem] uppercase tracking-[0.2em] ${
                        p.statusStyle === 'solid'
                          ? 'border-transparent bg-black/10 text-titanium-dim'
                          : 'border-black/15 text-titanium-dim'
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>

                  <h3 className="mb-6 text-4xl font-semibold tracking-tight text-bone md:text-6xl md:tracking-[-0.02em]">
                    {p.title}
                  </h3>
                  <p className="mb-8 max-w-sm text-lg font-medium leading-snug text-titanium md:text-xl">
                    {p.tagline}
                  </p>

                  <div className="mt-auto grid grid-cols-2 gap-x-6 gap-y-8 font-mono text-[0.6rem] uppercase tracking-[0.1em] text-titanium-dim">
                    <div>
                      <span className="block mb-2 text-titanium-dim/40">Role</span>
                      {p.role}
                    </div>
                    <div>
                      <span className="block mb-2 text-titanium-dim/40">Year</span>
                      {p.year}
                    </div>
                    <div className="col-span-2">
                      <span className="block mb-2 text-titanium-dim/40">Stack</span>
                      <div className="flex flex-wrap gap-2">
                        {p.stack.map((s) => (
                          <span key={s} className="rounded-sm bg-black/5 px-2 py-1">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Write-up & Visual */}
                <div className="flex flex-col justify-center">
                  <div className="mb-12 aspect-[4/3] w-full overflow-hidden rounded bg-panel border border-black/10 flex items-center justify-center p-8 group relative">
                    <CoverArt accent={p.cover.accent} motif={p.cover.motif} />
                    <div className="absolute inset-0 flex items-center justify-center bg-white/20 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button 
                        onClick={() => setActiveProto(p)}
                        className="bg-[#121212] text-[#f7f6f3] px-6 py-3 rounded-full font-mono text-[0.65rem] uppercase tracking-[0.2em] hover:scale-105 transition-transform"
                        data-cursor="magnetic"
                      >
                        Open Prototype
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-8 md:gap-10">
                    <div>
                      <h4 className="mb-3 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-titanium-dim/60">
                        The Problem
                      </h4>
                      <p className="text-sm leading-relaxed text-titanium md:text-base">
                        {p.problem}
                      </p>
                    </div>

                    <div>
                      <h4 className="mb-3 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-titanium-dim/60">
                        The Approach
                      </h4>
                      <p className="text-sm leading-relaxed text-titanium md:text-base">
                        {p.approach}
                      </p>
                    </div>

                    <div>
                      <h4 className="mb-4 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-titanium-dim/60">
                        Outcomes
                      </h4>
                      <ul className="flex flex-col gap-3">
                        {p.outcome.map((o, i) => (
                          <li key={i} className="flex items-start text-sm text-titanium md:text-base">
                            <span className="mr-3 mt-1 block h-1.5 w-1.5 shrink-0 rounded-full bg-cyan/80" />
                            {o}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-4 border-t border-black/10 pt-8">
                      <button
                        onClick={() => setActiveProto(p)}
                        className="group inline-flex items-center gap-3 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-bone transition-colors hover:text-cyan"
                        data-cursor="magnetic"
                      >
                        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-black/15 transition-colors group-hover:border-cyan">
                          +
                        </span>
                        View Interactive Prototype
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>

    {/* Prototype Drawer */}
    <div 
      className="fixed inset-0 z-[100] pointer-events-none" 
      style={{ visibility: activeProto ? 'visible' : 'hidden' }}
    >
      <div 
        className={`absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-500 ${activeProto ? 'opacity-100 pointer-events-auto' : 'opacity-0'}`}
        onClick={() => setActiveProto(null)}
      />
      <div 
        ref={drawerRef}
        className="absolute right-0 top-0 bottom-0 w-full md:w-[60vw] lg:w-[50vw] bg-[#f7f6f3] shadow-2xl border-l border-black/10 pointer-events-auto flex flex-col translate-x-full"
      >
        <div className="flex items-center justify-between p-6 border-b border-black/10">
          <div>
            <h3 className="font-mono text-sm font-bold uppercase tracking-[0.1em] text-bone">
              {activeProto?.title}
            </h3>
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.1em] text-titanium-dim mt-1">
              Interactive Prototype
            </p>
          </div>
          <button 
            onClick={() => setActiveProto(null)}
            className="p-3 bg-black/5 hover:bg-black/10 rounded-full transition-colors font-mono text-xs uppercase"
            data-cursor="magnetic"
          >
            Close ×
          </button>
        </div>
        <div className="flex-1 w-full bg-white relative">
          {activeProto && (
            <iframe 
              src={activeProto.protoUrl} 
              className="w-full h-full border-none"
              title={`${activeProto.title} Prototype`}
              loading="lazy"
            />
          )}
        </div>
      </div>
    </div>
    </>
  )
}
"""

with open("src/components/Projects.jsx", "r", encoding="utf-8") as f:
    content = f.read()

# We need to add useState
if "useState" not in content:
    content = content.replace("import { useLayoutEffect", "import { useLayoutEffect, useState")

# Keep the top imports and GSAP register, replace from const projects = [ onwards
split_marker = "const projects = ["
parts = content.split(split_marker)

final_content = parts[0] + new_code

with open("src/components/Projects.jsx", "w", encoding="utf-8") as f:
    f.write(final_content)
print("Rebuilt Projects.jsx with Nocturne, Munim, Awara and Drawer")
