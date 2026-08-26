import os

with open("src/App.jsx", "r", encoding="utf-8") as f:
    app_code = f.read()

# We will add a small timeout to refresh ScrollTrigger after mount
refresh_logic = """
  useEffect(() => {
    // Force a ScrollTrigger refresh after all child useLayoutEffects have run and created pins
    const timer = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 100)
    return () => clearTimeout(timer)
  }, [])
"""

# Insert it right before the last useEffect or just before return
app_code = app_code.replace("  return (", refresh_logic + "\n  return (")

with open("src/App.jsx", "w", encoding="utf-8") as f:
    f.write(app_code)
print("App.jsx patched with ScrollTrigger.refresh")
