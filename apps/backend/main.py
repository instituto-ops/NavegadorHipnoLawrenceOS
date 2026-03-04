from typing import Any
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from lam.orchestrator import LamOrchestrator
import uuid
from agent.jules_cli import run_jules_command, JulesRequest
from pydantic import BaseModel
import asyncio
import json

app = FastAPI(title="NeuroStrategy OS Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class WebSocketMessage(BaseModel):
    type: str
    task: str | None = None
    command: str | None = None
    thread_id: str | None = None
    action: str | None = None  # For HITL: approve, reject, edit
    plan: dict | None = None  # For edited plan


@app.get("/health")
async def health_check():
    return {"status": "ok"}


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    orchestrator = LamOrchestrator(headless=False)
    await orchestrator.setup()

    current_task: asyncio.Task | None = None

    async def process_lam_stream(initial_state, config, thread_id):
        try:
            async for event in orchestrator.graph.astream(initial_state, config):
                for node_name, state in event.items():
                    await websocket.send_text(
                        json.dumps(
                            {"type": "log", "message": f"Node executed: {node_name}"}
                        )
                    )
                    # Forward screenshot if present in state update
                    if "last_screenshot" in state and state["last_screenshot"]:
                        await websocket.send_text(
                            json.dumps(
                                {"type": "screenshot", "data": state["last_screenshot"]}
                            )
                        )

            # Check for HITL
            snapshot = await orchestrator.graph.aget_state(config)
            if snapshot.next and snapshot.next[0] == "Verification":
                await websocket.send_text(
                    json.dumps(
                        {
                            "type": "log",
                            "message": "HITL checkpoint reached. Waiting for human approval.",
                        }
                    )
                )
                plan = snapshot.values.get("plan", {})
                # Also send the last screenshot with the HITL request if available
                last_shot = snapshot.values.get("last_screenshot")
                if last_shot:
                    await websocket.send_text(
                        json.dumps({"type": "screenshot", "data": last_shot})
                    )

                await websocket.send_text(
                    json.dumps(
                        {"type": "hitl_request", "thread_id": thread_id, "plan": plan}
                    )
                )
            else:
                await websocket.send_text(
                    json.dumps({"type": "log", "message": "Task completed."})
                )
                await websocket.send_text(json.dumps({"type": "done"}))
        except asyncio.CancelledError:
            await websocket.send_text(
                json.dumps(
                    {"type": "log", "message": "Task forcefully stopped by user."}
                )
            )
            await websocket.send_text(json.dumps({"type": "done"}))
        except Exception as e:
            await websocket.send_text(json.dumps({"type": "error", "message": str(e)}))
            await websocket.send_text(json.dumps({"type": "done"}))

    try:
        while True:
            data_str = await websocket.receive_text()
            try:
                data_dict = json.loads(data_str)
                msg = WebSocketMessage(**data_dict)
            except Exception:
                msg = WebSocketMessage(type="lam", task=data_str)

            if msg.type == "lam" and msg.task:
                if current_task and not current_task.done():
                    await websocket.send_text(
                        json.dumps(
                            {
                                "type": "log",
                                "message": "A task is already running. Please stop it first.",
                            }
                        )
                    )
                    continue

                thread_id = msg.thread_id or str(uuid.uuid4())
                await websocket.send_text(
                    json.dumps(
                        {
                            "type": "log",
                            "message": f"Starting task: {msg.task} (Thread: {thread_id})",
                        }
                    )
                )

                config: Any = {"configurable": {"thread_id": thread_id}}
                initial_state: Any = {
                    "task": msg.task,
                    "plan": {},
                    "execution_results": [],
                    "status": "started",
                    "hitl_approved": False,
                    "summary": "",
                    "memory_context": "",
                    "last_screenshot": None,
                }
                current_task = asyncio.create_task(
                    process_lam_stream(initial_state, config, thread_id)
                )

            elif msg.type == "panic_stop":
                if current_task and not current_task.done():
                    current_task.cancel()
                    await websocket.send_text(
                        json.dumps(
                            {"type": "log", "message": "Stopping all operations..."}
                        )
                    )
                    # Force close playwright if hanging
                    try:
                        await orchestrator.executor.close()
                    except:
                        pass
                else:
                    await websocket.send_text(
                        json.dumps(
                            {"type": "log", "message": "No active task to stop."}
                        )
                    )

            elif msg.type == "hitl_response" and msg.thread_id:
                thread_id = msg.thread_id
                hitl_config: Any = {"configurable": {"thread_id": thread_id}}

                if msg.action == "approve":
                    await websocket.send_text(
                        json.dumps(
                            {"type": "log", "message": "Plan approved. Resuming..."}
                        )
                    )
                    await orchestrator.graph.aupdate_state(
                        hitl_config, {"hitl_approved": True}
                    )
                    current_task = asyncio.create_task(
                        process_lam_stream(None, hitl_config, thread_id)
                    )
                elif msg.action == "edit":
                    await websocket.send_text(
                        json.dumps(
                            {"type": "log", "message": "Plan edited. Resuming..."}
                        )
                    )
                    await orchestrator.graph.aupdate_state(
                        hitl_config, {"plan": msg.plan, "hitl_approved": True}
                    )
                    current_task = asyncio.create_task(
                        process_lam_stream(None, hitl_config, thread_id)
                    )
                elif msg.action in ["reject", "cancel"]:
                    await websocket.send_text(
                        json.dumps({"type": "log", "message": "Task aborted."})
                    )
                    await orchestrator.graph.aupdate_state(
                        hitl_config, {"hitl_approved": False}
                    )
                    current_task = asyncio.create_task(
                        process_lam_stream(None, hitl_config, thread_id)
                    )

            elif msg.type == "jules" and msg.command:
                request = JulesRequest(command=msg.command)
                asyncio.create_task(
                    run_jules_command(request=request, websocket=websocket)
                )

    except WebSocketDisconnect:
        if current_task:
            current_task.cancel()
        await orchestrator.close()
    except Exception as e:
        print(f"WS Error: {e}")
        if current_task:
            current_task.cancel()
        await orchestrator.close()


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
