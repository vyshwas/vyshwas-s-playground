import { useEffect, useRef, useState } from 'react'
import { reducedMotion } from '../App.jsx'

export default function MagneticCursor() {
  const cursorRef = useRef(null)
  const followerRef = useRef(null)
  const [visible, setVisible] = useState(false)
  const [state, setState] = useState('default')
  const reqRef = useRef(null)

  useEffect(() => {
    if (reducedMotion() || window.matchMedia('(pointer: coarse)').matches) return

    setVisible(true)
  }, [])

  useEffect(() => {
    if (!visible) return

    const cursor = cursorRef.current
    const follower = followerRef.current
    if (!cursor || !follower) return

    document.body.style.cursor = 'none'

    let targetX = 0, targetY = 0
    let followerX = 0, followerY = 0

    const onMouseMove = (e) => {
      targetX = e.clientX
      targetY = e.clientY
    }

    function animate() {
      targetX += (targetX - targetX) * 0.35
      targetY += (targetY - targetY) * 0.35

      followerX += (targetX - followerX) * 0.12
      followerY += (targetY - followerY) * 0.12

      cursor.style.transform = `translate(${targetX}px, ${targetY}px) translate(-50%, -50%)`
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
    if (reducedMotion()) return

    const handleMouseOver = (e) => {
      const target = e.target.closest('[data-cursor]')
      if (!target) return
      const type = target.dataset.cursor
      setState(type)
      cursorRef.current?.classList.add('is-' + type)
      followerRef.current?.classList.add('is-' + type)
    }
    const handleMouseOut = (e) => {
      const target = e.target.closest('[data-cursor]')
      if (!target) return
      setState('default')
      cursorRef.current?.classList.remove('is-hover', 'is-magnetic', 'is-text', 'is-drag')
      followerRef.current?.classList.remove('is-hover', 'is-magnetic', 'is-text', 'is-drag')
    }

    document.addEventListener('mouseover', handleMouseOver)
    document.addEventListener('mouseout', handleMouseOut)
    return () => {
      document.removeEventListener('mouseover', handleMouseOver)
      document.removeEventListener('mouseout', handleMouseOut)
    }
  }, [])

  if (!visible || reducedMotion()) return null

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[10000] hw"
        style={{ width: 12, height: 12, borderRadius: '50%', border: '2px solid #000000', background: '#000000', mixBlendMode: 'normal', transition: 'width 0.2s, height 0.2s, border-color 0.2s, background 0.1s' }}
        aria-hidden="true"
      />
      <div
        ref={followerRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] hw"
        style={{ width: 36, height: 36, borderRadius: '50%', border: '1.5px solid rgba(0,0,0,0.5)', mixBlendMode: 'normal', transition: 'width 0.3s, height 0.3s, border-color 0.3s' }}
        aria-hidden="true"
      />
      <style jsx>{`
        .is-hover { width: 24px !important; height: 24px !important; border-color: #000000 !important; background: #000000 !important; }
        .is-hover + * { width: 48px !important; height: 48px !important; border-color: rgba(0,0,0,0.3) !important; }
        .is-magnetic { width: 20px !important; height: 20px !important; border-color: #000000 !important; background: #000000 !important; opacity: 0.8 !important; }
        .is-magnetic + * { width: 48px !important; height: 48px !important; border-color: rgba(18,18,18,0.2) !important; }
        .is-text { width: 40px !important; height: 4px !important; border-radius: 2px !important; border-color: #000000 !important; background: #000000 !important; }
        .is-drag { width: 32px !important; height: 32px !important; border-color: #000000 !important; border-style: dashed !important; background: transparent !important; }
      `}</style>
    </>
  )
}
