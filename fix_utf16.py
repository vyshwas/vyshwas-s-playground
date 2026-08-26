import os

def fix_utf16(path):
    with open(path, 'rb') as f:
        data = f.read()
    
    if b'\x00' in data:
        print(f"File {path} looks like UTF-16. Fixing...")
        try:
            # Try to decode as utf-16-le
            content = data.decode('utf-16-le')
            with open(path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Fixed UTF-16 in {path}")
        except Exception as e:
            print(f"Failed to decode {path}: {e}")

for root, dirs, files in os.walk('src'):
    for file in files:
        if file.endswith(('.jsx', '.js', '.css', '.html')):
            fix_utf16(os.path.join(root, file))

if os.path.exists('index.html'):
    fix_utf16('index.html')
