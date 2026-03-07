import os
from typing import Any, Dict, List, Literal

from langchain_core.output_parsers import JsonOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_groq import ChatGroq
from pydantic import BaseModel, Field, SecretStr

# Import the main state

# Import sub-agents
try:
    pass
except ImportError:
    pass


class RoutingDecision(BaseModel):
    required_agents: List[Literal["copy", "ads", "seo"]] = Field(
        description="List of sub-agents required to fulfill the marketing task."
    )
    needs_data: bool = Field(
        description="True if we need the LAM to fetch more data from the web (competitors, metrics) before generating assets."
    )


def create_supervisor_chain():
    api_key = os.environ.get("GROQ_API_KEY", "")
    llm = ChatGroq(
        temperature=0,
        model="llama-3.3-70b-versatile",
        api_key=SecretStr(api_key) if api_key else None,
    )
    parser = JsonOutputParser(pydantic_object=RoutingDecision)

    prompt = ChatPromptTemplate.from_messages(
        [
            (
                "system",
                """You are the Marketing Coordinator (Supervisor Agent).
Your job is to evaluate a high-level marketing task and decide which sub-agents to invoke.
The available sub-agents are:
- 'copy': Generates marketing copy and ad text.
- 'ads': Suggests budget allocations and keywords for campaigns.
- 'seo': Architects landing page structures and meta-tags.

If the task implies creating an entire campaign, you might need all of them.
If the task is just 'write a Facebook ad', you only need 'copy'.

Also, determine if the agents need current web data (competitors, search volume) to complete their task successfully.

{format_instructions}""",
            ),
            ("human", "Task: {task}\nCurrent Memory/Data Context: {memory_context}"),
        ]
    )

    prompt = prompt.partial(format_instructions=parser.get_format_instructions())
    chain = prompt | llm | parser
    return chain


async def marketing_coordinator_node(state: Dict[str, Any]) -> Dict[str, Any]:
    print("MarketingCoordinator: Evaluating task...")
    task = state.get("task", "")
    memory_context = state.get("memory_context", "")

    # For simplicity, if the state already contains the agency results, we're done.
    if state.get("status") in [
        "copy_generated",
        "ads_generated",
        "seo_generated",
        "agency_completed",
    ]:
        return {"status": "agency_completed"}

    # Supervisor decides what's needed
    chain = create_supervisor_chain()
    decision = await chain.ainvoke({"task": task, "memory_context": memory_context})

    # Store the decision in state so the router knows where to go
    print(
        f"MarketingCoordinator: Decided on agents: {decision.get('required_agents')} and needs_data: {decision.get('needs_data')}"
    )

    # If it needs data, it might return a Plan DSL here for the LAM to execute, or transition to a special data-fetching node.
    # We will simulate simply setting the required agents for now.

    return {"agency_routing": decision, "status": "coordinating"}


def route_agency(state: Dict[str, Any]) -> List[str]:
    """
    Decides which nodes to transition to next from the coordinator.
    This demonstrates parallel execution in LangGraph if multiple agents are selected.
    """
    routing = state.get("agency_routing", {})
    agents = routing.get("required_agents", [])

    next_nodes = []
    if "copy" in agents:
        next_nodes.append("CopyAgent")
    if "ads" in agents:
        next_nodes.append("AdsAgent")
    if "seo" in agents:
        next_nodes.append("SEOAgent")

    if not next_nodes:
        return ["__end__"]  # Fallback

    return next_nodes
