import os

with open("src/components/Projects.jsx", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace("protoUrl: '/assets/", "protoUrl: './assets/")

with open("src/components/Projects.jsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated proto URLs to relative ./assets/")
