import os

replacements = {
    '?"': '—',
    '?T': "'",
    '?o': '"',
    '??': '"',
    'A': '·',
    '': ' '
}

for root, dirs, files in os.walk('src'):
    for file in files:
        if file.endswith(('.jsx', '.js', '.css', '.html')):
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
            
            original = content
            for bad, good in replacements.items():
                content = content.replace(bad, good)
            
            if content != original:
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"Fixed utf8 corruption in {path}")

if os.path.exists('index.html'):
    with open('index.html', 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    original = content
    for bad, good in replacements.items():
        content = content.replace(bad, good)
    if content != original:
        with open('index.html', 'w', encoding='utf-8') as f:
            f.write(content)
        print("Fixed utf8 corruption in index.html")
