import os

with open("src/components/Projects.jsx", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace("https://vyshwas.github.io/assets/", "/assets/")

with open("src/components/Projects.jsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated proto URLs to local /assets/")
