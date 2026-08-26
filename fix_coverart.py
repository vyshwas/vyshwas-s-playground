import os

path = "src/components/CoverArt.jsx"
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

if content.startswith(' c o n s t '):
    original = content[1::2]
    with open(path, 'w', encoding='utf-8') as f:
        f.write(original)
    print(f"Fixed spaces in {path}")
