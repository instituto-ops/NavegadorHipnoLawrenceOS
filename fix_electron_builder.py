import json

with open("apps/frontend/electron-builder.json", "r") as f:
    data = json.load(f)

if "mac" in data and "notarize" in data["mac"]:
    data["mac"]["notarize"] = False # or true, but boolean is required
if "win" in data and "signingHashAlgorithms" in data["win"]:
    del data["win"]["signingHashAlgorithms"]

with open("apps/frontend/electron-builder.json", "w") as f:
    json.dump(data, f, indent=4)
