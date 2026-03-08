import json
import asyncio
from dotenv import load_dotenv
from typing import Any
from langchain_groq import ChatGroq
from browser_use import Agent, Browser, BrowserProfile
from fastapi import WebSocket, WebSocketDisconnect

load_dotenv()


async def run_agent(task: str, websocket: WebSocket):
    # Initialize the LLM (Groq Llama 3 70B)
    llm = ChatGroq(model="llama3-70b-8192", temperature=0.0)

    # Initialize Browser (headless=False)
    browser = Browser(config=BrowserProfile(headless=False))  # type: ignore

    try:
        # We define a custom action/callback logic by wrapping the agent execution or
        # using the step generator. `browser-use` allows running steps iteratively.
        agent: Any = Agent(task=task, llm=llm, browser=browser)  # type: ignore

        await websocket.send_text(
            json.dumps({"type": "log", "message": f"Starting task: {task}"})
        )

        # In browser-use, we can step through the agent's execution
        async for state in agent.run_step_by_step():
            if state is None:
                continue

            # Assuming the state contains the step's thought or action
            # We construct a log message
            try:
                # This depends on browser-use's exact state structure.
                # Usually it has actions, memory, and a screenshot.

                # Try to extract the last thought or action
                action_text = "Processing step..."
                if hasattr(state, "history") and state.history:
                    last_step = state.history[-1]
                    if hasattr(last_step, "thought"):
                        action_text = f"Thought: {last_step.thought}"

                # Send log
                await websocket.send_text(
                    json.dumps({"type": "log", "message": action_text})
                )

                # Try to send screenshot if available
                # Usually state has a base64 encoded screenshot or we can get it from the browser state
                if hasattr(state, "screenshot") and state.screenshot:
                    await websocket.send_text(
                        json.dumps({"type": "screenshot", "data": state.screenshot})
                    )
                elif (
                    hasattr(state, "state")
                    and hasattr(state.state, "screenshot")
                    and state.state.screenshot
                ):
                    await websocket.send_text(
                        json.dumps(
                            {"type": "screenshot", "data": state.state.screenshot}
                        )
                    )

            except Exception as e:
                print(f"Error extracting step info: {e}")

            await asyncio.sleep(0.5)  # Slight delay to not overwhelm websocket

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
