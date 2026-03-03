import asyncio
from typing import TypedDict, List, Dict, Any, Literal
from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.sqlite.aio import AsyncSqliteSaver
import sqlite3
import aiosqlite

# Make sure imports point correctly depending on how main.py invokes this module
try:
    from .executor import Executor  # type: ignore
    from .planner import generate_plan  # type: ignore
except ImportError:
    from lam.executor import Executor  # type: ignore
    from lam.planner import generate_plan  # type: ignore
try:
    from .agency.ads_agent import ads_agent_node
    from .agency.coordinator import marketing_coordinator_node, route_agency
    from .agency.copy_agent import copy_agent_node
    from .agency.seo_agent import seo_agent_node
except ImportError:
    from lam.agency.ads_agent import ads_agent_node
    from lam.agency.coordinator import marketing_coordinator_node, route_agency
    from lam.agency.copy_agent import copy_agent_node
    from lam.agency.seo_agent import seo_agent_node


# Core state definition for the LAM session
class LamState(TypedDict):
    task: str
    plan: Dict[str, Any]
    execution_results: List[str]
    status: str
    hitl_approved: bool
    summary: str
    memory_context: str  # Placeholder for NeuroEngine connection
    agency_routing: Dict[str, Any]  # For coordinator decisions
    copy_asset: Dict[str, Any]
    ads_asset: Dict[str, Any]
    seo_asset: Dict[str, Any]


class LamOrchestrator:
    def __init__(self, headless: bool = False):
        self.headless = headless
        self.executor = Executor(headless=headless)
        self.memory: Any = None  # Will be set in async setup
        self.graph: Any = None

    async def setup(self):
        """Async setup for the orchestrator, specifically for DB connection."""
        if self.graph is None:
            self.memory_conn = await aiosqlite.connect("database/checkpoints.sqlite")
            self.memory = AsyncSqliteSaver(self.memory_conn)
            # Ensure tables are created
            await self.memory.setup()
            self.graph = self._build_graph()

    async def close(self):
        """Cleanup resources."""
        if hasattr(self, 'memory_conn') and self.memory_conn:
            await self.memory_conn.close()
        await self.executor.close()

    def _build_graph(self):
        """Constructs the state machine."""
        builder = StateGraph(LamState)

        # 1. Goal Node: Initial processing and context gathering (NeuroEngine hook)
        builder.add_node("Goal", self._node_goal)

        # Agency Subsystem Nodes
        builder.add_node("MarketingCoordinator", marketing_coordinator_node)
        builder.add_node("CopyAgent", copy_agent_node)
        builder.add_node("AdsAgent", ads_agent_node)
        builder.add_node("SEOAgent", seo_agent_node)

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
        # Route from Goal to Coordinator or straight to Planning depending on the task
        builder.add_conditional_edges("Goal", self._route_from_goal)

        # From Coordinator, route to the sub-agents
        builder.add_conditional_edges(
            "MarketingCoordinator", route_agency, ["CopyAgent", "AdsAgent", "SEOAgent"]
        )

        # Sub-agents go back to verification/planning if they need LAM execution, else Summarization. For simplicity, we send them to Summarization.
        builder.add_edge("CopyAgent", "Summarization")
        builder.add_edge("AdsAgent", "Summarization")
        builder.add_edge("SEOAgent", "Summarization")

        # Route to Verification if HITL is required, otherwise directly to Execution
        builder.add_conditional_edges(
            "Planning",
            self._route_after_planning,
            {"verify": "Verification", "execute": "Execution"}
        )

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

    def _route_from_goal(
        self, state: LamState
    ) -> Literal["MarketingCoordinator", "Planning"]:
        task = state.get("task", "").lower()
        marketing_keywords = [
            "campaign",
            "copy",
            "ads",
            "seo",
            "marketing",
            "hypnotherapy campaign",
        ]
        if any(keyword in task for keyword in marketing_keywords):
            print("Routing to Marketing Agency Subsystem...")
            return "MarketingCoordinator"
        return "Planning"

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

    def _route_after_planning(self, state: LamState) -> Literal["verify", "execute"]:
        """Check if the generated plan requires HITL."""
        plan = state.get("plan", {})
        requires_hitl = plan.get("requires_hitl", False) if isinstance(plan, dict) else getattr(plan, "requires_hitl", False)
        if requires_hitl:
            print("HITL Required. Routing to Verification node.")
            return "verify"
        return "execute"

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
            # Initialize state
            initial_state: Any = {
                "task": task,
                "plan": {},
                "execution_results": [],
                "status": "started",
                "hitl_approved": False,  # Changed to False until explicitly approved
                "summary": "",
                "memory_context": "",
                "agency_routing": {},
                "copy_asset": {},
                "ads_asset": {},
                "seo_asset": {},
            }

            # Run up to the interruption point (Verification)
            async for event in self.graph.astream(initial_state, config):
                print("Event:", event)

        final_snapshot = await self.graph.aget_state(config)
        return final_snapshot.values


if __name__ == "__main__":
    async def test():
        import os
        os.makedirs("database", exist_ok=True)
        orc = LamOrchestrator(headless=True)
        await orc.setup()
        print("Orchestrator state graph compiled successfully.")
        await orc.close()

    asyncio.run(test())
