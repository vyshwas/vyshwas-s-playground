import json
import os

log_path = r"C:\Users\vyshw\.gemini\antigravity\brain\b15d9466-6f69-4ded-9099-8e3fa8347fa1\.system_generated\logs\transcript.jsonl"

projects_content = []
with open(log_path, 'r', encoding='utf-8') as f:
    for line in f:
        try:
            data = json.loads(line)
            if 'tool_calls' in data:
                for call in data['tool_calls']:
                    if call['function']['name'] in ['write_to_file', 'replace_file_content']:
                        args = call['function']['arguments']
                        if isinstance(args, str):
                            args = json.loads(args)
                        if 'Projects.jsx' in args.get('TargetFile', ''):
                            if 'CodeContent' in args:
                                projects_content.append(args['CodeContent'])
                            elif 'ReplacementContent' in args:
                                projects_content.append(args['ReplacementContent'])
        except Exception as e:
            pass

print(f"Found {len(projects_content)} writes to Projects.jsx")
if len(projects_content) > 0:
    with open('old_projects_1.txt', 'w', encoding='utf-8') as f:
        f.write(projects_content[0]) # usually the first one or an early one is the dark mode
    with open('old_projects_last.txt', 'w', encoding='utf-8') as f:
        f.write(projects_content[-2] if len(projects_content) > 1 else projects_content[-1])

