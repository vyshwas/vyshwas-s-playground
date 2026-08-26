import os

with open("src/components/Projects.jsx", "rb") as f:
    content = f.read()

idx = content.find(b'Product Design ')
if idx != -1:
    print(content[idx:idx+30].hex())
    print(content[idx:idx+30].decode('utf-8', errors='replace'))
