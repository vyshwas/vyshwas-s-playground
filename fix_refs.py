import os

def fix_ref(file, bad_ref, good_ref):
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    content = content.replace(f"if ({bad_ref}.current) _obs.observe({bad_ref}.current);",
                              f"if ({good_ref}.current) _obs.observe({good_ref}.current);")
    
    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)

fix_ref('src/components/Hero.jsx', 'containerRef', 'root')
fix_ref('src/components/LabReveal.jsx', 'containerRef', 'mountRef')

print("Refs fixed!")
