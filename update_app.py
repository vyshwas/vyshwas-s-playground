import os

with open("src/App.jsx", "r", encoding="utf-8") as f:
    content = f.read()

replacement = """  useEffect(() => {
    const handleLoad = () => {
      ScrollTrigger.sort()
      ScrollTrigger.refresh()
    }
    
    // If already loaded
    if (document.readyState === 'complete') {
      handleLoad()
    } else {
      window.addEventListener('load', handleLoad)
    }
    
    // Also do a few delayed refreshes just in case fonts/components mount late
    const t1 = setTimeout(handleLoad, 500)
    const t2 = setTimeout(handleLoad, 1500)
    const t3 = setTimeout(handleLoad, 3000)

    return () => {
      window.removeEventListener('load', handleLoad)
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [])"""

# Find the old timer effect
old_effect = """  useEffect(() => {
    const timer = setTimeout(() => { ScrollTrigger.refresh() }, 200)
    return () => clearTimeout(timer)
  }, [])"""

content = content.replace(old_effect, replacement)

with open("src/App.jsx", "w", encoding="utf-8") as f:
    f.write(content)
print("App.jsx GSAP refresh logic updated.")
