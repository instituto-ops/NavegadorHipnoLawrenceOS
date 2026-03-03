with open("apps/backend/main.py", "r") as f:
    content = f.read()

import re

# Update imports
content = content.replace("from agent.service import run_agent", "from lam.orchestrator import LamOrchestrator\nimport uuid")

# Update WebSocketMessage
msg_old = """class WebSocketMessage(BaseModel):
    type: str
    task: str | None = None
    command: str | None = None"""

msg_new = """class WebSocketMessage(BaseModel):
    type: str
    task: str | None = None
    command: str | None = None
    thread_id: str | None = None
    action: str | None = None # For HITL: approve, reject, edit
    plan: dict | None = None # For edited plan"""

content = content.replace(msg_old, msg_new)

# Replace the run_agent call with LamOrchestrator logic inside the websocket loop
# We need an orchestrator instance per connection or a global one. Let's make one per connection.
ws_old = """@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        # We listen for messages.
        while True:"""

ws_new = """@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    orchestrator = LamOrchestrator(headless=False)
    await orchestrator.setup()
    try:
        # We listen for messages.
        while True:"""

content = content.replace(ws_old, ws_new)

# Handle lam task and hitl_response
loop_old = """            if msg.type == "lam" and msg.task:
                # Run the agent in background so we don't block the loop completely
                # but for MVP, we'll await it to keep things simple and sequential
                await run_agent(task=msg.task, websocket=websocket)
            elif msg.type == "jules" and msg.command:"""

loop_new = """            if msg.type == "lam" and msg.task:
                # Generate a unique thread ID if not provided
                thread_id = msg.thread_id or str(uuid.uuid4())
                await websocket.send_text(json.dumps({"type": "log", "message": f"Starting task: {msg.task} (Thread: {thread_id})"}))

                config = {"configurable": {"thread_id": thread_id}}
                initial_state = {
                    "task": msg.task,
                    "plan": {},
                    "execution_results": [],
                    "status": "started",
                    "hitl_approved": False,
                    "summary": "",
                    "memory_context": "",
                }

                async for event in orchestrator.graph.astream(initial_state, config):
                    for node_name, state in event.items():
                        await websocket.send_text(json.dumps({"type": "log", "message": f"Node executed: {node_name}"}))

                # Check if it paused at Verification
                snapshot = await orchestrator.graph.aget_state(config)
                if snapshot.next and snapshot.next[0] == "Verification":
                    await websocket.send_text(json.dumps({"type": "log", "message": "HITL checkpoint reached. Waiting for human approval."}))
                    plan = snapshot.values.get("plan", {})
                    await websocket.send_text(json.dumps({
                        "type": "hitl_request",
                        "thread_id": thread_id,
                        "plan": plan
                    }))
                else:
                    await websocket.send_text(json.dumps({"type": "log", "message": "Task completed."}))
                    await websocket.send_text(json.dumps({"type": "done"}))

            elif msg.type == "hitl_response" and msg.thread_id:
                thread_id = msg.thread_id
                config = {"configurable": {"thread_id": thread_id}}

                snapshot = await orchestrator.graph.aget_state(config)
                if not snapshot.next or snapshot.next[0] != "Verification":
                    await websocket.send_text(json.dumps({"type": "error", "message": "No active HITL checkpoint for this thread."}))
                    continue

                if msg.action == "approve":
                    await websocket.send_text(json.dumps({"type": "log", "message": "Plan approved by user. Resuming..."}))
                    # Update state to approved
                    await orchestrator.graph.aupdate_state(config, {"hitl_approved": True})

                    async for event in orchestrator.graph.astream(None, config):
                        for node_name, state in event.items():
                            await websocket.send_text(json.dumps({"type": "log", "message": f"Node executed: {node_name}"}))

                    await websocket.send_text(json.dumps({"type": "log", "message": "Task completed."}))
                    await websocket.send_text(json.dumps({"type": "done"}))

                elif msg.action == "edit" and msg.plan:
                    await websocket.send_text(json.dumps({"type": "log", "message": "Plan edited by user. Resuming..."}))
                    # Update state with new plan and approved
                    await orchestrator.graph.aupdate_state(config, {"plan": msg.plan, "hitl_approved": True})

                    async for event in orchestrator.graph.astream(None, config):
                        for node_name, state in event.items():
                            await websocket.send_text(json.dumps({"type": "log", "message": f"Node executed: {node_name}"}))

                    await websocket.send_text(json.dumps({"type": "log", "message": "Task completed."}))
                    await websocket.send_text(json.dumps({"type": "done"}))

                elif msg.action == "reject" or msg.action == "cancel":
                    await websocket.send_text(json.dumps({"type": "log", "message": "Plan rejected by user. Aborting."}))
                    await orchestrator.graph.aupdate_state(config, {"hitl_approved": False})

                    async for event in orchestrator.graph.astream(None, config):
                        for node_name, state in event.items():
                            await websocket.send_text(json.dumps({"type": "log", "message": f"Node executed: {node_name}"}))

                    await websocket.send_text(json.dumps({"type": "log", "message": "Task aborted."}))
                    await websocket.send_text(json.dumps({"type": "done"}))

            elif msg.type == "jules" and msg.command:"""

content = content.replace(loop_old, loop_new)

# Handle connection closing
cleanup_old = """    except WebSocketDisconnect:
        print("Client disconnected gracefully.")"""

cleanup_new = """    except WebSocketDisconnect:
        print("Client disconnected gracefully.")
        await orchestrator.close()"""

content = content.replace(cleanup_old, cleanup_new)

with open("apps/backend/main.py", "w") as f:
    f.write(content)
