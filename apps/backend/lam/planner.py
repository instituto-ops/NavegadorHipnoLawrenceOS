import os
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser

# Intention Intelligence Protocol
# Converts high-level user commands into a structured DSL of atomic actions

class ActionParam(BaseModel):
    selector: Optional[str] = Field(default=None, description="CSS or XPath selector if applicable")
    text: Optional[str] = Field(default=None, description="Text to type, if applicable")
    url: Optional[str] = Field(default=None, description="URL to navigate to")
    duration: Optional[int] = Field(default=None, description="Time to wait in milliseconds")

class AtomicAction(BaseModel):
    action: str = Field(description="Action type: GO_TO, CLICK, FILL, WAIT, EXTRACT, SUMMARIZE")
    params: ActionParam = Field(description="Parameters for the action")
    description: str = Field(description="Reasoning for this action")

class Plan(BaseModel):
    actions: List[AtomicAction] = Field(description="Sequence of atomic actions to achieve the goal")

def create_planner_chain():
    # We use Llama 3 via Groq for planning
    # Provide a fallback if GROQ_API_KEY is not set (it should be in .env)
    api_key = os.environ.get("GROQ_API_KEY", "")
    llm = ChatGroq(temperature=0, model_name="llama3-70b-8192", api_key=api_key)

    parser = JsonOutputParser(pydantic_object=Plan)

    prompt = ChatPromptTemplate.from_messages([
        ("system", """You are the LAM (Large Action Model) Intention Intelligence Planner.
Your job is to break down a high-level user web browsing command into a sequence of atomic actions.
Available actions are:
- GO_TO: Navigate to a specific URL (params: url)
- CLICK: Click on an element (params: selector)
- FILL: Type text into an input field (params: selector, text)
- WAIT: Wait for a specific duration or condition (params: duration)
- EXTRACT: Extract text from an element or the whole page (params: selector)
- SUMMARIZE: Summarize the extracted content (params: text)

Provide CSS or XPath selectors based on common web structures if exact selectors are unknown,
but prioritize semantic HTML elements (e.g., 'input[type="search"]', 'button').

{format_instructions}"""),
        ("human", "{command}")
    ])

    prompt = prompt.partial(format_instructions=parser.get_format_instructions())

    chain = prompt | llm | parser
    return chain

async def generate_plan(command: str) -> Dict[str, Any]:
    """Generates a structured plan of atomic actions from a user command."""
    chain = create_planner_chain()
    plan = await chain.ainvoke({"command": command})
    return plan

if __name__ == "__main__":
    import asyncio
    # Simple test
    async def test():
        os.environ["GROQ_API_KEY"] = "dummy_key_for_test"
        chain = create_planner_chain()
        print("Planner chain created successfully.")

    asyncio.run(test())
