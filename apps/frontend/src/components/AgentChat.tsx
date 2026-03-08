import {
  Send,
  TerminalSquare,
  Image as ImageIcon,
  Loader2,
  OctagonPause,
  Activity,
  Globe2,
  Cpu,
} from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import { useAgentSocket } from '../hooks/useAgentSocket';
import { ActionReviewCard } from './ActionReviewCard';

export const AgentChat: React.FC = () => {
  const [input, setInput] = useState('');

  const {
    logs,
    screenshot,
    isConnected,
    isRunning,
    hitlRequest,
    sendTask,
    sendPanicStop,
    sendHitlResponse,
  } = useAgentSocket('ws://localhost:8000/ws');

  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (!input.trim() || !isConnected || isRunning) return;
    sendTask(input);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#0A0A0A] font-sans">
      {/* Top Header */}
      <header className="mb-4 flex gap-4">
        <div className="flex-1 bg-[#111111] rounded-xl border border-gray-800/60 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Activity
              className={isRunning ? 'text-[#2EED8F] animate-pulse' : 'text-gray-500'}
              size={20}
            />
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">
                Status do Núcleo
              </p>
              <p
                className={`text-sm font-semibold ${isRunning ? 'text-[#2EED8F]' : 'text-gray-400'}`}
              >
                {isRunning ? 'Processando' : 'Ocioso'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 border-l border-gray-800 pl-4 ml-4">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center border ${isConnected ? 'bg-[#2EED8F]/10 border-[#2EED8F]/20' : 'bg-red-500/10 border-red-500/20'}`}
            >
              <Cpu size={16} className={isConnected ? 'text-[#2EED8F]' : 'text-red-500'} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">
                Conexão WebSocket
              </p>
              <p className={`text-sm font-semibold ${isConnected ? 'text-white' : 'text-red-500'}`}>
                {isConnected ? 'Online' : 'Offline'}
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 gap-6 overflow-hidden">
        {/* Left Column: Logs / Chat */}
        <div className="flex-[0.4] flex flex-col gap-4 overflow-hidden">
          {/* LAM Logs */}
          <div className="flex-1 flex flex-col bg-[#111111] rounded-xl border border-gray-800/60 overflow-hidden shadow-sm">
            <div className="px-4 py-3 flex items-center gap-2 border-b border-gray-800/60">
              <TerminalSquare size={16} className="text-gray-500" />
              <h2 className="font-mono text-xs text-gray-500 uppercase tracking-wider">
                &gt;_ THOUGHT BOX (REACT LOOP)
              </h2>
            </div>
            <div className="flex-1 p-4 overflow-y-auto bg-[#0F0F0F] text-green-400/80 font-mono text-sm">
              {logs.length === 0 ? (
                <p className="text-gray-600 italic">
                  Aguardando inicialização do motor cognitivo...
                </p>
              ) : (
                logs.map((log, index) => (
                  <div key={index} className="mb-1 leading-relaxed">
                    <span className="text-gray-600 mr-2">[{new Date().toLocaleTimeString()}]</span>
                    {log}
                  </div>
                ))
              )}
              {isRunning && (
                <div className="flex items-center gap-2 mt-2 text-gray-500">
                  <Loader2 size={14} className="animate-spin" />
                  <span>Agente trabalhando...</span>
                </div>
              )}
              <div ref={logsEndRef} />
            </div>
          </div>

          {/* LAM Input */}
          {hitlRequest && (
            <ActionReviewCard
              plan={
                hitlRequest.plan as unknown as React.ComponentProps<typeof ActionReviewCard>['plan']
              }
              onApprove={() => sendHitlResponse(hitlRequest.thread_id, 'approve')}
              onReject={() => sendHitlResponse(hitlRequest.thread_id, 'reject')}
              onEdit={(editedPlan) => sendHitlResponse(hitlRequest.thread_id, 'edit', editedPlan)}
            />
          )}
          <div className="bg-[#111111] rounded-xl border border-gray-800/60 p-2 shadow-sm">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <div className="flex-1 flex items-center bg-[#1A1A1A] rounded-lg border border-gray-800 px-3">
                <span className="text-gray-500 font-mono text-sm mr-2">&gt;_</span>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={!isConnected || isRunning}
                  placeholder={!isConnected ? 'Conectando ao sistema...' : 'Comando para o Maestro'}
                  className="flex-1 py-3 bg-transparent text-gray-300 border-none focus:outline-none focus:ring-0 placeholder-gray-600 font-mono text-sm min-w-0"
                />
              </div>
              {isRunning && (
                <button
                  type="button"
                  onClick={sendPanicStop}
                  className="bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 text-red-500 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <OctagonPause size={18} />
                  Parar
                </button>
              )}
              <button
                type="submit"
                disabled={!input.trim() || !isConnected || isRunning}
                className="bg-[#2EED8F] hover:bg-[#20c978] text-[#0A0A0A] px-4 py-2 rounded-lg font-bold transition-colors disabled:opacity-50 flex items-center gap-2 shadow-[0_0_15px_rgba(46,237,143,0.2)]"
              >
                {isRunning ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <>
                    Enviar <Send size={16} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Live View (Full Height) */}
        <div className="flex-[0.6] flex flex-col gap-4 overflow-hidden">
          <div className="flex-1 flex flex-col bg-[#111111] rounded-xl border border-gray-800/60 overflow-hidden shadow-sm">
            <div className="px-4 py-3 flex items-center gap-3 border-b border-gray-800/60">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="flex-1 flex items-center justify-center">
                <div className="bg-[#1A1A1A] text-gray-300 text-xs py-1.5 px-32 rounded-md font-mono border border-gray-800">
                  <ImageIcon size={12} className="inline mr-2 opacity-50" />
                  Visualização em Tempo Real (LAM)
                </div>
              </div>
            </div>
            <div className="flex-1 bg-[#FDFDFD] flex items-center justify-center overflow-auto relative rounded-b-xl p-2">
              {screenshot ? (
                <img
                  src={screenshot}
                  alt="Agent Browser View"
                  className="w-full h-full object-contain rounded border border-gray-200"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-400">
                  <Globe2 size={64} className="mb-4 opacity-20" />
                  <h3 className="text-xl font-medium text-gray-500 mb-2">Navegador em Standby</h3>
                  <p className="text-sm">Envie um comando para iniciar a automação.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
