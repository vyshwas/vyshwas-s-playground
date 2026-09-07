import * as THREE from 'three'
import gsap from 'gsap'
const COUNT = window.innerWidth < 768 ? 2800 : 6200
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
  const R = 1.35,
    tube = 0.34
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

export function createParticleScene(container) {
  const scene = new THREE.Scene()
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: false,
    powerPreference: 'low-power',
  })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
  renderer.setSize(container.clientWidth, container.clientHeight)
  const canvas = renderer.domElement
  canvas.className = 'particle-canvas'
  canvas.setAttribute('aria-hidden', 'true')
  container.appendChild(canvas)
  const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    100,
  )
  camera.position.z = 7.8
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
    uInk: {
      value: new THREE.Color(
        getComputedStyle(container).getPropertyValue('--paper').trim(),
      ),
    },
    uSize: { value: 1.05 },
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

            // 1. Transform local vertex p into world coordinates using modelMatrix
            // This ensures interaction stays locked to the screen/mouse, regardless of sphere Y-rotation or drag spin
            vec4 worldPos = modelMatrix * vec4(p, 1.0);

            // 2. Compute tactile repulsion/attraction in world space against uMouse
            vec2 d = worldPos.xy - uMouse;
            float dist = length(d);
            float f = smoothstep(1.3, 0.0, dist) * uRepel;
            worldPos.xy += (d / max(dist, 0.0001)) * f * 0.6;
            worldPos.z += f * 0.28 * sin(uTime * 3.0 + aRand * 20.0);

            // 3. Morph burst effect
            float seg = fract(min(m, 2.999));
            float burst = sin(seg * 3.14159) * step(0.01, m);
            worldPos.xyz += normalize(worldPos.xyz + 0.001) * burst * (0.3 + aRand * 0.55) * 0.5;

            // 4. View matrix maps world space to camera view space
            vec4 mv = viewMatrix * worldPos;
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
            col = mix(col, uInk, clamp(vGlow, 0.0, 1.0) * 0.6);
            float twinkle = 0.85 + 0.15 * sin(uTime * 2.0 + vRand * 50.0);
            float alpha = (disk * 0.9 + halo) * twinkle;
            if (alpha < 0.02) discard;
            gl_FragColor = vec4(col, alpha);
          }
        `,
  })

  const points = new THREE.Points(geo, material)
  scene.add(points)

  let visible = false,
    holding = false,
    drag = false,
    lastX = 0,
    velocity = 0,
    repel = 0,
    running = false,
    disposed = false,
    elapsed = 0
  let rect = canvas.getBoundingClientRect()
  const draw = (_time, delta) => {
    const dt = Math.min(delta / 1000, 0.05)
    elapsed += dt
    uniforms.uTime.value = elapsed
    uniforms.uRepel.value = THREE.MathUtils.damp(
      uniforms.uRepel.value,
      repel,
      9,
      dt,
    )
    if (!drag) velocity *= Math.exp(-5 * dt)
    points.rotation.y += dt * (0.1 + velocity)
    points.rotation.x =
      Math.sin(elapsed * 0.12) * 0.06 -
      THREE.MathUtils.smoothstep(uniforms.uMorph.value, 2.2, 3) * 0.45
    renderer.render(scene, camera)
  }
  const sync = () => {
    const shouldRun = visible && !document.hidden && !disposed
    if (shouldRun && !running) {
      gsap.ticker.add(draw)
      running = true
    } else if (!shouldRun && running) {
      gsap.ticker.remove(draw)
      running = false
    }
  }
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting
    sync()
  })
  observer.observe(container)
  document.addEventListener('visibilitychange', sync)
  const resize = new ResizeObserver(() => {
    const w = container.clientWidth,
      h = container.clientHeight
    if (!w || !h) return
    renderer.setSize(w, h)
    camera.aspect = w / h
    camera.position.z = camera.aspect < 0.8 ? 9.5 : 7.8
    camera.updateProjectionMatrix()
    rect = canvas.getBoundingClientRect()
  })
  resize.observe(container)
  const enter = () => {
    rect = canvas.getBoundingClientRect()
  }
  const move = (e) => {
    if (e.pointerType !== 'mouse') return
    const height =
      2 * Math.tan((camera.fov * Math.PI) / 360) * camera.position.z
    uniforms.uMouse.value.set(
      ((e.clientX - rect.left) / rect.width - 0.5) * height * camera.aspect,
      -((e.clientY - rect.top) / rect.height - 0.5) * height,
    )
    repel = holding ? -1.4 : 1
    if (drag) {
      velocity = (e.clientX - lastX) * 0.12
      lastX = e.clientX
    }
  }
  const down = (e) => {
    if (e.pointerType === 'mouse') {
      holding = true
      drag = true
      lastX = e.clientX
      canvas.setPointerCapture(e.pointerId)
    }
  }
  const up = () => {
    holding = false
    drag = false
    repel = 0
  }
  const leave = () => {
    up()
    uniforms.uMouse.value.set(99, 99)
  }
  const lost = (e) => {
    e.preventDefault()
    disposed = true
    sync()
    container.dispatchEvent(new Event('sceneerror'))
  }
  canvas.addEventListener('pointerenter', enter)
  canvas.addEventListener('pointermove', move)
  canvas.addEventListener('pointerdown', down)
  canvas.addEventListener('pointerup', up)
  canvas.addEventListener('pointercancel', leave)
  canvas.addEventListener('pointerleave', leave)
  canvas.addEventListener('webglcontextlost', lost)
  return {
    setMorph: (value) => {
      uniforms.uMorph.value = value
    },
    dispose: () => {
      disposed = true
      sync()
      observer.disconnect()
      resize.disconnect()
      document.removeEventListener('visibilitychange', sync)
      canvas.removeEventListener('pointerenter', enter)
      canvas.removeEventListener('pointermove', move)
      canvas.removeEventListener('pointerdown', down)
      canvas.removeEventListener('pointerup', up)
      canvas.removeEventListener('pointercancel', leave)
      canvas.removeEventListener('pointerleave', leave)
      canvas.removeEventListener('webglcontextlost', lost)
      geo.dispose()
      material.dispose()
      renderer.dispose()
      canvas.remove()
    },
  }
}
