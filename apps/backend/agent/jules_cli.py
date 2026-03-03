import subprocess
import os
import shlex
import asyncio
from fastapi import WebSocket
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

class JulesRequest(BaseModel):
    command: str

class JulesResponse(BaseModel):
    type: str
    message: str | None = None
    exit_code: int | None = None

async def run_jules_command(request: JulesRequest, websocket: WebSocket):
    command = request.command

    # Security: basic validation
    if not command.startswith("jules"):
        await websocket.send_json(JulesResponse(type="jules_error", message="Error: Command must start with 'jules'").model_dump())
        return

    # Parse the command safely using shlex to avoid command injection
    try:
        args = shlex.split(command)
    except ValueError as e:
         await websocket.send_json(JulesResponse(type="jules_error", message=f"Error parsing command: {e}").model_dump())
         return

    # Ensure the first argument is indeed 'jules'
    if not args or args[0] != "jules":
         await websocket.send_json(JulesResponse(type="jules_error", message="Error: Invalid command format").model_dump())
         return

    # Prepare environment with the API key
    env = os.environ.copy()
    jules_api_key = os.getenv("JULES_API_KEY")
    if jules_api_key:
        env["JULES_API_KEY"] = jules_api_key

    # We use asyncio.create_subprocess_exec to avoid shell injection vulnerabilities
    try:
        process = await asyncio.create_subprocess_exec(
            *args,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
            env=env
        )

        async def read_stream(stream: asyncio.StreamReader, ws: WebSocket, stream_type: str):
            while True:
                line = await stream.readline()
                if line:
                    await ws.send_json(JulesResponse(type=stream_type, message=line.decode('utf-8')).model_dump())
                else:
                    break

        if process.stdout and process.stderr:
            await asyncio.gather(
                read_stream(process.stdout, websocket, "jules_output"),
                read_stream(process.stderr, websocket, "jules_error")
            )

        await process.wait()
        await websocket.send_json(JulesResponse(type="jules_done", exit_code=process.returncode).model_dump())

    except FileNotFoundError:
        # Expected if the 'jules' binary is not actually installed in this environment
        await websocket.send_json(JulesResponse(type="jules_error", message="Error: jules executable not found").model_dump())
        await websocket.send_json(JulesResponse(type="jules_done", exit_code=127).model_dump())
    except Exception as e:
        await websocket.send_json(JulesResponse(type="jules_error", message=str(e)).model_dump())
