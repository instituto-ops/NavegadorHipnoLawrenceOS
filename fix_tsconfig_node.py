import re

with open("apps/frontend/tsconfig.node.json", "r") as f:
    content = f.read()

# Strip comments for standard JSON parser or use a simpler replacement
if '"include": ["vite.config.ts"]' in content:
    content = content.replace('"include": ["vite.config.ts"]', '"include": ["vite.config.ts", "electron/**/*.ts"]')

with open("apps/frontend/tsconfig.node.json", "w") as f:
    f.write(content)
