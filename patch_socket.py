with open("apps/frontend/src/hooks/useAgentSocket.ts", "r") as f:
    content = f.read()

import re

# Update AgentMessage type
msg_old = """export interface AgentMessage {
  type:
    | "log"
    | "screenshot"
    | "done"
    | "error"
    | "jules_output"
    | "jules_error"
    | "jules_done";
  message?: string;
  data?: string; // base64 screenshot data
  exit_code?: number;
}"""

msg_new = """export interface AgentMessage {
  type:
    | "log"
    | "screenshot"
    | "done"
    | "error"
    | "jules_output"
    | "jules_error"
    | "jules_done"
    | "hitl_request";
  message?: string;
  data?: string; // base64 screenshot data
  exit_code?: number;
  thread_id?: string;
  plan?: any;
}"""

content = content.replace(msg_old, msg_new)

# Update state variables
state_old = """  const [logs, setLogs] = useState<string[]>([]);
  const [julesLogs, setJulesLogs] = useState<string[]>([]);
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isJulesRunning, setIsJulesRunning] = useState(false);"""

state_new = """  const [logs, setLogs] = useState<string[]>([]);
  const [julesLogs, setJulesLogs] = useState<string[]>([]);
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isJulesRunning, setIsJulesRunning] = useState(false);
  const [hitlRequest, setHitlRequest] = useState<{thread_id: string, plan: any} | null>(null);"""

content = content.replace(state_old, state_new)

# Handle message
handle_old = """        } else if (data.type === "jules_done") {
          setJulesLogs((prev) => [
            ...prev,
            `[PROCESS EXITED WITH CODE ${data.exit_code}]`,
          ]);
          setIsJulesRunning(false);
        }"""

handle_new = """        } else if (data.type === "jules_done") {
          setJulesLogs((prev) => [
            ...prev,
            `[PROCESS EXITED WITH CODE ${data.exit_code}]`,
          ]);
          setIsJulesRunning(false);
        } else if (data.type === "hitl_request" && data.thread_id && data.plan) {
          setHitlRequest({ thread_id: data.thread_id, plan: data.plan });
        }"""

content = content.replace(handle_old, handle_new)

# Add hitl_response function
func_old = """  const sendPanicStop = useCallback(() => {
    if (ws.current && isConnected) {
      ws.current.send(JSON.stringify({ type: "panic_stop" }));
    }
  }, [isConnected]);"""

func_new = """  const sendPanicStop = useCallback(() => {
    if (ws.current && isConnected) {
      ws.current.send(JSON.stringify({ type: "panic_stop" }));
    }
  }, [isConnected]);

  const sendHitlResponse = useCallback((thread_id: string, action: "approve" | "reject" | "edit", plan?: any) => {
    if (ws.current && isConnected) {
      ws.current.send(JSON.stringify({
        type: "hitl_response",
        thread_id,
        action,
        plan
      }));
      setHitlRequest(null);
    }
  }, [isConnected]);"""

content = content.replace(func_old, func_new)

# Return hitl
ret_old = """    isJulesRunning,
    sendTask,
    sendJulesCommand,
    sendPanicStop,
  };
}"""

ret_new = """    isJulesRunning,
    hitlRequest,
    sendTask,
    sendJulesCommand,
    sendPanicStop,
    sendHitlResponse,
  };
}"""

content = content.replace(ret_old, ret_new)

with open("apps/frontend/src/hooks/useAgentSocket.ts", "w") as f:
    f.write(content)
