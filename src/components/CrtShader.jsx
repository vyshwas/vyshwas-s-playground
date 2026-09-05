import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { reducedMotion } from '../App.jsx'

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`

const fragmentShader = `
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uHover;

varying vec2 vUv;

// --- Noise & Hash ---
float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
}

float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

// --- 3D Rotation ---
mat2 rot(float a) {
    float s = sin(a), c = cos(a);
    return mat2(c, -s, s, c);
}

// --- SDFs ---
float sdBoxFrame( vec3 p, vec3 b, float e ) {
  p = abs(p)  - b;
  vec3 q = abs(p+e) - e;
  return min(min(
      length(max(vec3(p.x,q.y,q.z),0.0))+min(max(p.x,max(q.y,q.z)),0.0),
      length(max(vec3(q.x,p.y,q.z),0.0))+min(max(q.x,max(p.y,q.z)),0.0)),
      length(max(vec3(q.x,q.y,p.z),0.0))+min(max(q.x,max(q.y,p.z)),0.0));
}

float sdOctahedron( vec3 p, float s ) {
  p = abs(p);
  return (p.x+p.y+p.z-s)*0.57735027;
}

// --- Map (Scene definition) ---
float map(vec3 p) {
    // Complex rotation based on time and mouse
    p.xz *= rot(uTime * 0.5 + uMouse.x * 2.0);
    p.xy *= rot(uTime * 0.3 + uMouse.y * 2.0);
    
    // Core shape: A wireframe box
    float d1 = sdBoxFrame(p, vec3(0.6), 0.02);
    
    // Inner shape: Octahedron that pulses
    float pulse = sin(uTime * 2.0) * 0.1 + 0.3;
    float d2 = sdOctahedron(p, pulse);
    
    // Outer shape: Another rotating wireframe box
    vec3 p2 = p;
    p2.xz *= rot(uTime);
    float d3 = sdBoxFrame(p2, vec3(0.9), 0.01);
    
    return min(d1, min(max(d2, -sdBoxFrame(p, vec3(pulse+0.05), 0.05)), d3));
}

// --- CRT Distortion ---
vec2 curve(vec2 uv) {
    uv = (uv - 0.5) * 2.0;
    uv *= 1.1; 
    uv.x *= 1.0 + pow((abs(uv.y) / 5.0), 2.0);
    uv.y *= 1.0 + pow((abs(uv.x) / 4.0), 2.0);
    uv  = (uv / 2.0) + 0.5;
    uv =  uv *0.92 + 0.04;
    return uv;
}

void main() {
    vec2 q = vUv;
    vec2 uv = curve(q);
    
    // Out of bounds (CRT monitor edges)
    if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
        return;
    }
    
    // Glitch effect based on time and hover
    float glitchTime = uTime * (1.0 + uHover * 2.0);
    float glitch = noise(vec2(glitchTime * 10.0, uv.y * 50.0)) * 0.02 * uHover;
    uv.x += glitch;

    // --- Raymarching ---
    vec3 ro = vec3(0.0, 0.0, -2.5); // Ray origin
    vec3 ta = vec3(0.0, 0.0, 0.0);  // Target
    vec3 ww = normalize(ta - ro);
    vec3 uu = normalize(cross(ww, vec3(0.0, 1.0, 0.0)));
    vec3 vv = normalize(cross(uu, ww));
    
    // Setup view ray for this pixel
    vec2 p = -1.0 + 2.0 * uv;
    p.x *= uResolution.x / uResolution.y;
    vec3 rd = normalize(p.x*uu + p.y*vv + 1.5*ww);
    
    // March loop
    float t = 0.0;
    float maxD = 10.0;
    float d = 0.0;
    vec3 pos;
    for(int i = 0; i < 64; i++) {
        pos = ro + rd * t;
        d = map(pos);
        if(d < 0.001 || t > maxD) break;
        t += d;
    }
    
    // --- Shading / Hologram color ---
    vec3 col = vec3(0.0);
    if(t < maxD) {
        // Pseudo lighting based on distance and iterations
        float glow = 1.0 - (t / maxD);
        
        // Base phosphor green
        vec3 baseColor = vec3(0.1, 1.0, 0.3);
        
        // Highlight active hover state
        baseColor = mix(baseColor, vec3(0.4, 1.0, 0.8), uHover);
        
        col = baseColor * glow * 1.5;
        
        // Add wireframe edge glow
        col += vec3(0.2, 0.9, 0.4) * (0.01 / abs(d));
    }
    
    // --- CRT Post-Processing ---
    // Scanlines
    float scanline = sin(uv.y * 800.0 * (uResolution.y/1000.0)) * 0.04;
    col -= scanline;
    
    // Slow scanning beam
    float beam = clamp(sin(uv.y * 10.0 + uTime * 3.0), 0.0, 1.0);
    col += vec3(0.05, 0.2, 0.1) * beam * 0.5;
    
    // Phosphor noise
    col += (hash(uv + uTime) - 0.5) * 0.08;
    
    // Vignette
    float vig = (0.0 + 1.0*16.0*uv.x*uv.y*(1.0-uv.x)*(1.0-uv.y));
    col *= pow(vig, 0.3);
    
    // Chromatic aberration (fake, applied to overall brightness)
    float r = col.r * 1.1;
    float g = col.g;
    float b = col.b * 0.9;
    
    gl_FragColor = vec4(r, g, b, 1.0);
}
`

export default function CrtShader() {
  const mountRef = useRef(null)
  const isHoveredRef = useRef(false)
  const mouseRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (reducedMotion() || !mountRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    
    // Orthographic camera for full screen quad
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    
    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    
    const mount = mountRef.current
    mount.appendChild(renderer.domElement)

    // Shader Material
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2() },
        uMouse: { value: new THREE.Vector2() },
        uHover: { value: 0 }
      },
      depthWrite: false,
      depthTest: false
    })

    // Full screen plane
    const geometry = new THREE.PlaneGeometry(2, 2)
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    // Resize handler
    const onResize = () => {
      if (!mount) return
      const width = mount.clientWidth
      const height = mount.clientHeight
      renderer.setSize(width, height)
      material.uniforms.uResolution.value.set(width, height)
    }
    
    // Initial size
    onResize()
    
    // We need to use ResizeObserver because this element is inside a scaled GSAP container
    const resizeObserver = new ResizeObserver(onResize)
    resizeObserver.observe(mount)

    // Mouse tracking for interaction
    const onMouseMove = (e) => {
      const rect = mount.getBoundingClientRect()
      // Normalize mouse coordinates to -1 to 1 relative to the canvas
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1
      mouseRef.current = { x, y }
    }
    
    const onMouseEnter = () => isHoveredRef.current = true
    const onMouseLeave = () => isHoveredRef.current = false

    mount.addEventListener('mousemove', onMouseMove)
    mount.addEventListener('mouseenter', onMouseEnter)
    mount.addEventListener('mouseleave', onMouseLeave)

    // Animation loop
    let frameId
    const clock = new THREE.Clock()

    const render = () => {
      const elapsedTime = clock.getElapsedTime()
      
      material.uniforms.uTime.value = elapsedTime
      
      // Smoothly interpolate mouse and hover uniforms
      const currentMouse = material.uniforms.uMouse.value
      currentMouse.x += (mouseRef.current.x - currentMouse.x) * 0.1
      currentMouse.y += (mouseRef.current.y - currentMouse.y) * 0.1
      
      const currentHover = material.uniforms.uHover.value
      const targetHover = isHoveredRef.current ? 1.0 : 0.0
      material.uniforms.uHover.value += (targetHover - currentHover) * 0.1
      
      renderer.render(scene, camera)
      frameId = requestAnimationFrame(render)
    }
    
    render()

    return () => {
      cancelAnimationFrame(frameId)
      resizeObserver.disconnect()
      mount.removeEventListener('mousemove', onMouseMove)
      mount.removeEventListener('mouseenter', onMouseEnter)
      mount.removeEventListener('mouseleave', onMouseLeave)
      mount.removeChild(renderer.domElement)
      geometry.dispose()
      material.dispose()
      renderer.dispose()
    }
  }, [])

  return (
    <div 
      ref={mountRef} 
      className="absolute inset-0 w-full h-full overflow-hidden cursor-crosshair"
      aria-hidden="true"
    />
  )
}
