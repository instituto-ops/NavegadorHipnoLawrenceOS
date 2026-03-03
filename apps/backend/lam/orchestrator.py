import asyncio
from typing import TypedDict, List, Dict, Any, Literal
from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.memory import MemorySaver

# Make sure imports point correctly depending on how main.py invokes this module
try:
    from .planner import generate_plan
    from .executor import Executor
except ImportError:
    from planner import generate_plan
    from executor import Executor


# Core state definition for the LAM session
class LamState(TypedDict):
    task: str
    plan: Dict[str, Any]
    execution_results: List[str]
    status: str
    hitl_approved: bool
    summary: str
    memory_context: str  # Placeholder for NeuroEngine connection


class LamOrchestrator:
    def __init__(self, headless: bool = False):
        self.headless = headless
        self.executor = Executor(headless=headless)
        self.memory = MemorySaver()  # Initialize MemorySaver BEFORE building graph
        self.graph = self._build_graph()

    def _build_graph(self):
        """Constructs the state machine."""
        builder = StateGraph(LamState)

        # 1. Goal Node: Initial processing and context gathering (NeuroEngine hook)
        builder.add_node("Goal", self._node_goal)

        # 2. Planning Node: Generates the DSL via Intention Intelligence
        builder.add_node("Planning", self._node_planning)

        # 3. HITL Checkpoint: Allows Human-in-the-Loop intervention before execution
        builder.add_node("Verification", self._node_verification)

        # 4. Execution Node: Converts DSL into browser actions
        builder.add_node("Execution", self._node_execution)

        # 5. Summarization Node: Wraps up session and prepares payload
        builder.add_node("Summarization", self._node_summarization)

        # --- Edges Definition ---
        builder.add_edge(START, "Goal")
        builder.add_edge("Goal", "Planning")
        builder.add_edge("Planning", "Verification")

        # Conditional edge based on HITL approval
        builder.add_conditional_edges(
            "Verification",
            self._route_after_verification,
            {"execute": "Execution", "abort": END, "replan": "Planning"},
        )

        builder.add_edge("Execution", "Summarization")
        builder.add_edge("Summarization", END)

        # Compile the state graph
        # For HITL, we interrupt before Verification if we want it to block
        return builder.compile(
            checkpointer=self.memory, interrupt_before=["Verification"]
        )

    async def _node_goal(self, state: LamState):
        """Prepares task and context (hook for NeuroEngine/Long-Term Memory)."""
        print(f"Goal Node: Preparing task '{state.get('task')}'")
        # In the future, query NeuroEngine here and update state['memory_context']
        return {"status": "goal_set", "memory_context": "Initial state"}

    async def _node_planning(self, state: LamState):
        """Calls the Intention Intelligence planner."""
        print("Planning Node: Generating DSL...")
        task = state.get("task", "")
        plan = await generate_plan(task)
        return {"plan": plan, "status": "planned"}

    async def _node_verification(self, state: LamState):
        """Human-in-the-loop checkpoint."""
        # When compiled with interrupt_before=["Verification"], the graph pauses here.
        # This node runs AFTER the graph is resumed.
        print(f"Verification Node: Plan is {state.get('plan')}")
        return {"status": "verified"}

    def _route_after_verification(
        self, state: LamState
    ) -> Literal["execute", "abort", "replan"]:
        """Routing logic based on state['hitl_approved'] or similar."""
        approved = state.get("hitl_approved", True)  # Defaulting to True for now
        if approved:
            return "execute"
        # In a real scenario, you might check if they requested replanning
        return "abort"

    async def _node_execution(self, state: LamState):
        """Executes the Playwright bridge."""
        print("Execution Node: Running browser actions...")
        plan = state.get("plan", {})
        results = await self.executor.execute_plan(plan)
        return {"execution_results": results, "status": "executed"}

    async def _node_summarization(self, state: LamState):
        """Wraps up and summarizes."""
        print("Summarization Node: Finalizing session.")
        results = state.get("execution_results", [])
        summary = f"Task completed with {len(results)} steps logged."
        # In the future, save to NeuroEngine here
        return {"summary": summary, "status": "completed"}

    async def run_task(self, task: str, thread_id: str = "default_thread"):
        """Main entry point invoked by main.py WebSocket."""
        config = {"configurable": {"thread_id": thread_id}}

        # Initialize state
        initial_state = {
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

        return final_state.values


if __name__ == "__main__":

    async def test():
        LamOrchestrator(headless=True)
        print("Orchestrator state graph compiled successfully.")

    asyncio.run(test())
