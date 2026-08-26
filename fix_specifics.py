import os

def replace_exact(path, old, new):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    if old in content:
        content = content.replace(old, new)
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Fixed {old} in {path}")

replace_exact("src/components/Projects.jsx", "Product Design A Frontend", "Product Design · Frontend")
replace_exact("src/components/Projects.jsx", "Product Design A Build", "Product Design · Build")
replace_exact("src/components/Projects.jsx", "Concept A Prototyping", "Concept · Prototyping")
replace_exact("src/components/Projects.jsx", "tokens A contrast A 60-30-10", "tokens · contrast · 60-30-10")
replace_exact("src/components/Projects.jsx", "on-device A zero telemetry", "on-device · zero telemetry")
replace_exact("src/components/Projects.jsx", "cv A open-source", "cv · open-source")

replace_exact("src/components/Projects.jsx", "?", "—") # Just in case any raw Unicode replacements are left
replace_exact("src/components/Projects.jsx", '?"', "—") 
replace_exact("src/components/Projects.jsx", "?'", "'") 
