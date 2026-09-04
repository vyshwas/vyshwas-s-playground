import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { reducedMotion } from '../App.jsx'

gsap.registerPlugin(ScrollTrigger)

const VIDEO_SRC =
  'https://videos.pexels.com/video-files/5561389/5561389-hd_1920_1080_25fps.mp4'

const DisplacementShader = {
  uniforms: {
    tDiffuse: { value: null },
    tDisplacement: { value: null },
    uProgress: { value: 0 },
    uTime: { value: 0 },
    uIntensity: { value: 0.015 },
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
    uniform sampler2D tDisplacement;
    uniform float uProgress;
    uniform float uTime;
    uniform float uIntensity;
    varying vec2 vUv;
    void main() {
      vec2 disp = texture2D(tDisplacement, vUv * 2.0 + uTime * 0.02).rg;
      vec2 uv = vUv + (disp - 0.5) * uIntensity * (1.0 + uProgress * 2.0);
      vec4 color = texture2D(tDiffuse, uv);
      float vig = 1.0 - length(vUv - 0.5) * 1.2;
      color.rgb *= vig;
      gl_FragColor = color;
    }
  `,
}

const ColorGradeShader = {
  uniforms: {
    tDiffuse: { value: null },
    uProgress: { value: 0 },
    uTime: { value: 0 },
    uBrightness: { value: 0.45 },
    uContrast: { value: 1.15 },
    uSaturation: { value: 1.08 },
    uHueRotate: { value: -0.087 },
    uLift: { value: new THREE.Vector3(0.02, 0.01, 0.03) },
    uGamma: { value: new THREE.Vector3(1.0, 0.98, 0.95) },
    uGain: { value: new THREE.Vector3(0.95, 0.92, 0.88) },
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
    uniform float uProgress;
    uniform float uTime;
    uniform float uBrightness;
    uniform float uContrast;
    uniform float uSaturation;
    uniform float uHueRotate;
    uniform vec3 uLift;
    uniform vec3 uGamma;
    uniform vec3 uGain;
    varying vec2 vUv;
    vec3 hueRotate(vec3 color, float angle) {
      float c = cos(angle);
      float s = sin(angle);
      mat3 m = mat3(
        0.299 + 0.701 * c + 0.168 * s, 0.587 - 0.587 * c - 0.330 * s, 0.114 - 0.114 * c + 0.498 * s,
        0.299 - 0.299 * c - 0.328 * s, 0.587 + 0.413 * c + 0.035 * s, 0.114 - 0.114 * c + 0.292 * s,
        0.299 - 0.3 * c + 1.25 * s, 0.587 - 0.588 * c - 1.05 * s, 0.114 + 0.886 * c - 0.203 * s
      );
      return m * color;
    }
    void main() {
      vec3 color = texture2D(tDiffuse, vUv).rgb;
      color = color * uGain + uLift;
      color = pow(color, uGamma);
      color = (color - 0.5) * uContrast + 0.5;
      float gray = dot(color, vec3(0.299, 0.587, 0.114));
      color = mix(vec3(gray), color, uSaturation);
      color = hueRotate(color, uHueRotate + uProgress * 0.05);
      color = color * uBrightness * (1.0 - uProgress * 0.15);
      float vig = 1.0 - length(vUv - 0.5) * 0.8;
      color *= vig;
      gl_FragColor = vec4(color, 1.0);
    }
  `,
}

const ChromaticShader = {
  uniforms: {
    tDiffuse: { value: null },
    uProgress: { value: 0 },
    uOffset: { value: 0.001 },
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
    uniform float uProgress;
    uniform float uOffset;
    varying vec2 vUv;
    void main() {
      float offset = uOffset * (1.0 + uProgress * 3.0);
      vec2 uv = vUv;
      float r = texture2D(tDiffuse, uv + vec2(offset, 0.0)).r;
      float g = texture2D(tDiffuse, uv).g;
      float b = texture2D(tDiffuse, uv - vec2(offset, 0.0)).b;
      gl_FragColor = vec4(r, g, b, 1.0);
    }
  `,
}

const VignetteShader = {
  uniforms: {
    tDiffuse: { value: null },
    uProgress: { value: 0 },
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
    uniform float uProgress;
    varying vec2 vUv;
    void main() {
      vec4 color = texture2D(tDiffuse, vUv);
      float vig = smoothstep(0.45, 0.85, length(vUv - 0.5));
      float darkness = 0.35 + uProgress * 0.25;
      color.rgb = mix(color.rgb, vec3(0.0), vig * darkness);
      gl_FragColor = color;
    }
  `,
}

export default function Hero() {
  const root = useRef(null)
  const videoRef = useRef(null)

  useLayoutEffect(() => {
    if (reducedMotion()) return

      // Removed GSAP text entrance and scroll animations as requested


    const video = videoRef.current
    if (!video) return

    let renderer, composer, scene, camera, quad, videoTexture, displacementTexture
    let displacementPass, colorGradePass, chromaticPass, vignettePass
    let animationId = 0
    let lastProgress = 0
    let clock = new THREE.Clock()

    const initThree = () => {
      const heroRoot = root.current
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: false,
        powerPreference: 'high-performance',
      })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.toneMapping = THREE.NoToneMapping

      videoTexture = new THREE.VideoTexture(video)
      videoTexture.minFilter = THREE.LinearFilter
      videoTexture.magFilter = THREE.LinearFilter
      videoTexture.generateMipmaps = false

      const displacementCanvas = document.createElement('canvas')
      displacementCanvas.width = 512
      displacementCanvas.height = 512
      const dctx = displacementCanvas.getContext('2d')
      const imgData = dctx.createImageData(512, 512)
      for (let i = 0; i < imgData.data.length; i += 4) {
        imgData.data[i] = Math.random() * 255
        imgData.data[i + 1] = Math.random() * 255
        imgData.data[i + 2] = 128
        imgData.data[i + 3] = 255
      }
      dctx.putImageData(imgData, 0, 0)
      displacementTexture = new THREE.CanvasTexture(displacementCanvas)
      displacementTexture.wrapS = THREE.RepeatWrapping
      displacementTexture.wrapT = THREE.RepeatWrapping

      scene = new THREE.Scene()
      camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)

      const quadGeometry = new THREE.PlaneGeometry(2, 2)
      const baseMaterial = new THREE.ShaderMaterial({
        uniforms: { tDiffuse: { value: videoTexture } },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform sampler2D tDiffuse;
          varying vec2 vUv;
          void main() {
            gl_FragColor = texture2D(tDiffuse, vUv);
          }
        `,
      })
      quad = new THREE.Mesh(quadGeometry, baseMaterial)
      scene.add(quad)

      composer = new EffectComposer(renderer)
      composer.addPass(new RenderPass(scene, camera))

      displacementPass = new ShaderPass(DisplacementShader)
      displacementPass.uniforms.tDisplacement.value = displacementTexture
      composer.addPass(displacementPass)

      colorGradePass = new ShaderPass(ColorGradeShader)
      composer.addPass(colorGradePass)

      chromaticPass = new ShaderPass(ChromaticShader)
      composer.addPass(chromaticPass)

      vignettePass = new ShaderPass(VignetteShader)
      composer.addPass(vignettePass)

      const canvas = renderer.domElement
      canvas.className = 'hero-video-canvas absolute inset-0 w-full h-full object-cover hw'
      canvas.style.mixBlendMode = 'normal'
      canvas.style.opacity = '0'
      canvas.style.transition = 'opacity 1s ease'
      heroRoot?.prepend(canvas)
      requestAnimationFrame(() => { canvas.style.opacity = '1' })

      window.__heroVis = true
      const _obs = new IntersectionObserver(([entry]) => { window.__heroVis = entry.isIntersecting }, { threshold: 0 })
      if (root.current) _obs.observe(root.current)

      function animate() {
        if (!window.__heroVis) {
          requestAnimationFrame(animate)
          return
        }
        animationId = requestAnimationFrame(animate)
        const elapsed = clock.getElapsedTime()

        const isLowQuality = document.documentElement.classList.contains('low-quality')

        displacementPass.uniforms.uTime.value = elapsed
        displacementPass.uniforms.uProgress.value = lastProgress
        colorGradePass.uniforms.uTime.value = elapsed
        colorGradePass.uniforms.uProgress.value = lastProgress
        chromaticPass.uniforms.uProgress.value = lastProgress
        vignettePass.uniforms.uProgress.value = lastProgress

        colorGradePass.uniforms.uBrightness.value = THREE.MathUtils.lerp(0.55, 0.45, lastProgress)
        colorGradePass.uniforms.uContrast.value = THREE.MathUtils.lerp(1.25, 1.4, lastProgress)
        colorGradePass.uniforms.uSaturation.value = THREE.MathUtils.lerp(1.08, 0.85, lastProgress)
        colorGradePass.uniforms.uHueRotate.value = THREE.MathUtils.lerp(-0.087, 0.05, lastProgress)

        displacementPass.uniforms.uIntensity.value = THREE.MathUtils.lerp(0.015, 0.035, lastProgress)

        if (!isLowQuality) {
          composer.render()
        } else {
          renderer.render(scene, camera)
        }
      }

      ScrollTrigger.create({
        trigger: root.current,
        start: 'top top',
        end: 'bottom top',
        onUpdate: (self) => { lastProgress = self.progress },
      })

      animate()

      function resize() {
        renderer.setSize(window.innerWidth, window.innerHeight)
        composer.setSize(window.innerWidth, window.innerHeight)
      }
      window.addEventListener('resize', resize)

      return () => {
        cancelAnimationFrame(animationId)
        window.removeEventListener('resize', resize)
        renderer.dispose()
        videoTexture.dispose()
        displacementTexture.dispose()
        composer.passes.forEach(p => p.dispose?.())
        heroRoot?.removeChild(canvas)
      }
    }

    if (video.readyState >= 2) {
      initThree()
    } else {
      video.addEventListener('loadeddata', initThree, { once: true })
    }
  }, [])

  return (
    <section
      ref={root}
      id="hero"
      className="relative h-screen overflow-hidden hw"
      style={{ background: 'radial-gradient(85% 65% at 50% 42%, rgba(247,246,243,0.07) 0%, transparent 70%), #121212' }}
      aria-label="Intro — Vishwas's Playground"
    >
      <video
        ref={videoRef}
        className="hidden"
        src={VIDEO_SRC}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        onEnded={(e) => { e.target.currentTime = 0; e.target.play().catch(() => {}) }}
      />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <p
          className="hero-meta hero-intro font-mono text-[0.65rem] uppercase tracking-[0.35em] text-[#e8e4da] md:text-xs"
          style={{ opacity: 1 }}
          data-cursor="text"
        >
          {'// Vishwas Mehta — Product Designer A Bengaluru'}
        </p>

        <h1
          className="hero-headline mt-8 hw"
          style={{ perspective: '1100px', transformStyle: 'preserve-3d' }}
          data-cursor="text"
        >
          <span className="block overflow-visible">
            <span
              className="hero-word inline-block hw text-[11.5vw] font-extrabold leading-[1.02] tracking-[-0.04em] text-[#f7f6f3] md:text-[7.2vw]"
              style={{ opacity: 1, transformStyle: 'preserve-3d', fontVariationSettings: '"wght" 800', textShadow: '0 4px 34px rgba(0,0,0,0.55)' }}
            >
              Design that <em className="font-display font-normal text-[#f7f6f3]">ships.</em>
            </span>
          </span>
          <span className="block overflow-visible">
            <span
              className="hero-word inline-block hw text-[11.5vw] font-extrabold leading-[1.02] tracking-[-0.04em] text-[#f7f6f3] md:text-[7.2vw]"
              style={{ opacity: 1, transformStyle: 'preserve-3d', fontVariationSettings: '"wght" 800', textShadow: '0 4px 34px rgba(0,0,0,0.55)' }}
            >
              Code that <em className="font-display font-normal text-[#f7f6f3]">feels.</em>
            </span>
          </span>
        </h1>

        <p
          className="hero-meta hero-intro mt-9 max-w-xl text-sm font-light leading-relaxed text-[#f7f6f3]/85 md:text-base"
          style={{ opacity: 1, textShadow: '0 2px 12px rgba(0,0,0,0.75)' }}
          data-cursor="text"
        >
          Local-first AI tools, design systems, and vision-based automation —
          taken from first sketch to production by one person.
        </p>

        <div
          className="hero-meta hero-intro mt-10 flex flex-wrap items-center justify-center gap-5"
          style={{ opacity: 1 }}
        >
          <button
            type="button"
            onClick={() => document.getElementById('experiments')?.scrollIntoView({ behavior: 'smooth' })}
            className="rounded-full bg-[#f7f6f3] px-8 py-3.5 font-mono text-[0.65rem] font-bold uppercase tracking-[0.22em] text-[#121212] transition-colors duration-300 hover:bg-white"
            data-cursor="magnetic"
          >
            View Selected Work
          </button>
          <a
            href="mailto:vyommehta197@gmail.com"
            className="rounded-full border border-white/30 px-8 py-3.5 font-mono text-[0.65rem] uppercase tracking-[0.22em] text-white backdrop-blur-sm transition-colors duration-300 hover:border-white hover:bg-white/10"
            data-cursor="magnetic"
          >
            vyommehta197@gmail.com
          </a>
        </div>
      </div>

      <div className="hero-scrollcue absolute bottom-8 left-1/2 z-10 -translate-x-1/2" data-cursor="drag">
        <span className="font-mono text-[0.55rem] uppercase tracking-[0.3em] text-white/50">
          Scroll
        </span>
        <div className="mx-auto mt-3 h-9 w-px animate-pulse bg-gradient-to-b from-white/40 to-transparent" />
      </div>
    </section>
  )
}