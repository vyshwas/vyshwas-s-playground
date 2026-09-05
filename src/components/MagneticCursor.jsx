import { useEffect, useRef, useState } from 'react'
import { reducedMotion } from '../App.jsx'

export default function MagneticCursor() {
  const cursorRef = useRef(null)
  const followerRef = useRef(null)
  const [visible] = useState(() => {
    if (typeof window === 'undefined') return false
    return !reducedMotion() && !window.matchMedia('(pointer: coarse)').matches
  })
  const reqRef = useRef(null)

  useEffect(() => {
    if (!visible) return

    const cursor = cursorRef.current
    const follower = followerRef.current
    if (!cursor || !follower) return

    document.body.style.cursor = 'none'

    let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2
    let cursorX = mouseX, cursorY = mouseY
    let followerX = mouseX, followerY = mouseY

    const onMouseMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    function animate() {
      // Smooth the dot cursor (fast follow)
      cursorX += (mouseX - cursorX) * 0.38
      cursorY += (mouseY - cursorY) * 0.38

      // Smooth the follower ring (slow follow)
      followerX += (mouseX - followerX) * 0.14
      followerY += (mouseY - followerY) * 0.14

      cursor.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`
      follower.style.transform = `translate(${followerX}px, ${followerY}px) translate(-50%, -50%)`

      reqRef.current = requestAnimationFrame(animate)
    }

    document.addEventListener('mousemove', onMouseMove, { passive: true })
    reqRef.current = requestAnimationFrame(animate)

    return () => {
      document.body.style.cursor = ''
      document.removeEventListener('mousemove', onMouseMove)
      if (reqRef.current) cancelAnimationFrame(reqRef.current)
    }
  }, [visible])

  useEffect(() => {
    if (reducedMotion() || !visible) return

    const handleMouseOver = (e) => {
      const target = e.target.closest('[data-cursor]')
      if (!target) return
      const type = target.dataset.cursor
      cursorRef.current?.classList.add('is-' + type)
      followerRef.current?.classList.add('is-' + type)
    }
    const handleMouseOut = (e) => {
      const target = e.target.closest('[data-cursor]')
      if (!target) return
      cursorRef.current?.classList.remove('is-hover', 'is-magnetic', 'is-text', 'is-drag')
      followerRef.current?.classList.remove('is-hover', 'is-magnetic', 'is-text', 'is-drag')
    }

    document.addEventListener('mouseover', handleMouseOver)
    document.addEventListener('mouseout', handleMouseOut)
    return () => {
      document.removeEventListener('mouseover', handleMouseOver)
      document.removeEventListener('mouseout', handleMouseOut)
    }
  }, [visible])

  if (!visible || reducedMotion()) return null

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[999999] hw"
        style={{
          width: 10,
          height: 10,
          borderRadius: '50%',
          backgroundColor: '#ffffff',
          mixBlendMode: 'difference',
          transition: 'width 0.2s cubic-bezier(0.16, 1, 0.3, 1), height 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        aria-hidden="true"
      />
      <div
        ref={followerRef}
        className="fixed top-0 left-0 pointer-events-none z-[999998] hw"
        style={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          border: '1.5px solid rgba(255, 255, 255, 0.85)',
          mixBlendMode: 'difference',
          transition: 'width 0.25s cubic-bezier(0.16, 1, 0.3, 1), height 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        aria-hidden="true"
      />
      <style>{`
        .is-hover {
          width: 22px !important;
          height: 22px !important;
          background-color: #ffffff !important;
          opacity: 0.95 !important;
        }
        .is-hover + * {
          width: 48px !important;
          height: 48px !important;
          border-color: rgba(255, 255, 255, 0.6) !important;
        }
        .is-magnetic {
          width: 20px !important;
          height: 20px !important;
          background-color: #ffffff !important;
          opacity: 0.9 !important;
        }
        .is-magnetic + * {
          width: 48px !important;
          height: 48px !important;
          border-color: rgba(255, 255, 255, 0.5) !important;
        }
        .is-text {
          width: 36px !important;
          height: 4px !important;
          border-radius: 2px !important;
          background-color: #ffffff !important;
        }
        .is-drag {
          width: 36px !important;
          height: 36px !important;
          border: 1.5px dashed #ffffff !important;
          background-color: transparent !important;
        }
      `}</style>
    </>
  )
}
