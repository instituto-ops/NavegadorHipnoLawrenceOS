import os
from typing import Any, Dict

from langchain_core.output_parsers import JsonOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_groq import ChatGroq
from pydantic import SecretStr

from .schemas import SEOAsset

# Ensure we use Pydantic models correctly for Intention Intelligence Protocol
import typing

if typing.TYPE_CHECKING:
    pass
else:
    try:
        pass
    except ImportError:
        pass


def create_seo_planner_chain():
    api_key = os.environ.get("GROQ_API_KEY", "")
    llm = ChatGroq(
        temperature=0.3,
        model="llama-3.3-70b-versatile",
        api_key=SecretStr(api_key) if api_key else None,
    )
    parser = JsonOutputParser(pydantic_object=SEOAsset)

    prompt = ChatPromptTemplate.from_messages(
        [
            (
                "system",
                """You are an expert SEO and Landing Page Planner Sub-Agent.
Your job is to architect a high-converting landing page structure, including the H1 tag, meta title, and description,
optimized for a Hypnotherapy clinic serving adults. The content outline must guide users seamlessly towards scheduling a consultation.

{format_instructions}""",
            ),
            ("human", "Task: {task}\nCompetitor Analysis: {competitor_analysis}"),
        ]
    )

    prompt = prompt.partial(format_instructions=parser.get_format_instructions())
    chain = prompt | llm | parser
    return chain


async def seo_agent_node(state: Dict[str, Any]) -> Dict[str, Any]:
    print("SEOAgent: Architecting landing page...")
    task = state.get("task", "")

    # Generate the SEO asset
    memory_context = state.get("memory_context", "")
    chain = create_seo_planner_chain()

    # We pass the memory context as a placeholder for competitor analysis
    result = await chain.ainvoke({"task": task, "competitor_analysis": memory_context})

    # We append the generated asset to the state.
    return {"seo_asset": result}
