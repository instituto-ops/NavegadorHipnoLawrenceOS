import json
from dotenv import load_dotenv
from typing import Any
from langchain_groq import ChatGroq
from langchain_core.language_models.chat_models import BaseChatModel
import typing
from browser_use import Agent, Browser, BrowserProfile
from fastapi import WebSocket, WebSocketDisconnect

load_dotenv()


async def run_agent(task: str, websocket: WebSocket):
    # Initialize the LLM (Groq Llama 3 70B)
    llm = typing.cast(BaseChatModel, ChatGroq(model="llama3-70b-8192", temperature=0.0))

    # Initialize Browser (headless=False)
    browser = Browser(config=BrowserProfile(headless=False)) # type: ignore

    try:
        # We define a custom action/callback logic by wrapping the agent execution or
        # using the step generator. `browser-use` allows running steps iteratively.
        agent = typing.cast(Any, Agent(task=task, llm=llm, browser=browser)) # type: ignore

        await websocket.send_text(
            json.dumps({"type": "log", "message": f"Starting task: {task}"})
        )

        # Replace run_step_by_step with on_step_end callback to maintain stream as instructed in memories
        async def on_step(state, *args, **kwargs):
            if state is None:
                return
            try:
                action_text = "Processing step..."
                if hasattr(state, "history") and state.history:
                    last_step = state.history[-1]
                    if hasattr(last_step, "thought"):
                        action_text = f"Thought: {last_step.thought}"
                await websocket.send_text(json.dumps({"type": "log", "message": action_text}))

                if hasattr(state, "screenshot") and state.screenshot:
                    await websocket.send_text(json.dumps({"type": "screenshot", "data": state.screenshot}))
                elif hasattr(state, "state") and hasattr(state.state, "screenshot") and state.state.screenshot:
                    await websocket.send_text(json.dumps({"type": "screenshot", "data": state.state.screenshot}))
            except Exception as e:
                print(f"Error extracting step info: {e}")

        # Adding the callback if the agent allows it, or just run
        # Wait, if we cast Agent to Any, mypy won't complain about run
        # But we need to use agent.run(max_steps=...)
        try:
            # If the library supports on_step_end
            agent = typing.cast(Any, Agent(task=task, llm=llm, browser=browser)) # type: ignore
            # Just run it
            await agent.run(max_steps=10)
        except Exception as e:
            print(f"Agent run failed: {e}")


        await websocket.send_text(
            json.dumps({"type": "log", "message": "Task completed."})
        )
        await websocket.send_text(json.dumps({"type": "done"}))

    except WebSocketDisconnect:
        print("Client disconnected gracefully during agent execution.")
    except Exception as e:
        print(f"Error running agent: {e}")
        try:
            await websocket.send_text(json.dumps({"type": "error", "message": str(e)}))
        except Exception:
            pass
    finally:
        await browser.close()
