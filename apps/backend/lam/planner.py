from pydantic import SecretStr
import os
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser

# Intention Intelligence Protocol
# Converts high-level user commands into a structured DSL of atomic actions


class ActionParam(BaseModel):
    selector: Optional[str] = Field(
        default=None, description="CSS or XPath selector if applicable"
    )
    text: Optional[str] = Field(default=None, description="Text to type, if applicable")
    url: Optional[str] = Field(default=None, description="URL to navigate to")
    duration: Optional[int] = Field(
        default=None, description="Time to wait in milliseconds"
    )
    title: Optional[str] = Field(default=None, description="Title for WP_DRAFT_POST")
    content: Optional[str] = Field(default=None, description="Content for WP_DRAFT_POST")


class AtomicAction(BaseModel):
    action: str = Field(
        description="Action type: GO_TO, CLICK, FILL, WAIT, EXTRACT, SUMMARIZE, DOCTORALIA_SCRAPE, ADS_READ_CAMPAIGNS, WP_DRAFT_POST"
    )
    params: ActionParam = Field(description="Parameters for the action")
    description: str = Field(description="Reasoning for this action")


class Plan(BaseModel):
    actions: List[AtomicAction] = Field(
        description="Sequence of atomic actions to achieve the goal"
    )
    requires_hitl: bool = Field(
        default=False,
        description="Must be True if ANY action in the plan involves financial spending, publishing posts, or sending public messages."
    )



def create_planner_chain(model_name: str = "llama-3.3-70b-versatile"):
    # We use Llama 3 via Groq for planning
    api_key = os.environ.get("GROQ_API_KEY", "")
    if not api_key:
        # Fallback to OpenRouter if Groq key is missing
        api_key = os.environ.get("OPENROUTER_API_KEY", "")
        from langchain_openai import ChatOpenAI
        llm = ChatOpenAI(
            model="google/gemini-2.0-flash-001", # High performance free-ish model on OpenRouter
            api_key=SecretStr(api_key) if api_key else None,
            base_url="https://openrouter.ai/api/v1"
        )
    else:
        llm = ChatGroq(temperature=0, model=model_name, api_key=SecretStr(api_key))

    parser = JsonOutputParser(pydantic_object=Plan)

    prompt = ChatPromptTemplate.from_messages(
        [
            (
                "system",
                """You are the LAM (Large Action Model) Intention Intelligence Planner.
Your job is to break down a high-level user web browsing command into a sequence of atomic actions.
Available actions are:
- GO_TO: Navigate to a specific URL (params: url)
- CLICK: Click on an element (params: selector)
- FILL: Type text into an input field (params: selector, text)
- WAIT: Wait for a specific duration or condition (params: duration)
- EXTRACT: Extract text from an element or the whole page (params: selector)
- SUMMARIZE: Summarize the extracted content (params: text)
- DOCTORALIA_SCRAPE: Navigate and scrape a Doctoralia profile (params: url)
- ADS_READ_CAMPAIGNS: Extract campaigns from Google Ads (params: url)
- WP_DRAFT_POST: Draft a WordPress post securely (params: url, title, content)

NAVIGATION INTELLIGENCE:
- DO NOT guess complex URLs with many query parameters (like specific Google Ads campaign IDs). 
- If a user asks for a specific campaign or data point deep within a dashboard like Google Ads or Facebook, the safer plan is to:
  1. GO_TO the main dashboard URL (e.g., https://ads.google.com).
  2. SEARCH by clicking the search icon and filling the campaign name.
  3. CLICK the correct campaign from the results.
- For deep target navigation inside Google Ads, look for these specific sections in the navigation menus: Visão geral, Recomendações, Insights, Informações do leilão, Termos de pesquisa, Performance do canal, Páginas de destino, Campanhas, Grupos de anúncios, Anúncios, Palavras-chave, Públicos-alvo, Locais, Programação de anúncios, Histórico de alterações.
- Use the current PAGE CONTEXT (Accessibility Tree) to find the correct links or search them.
- CRITICAL: Check the 'isVisible' and 'readOnly' attributes in the context. If an element says 'readOnly: true', DO NOT try to FILL it. Instead, look for a sibling button or icon (like a search icon) that might activate the field.
- Always wait for elements to load before clicking.

STRICT CLINICAL AND ETHICAL GUARDRAILS (CFM COMPLIANCE):
- You must evaluate if the plan involves ANY sensitive operations, defined as:
  1. Financials: changing budgets, bidding, or Google Ads settings.
  2. Publishing: creating, drafting, or publishing blog posts (e.g., WordPress), or social media content.
  3. Public Messaging: replying to reviews (e.g., Doctoralia) or sending direct messages.
- If the plan involves ANY of these sensitive operations, you MUST set `requires_hitl` to true.
- Do not promise guaranteed cures or outcomes in any proposed text, adhering strictly to CFM (Conselho Federal de Medicina) guidelines.

{format_instructions}""",
            ),
            ("human", "{command}"),
        ]
    )

    prompt = prompt.partial(format_instructions=parser.get_format_instructions())

    chain = prompt | llm | parser
    return chain


async def generate_plan(command: str, page_context: str = "No page loaded.") -> Dict[str, Any]:
    """Generates a structured plan of atomic actions from a user command and current page state."""
    # We enrich the human prompt with current page context if available
    enriched_command = f"Goal: {command}\n\nCurrent Browser State (Accessibility Tree): {page_context}"

    try:
        # Try with the high-end model first (Llama 3.3 70B)
        chain = create_planner_chain(model_name="llama-3.3-70b-versatile")
        return await chain.ainvoke({"command": enriched_command})
    except Exception as e:
        error_msg = str(e)
        if "rate_limit_exceeded" in error_msg.lower() or "429" in error_msg:
            print("Planner: High-end model rate limited. Falling back to Llama 3.1 8B...")
            try:
                # Fallback to the lighter, high-quota model
                chain = create_planner_chain(model_name="llama-3.1-8b-instant")
                return await chain.ainvoke({"command": enriched_command})
            except Exception as e2:
                print("Planner: Fallback model also failed: {e2}")
                raise e2
        else:
            print(f"Planner error: {e}")
            raise e


if __name__ == "__main__":
    import asyncio

    # Simple test
    async def test():
        os.environ["GROQ_API_KEY"] = "dummy_key_for_test"
        create_planner_chain()
        print("Planner chain created successfully.")

    asyncio.run(test())
