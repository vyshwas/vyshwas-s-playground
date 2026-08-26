import os

with open("src/components/Hero.jsx", "r", encoding="utf-8") as f:
    content = f.read()

# Replace the animate loop to check visibility
if "isHeroVisible" not in content:
    # We will inject a check
    old_animate = """      // Frame throttling for low quality
      const frameInterval = isLowQuality ? 50 : 0
      if (frameInterval > 0) {
        setTimeout(() => requestAnimationFrame(animate), frameInterval)
      } else {
        requestAnimationFrame(animate)
      }
    }"""
    
    new_animate = """      // Frame throttling for low quality
      const frameInterval = isLowQuality ? 50 : 0
      
      const doNext = () => {
        if (!window.__heroVisible) return requestAnimationFrame(doNext)
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
        
        # Add observer logic
        observer_logic = """    window.__heroVisible = true
    const observer = new IntersectionObserver(([entry]) => {
      window.__heroVisible = entry.isIntersecting
    }, { threshold: 0 })
    observer.observe(containerRef.current)
"""
        content = content.replace("function animate() {", observer_logic + "\n    function animate() {")
        
        with open("src/components/Hero.jsx", "w", encoding="utf-8") as f:
            f.write(content)
        print("Hero.jsx perf fixed.")
    else:
        print("Could not find Hero old animate block.")

