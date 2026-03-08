import { useState, useEffect, useRef, useCallback } from 'react';

export interface AgentMessage {
  type:
  | 'log'
  | 'screenshot'
  | 'done'
  | 'error'
  | 'jules_output'
  | 'jules_error'
  | 'jules_done'
  | 'hitl_request';
  message?: string;
  summary?: string;
  data?: string; // base64 screenshot data
  exit_code?: number;
  thread_id?: string;
  plan?: unknown;
}

export function useAgentSocket(url: string): {
  logs: string[];
  julesLogs: string[];
  screenshot: string | null;
  result: string | null;
  isConnected: boolean;
  isRunning: boolean;
  isJulesRunning: boolean;
  hitlRequest: { thread_id: string; plan: unknown } | null;
  sendTask: (task: string) => void;
  sendJulesCommand: (command: string) => void;
  sendPanicStop: () => void;
  sendHitlResponse: (
    thread_id: string,
    action: 'approve' | 'reject' | 'edit',
    plan?: unknown
  ) => void;
} {
  const [logs, setLogs] = useState<string[]>([]);
  const [julesLogs, setJulesLogs] = useState<string[]>([]);
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isJulesRunning, setIsJulesRunning] = useState(false);
  const [hitlRequest, setHitlRequest] = useState<{ thread_id: string; plan: unknown } | null>(null);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    let socket: WebSocket | null = null;
    let reconnectTimeout: any = null;

    const connect = () => {
      console.log('Connecting to WebSocket:', url);
      socket = new WebSocket(url);
      ws.current = socket;

      socket.onopen = () => {
        setIsConnected(true);
        console.log('WebSocket connected');
      };

      socket.onmessage = (event) => {
        try {
          const data: AgentMessage = JSON.parse(event.data);
          if (data.type === 'log' && data.message) {
            setLogs((prev) => [...prev, data.message!]);
          } else if (data.type === 'screenshot' && data.data) {
            setScreenshot(`data:image/jpeg;base64,${data.data}`);
          } else if (data.type === 'done') {
            if (data.summary) {
              setResult(data.summary);
            }
            setIsRunning(false);
          } else if (data.type === 'error' && data.message) {
            setLogs((prev) => [...prev, `[ERROR] ${data.message}`]);
            setIsRunning(false);
          } else if (data.type === 'jules_output' && data.message) {
            setJulesLogs((prev) => [...prev, data.message!]);
          } else if (data.type === 'jules_error' && data.message) {
            setJulesLogs((prev) => [...prev, `[ERROR] ${data.message}`]);
            setIsJulesRunning(false);
          } else if (data.type === 'jules_done') {
            setJulesLogs((prev) => [...prev, `[PROCESS EXITED WITH CODE ${data.exit_code}]`]);
            setIsJulesRunning(false);
          } else if (data.type === 'hitl_request' && data.thread_id && data.plan) {
            setHitlRequest({ thread_id: data.thread_id, plan: data.plan });
          }
        } catch (e) {
          console.error('Failed to parse websocket message', e);
        }
      };

      socket.onerror = (err) => {
        console.error('WebSocket error:', err);
      };

      socket.onclose = () => {
        setIsConnected(false);
        setIsRunning(false);
        setIsJulesRunning(false);
        console.log('WebSocket closed. Attempting reconnect in 3s...');
        reconnectTimeout = setTimeout(connect, 3000);
      };
    };

    connect();

    return () => {
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      if (socket) {
        socket.onclose = null; // Prevent reconnect on intentional unmount
        socket.close();
      }
    };
  }, [url]);

  const sendTask = useCallback(
    (task: string) => {
      if (ws.current && isConnected) {
        setLogs([]);
        setScreenshot(null);
        setResult(null);
        setIsRunning(true);
        ws.current.send(JSON.stringify({ type: 'lam', task }));
      }
    },
    [isConnected]
  );

  const sendJulesCommand = useCallback(
    (command: string) => {
      if (ws.current && isConnected) {
        setIsJulesRunning(true);
        ws.current.send(JSON.stringify({ type: 'jules', command }));
      }
    },
    [isConnected]
  );

  const sendPanicStop = useCallback(() => {
    if (ws.current && isConnected) {
      ws.current.send(JSON.stringify({ type: 'panic_stop' }));
    }
  }, [isConnected]);

  const sendHitlResponse = useCallback(
    (thread_id: string, action: 'approve' | 'reject' | 'edit', plan?: unknown) => {
      if (ws.current && isConnected) {
        ws.current.send(
          JSON.stringify({
            type: 'hitl_response',
            thread_id,
            action,
            plan,
          })
        );
        setHitlRequest(null);
      }
    },
    [isConnected]
  );

  return {
    logs,
    julesLogs,
    screenshot,
    result,
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
