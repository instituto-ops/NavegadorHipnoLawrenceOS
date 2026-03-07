import os
from typing import Any, Dict

from langchain_core.output_parsers import JsonOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_groq import ChatGroq
from pydantic import SecretStr

from .schemas import CopyAsset

# Ensure we use Pydantic models correctly for Intention Intelligence Protocol


def create_copywriter_chain():
    api_key = os.environ.get("GROQ_API_KEY", "")
    llm = ChatGroq(
        temperature=0.7,
        model="llama-3.3-70b-versatile",
        api_key=SecretStr(api_key) if api_key else None,
    )
    parser = JsonOutputParser(pydantic_object=CopyAsset)

    prompt = ChatPromptTemplate.from_messages(
        [
            (
                "system",
                """You are an expert Marketing Copywriter Sub-Agent.
Your job is to generate high-converting, persuasive, and empathetic marketing copy based on the given task and any competitor data provided.
Ensure the copy complies with CFM (Conselho Federal de Medicina) guidelines regarding health and therapy claims.
Avoid making guarantees of results or using sensationalist language. Focus on the benefits of hypnotherapy and the transformation.

{format_instructions}""",
            ),
            ("human", "Task: {task}\nCompetitor Data: {competitor_data}"),
        ]
    )

    prompt = prompt.partial(format_instructions=parser.get_format_instructions())
    chain = prompt | llm | parser
    return chain


async def copy_agent_node(state: Dict[str, Any]) -> Dict[str, Any]:
    print("CopyAgent: Analyzing task and competitor data...")
    task = state.get("task", "")

    # Check if we need to gather competitor data first
    # In a full flow, if we lack context, we might generate a Plan to search Google.
    # For now, if the task explicitly mentions generating copy but we haven't executed a search,
    # we might optionally return a Plan to the orchestrator to fetch it first.

    memory_context = state.get("memory_context", "")

    # Generate the copy asset
    chain = create_copywriter_chain()

    # We pass the memory context as a placeholder for competitor data
    # In a real scenario, this would be extracted by the LAM and fed back
    result = await chain.ainvoke({"task": task, "competitor_data": memory_context})

    # We append the generated asset to the state.
    # We might want to add an 'agency_results' key to the state later.
    return {"copy_asset": result}
