with open("apps/backend/lam/orchestrator.py", "r") as f:
    content = f.read()

import re

# Update edges definition in _build_graph
old_edges = """        # --- Edges Definition ---
        builder.add_edge(START, "Goal")
        builder.add_edge("Goal", "Planning")
        builder.add_edge("Planning", "Verification")"""

new_edges = """        # --- Edges Definition ---
        builder.add_edge(START, "Goal")
        builder.add_edge("Goal", "Planning")

        # Route to Verification if HITL is required, otherwise directly to Execution
        builder.add_conditional_edges(
            "Planning",
            self._route_after_planning,
            {"verify": "Verification", "execute": "Execution"}
        )"""

content = content.replace(old_edges, new_edges)

# Add the routing method after planning
new_route = """    def _route_after_planning(self, state: LamState) -> Literal["verify", "execute"]:
        \"\"\"Check if the generated plan requires HITL.\"\"\"
        plan = state.get("plan", {})
        requires_hitl = plan.get("requires_hitl", False) if isinstance(plan, dict) else getattr(plan, "requires_hitl", False)
        if requires_hitl:
            print("HITL Required. Routing to Verification node.")
            return "verify"
        return "execute"

    async def _node_verification(self, state: LamState):"""

content = content.replace("    async def _node_verification(self, state: LamState):", new_route)

# In run_task, we need to adapt to the async setup
run_task_old = """    async def run_task(self, task: str, thread_id: str = "default_thread"):
        \"\"\"Main entry point invoked by main.py WebSocket.\"\"\"
        config: Any = {"configurable": {"thread_id": thread_id}}

        # Initialize state
        initial_state: Any = {
            "task": task,
            "plan": {},
            "execution_results": [],
            "status": "started",
            "hitl_approved": True,  # Hardcoded True to allow execution in testing
            "summary": "",
            "memory_context": "",
        }

        # Run up to the interruption point (Verification)
        async for event in self.graph.astream(initial_state, config):
            print("Event:", event)

        # If it paused at Verification, we resume it
        snapshot = self.graph.get_state(config)
        if snapshot.next and snapshot.next[0] == "Verification":
            print("Resuming graph from HITL checkpoint...")
            # Resuming graph
            async for event in self.graph.astream(None, config):
                print("Event:", event)

        final_state = self.graph.get_state(config)

        # Cleanup browser
        await self.executor.close()

        return final_state.values"""

run_task_new = """    async def run_task(self, task: str, thread_id: str = "default_thread"):
        \"\"\"Main entry point invoked by main.py WebSocket.\"\"\"
        if self.graph is None:
            await self.setup()

        config: Any = {"configurable": {"thread_id": thread_id}}

        # Check if thread already exists
        snapshot = await self.graph.aget_state(config)
        if snapshot.next and snapshot.next[0] == "Verification":
            print("Resuming graph from HITL checkpoint...")
            # We assume state has been updated externally if needed
            async for event in self.graph.astream(None, config):
                print("Event:", event)
        else:
            # Initialize state
            initial_state: Any = {
                "task": task,
                "plan": {},
                "execution_results": [],
                "status": "started",
                "hitl_approved": False,  # Changed to False until explicitly approved
                "summary": "",
                "memory_context": "",
            }

            # Run up to the interruption point (Verification)
            async for event in self.graph.astream(initial_state, config):
                print("Event:", event)

        final_snapshot = await self.graph.aget_state(config)
        return final_snapshot.values"""

content = content.replace(run_task_old, run_task_new)

# Update test block
test_old = """if __name__ == "__main__":

    async def test():
        LamOrchestrator(headless=True)
        print("Orchestrator state graph compiled successfully.")

    asyncio.run(test())"""

test_new = """if __name__ == "__main__":
    async def test():
        import os
        os.makedirs("database", exist_ok=True)
        orc = LamOrchestrator(headless=True)
        await orc.setup()
        print("Orchestrator state graph compiled successfully.")
        await orc.close()

    asyncio.run(test())"""
content = content.replace(test_old, test_new)

with open("apps/backend/lam/orchestrator.py", "w") as f:
    f.write(content)
