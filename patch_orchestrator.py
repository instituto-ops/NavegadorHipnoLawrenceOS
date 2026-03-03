with open("apps/backend/lam/orchestrator.py", "r") as f:
    content = f.read()

import os

# Update imports
if "from langgraph.checkpoint.memory import MemorySaver" in content:
    content = content.replace("from langgraph.checkpoint.memory import MemorySaver", "from langgraph.checkpoint.sqlite.aio import AsyncSqliteSaver\nimport sqlite3\nimport aiosqlite")

# Update persistence
if "self.memory = MemorySaver()" in content:
    content = content.replace("self.memory = MemorySaver()", "self.memory_connection = None\n        self.memory = None")

with open("apps/backend/lam/orchestrator.py", "w") as f:
    f.write(content)
