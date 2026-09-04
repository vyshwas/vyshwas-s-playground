import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { reducedMotion } from '../App.jsx'

gsap.registerPlugin(ScrollTrigger)

const COUNT = typeof window !== 'undefined' && window.innerWidth < 768 ? 3500 : 7000

const PHASES = [
  { label: '01 / RAW', text: 'Every idea starts as noise.' },
  { label: '02 / STRUCTURE', text: 'Systems give it shape.' },
  { label: '03 / GROWTH', text: 'Iteration compounds.' },
  { label: '04 / SHIP', text: 'Then it meets real people.' },
]

function genSphere() {
  const a = new Float32Array(COUNT * 3)
  const golden = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < COUNT; i++) {
    const y = 1 - (i / (COUNT - 1)) * 2
    const rad = Math.sqrt(1 - y * y)
    const th = golden * i
    const r = 1.9 * (0.94 + Math.random() * 0.06)
    a[i * 3] = Math.cos(th) * rad * r
    a[i * 3 + 1] = y * r
    a[i * 3 + 2] = Math.sin(th) * rad * r
  }
  return a
}

function genTorusKnot() {
  const a = new Float32Array(COUNT * 3)
  const R = 1.35, tube = 0.34
  for (let i = 0; i < COUNT; i++) {
    const t = (i / COUNT) * Math.PI * 4
    const cx = (R + Math.cos(3 * t) * 0.6) * Math.cos(t)
    const cy = (R + Math.cos(3 * t) * 0.6) * Math.sin(t)
    const cz = Math.sin(3 * t) * 0.6
    const ang = Math.random() * Math.PI * 2
    const r = Math.random() * tube
    a[i * 3] = cx + Math.cos(ang) * r
    a[i * 3 + 1] = cy + Math.sin(ang) * r
    a[i * 3 + 2] = cz + (Math.random() - 0.5) * r
  }
  return a
}

function genHelix() {
  const a = new Float32Array(COUNT * 3)
  for (let i = 0; i < COUNT; i++) {
    const f = i / COUNT
    if (i % 7 === 0) {
      const t = f * Math.PI * 8
      const k = Math.random()
      const x = Math.cos(t) * 1.1
      const z = Math.sin(t) * 1.1
      a[i * 3] = x * (1 - k) + -x * k
      a[i * 3 + 1] = (f - 0.5) * 4.6
      a[i * 3 + 2] = z * (1 - k) + -z * k
    } else {
      const t = f * Math.PI * 8 + (i % 2 === 0 ? 0 : Math.PI)
      a[i * 3] = Math.cos(t) * 1.1 + (Math.random() - 0.5) * 0.08
      a[i * 3 + 1] = (f - 0.5) * 4.6 + (Math.random() - 0.5) * 0.08
      a[i * 3 + 2] = Math.sin(t) * 1.1 + (Math.random() - 0.5) * 0.08
    }
  }
  return a
}

function genGrid() {
  const a = new Float32Array(COUNT * 3)
  const side = Math.ceil(Math.sqrt(COUNT))
  for (let i = 0; i < COUNT; i++) {
    a[i * 3] = ((i % side) / (side - 1) - 0.5) * 5.2
    a[i * 3 + 2] = (Math.floor(i / side) / (side - 1) - 0.5) * 5.2
  }
  return a
}

export default function LabReveal() {
  const mountRef = useRef(null)
  const stageRef = useRef(null)
  const [phase, setPhase] = useState(0)
  const phaseRef = useRef(0)

  useEffect(() => {
    if (reducedMotion()) return
    const container = mountRef.current
    if (!container) return

    const ctx = gsap.context(() => {
      if (stageRef.current) {
        gsap.fromTo(stageRef.current, { opacity: 0, scale: 0.95 }, {
          opacity: 1, scale: 1, ease: 'none',
          scrollTrigger: { trigger: container, start: 'top 90%', end: 'top 15%', scrub: 0.6 },
        })
      }

      const scene = new THREE.Scene()
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.setSize(container.clientWidth, container.clientHeight)
      renderer.domElement.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;cursor:grab;touch-action:pan-y;'
      stageRef.current?.appendChild(renderer.domElement)
      const canvas = renderer.domElement

      const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100)
      camera.position.set(0, 0, 6.2)

      const geo = new THREE.BufferGeometry()
      const rand = new Float32Array(COUNT)
      for (let i = 0; i < COUNT; i++) rand[i] = Math.random()
      geo.setAttribute('position', new THREE.BufferAttribute(genSphere(), 3))
      geo.setAttribute('aPosA', new THREE.BufferAttribute(genSphere(), 3))
      geo.setAttribute('aPosB', new THREE.BufferAttribute(genTorusKnot(), 3))
      geo.setAttribute('aPosC', new THREE.BufferAttribute(genHelix(), 3))
      geo.setAttribute('aPosD', new THREE.BufferAttribute(genGrid(), 3))
      geo.setAttribute('aRand', new THREE.BufferAttribute(rand, 1))

      const uniforms = {
        uTime: { value: 0 },
        uMorph: { value: 0 },
        uMouse: { value: new THREE.Vector2(99, 99) },
        uRepel: { value: 0 },
        uInk: { value: new THREE.Color(0x121212) },
        uSize: { value: Math.min(window.devicePixelRatio, 2) > 1 ? 1.8 : 2.5 },
      }

      const material = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        uniforms,
        vertexShader: `
          attribute vec3 aPosA; attribute vec3 aPosB; attribute vec3 aPosC; attribute vec3 aPosD;
          attribute float aRand;
          uniform float uTime; uniform float uMorph; uniform float uRepel; uniform float uSize;
          uniform vec2 uMouse;
          varying float vRand; varying float vGlow;
          void main() {
            vRand = aRand;
            float m = clamp(uMorph + (aRand - 0.5) * 0.15, 0.0, 3.0);
            vec3 p;
            if (m < 1.0)      p = mix(aPosA, aPosB, smoothstep(0.0, 1.0, m));
            else if (m < 2.0) p = mix(aPosB, aPosC, smoothstep(0.0, 1.0, m - 1.0));
            else              p = mix(aPosC, aPosD, smoothstep(0.0, 1.0, m - 2.0));
            p += 0.018 * vec3(sin(uTime*0.6+aRand*40.0), cos(uTime*0.5+aRand*35.0), sin(uTime*0.7+aRand*25.0));
            float gridness = smoothstep(2.55, 3.0, m);
            p.y += sin(p.x*1.6+uTime*1.4) * cos(p.z*1.6+uTime*1.1) * 0.22 * gridness;
            vec2 d = p.xy - uMouse;
            float dist = length(d);
            float f = smoothstep(1.15, 0.0, dist) * uRepel;
            p.xy += (d / max(dist, 0.001)) * f * 0.55;
            p.z += f * 0.3 * sin(uTime*3.0+aRand*20.0);
            float seg = fract(min(m, 2.999));
            float burst = sin(seg * 3.14159) * step(0.01, m);
            p += normalize(p + 0.001) * burst * (0.3 + aRand * 0.55) * 0.5;
            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            vGlow = f + burst * 0.7;
            gl_PointSize = uSize * (26.0 / -mv.z) * (0.7 + aRand * 0.6) + burst * 1.5;
            gl_Position = projectionMatrix * mv;
          }
        `,
        fragmentShader: `
          uniform vec3 uInk; uniform float uTime;
          varying float vRand; varying float vGlow;
          void main() {
            vec2 uv = gl_PointCoord - 0.5;
            float dist = length(uv);
            if (dist > 0.5) discard;
            float disk = 1.0 - smoothstep(0.30, 0.46, dist);
            float halo = (1.0 - disk) * 0.14;
            vec3 col = uInk * (0.55 + vRand * 0.75);
            col = mix(col, vec3(0.0), clamp(vGlow, 0.0, 1.0) * 0.6);
            float twinkle = 0.85 + 0.15 * sin(uTime * 2.0 + vRand * 50.0);
            float alpha = (disk * 0.9 + halo) * twinkle;
            if (alpha < 0.02) discard;
            gl_FragColor = vec4(col, alpha);
          }
        `,
      })

      const points = new THREE.Points(geo, material)
      scene.add(points)

      const st = ScrollTrigger.create({
        trigger: container, start: 'top top', end: '+=170%',
        pin: true, anticipatePin: 1,
      })

      let repelTarget = 0, dragging = false, dragVel = 0, lastX = 0, holding = false

      const toWorld = (cx, cy) => {
        const rect = canvas.getBoundingClientRect()
        const nx = ((cx - rect.left) / rect.width) * 2 - 1
        const ny = -(((cy - rect.top) / rect.height) * 2 - 1)
        const vh = 2 * Math.tan((camera.fov * Math.PI) / 360) * camera.position.z
        return { x: nx * (vh / 2) * camera.aspect, y: ny * (vh / 2) }
      }
      const onMove = (e) => {
        const w = toWorld(e.clientX, e.clientY)
        uniforms.uMouse.value.set(w.x, w.y)
        repelTarget = holding ? -1.4 : 1.0
        if (dragging) { dragVel = (e.clientX - lastX) * 0.0045; lastX = e.clientX }
      }
      const onDown = (e) => {
        if (e.pointerType !== 'mouse') return
        holding = true; dragging = true; lastX = e.clientX
        canvas.style.cursor = 'grabbing'
      }
      const onUp = () => { holding = false; dragging = false; canvas.style.cursor = 'grab' }
      const onLeave = () => { uniforms.uMouse.value.set(99, 99); repelTarget = 0; dragging = false; holding = false }

      canvas.addEventListener('pointermove', onMove)
      canvas.addEventListener('pointerdown', onDown)
      window.addEventListener('pointerup', onUp)
      canvas.addEventListener('pointerleave', onLeave)

      let visible = true
      const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting }, { threshold: 0 })
      io.observe(container)

      const onResize = () => {
        renderer.setSize(container.clientWidth, container.clientHeight)
        camera.aspect = container.clientWidth / container.clientHeight
        camera.updateProjectionMatrix()
      }
      window.addEventListener('resize', onResize)

      const clock = new THREE.Clock()

      let morphTarget = 0
      let morphVelocity = 0

      function animate() {
        requestAnimationFrame(animate)
        if (!visible || document.hidden) return
        const t = clock.getElapsedTime()
        uniforms.uTime.value = t

        const span = Math.max(st.end - st.start, 1)
        const prog = THREE.MathUtils.clamp((window.scrollY - st.start) / span, 0, 1)
        morphTarget = prog * 3

        // Smooth the morph with velocity damping for buttery transitions
        const morphDelta = morphTarget - uniforms.uMorph.value
        morphVelocity += morphDelta * 0.008  // spring-like acceleration
        morphVelocity *= 0.88                 // damping
        uniforms.uMorph.value += morphVelocity
        // Clamp to valid range
        uniforms.uMorph.value = THREE.MathUtils.clamp(uniforms.uMorph.value, 0, 3)
        const morph = uniforms.uMorph.value

        // Phase detection with hysteresis to prevent flickering
        const ph = morph < 0.4 ? 0 : morph < 1.4 ? 1 : morph < 2.4 ? 2 : 3
        if (ph !== phaseRef.current) { phaseRef.current = ph; setPhase(ph) }

        uniforms.uRepel.value += (repelTarget - uniforms.uRepel.value) * 0.08
        if (!dragging) dragVel *= 0.94
        points.rotation.y += 0.0016 + dragVel

        // Smooth tilt toward grid view — interpolate instead of snapping
        const gridTilt = THREE.MathUtils.smoothstep(morph, 2.2, 3.0) * -0.45
        points.rotation.x = Math.sin(t * 0.12) * 0.08 + gridTilt

        // Gentle camera ease — no jarring zoom pulses mid-transition
        const camPull = THREE.MathUtils.smoothstep(morph, 0.0, 1.5) * 0.4 - THREE.MathUtils.smoothstep(morph, 1.5, 3.0) * 0.4
        camera.position.z = 6.2 - camPull
        camera.lookAt(0, 0, 0)
        renderer.render(scene, camera)
      }
      animate()

      return () => {
        st.kill()
        io.disconnect()
        window.removeEventListener('resize', onResize)
        window.removeEventListener('pointerup', onUp)
        canvas.removeEventListener('pointermove', onMove)
        canvas.removeEventListener('pointerdown', onDown)
        canvas.removeEventListener('pointerleave', onLeave)
        geo.dispose()
        material.dispose()
        renderer.dispose()
        canvas.remove()
      }
    }, mountRef)

    return () => ctx.revert()
  }, [])

  if (reducedMotion()) {
    return (
      <section ref={mountRef} id="lab" className="relative flex h-screen items-center justify-center bg-void hw" aria-label="The lab">
        <div className="max-w-xl px-6 text-center">
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.35em] text-titanium-dim">[ Chapter 02 — The Lab ]</p>
          <h2 className="mt-6 text-3xl font-semibold text-bone md:text-5xl">
            Not a template — <span className="font-display">hand-written WebGL</span>, tuned to 60fps.
          </h2>
        </div>
      </section>
    )
  }

  return (
    <section ref={mountRef} id="lab" className="relative h-screen bg-void hw" aria-label="The lab — interactive particle lab">
      <div ref={stageRef} className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden">
        <p className="pointer-events-none absolute top-[9vh] font-mono text-[0.65rem] uppercase tracking-[0.35em] text-titanium-dim">
          [ Chapter 02 — Enter the Lab ]
        </p>
        <div className="pointer-events-none absolute bottom-[16vh] flex flex-col items-center gap-3 text-center">
          <span key={'l' + phase} className="phase-in font-mono text-[0.6rem] uppercase tracking-[0.4em] text-bone">
            {PHASES[phase].label}
          </span>
          <h2 key={phase} className="phase-in text-3xl font-semibold tracking-tight text-bone md:text-5xl" data-cursor="text">
            {PHASES[phase].text}
          </h2>
        </div>
        <div className="pointer-events-none absolute bottom-[7vh] flex items-center gap-6 font-mono text-[0.55rem] uppercase tracking-[0.25em] text-titanium-dim">
          <span>drag — spin</span>
          <span className="h-3 w-px bg-black/20" />
          <span>move — disturb</span>
          <span className="h-3 w-px bg-black/20" />
          <span>hold — gather</span>
        </div>
      </div>
    </section>
  )
}