import { useRef } from 'react'
import gsap from 'gsap'

export default function Magnetic({
  children,
  strength = 0.35,
  className = '',
  as: Tag = 'div',
  ...rest
}) {
  const ref = useRef(null)

  const onMove = (e) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const dx = e.clientX - (r.left + r.width / 2)
    const dy = e.clientY - (r.top + r.height / 2)
    gsap.to(el, {
      x: dx * strength,
      y: dy * strength,
      duration: 0.4,
      ease: 'power3.out',
    })
  }

  const onLeave = () => {
    if (!ref.current) return
    gsap.to(ref.current, {
      x: 0,
      y: 0,
      duration: 0.8,
      ease: 'elastic.out(1, 0.45)',
    })
  }

  return (
    <Tag
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`hw ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  )
}
