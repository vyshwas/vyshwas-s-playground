import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { reducedMotion } from '../App.jsx'

gsap.registerPlugin(ScrollTrigger)

export default function About() {
  const textRef = useRef(null)

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
        }
      )
    }, textRef.current)
    
    return () => ctx.revert()
  }, [])

  const text =
    'I started in computer science and moved into design to work on the questions code alone cannot answer: what a product should do, how it should behave, and why people should trust it. Today I work across product strategy, research, interaction design, prototyping, and front-end execution. I use systems thinking to make complex ideas understandable before polishing the surface.'

  return (
    <section id="about" className="relative border-t border-black/5 bg-void px-6 py-[20vh] md:px-[8vw] flex flex-col items-center justify-center min-h-[70vh]" aria-label="About">
      <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
        <span className="mb-8 block font-sans text-[0.65rem] uppercase tracking-[0.35em] text-cyan" data-cursor="text">
          [ WHAT I BRING ]
        </span>
        
        <h2 className="mb-12 font-display italic text-4xl text-bone/90 md:text-5xl" data-cursor="text">
          I work on the decisions between an idea and an interface.
        </h2>
        
        <p
          ref={textRef}
          className="text-2xl font-bold leading-[1.4] text-bone md:text-[2.8rem]"
          data-cursor="text"
        >
          {text.split(' ').map((word, i) => {
            // Emphasize specific words by wrapping them in italics or colored spans
            const accent = ['computer', 'science', 'systems', 'thinking', 'code'].includes(word.replace(/[^a-z]/gi, ''))
            const italic = ['design', 'trust', 'strategy,', 'prototyping,', 'execution.', 'understandable'].includes(word.replace(/[^a-z.,]/gi, ''))
            
            return (
              <span key={i} className="kinetic-word mr-[0.28em] inline-block">
                {accent ? (
                  <span className="text-cyan">{word}</span>
                ) : italic ? (
                  <em className="font-display text-bone/90 font-normal">{word}</em>
                ) : (
                  word
                )}
              </span>
            )
          })}
        </p>

        <div className="mt-20 flex flex-wrap items-center justify-center gap-4 text-[0.65rem] font-sans uppercase tracking-[0.2em] text-titanium/80">
          <span>PROBLEM FRAMING</span>
          <span className="text-cyan">&middot;</span>
          <span>PRODUCT SYSTEMS</span>
          <span className="text-cyan">&middot;</span>
          <span>INTERACTION DESIGN</span>
          <span className="text-cyan">&middot;</span>
          <span>PROTOTYPING</span>
          <span className="text-cyan">&middot;</span>
          <span>FRONT-END EXECUTION</span>
        </div>
      </div>
    </section>
  )
}
