#!/bin/bash
cd apps/backend

# Fix syntax errors by adding 'pass' to empty try blocks
sed -i 's/# from \.\.planner import Plan, generate_plan/pass/g' lam/agency/ads_agent.py
sed -i 's/# from \.\.planner import Plan, generate_plan/pass/g' lam/agency/copy_agent.py
sed -i 's/# from \.\.planner import Plan, generate_plan/pass/g' lam/agency/seo_agent.py

# Fix lam/agency/coordinator.py try block
cat << 'COORD_EOF' > lam/agency/coordinator.py
import json
import os
from typing import Any, Dict

from langchain_core.prompts import ChatPromptTemplate
from langchain_groq import ChatGroq
from pydantic import BaseModel, Field, SecretStr

# Import sub-agents
try:
    pass
except ImportError:
    pass

# We redefine or mock the nodes here if they fail to import cleanly in some environments.
# In a real setup, these are LangGraph nodes that take state and return state updates.

def ads_agent_mock_node(state: Dict[str, Any]) -> Dict[str, Any]:
    print("Ads Agent executing...")
    return {"messages": ["Ads generated."]}

def copy_agent_mock_node(state: Dict[str, Any]) -> Dict[str, Any]:
    print("Copy Agent executing...")
    return {"messages": ["Copy written."]}

def seo_agent_mock_node(state: Dict[str, Any]) -> Dict[str, Any]:
    print("SEO Agent executing...")
    return {"messages": ["SEO optimized."]}


class SupervisorResponse(BaseModel):
    next_agent: str = Field(description="Which agent to route to next: 'ads', 'copy', 'seo', or 'FINISH'")
    instructions: str = Field(description="Instructions for the agent")


def get_supervisor_chain():
    """Creates the supervisor routing logic."""
    llm = ChatGroq(
        model="llama-3.3-70b-versatile",
        api_key=SecretStr(os.getenv("GROQ_API_KEY", "")),
        temperature=0.1
    )

    prompt = ChatPromptTemplate.from_messages([
        ("system", """You are a marketing agency supervisor.
Your job is to route the client's request to the correct specialized agent.
Available agents:
- ads: for Google/Meta ads creation and management
- copy: for copywriting, social media posts, blog drafts
- seo: for keyword research, technical SEO, content strategy

If the goal is fully achieved, respond with 'FINISH'.
"""),
        ("user", "State: {state}")
    ])

    return prompt | llm.with_structured_output(SupervisorResponse)

# Note: The actual graph assembly (StateGraph) is typically done in the orchestrator
# or a main agency setup script. This file serves as the definition hub.
COORD_EOF
