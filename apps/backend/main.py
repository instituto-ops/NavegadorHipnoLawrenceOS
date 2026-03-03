from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from agent.service import run_agent
from agent.jules_cli import run_jules_command
import json

app = FastAPI(title="NeuroStrategy OS Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health_check():
    return {"status": "ok"}


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        # We listen for messages.
        while True:
            data_str = await websocket.receive_text()
            try:
                data = json.loads(data_str)
            except json.JSONDecodeError:
                # Fallback to simple text for LAM if needed, but let's assume JSON now.
                data = {"type": "lam", "task": data_str}

            if data.get("type") == "lam":
                task = data.get("task")
                if task:
                    # Run the agent in background so we don't block the loop completely
                    # but for MVP, we'll await it to keep things simple and sequential
                    await run_agent(task=task, websocket=websocket)
            elif data.get("type") == "jules":
                command = data.get("command")
                if command:
                    await run_jules_command(command=command, websocket=websocket)
            else:
                await websocket.send_text(
                    json.dumps({"type": "error", "message": "Unknown task type"})
                )

    except WebSocketDisconnect:
        print("Client disconnected gracefully.")
    except Exception as e:
        print(f"Error in websocket connection: {e}")
        try:
            await websocket.close()
        except Exception:
            pass


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
