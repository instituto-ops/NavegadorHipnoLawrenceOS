import { useState, useEffect, useRef, useCallback } from "react";

export interface AgentMessage {
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
  plan?: unknown;
}

export function useAgentSocket(url: string) {
  const [logs, setLogs] = useState<string[]>([]);
  const [julesLogs, setJulesLogs] = useState<string[]>([]);
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isJulesRunning, setIsJulesRunning] = useState(false);
  const [hitlRequest, setHitlRequest] = useState<{thread_id: string, plan: unknown} | null>(null);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket(url);

    ws.current.onopen = () => {
      setIsConnected(true);
    };

    ws.current.onmessage = (event) => {
      try {
        const data: AgentMessage = JSON.parse(event.data);
        if (data.type === "log" && data.message) {
          setLogs((prev) => [...prev, data.message!]);
        } else if (data.type === "screenshot" && data.data) {
          setScreenshot(`data:image/jpeg;base64,${data.data}`);
        } else if (data.type === "done") {
          setIsRunning(false);
        } else if (data.type === "error" && data.message) {
          setLogs((prev) => [...prev, `[ERROR] ${data.message}`]);
          setIsRunning(false);
        } else if (data.type === "jules_output" && data.message) {
          setJulesLogs((prev) => [...prev, data.message!]);
        } else if (data.type === "jules_error" && data.message) {
          setJulesLogs((prev) => [...prev, `[ERROR] ${data.message}`]);
          setIsJulesRunning(false);
        } else if (data.type === "jules_done") {
          setJulesLogs((prev) => [
            ...prev,
            `[PROCESS EXITED WITH CODE ${data.exit_code}]`,
          ]);
          setIsJulesRunning(false);
        } else if (data.type === "hitl_request" && data.thread_id && data.plan) {
          setHitlRequest({ thread_id: data.thread_id, plan: data.plan });
        }
      } catch (e) {
        console.error("Failed to parse websocket message", e);
      }
    };

    ws.current.onclose = () => {
      setIsConnected(false);
      setIsRunning(false);
      setIsJulesRunning(false);
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [url]);

  const sendTask = useCallback(
    (task: string) => {
      if (ws.current && isConnected) {
        setLogs([]);
        setScreenshot(null);
        setIsRunning(true);
        ws.current.send(JSON.stringify({ type: "lam", task }));
      }
    },
    [isConnected],
  );

  const sendJulesCommand = useCallback(
    (command: string) => {
      if (ws.current && isConnected) {
        setIsJulesRunning(true);
        ws.current.send(JSON.stringify({ type: "jules", command }));
      }
    },
    [isConnected],
  );

  const sendPanicStop = useCallback(() => {
    if (ws.current && isConnected) {
      ws.current.send(JSON.stringify({ type: "panic_stop" }));
    }
  }, [isConnected]);

  const sendHitlResponse = useCallback((thread_id: string, action: "approve" | "reject" | "edit", plan?: unknown) => {
    if (ws.current && isConnected) {
      ws.current.send(JSON.stringify({
        type: "hitl_response",
        thread_id,
        action,
        plan
      }));
      setHitlRequest(null);
    }
  }, [isConnected]);

  return {
    logs,
    julesLogs,
    screenshot,
    isConnected,
    isRunning,
    isJulesRunning,
    hitlRequest,
    sendTask,
    sendJulesCommand,
    sendPanicStop,
    sendHitlResponse,
  };
}
