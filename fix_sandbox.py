import os

with open("src/components/AboutSandbox.jsx", "r", encoding="utf-8") as f:
    content = f.read()

# Add Intersection Observer to Matter.js
if "IntersectionObserver" not in content:
    old_matter = """    Runner.run(Runner.create(), engine)
    Render.run(render)

    return () => {"""
    
    new_matter = """    const runner = Runner.create()
    let isVisible = false
    
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting
      if (isVisible) {
        Runner.start(runner, engine)
        Render.run(render)
      } else {
        Runner.stop(runner)
        Render.stop(render)
      }
    }, { threshold: 0 })
    
    observer.observe(canvasRef.current)

    return () => {
      observer.disconnect()
      Runner.stop(runner)"""
      
    content = content.replace(old_matter, new_matter)
    
    with open("src/components/AboutSandbox.jsx", "w", encoding="utf-8") as f:
        f.write(content)
print("AboutSandbox perf fixed.")
