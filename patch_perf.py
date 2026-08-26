import os
import re

def fix(file, vis_var):
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if vis_var in content:
        print(f"{file} already fixed.")
        return
        
    # find function animate() { ... }
    # add intersection observer right before it
    
    content = content.replace("function animate() {", f"""window.{vis_var} = true;
    const _obs = new IntersectionObserver(([entry]) => window.{vis_var} = entry.isIntersecting, {{ threshold: 0 }});
    if (containerRef.current) _obs.observe(containerRef.current);
    
    function animate() {{
      if (!window.{vis_var}) {{
         requestAnimationFrame(animate);
         return;
      }}""")
      
    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Fixed {file}")

fix('src/components/Hero.jsx', '__heroVis')
fix('src/components/LabReveal.jsx', '__labVis')
fix('src/components/AmbientWebGL.jsx', '__ambVis')
