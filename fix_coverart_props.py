import os

with open("src/components/Projects.jsx", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace("<CoverArt accent={p.cover.accent} motif={p.cover.motif} />", "<CoverArt p={p} />")

with open("src/components/Projects.jsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Fixed CoverArt props")
