import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useReducedMotion } from '../lib/motion.js'
export default function MagneticCursor() {
  const ref = useRef(null)
  const calm = useReducedMotion()
  useEffect(() => {
    if (calm || !window.matchMedia('(pointer: fine)').matches) return
    const element = ref.current
    const x = gsap.quickTo(element, 'x', { duration: 0.25, ease: 'power3.out' })
    const y = gsap.quickTo(element, 'y', { duration: 0.25, ease: 'power3.out' })
    const move = (event) => {
      element.classList.toggle(
        'visible',
        !!event.target.closest('[data-cursor="view"]'),
      )
      x(event.clientX)
      y(event.clientY)
    }
    const leave = () => element.classList.remove('visible')
    document.addEventListener('pointermove', move)
    document.addEventListener('pointerleave', leave)
    return () => {
      document.removeEventListener('pointermove', move)
      document.removeEventListener('pointerleave', leave)
      x.tween.kill()
      y.tween.kill()
      leave()
    }
  }, [calm])
  return (
    <div className="project-cursor" ref={ref} aria-hidden="true">
      View
      <br />
      project
    </div>
  )
}
