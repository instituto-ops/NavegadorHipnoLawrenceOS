import json
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from browser_use import Agent, Browser, BrowserProfile
from fastapi import WebSocket, WebSocketDisconnect

load_dotenv()


async def run_agent(task: str, websocket: WebSocket):
    # Initialize the LLM (Groq Llama 3 70B)
    from langchain_core.language_models.chat_models import BaseChatModel
    from typing import cast

    llm = cast(BaseChatModel, ChatGroq(model="llama3-70b-8192", temperature=0.0))

    # Initialize Browser (headless=False)
    # The agent requires an asynchronous browser setup from browser-use
    browser = Browser(config=BrowserProfile(headless=False))  # type: ignore

    try:
        # We define a custom action/callback logic by wrapping the agent execution or
        # using the step generator. `browser-use` allows running steps iteratively.
        agent: Agent = Agent(task=task, llm=llm, browser=browser)

        await websocket.send_text(
            json.dumps({"type": "log", "message": f"Starting task: {task}"})
        )

        async def _on_step_end(agent_instance: Agent):
            try:
                # Try to extract the last thought or action
                action_text = "Processing step..."
                # Get the last history item if it exists
                history = getattr(agent_instance, "history", None)
                if history and hasattr(history, "history") and history.history:
                    last_step = history.history[-1]
                    if (
                        hasattr(last_step, "model_output")
                        and last_step.model_output
                        and hasattr(last_step.model_output, "current_state")
                    ):
                        thought = (
                            last_step.model_output.current_state.evaluation_previous_goal
                            or ""
                        )
                        next_goal = last_step.model_output.current_state.next_goal or ""
                        action_text = f"Thought: {thought} | Next: {next_goal}"
                    elif hasattr(last_step, "result"):
                        action_text = f"Result: {last_step.result}"

                # Send log
                await websocket.send_text(
                    json.dumps({"type": "log", "message": action_text})
                )

                # Try to extract screenshot
                if history and hasattr(history, "history") and history.history:
                    last_step = history.history[-1]
                    # browser-use history state typically holds screenshots
                    if (
                        hasattr(last_step, "state")
                        and hasattr(last_step.state, "screenshot")
                        and last_step.state.screenshot
                    ):
                        await websocket.send_text(
                            json.dumps(
                                {
                                    "type": "screenshot",
                                    "data": last_step.state.screenshot,
                                }
                            )
                        )

            except Exception as e:
                print(f"Error extracting step info during stream: {e}")

        # Execute using standard async execution with callbacks
        await agent.run(max_steps=10, on_step_end=_on_step_end)

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
