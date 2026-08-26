import os

def fix_spaces(path):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if it was affected by replace('', ' ')
    if content.startswith(' i m p o r t ') or content.startswith(' / * ') or content.startswith(' @ i m p o r t '):
        print(f"Fixing spaces in {path}")
        original = content[1::2]
        with open(path, 'w', encoding='utf-8') as f:
            f.write(original)

for root, dirs, files in os.walk('src'):
    for file in files:
        if file.endswith(('.jsx', '.js', '.css', '.html')):
            fix_spaces(os.path.join(root, file))

if os.path.exists('index.html'):
    fix_spaces('index.html')
