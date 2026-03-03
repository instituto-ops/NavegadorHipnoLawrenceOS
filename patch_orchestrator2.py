import re

with open("apps/backend/lam/orchestrator.py", "r") as f:
    content = f.read()

# Since AsyncSqliteSaver needs to be initialized async, we'll need an async init/setup method
new_class = """class LamOrchestrator:
    def __init__(self, headless: bool = False):
        self.headless = headless
        self.executor = Executor(headless=headless)
        self.memory = None  # Will be set in async setup
        self.graph = None

    async def setup(self):
        \"\"\"Async setup for the orchestrator, specifically for DB connection.\"\"\"
        if self.graph is None:
            self.memory_conn = await aiosqlite.connect("database/checkpoints.sqlite")
            self.memory = AsyncSqliteSaver(self.memory_conn)
            # Ensure tables are created
            await self.memory.setup()
            self.graph = self._build_graph()

    async def close(self):
        \"\"\"Cleanup resources.\"\"\"
        if hasattr(self, 'memory_conn') and self.memory_conn:
            await self.memory_conn.close()
        await self.executor.close()

    def _build_graph(self):"""

content = re.sub(r'class LamOrchestrator:\n    def __init__\(self, headless: bool = False\):\n.*?def _build_graph\(self\):', new_class, content, flags=re.DOTALL)

with open("apps/backend/lam/orchestrator.py", "w") as f:
    f.write(content)
