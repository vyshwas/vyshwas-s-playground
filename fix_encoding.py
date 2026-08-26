import os

replacements = {
    'A': '·',
    '?"': '—',
    '?T': "'",
    '?o': '"',
    '??': '"',
    '+\'': '→',
    'o ': '×'
}

def fix_file(path):
    with open(path, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    original = content
    for bad, good in replacements.items():
        content = content.replace(bad, good)
    
    if content != original:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Fixed {path}")

for root, dirs, files in os.walk('src'):
    for file in files:
        if file.endswith(('.jsx', '.js', '.css', '.html')):
            fix_file(os.path.join(root, file))

if os.path.exists('index.html'):
    fix_file('index.html')
