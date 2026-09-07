import { useLayoutEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { reducedMotion } from '../lib/motion.js'

export default function Dialog({ children, onClose, labelId, className = '' }) {
  const ref = useRef(null)
  useLayoutEffect(() => {
    const dialog = ref.current
    const focused = document.activeElement
    const previous = document.documentElement.style.overflow
    dialog.showModal()
    document.documentElement.style.overflow = 'hidden'
    window.__lenis?.stop()
    const animation = reducedMotion()
      ? null
      : dialog.animate(
          [{ transform: 'translateX(100%)' }, { transform: 'translateX(0)' }],
          { duration: 560, easing: 'cubic-bezier(.16,1,.3,1)' },
        )
    return () => {
      animation?.cancel()
      dialog.close()
      document.documentElement.style.overflow = previous
      window.__lenis?.start()
      if (focused?.isConnected) focused.focus({ preventScroll: true })
    }
  }, [])
  return createPortal(
    <dialog
      ref={ref}
      className={'workspace-dialog ' + className}
      aria-labelledby={labelId}
      onCancel={(e) => {
        e.preventDefault()
        onClose()
      }}
      data-lenis-prevent
    >
      {children}
    </dialog>,
    document.body,
  )
}
