import os
import glob

files = glob.glob("src/components/*.jsx")
for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
        if "computer science" in content.lower() or "started in" in content.lower():
            print(f"FOUND TEXT IN {file}")
        if "<img" in content:
            print(f"IMAGE IN {file}")
