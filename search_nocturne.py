import json
import re

log_path = r"C:\Users\vyshw\.gemini\antigravity\brain\b15d9466-6f69-4ded-9099-8e3fa8347fa1\.system_generated\logs\transcript.jsonl"

with open(log_path, 'r', encoding='utf-8', errors='ignore') as f:
    content = f.read()

# Find all occurrences of "Nocturne"
matches = re.finditer(r'.{0,200}Nocturne.{0,200}', content)
for i, m in enumerate(matches):
    print(f"Match {i}: {m.group(0)}")
    if i > 10:
        break
