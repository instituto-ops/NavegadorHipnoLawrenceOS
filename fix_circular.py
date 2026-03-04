files = [
    "apps/backend/lam/agency/coordinator.py",
    "apps/backend/lam/agency/copy_agent.py",
    "apps/backend/lam/agency/ads_agent.py",
    "apps/backend/lam/agency/seo_agent.py",
]

for file in files:
    with open(file, "r") as f:
        content = f.read()

    # We remove LamState imports to avoid circular dependency
    content = content.replace("from ..orchestrator import LamState", "")
    content = content.replace("from lam.orchestrator import LamState", "")

    # Change annotations of state from LamState to Dict[str, Any]
    content = content.replace("(state: LamState)", "(state: Dict[str, Any])")

    with open(file, "w") as f:
        f.write(content)
