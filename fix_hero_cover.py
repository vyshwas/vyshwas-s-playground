import os

with open("src/components/Hero.jsx", "r", encoding="utf-8") as f:
    content = f.read()

# Replace baseMaterial setup
old_base_mat = """        const baseMaterial = new THREE.ShaderMaterial({
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
        })"""

new_base_mat = """        const baseMaterial = new THREE.ShaderMaterial({
          uniforms: { 
            tDiffuse: { value: videoTexture },
            uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
            uMediaResolution: { value: new THREE.Vector2(1920, 1080) }
          },
          vertexShader: `
            varying vec2 vUv;
            void main() {
              vUv = uv;
              gl_Position = vec4(position, 1.0); // Ortho direct
            }
          `,
          fragmentShader: `
            uniform sampler2D tDiffuse;
            uniform vec2 uResolution;
            uniform vec2 uMediaResolution;
            varying vec2 vUv;
            void main() {
              float screenAspect = uResolution.x / uResolution.y;
              float mediaAspect = uMediaResolution.x / uMediaResolution.y;
              vec2 uv = vUv;
              
              // Emulate object-fit: cover
              if (screenAspect < mediaAspect) {
                  float scale = screenAspect / mediaAspect;
                  uv.x = (uv.x - 0.5) * scale + 0.5;
              } else {
                  float scale = mediaAspect / screenAspect;
                  uv.y = (uv.y - 0.5) * scale + 0.5;
              }
              
              gl_FragColor = texture2D(tDiffuse, uv);
            }
          `,
        })"""

content = content.replace(old_base_mat, new_base_mat)

# Update resize logic to pass uResolution
old_resize = """      function resize() {
        renderer.setSize(window.innerWidth, window.innerHeight)
        composer.setSize(window.innerWidth, window.innerHeight)
      }"""

new_resize = """      function resize() {
        renderer.setSize(window.innerWidth, window.innerHeight)
        composer.setSize(window.innerWidth, window.innerHeight)
        if (quad && quad.material && quad.material.uniforms.uResolution) {
          quad.material.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight)
        }
      }"""

content = content.replace(old_resize, new_resize)

# Also enforce looping on the video just in case
old_video = """        <video
          ref={videoRef}
          className="hidden"
          src={VIDEO_SRC}
          autoPlay
          muted
          loop
          playsInline"""

new_video = """        <video
          ref={videoRef}
          className="hidden"
          src={VIDEO_SRC}
          autoPlay
          muted
          loop
          playsInline
          onCanPlay={(e) => e.target.play().catch(() => {})}"""

content = content.replace(old_video, new_video)

with open("src/components/Hero.jsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Hero.jsx object-fit cover and resize fixed.")
