with open("apps/backend/lam/orchestrator.py", "r") as f:
    content = f.read()

content = content.replace("self.graph = None", "self.graph: Any = None")
content = content.replace("self.memory = None", "self.memory: Any = None")

with open("apps/backend/lam/orchestrator.py", "w") as f:
    f.write(content)

with open("apps/backend/main.py", "r") as f:
    content = f.read()

content = content.replace(
    'config = {"configurable": {"thread_id": thread_id}}',
    'config: Any = {"configurable": {"thread_id": thread_id}}',
)
content = content.replace("initial_state = {", "initial_state: Any = {")

with open("apps/backend/main.py", "w") as f:
    f.write(content)
