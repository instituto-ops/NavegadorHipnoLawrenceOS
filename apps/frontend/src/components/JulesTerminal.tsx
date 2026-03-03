import React, { useRef, useEffect } from "react";
import { Code2, Loader2 } from "lucide-react";

interface JulesTerminalProps {
  logs: string[];
  isRunning: boolean;
  isConnected: boolean;
  input: string;
  setInput: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const JulesTerminal: React.FC<JulesTerminalProps> = ({
  logs,
  isRunning,
  isConnected,
  input,
  setInput,
  onSubmit,
}) => {
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  return (
    <div className="flex-1 flex flex-col bg-[#1e1e1e] rounded-xl shadow-sm border border-gray-800 overflow-hidden">
      <div className="bg-[#2d2d2d] text-gray-200 px-4 py-2 flex items-center gap-2 border-b border-black">
        <Code2 size={18} className="text-blue-400" />
        <h2 className="font-semibold text-sm">Jules Terminal</h2>
      </div>

      <div className="flex-1 p-4 overflow-y-auto text-gray-300 font-mono text-sm">
        <div className="mb-4 text-blue-400">
          Welcome to Jules CLI. Type commands starting with "jules" (e.g.,
          `jules --help`)
        </div>

        {logs.map((log, index) => (
          <div
            key={index}
            className="whitespace-pre-wrap font-mono text-sm leading-snug"
          >
            {log}
          </div>
        ))}

        {isRunning && (
          <div className="flex items-center gap-2 mt-2 text-gray-500">
            <Loader2 size={14} className="animate-spin" />
            <span>Running...</span>
          </div>
        )}
        <div ref={logsEndRef} />
      </div>

      <div className="p-2 border-t border-gray-800 bg-[#2d2d2d]">
        <form onSubmit={onSubmit} className="flex gap-2">
          <span className="text-green-500 font-mono py-2 pl-2">❯</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={!isConnected || isRunning}
            placeholder="jules --help"
            className="flex-1 px-2 py-2 bg-transparent text-gray-200 font-mono focus:outline-none disabled:opacity-50 placeholder-gray-600"
          />
        </form>
      </div>
    </div>
  );
};
