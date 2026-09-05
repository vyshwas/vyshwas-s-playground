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
    'I started in computer science and moved into design to work on the decisions code alone cannot solve: what a product means, how it behaves, and why people should trust it. I work across research, product, brand, and front-end prototyping — systems thinking before visual polish.'

  return (
    <section id="about" className="relative border-t border-black/5 bg-void px-6 py-[20vh] md:px-[8vw] flex flex-col items-center justify-center min-h-[70vh]" aria-label="About">
      <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
        <span className="mb-10 block font-sans text-[0.65rem] uppercase tracking-[0.35em] text-cyan" data-cursor="text">
          [ Chapter 02 &mdash; Context ]
        </span>
        
        <p
          ref={textRef}
          className="text-3xl font-bold leading-[1.3] text-bone md:text-[3.2rem]"
          data-cursor="text"
        >
          {text.split(' ').map((word, i) => {
            // Emphasize specific words by wrapping them in italics or colored spans
            const accent = ['computer', 'science', 'systems', 'thinking.', 'code'].includes(word.replace(/[^a-z.]/gi, ''))
            const italic = ['design', 'trust', 'prototyping'].includes(word.replace(/[^a-z]/gi, ''))
            
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
      </div>
    </section>
  )
}
