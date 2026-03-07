import re

# main.py
with open("apps/backend/main.py", "r") as f:
    content = f.read()

content = content.replace("config_obj: Any = {\"configurable\": {\"thread_id\": thread_id}}", "config_obj: Any = {\"configurable\": {\"thread_id\": thread_id}}")

lines = content.split('\n')
for i, line in enumerate(lines):
    if "config_obj: Any = {\"configurable\": {\"thread_id\": thread_id}}" in line and i > 160:
        lines[i] = line.replace("config_obj: Any = ", "config_obj = ")

content = '\n'.join(lines)

with open("apps/backend/main.py", "w") as f:
    f.write(content)
