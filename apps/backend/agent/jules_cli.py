import os
import asyncio
from fastapi import WebSocket


async def run_jules_command(command: str, websocket: WebSocket):
    # Security: basic validation
    if not command.startswith("jules"):
        await websocket.send_text("Error: Command must start with 'jules'")
        return

    # Prepare environment with the API key
    env = os.environ.copy()

    # We will use asyncio.create_subprocess_shell to capture output progressively
    try:
        process = await asyncio.create_subprocess_shell(
            command,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
            env=env,
        )

        async def read_stream(stream, ws: WebSocket, stream_type: str):
            while True:
                line = await stream.readline()
                if line:
                    await ws.send_json(
                        {"type": stream_type, "message": line.decode("utf-8")}
                    )
                else:
                    break

        await asyncio.gather(
            read_stream(process.stdout, websocket, "jules_output"),
            read_stream(process.stderr, websocket, "jules_error"),
        )

        await process.wait()
        await websocket.send_json(
            {"type": "jules_done", "exit_code": process.returncode}
        )

    except Exception as e:
        await websocket.send_json({"type": "jules_error", "message": str(e)})
