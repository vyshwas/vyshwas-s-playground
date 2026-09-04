import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { reducedMotion } from '../App.jsx'

const ChromaticAberrationShader = {
  uniforms: {
    tDiffuse: { value: null },
    offset: { value: new THREE.Vector2(0.0015, 0) },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform vec2 offset;
    varying vec2 vUv;
    void main() {
      vec2 uv = vUv;
      vec4 cr = texture2D(tDiffuse, uv + offset);
      vec4 cg = texture2D(tDiffuse, uv);
      vec4 cb = texture2D(tDiffuse, uv - offset);
      gl_FragColor = vec4(cr.r, cg.g, cb.b, cg.a);
    }
  `,
}

const VignetteShader = {
  uniforms: {
    tDiffuse: { value: null },
    offset: { value: 0.65 },
    darkness: { value: 0.45 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float offset;
    uniform float darkness;
    varying vec2 vUv;
    void main() {
      vec4 color = texture2D(tDiffuse, vUv);
      float dist = length(vUv - 0.5);
      float vig = smoothstep(offset, offset + 0.35, dist);
      color.rgb = mix(color.rgb, vec3(0.0), vig * darkness);
      gl_FragColor = color;
    }
  `,
}

export default function AmbientWebGL() {
  const containerRef = useRef(null)

  useEffect(() => {
    if (reducedMotion()) return

    const container = containerRef.current
    if (!container) return

    (() => {
      const scene = new THREE.Scene()
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)

      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.toneMapping = THREE.ACESFilmicToneMapping
      renderer.toneMappingExposure = 1.0
      container.appendChild(renderer.domElement)

      const composer = new EffectComposer(renderer)
      composer.addPass(new RenderPass(scene, camera))

      const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        0.3, 0.25, 0.85
      )
      composer.addPass(bloomPass)

      const chromaticPass = new ShaderPass(ChromaticAberrationShader)
      composer.addPass(chromaticPass)

      const vignettePass = new ShaderPass(VignetteShader)
      composer.addPass(vignettePass)

      const PARTICLE_COUNT = 200
      const geometry = new THREE.BufferGeometry()
      const positions = new Float32Array(PARTICLE_COUNT * 3)
      const sizes = new Float32Array(PARTICLE_COUNT)
      const alphas = new Float32Array(PARTICLE_COUNT)
      const hues = new Float32Array(PARTICLE_COUNT)
      const phases = new Float32Array(PARTICLE_COUNT)
      const velocities = new Float32Array(PARTICLE_COUNT * 2)
      const basePositions = new Float32Array(PARTICLE_COUNT * 3)

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const theta = Math.random() * Math.PI * 2
        const phi = Math.acos(2 * Math.random() - 1)
        const r = 0.5 + Math.random() * 1.5
        const x = r * Math.sin(phi) * Math.cos(theta)
        const y = r * Math.sin(phi) * Math.sin(theta)
        const z = r * Math.cos(phi)
        positions[i * 3] = x * 2
        positions[i * 3 + 1] = y * 2
        positions[i * 3 + 2] = z
        basePositions[i * 3] = x * 2
        basePositions[i * 3 + 1] = y * 2
        basePositions[i * 3 + 2] = z
        sizes[i] = Math.random() * 2.0 + 0.5
        alphas[i] = Math.random() * 0.4 + 0.1
        hues[i] = Math.random() > 0.7 ? 0 : 1
        phases[i] = Math.random() * Math.PI * 2
        velocities[i * 2] = (Math.random() - 0.5) * 0.0005
        velocities[i * 2 + 1] = (Math.random() - 0.5) * 0.0005
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
      geometry.setAttribute('alpha', new THREE.BufferAttribute(alphas, 1))
      geometry.setAttribute('hue', new THREE.BufferAttribute(hues, 1))
      geometry.setAttribute('phase', new THREE.BufferAttribute(phases, 1))
      geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 2))
      geometry.setAttribute('basePosition', new THREE.BufferAttribute(basePositions, 3))

      const themeUniforms = {
        uTime: { value: 0 },
        uProgress: { value: 0 },
        uScrollVelocity: { value: 0 },
        uAccentColor: { value: new THREE.Color(0x2a2a2a) },
        uAccentColor2: { value: new THREE.Color(0x555555) },
        uBaseColor: { value: new THREE.Color(0x060607) },
      }

      const material = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.NormalBlending,
        vertexShader: `
          attribute float size;
          attribute float alpha;
          attribute float hue;
          attribute float phase;
          attribute vec2 velocity;
          attribute vec3 basePosition;
          varying float vAlpha;
          varying float vHue;
          varying float vPhase;
          varying vec2 vVelocity;
          varying vec3 vBasePosition;
          uniform float uTime;
          uniform float uProgress;
          uniform float uScrollVelocity;
          void main() {
            vAlpha = alpha;
            vHue = hue;
            vPhase = phase;
            vVelocity = velocity;
            vBasePosition = basePosition;
            vec3 pos = position;
            float wave = sin(uTime * 0.3 + phase) * 0.12;
            pos.x += sin(uTime * 0.2 + phase * 1.3) * 0.08;
            pos.y += cos(uTime * 0.15 + phase * 0.7) * 0.06;
            pos *= 1.0 + wave;
            float progressWave = sin(uProgress * 6.28 + phase * 2.0) * 0.05;
            pos.z += progressWave;
            float scrollDrift = uScrollVelocity * 0.02;
            pos.y += scrollDrift;
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_PointSize = size * (250.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          varying float vAlpha;
          varying float vHue;
          varying float vPhase;
          uniform float uTime;
          uniform vec3 uAccentColor;
          uniform vec3 uAccentColor2;
          void main() {
            float dist = length(gl_PointCoord - 0.5);
            if (dist > 0.5) discard;
            float glow = 1.0 - smoothstep(0.0, 0.5, dist);
            float pulse = sin(uTime * 1.5 + vPhase) * 0.25 + 0.75;
            vec3 color = mix(uAccentColor2, uAccentColor, vHue);
            float alpha = vAlpha * glow * pulse * 0.35;
            gl_FragColor = vec4(color, alpha);
          }
        `,
        uniforms: themeUniforms,
      })

      const particles = new THREE.Points(geometry, material)
      scene.add(particles)

      const clock = new THREE.Clock()
      let lastScrollY = window.scrollY
      let lastTime = performance.now()
      let scrollProgress = 0
      let targetProgress = 0

      function onScroll() {
        const scrollY = window.scrollY
        const velocity = (scrollY - lastScrollY) * 0.001
        lastScrollY = scrollY
        themeUniforms.uScrollVelocity.value = THREE.MathUtils.clamp(velocity, -0.5, 0.5)
        const total = document.documentElement.scrollHeight - window.innerHeight
        targetProgress = THREE.MathUtils.clamp(scrollY / total, 0, 1)
      }

      function resize() {
        renderer.setSize(window.innerWidth, window.innerHeight)
        composer.setSize(window.innerWidth, window.innerHeight)
        bloomPass.resolution.set(window.innerWidth, window.innerHeight)
      }

      function animate(now) {
        const _dt = Math.min(33, now - lastTime)
        lastTime = now
        const elapsed = clock.getElapsedTime()

        themeUniforms.uTime.value = elapsed
        scrollProgress += (targetProgress - scrollProgress) * 0.06
        themeUniforms.uProgress.value = scrollProgress

        const p = scrollProgress
        if (p < 0.12) {
          themeUniforms.uAccentColor.value.setHex(0x2a2a2a)
          themeUniforms.uAccentColor2.value.setHex(0x555555)
        } else if (p < 0.3) {
          themeUniforms.uAccentColor.value.setHex(0x2a2a2a)
          themeUniforms.uAccentColor2.value.setHex(0x555555)
        } else if (p < 0.55) {
          themeUniforms.uAccentColor.value.setHex(0x2a2a2a)
          themeUniforms.uAccentColor2.value.setHex(0x555555)
        } else if (p < 0.8) {
          themeUniforms.uAccentColor.value.setHex(0x2a2a2a)
          themeUniforms.uAccentColor2.value.setHex(0x555555)
        } else {
          themeUniforms.uAccentColor.value.setHex(0x2a2a2a)
          themeUniforms.uAccentColor2.value.setHex(0x555555)
        }

        particles.rotation.y = elapsed * 0.005
        particles.rotation.x = Math.sin(elapsed * 0.1) * 0.03

        const isLowQuality = document.documentElement.classList.contains('low-quality')
        if (!document.hidden) {
          if (!isLowQuality) {
            composer.render()
          } else {
            renderer.render(scene, camera)
          }
        }

        requestAnimationFrame(animate)
      }

      window.addEventListener('scroll', onScroll, { passive: true })
      window.addEventListener('resize', resize)

      let isVisible = true
      const obs = new IntersectionObserver(([entry]) => {
        isVisible = entry.isIntersecting
      }, { threshold: 0 })
      obs.observe(container)

      onScroll()

      function animateLoop(now) {
        if (!isVisible || document.hidden) {
          requestAnimationFrame(animateLoop)
          return
        }
        animate(now)
      }
      animateLoop(performance.now())

      return () => {
        obs.disconnect()
        window.removeEventListener('scroll', onScroll)
        window.removeEventListener('resize', resize)
        renderer.dispose()
        geometry.dispose()
        material.dispose()
        composer.passes.forEach(p => p.dispose?.())
        container.removeChild(renderer.domElement)
      }
    })()
  }, [])

  return <div ref={containerRef} className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true" />
}