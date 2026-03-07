
with open("apps/backend/lam/orchestrator.py", "r") as f:
    content = f.read()

# Fix the duplicate imports handling logic to avoid mypy complaining about Name already defined
content = content.replace("try:\n    from .planner import generate_plan\n    from .executor import Executor", "try:\n    from .planner import generate_plan  # type: ignore\n    from .executor import Executor  # type: ignore")
content = content.replace("except ImportError:\n    from planner import generate_plan\n    from executor import Executor", "except ImportError:\n    from planner import generate_plan  # type: ignore\n    from executor import Executor  # type: ignore")

with open("apps/backend/lam/orchestrator.py", "w") as f:
    f.write(content)
