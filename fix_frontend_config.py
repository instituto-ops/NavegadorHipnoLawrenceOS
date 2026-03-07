import json

# Fix tsconfig.node.json
with open("apps/frontend/tsconfig.node.json", "r") as f:
    data = json.load(f)

if "include" in data:
    if "electron/**/*.ts" not in data["include"]:
        data["include"].append("electron/**/*.ts")

with open("apps/frontend/tsconfig.node.json", "w") as f:
    json.dump(data, f, indent=2)
