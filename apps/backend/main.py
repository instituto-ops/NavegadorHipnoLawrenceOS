from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from agent.service import run_agent
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
                data_dict = json.loads(data_str)
                msg = WebSocketMessage(**data_dict)
            except json.JSONDecodeError:
                # Fallback to simple text for LAM if needed, but let's assume JSON now.
                msg = WebSocketMessage(type="lam", task=data_str)
            except ValueError as e:
                await websocket.send_text(
                    json.dumps(
                        {"type": "error", "message": f"Invalid message format: {e}"}
                    )
                )
                continue

            if msg.type == "lam" and msg.task:
                # Run the agent in background so we don't block the loop completely
                # but for MVP, we'll await it to keep things simple and sequential
                await run_agent(task=msg.task, websocket=websocket)
            elif msg.type == "jules" and msg.command:
                # Run jules command in the background to avoid blocking the main API loop
                request = JulesRequest(command=msg.command)
                asyncio.create_task(
                    run_jules_command(request=request, websocket=websocket)
                )
            else:
                await websocket.send_text(
                    json.dumps(
                        {
                            "type": "error",
                            "message": "Unknown task type or missing payload",
                        }
                    )
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
