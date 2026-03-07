import re

# lam/agency/coordinator.py
with open("apps/backend/lam/agency/coordinator.py", "r") as f:
    content = f.read()

# Add missing mock nodes so orchestrator doesn't crash on import
mock_code = """
def marketing_coordinator_node(state: Dict[str, Any]) -> Dict[str, Any]:
    print("Marketing Coordinator executing...")
    return {"messages": ["Coordinator routed."]}

def route_agency(state: Dict[str, Any]) -> str:
    print("Routing agency...")
    return "FINISH"
"""

if "def marketing_coordinator_node" not in content:
    content += "\n" + mock_code

with open("apps/backend/lam/agency/coordinator.py", "w") as f:
    f.write(content)

# main.py
with open("apps/backend/main.py", "r") as f:
    content = f.read()

content = content.replace("config = {\"configurable\": {\"thread_id\": \"ws_\" + client_id}}", "_config = {\"configurable\": {\"thread_id\": \"ws_\" + client_id}}")
content = content.replace("config=config", "config=_config")

with open("apps/backend/main.py", "w") as f:
    f.write(content)
