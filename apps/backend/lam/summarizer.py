from pydantic import SecretStr
import json
import uuid
import os
from typing import List, Any
from datetime import datetime, timezone

from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser

from pydantic import BaseModel, Field

# Ensure correct imports assuming run context
try:
    from lam.neuro_engine import IntelligenceSource, NeuroInsight, InsightCategory
    from database.vector_db import ltm_db
except ImportError:
    from .neuro_engine import IntelligenceSource, NeuroInsight, InsightCategory
    from database.vector_db import ltm_db

class SummarizerOutput(BaseModel):
    category: InsightCategory = Field(..., description="Category: Priority, Risk, Opportunity, or Trend")
    title: str = Field(..., description="Short descriptive title of the insight")
    description: str = Field(..., description="Detailed explanation of the insight")
    actionable_items: List[str] = Field(default_factory=list, description="Suggested actions")
    confidence_score: float = Field(..., ge=0.0, le=1.0, description="Confidence score from 0.0 to 1.0")

def create_summarizer_chain():
    # Provide fallback if GROQ_API_KEY not set
    api_key = os.environ.get("GROQ_API_KEY", "")
    llm = ChatGroq(temperature=0.2, model="llama-3.3-70b-versatile", api_key=SecretStr(api_key) if api_key else None)

    parser = JsonOutputParser(pydantic_object=SummarizerOutput)

    prompt = ChatPromptTemplate.from_messages([
        ("system", """You are the NeuroEngine Summarizer. Your goal is to convert raw execution logs, extracted text, and metrics into a highly structured NeuroInsight.
Analyze the provided raw data (which may include extracted Doctoralia reviews, Google Ads metrics, etc).
Categorize the insight as Priority, Risk, Opportunity, or Trend.
If dealing with specific platforms, generate highly specific titles (e.g. "Doctoralia Reputation Risk Insight", "Ads Keyword Opportunity Insight").

{format_instructions}"""),
        ("human", "Here is the raw data from the LAM execution:\n{raw_data}")
    ])

    prompt = prompt.partial(format_instructions=parser.get_format_instructions())

    return prompt | llm | parser

async def process_execution_results(results: List[Any], task_description: str) -> List[NeuroInsight]:
    """
    Takes raw execution results from Executor and converts them into structured NeuroInsights.
    Gracefully handles non-dictionary/malformed items to prevent AttributeError crashes.
    """

    # 1. Clean and normalize raw data
    cleaned_results = []
    for item in results:
        if isinstance(item, dict):
            cleaned_results.append(item)
        elif isinstance(item, str):
            cleaned_results.append({"text": item})
        else:
            try:
                # Attempt to convert to string if it's some object
                cleaned_results.append({"raw_str": str(item)})
            except Exception:
                pass

    raw_data_str = json.dumps(cleaned_results, indent=2)

    # Create the source record
    source_id = str(uuid.uuid4())
    source = IntelligenceSource(
        id=source_id,
        type="execution_log",
        origin="lam_executor",
        timestamp=datetime.now(timezone.utc),
        freshness=1.0,
        reliability=0.9,
        raw_data={"task": task_description, "results": cleaned_results}
    )

    # 2. Invoke LLM to generate the summarized output
    try:
        chain = create_summarizer_chain()
        # Ensure we await the LLM call properly. The chain is async if we use ainvoke
        llm_response = await chain.ainvoke({"raw_data": raw_data_str})

        # 3. Structure into NeuroInsight
        insight = NeuroInsight(
            id=str(uuid.uuid4()),
            source_id=source.id,
            category=llm_response.get("category", InsightCategory.OPPORTUNITY),
            title=llm_response.get("title", "Execution Insight"),
            description=llm_response.get("description", "No detailed description generated."),
            actionable_items=llm_response.get("actionable_items", []),
            confidence_score=llm_response.get("confidence_score", 0.5),
            created_at=datetime.now(timezone.utc)
        )

        # 4. Persist to LTM
        try:
            await ltm_db.store_insight(insight)
            print(f"Successfully saved NeuroInsight {insight.id} to LTM.")
        except Exception as e:
            print(f"Error persisting insight to LTM: {e}")

        return [insight]

    except Exception as e:
        print(f"Error generating summarizer output via LLM: {e}")
        # Return a fallback insight if LLM fails
        fallback_insight = NeuroInsight(
            id=str(uuid.uuid4()),
            source_id=source.id,
            category=InsightCategory.TREND,
            title=f"Task: {task_description[:30]}...",
            description="Failed to generate detailed insight due to LLM error. Raw data preserved in source.",
            actionable_items=[],
            confidence_score=0.1,
            created_at=datetime.now(timezone.utc)
        )
        try:
            await ltm_db.store_insight(fallback_insight)
        except Exception:
            pass

        return [fallback_insight]

if __name__ == "__main__":
    import asyncio

    async def test():
        os.environ["GROQ_API_KEY"] = "dummy_key_for_test"

        mock_results = [
            "Navigated to https://doctoralia.com/dr-john-doe",
            "Extracted 3 reviews: 'Great doctor, highly recommend!', 'Long wait time', 'Very attentive'",
            {"status": "success", "element": "button#contact"}
        ]

        print("Testing process_execution_results...")
        insights = await process_execution_results(mock_results, "Analyze recent reviews")
        for i in insights:
            print(f"Generated Insight: {i.category} - {i.title}")
            print(f"Desc: {i.description}")
            print(f"Actions: {i.actionable_items}")

    asyncio.run(test())
