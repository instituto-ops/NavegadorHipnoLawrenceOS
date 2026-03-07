
files = [
    "apps/backend/lam/agency/coordinator.py",
    "apps/backend/lam/agency/copy_agent.py",
    "apps/backend/lam/agency/ads_agent.py",
    "apps/backend/lam/agency/seo_agent.py"
]

for file in files:
    with open(file, "r") as f:
        content = f.read()

    # We remove the empty try-except blocks completely
    content = content.replace("try:\n    \nexcept ImportError:\n    \n", "")
    content = content.replace("try:\n\nexcept ImportError:\n\n", "")
    content = content.replace("try:\nexcept ImportError:\n", "")
    content = content.replace("try:\n    \nexcept ImportError:\n    ", "")
    content = content.replace("try:\n    \nexcept ImportError:\n", "")

    with open(file, "w") as f:
        f.write(content)
