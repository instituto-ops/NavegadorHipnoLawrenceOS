import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  TerminalSquare,
  Image as ImageIcon,
  Loader2,
  OctagonPause,
} from "lucide-react";
import { useAgentSocket } from "../hooks/useAgentSocket";
import { JulesTerminal } from "./JulesTerminal";
import { ActionReviewCard } from "./ActionReviewCard";

export const AgentChat: React.FC = () => {
  const [input, setInput] = useState("");
  const [julesInput, setJulesInput] = useState("");

  const {
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
  } = useAgentSocket("ws://localhost:8000/ws");

  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !isConnected || isRunning) return;
    sendTask(input);
    setInput("");
  };

  const handleJulesSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!julesInput.trim() || !isConnected || isJulesRunning) return;
    sendJulesCommand(julesInput);
    setJulesInput("");
  };

  return (
    <div className="flex flex-col h-screen max-w-[1400px] mx-auto p-4 bg-gray-50">
      <header className="mb-4 text-center">
        <h1 className="text-3xl font-bold text-gray-800">NeuroStrategy OS</h1>
        <p className="text-sm text-gray-500">
          Status:{" "}
          {isConnected ? (
            <span className="text-green-600 font-semibold">Connected</span>
          ) : (
            <span className="text-red-600 font-semibold">Disconnected</span>
          )}
        </p>
      </header>

      <div className="flex flex-1 gap-6 overflow-hidden">
        {/* Left Column: Chat & Live View (LAM) */}
        <div className="flex-1 flex flex-col gap-4 overflow-hidden border-r border-gray-300 pr-4">
          {/* Live View */}
          <div className="flex-[0.6] flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-100 text-gray-700 px-4 py-2 flex items-center gap-2 border-b border-gray-200">
              <ImageIcon size={18} />
              <h2 className="font-semibold text-sm">Live Browser View (LAM)</h2>
            </div>
            <div className="flex-1 p-4 bg-gray-50 flex items-center justify-center overflow-auto relative">
              {screenshot ? (
                <img
                  src={screenshot}
                  alt="Agent Browser View"
                  className="max-w-full max-h-full object-contain rounded shadow-sm border border-gray-200"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-400">
                  <ImageIcon size={48} className="mb-2 opacity-50" />
                  <p>No visual context available</p>
                </div>
              )}
            </div>
          </div>

          {/* LAM Logs / Chat */}
          <div className="flex-[0.4] flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-800 text-gray-200 px-4 py-2 flex items-center gap-2 border-b border-gray-700">
              <TerminalSquare size={18} />
              <h2 className="font-semibold text-sm">
                Agent Thoughts & Actions
              </h2>
            </div>
            <div className="flex-1 p-4 overflow-y-auto bg-gray-900 text-green-400 font-mono text-sm">
              {logs.length === 0 ? (
                <p className="text-gray-500 italic">Waiting for a task...</p>
              ) : (
                logs.map((log, index) => (
                  <div key={index} className="mb-1 leading-relaxed">
                    <span className="text-gray-500 mr-2">
                      [{new Date().toLocaleTimeString()}]
                    </span>
                    {log}
                  </div>
                ))
              )}
              {isRunning && (
                <div className="flex items-center gap-2 mt-2 text-gray-400">
                  <Loader2 size={14} className="animate-spin" />
                  <span>Agent is working...</span>
                </div>
              )}
              <div ref={logsEndRef} />
            </div>
          </div>

          {/* LAM Input */}
          {hitlRequest && (
            <ActionReviewCard
              plan={hitlRequest.plan}
              onApprove={() => sendHitlResponse(hitlRequest.thread_id, "approve")}
              onReject={() => sendHitlResponse(hitlRequest.thread_id, "reject")}
              onEdit={(editedPlan) => sendHitlResponse(hitlRequest.thread_id, "edit", editedPlan)}
            />
          )}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={!isConnected || isRunning}
                placeholder={
                  !isConnected
                    ? "Connecting..."
                    : "Enter LAM task (e.g., 'Search Google for NeuroStrategy')"
                }
                className="flex-1 px-4 py-2 rounded-lg border-none bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
              {isRunning && (
                <button
                  type="button"
                  onClick={sendPanicStop}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <OctagonPause size={18} />
                  Panic Stop
                </button>
              )}
              <button
                type="submit"
                disabled={!input.trim() || !isConnected || isRunning}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isRunning ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Send size={18} />
                )}
                Execute
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Jules Terminal */}
        <JulesTerminal
          logs={julesLogs}
          isRunning={isJulesRunning}
          isConnected={isConnected}
          input={julesInput}
          setInput={setJulesInput}
          onSubmit={handleJulesSubmit}
        />
      </div>
    </div>
  );
};
