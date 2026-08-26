import os

with open("src/components/Hero.jsx", "r", encoding="utf-8") as f:
    content = f.read()
content = content.replace('[-70, 60][i] " 0', '[-70, 60][i] ?? 0')
content = content.replace('[4, -5][i] " 0', '[4, -5][i] ?? 0')
with open("src/components/Hero.jsx", "w", encoding="utf-8") as f:
    f.write(content)

with open("src/components/Projects.jsx", "r", encoding="utf-8") as f:
    content = f.read()
content = content.replace("last — '' :", "last ? '' :")
with open("src/components/Projects.jsx", "w", encoding="utf-8") as f:
    f.write(content)
