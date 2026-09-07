import { useSyncExternalStore } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
const query = '(prefers-reduced-motion: reduce)'
export const reducedMotion = () =>
  window.matchMedia(query).matches ||
  document.documentElement.dataset.motion === 'reduced'
const subscribe = (callback) => {
  const media = window.matchMedia(query)
  media.addEventListener('change', callback)
  window.addEventListener('motionchange', callback)
  return () => {
    media.removeEventListener('change', callback)
    window.removeEventListener('motionchange', callback)
  }
}
export const useReducedMotion = () =>
  useSyncExternalStore(subscribe, reducedMotion, () => true)
export function toggleMotion() {
  document.documentElement.dataset.motion = reducedMotion() ? 'full' : 'reduced'
  window.dispatchEvent(new Event('motionchange'))
}
export function scrollToTarget(target) {
  const element =
    typeof target === 'string' ? document.querySelector(target) : null
  const scene = element && ScrollTrigger.getById(element.id + '-scene')
  const destination =
    target === '#hero' ? 0 : scene ? scene.start : element || target
  if (typeof destination !== 'number' && !(destination instanceof Element))
    return
  if (window.__lenis)
    window.__lenis.scrollTo(destination, {
      duration: 1.35,
      offset: element && !scene ? -88 : 0,
    })
  else if (typeof destination === 'number')
    window.scrollTo({
      top: destination,
      behavior: reducedMotion() ? 'instant' : 'smooth',
    })
  else
    window.scrollTo({
      top: destination.getBoundingClientRect().top + window.scrollY - 88,
      behavior: reducedMotion() ? 'instant' : 'smooth',
    })
}
