import os

with open("src/components/Hero.jsx", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace('[-70, 60][i] " 0', '[-70, 60][i] ?? 0')

with open("src/components/Hero.jsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Fixed Hero.jsx ??")
