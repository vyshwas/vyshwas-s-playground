import os

with open("src/components/LabReveal.jsx", "r", encoding="utf-8") as f:
    content = f.read()

# Replace the animate loop to check visibility
if "isLabVisible" not in content:
    old_animate = """          // Frame throttling for low quality
          const frameInterval = isLowQuality ? 50 : 0
          if (frameInterval > 0) {
            setTimeout(() => requestAnimationFrame(animate), frameInterval)
          } else {
            requestAnimationFrame(animate)
          }
        }"""
    
    new_animate = """          // Frame throttling for low quality
          const frameInterval = isLowQuality ? 50 : 0
          
          const doNext = () => {
            if (!window.__labVisible) return requestAnimationFrame(doNext)
            requestAnimationFrame(animate)
          }
          
          if (frameInterval > 0) {
            setTimeout(doNext, frameInterval)
          } else {
            doNext()
          }
        }"""
    
    if old_animate in content:
        content = content.replace(old_animate, new_animate)
        
        observer_logic = """        window.__labVisible = false
        const observer = new IntersectionObserver(([entry]) => {
          window.__labVisible = entry.isIntersecting
        }, { threshold: 0 })
        observer.observe(containerRef.current)
"""
        content = content.replace("function animate() {", observer_logic + "\n        function animate() {")
        
        with open("src/components/LabReveal.jsx", "w", encoding="utf-8") as f:
            f.write(content)
        print("LabReveal.jsx perf fixed.")
    else:
        print("Could not find LabReveal old animate block.")

