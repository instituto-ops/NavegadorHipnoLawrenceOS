import os
from typing import Any, Dict

from langchain_core.output_parsers import JsonOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_groq import ChatGroq
from pydantic import SecretStr

from .schemas import AdsAsset


def create_ads_analyzer_chain():
    api_key = os.environ.get("GROQ_API_KEY", "")
    llm = ChatGroq(
        temperature=0.2,
        model="llama-3.3-70b-versatile",
        api_key=SecretStr(api_key) if api_key else None,
    )
    parser = JsonOutputParser(pydantic_object=AdsAsset)

    prompt = ChatPromptTemplate.from_messages(
        [
            (
                "system",
                """You are an expert Performance Marketing and Google Ads Sub-Agent.
Your job is to analyze the marketing task and any provided metrics to suggest budget allocations,
target keywords, and specific campaign optimizations for a Hypnotherapy clinic.
Focus on high-intent, long-tail keywords relevant to adults seeking therapy.

{format_instructions}""",
            ),
            ("human", "Task: {task}\nMetrics Data: {metrics_data}"),
        ]
    )

    prompt = prompt.partial(format_instructions=parser.get_format_instructions())
    chain = prompt | llm | parser
    return chain


async def ads_agent_node(state: Dict[str, Any]) -> Dict[str, Any]:
    print("AdsAgent: Analyzing task and metrics...")
    task = state.get("task", "")

    # Check if we have metrics, otherwise we might request a plan
    memory_context = state.get("memory_context", "")

    # Generate the ads asset
    chain = create_ads_analyzer_chain()

    # We pass the memory context as a placeholder for metrics
    # In a real scenario, this would be extracted by the LAM and fed back
    result = await chain.ainvoke({"task": task, "metrics_data": memory_context})

    # We append the generated asset to the state.
    return {"ads_asset": result}
