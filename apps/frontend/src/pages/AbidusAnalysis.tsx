import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Loader2,
  TerminalSquare
} from 'lucide-react';
import { useAgentSocket } from '../hooks/useAgentSocket';

export const AbidusAnalysis: React.FC = () => {
  const [url, setUrl] = useState('www.hipnolawrence.com');
  const [hasStartedAnalysis, setHasStartedAnalysis] = useState(false);
  const logsEndRef = useRef<HTMLDivElement>(null);

  const {
    logs,
    isConnected,
    isRunning,
    sendTask,
  } = useAgentSocket("ws://localhost:8000/ws");

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || !isConnected || isRunning) return;

    setHasStartedAnalysis(true);

    const prompt = `Analise a URL ${url} utilizando a metodologia "Análises Abidus".
A sua resposta deve conter as seguintes seções detalhadas, baseando-se no que você puder inferir, raspar (scraping) ou auditar da página:
1. Otimização On-Page (Padrão Rank Math)
2. Auditoria Técnica e Concorrentes (Padrão SEO META in 1 CLICK)
3. Validação de Palavras-Chave (Padrão Ubersuggest)
4. SEO Local e Estrutura de Silos
5. Nicho de Saúde (YMYL) e Compliance CFP
6. Sinergia com Google Ads

Apresente um relatório textual completo e profissional, formatado em Markdown, com cada uma dessas seções.`;

    sendTask(prompt);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="mb-8 flex-shrink-0">
        <h1 className="text-2xl font-bold text-white mb-2">Análises Abidus</h1>
        <p className="text-gray-400 text-sm">Plataforma de auditoria avançada em SEO, SEM e Compliance YMYL.</p>
      </div>

      <div className="bg-[#111111] border border-gray-800/60 rounded-xl p-5 shadow-sm mb-6 flex-shrink-0">
        <form onSubmit={handleAnalyze} className="flex gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="text-gray-500" size={18} />
            </div>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Digite a URL para analisar (ex: www.hipnolawrence.com)"
              className="w-full bg-[#0A0A0A] border border-gray-800 text-white text-sm rounded-lg focus:ring-[#2EED8F] focus:border-[#2EED8F] block pl-10 p-3"
              required
              disabled={isRunning || !isConnected}
            />
          </div>
          <button
            type="submit"
            disabled={isRunning || !isConnected}
            className="bg-[#2EED8F] hover:bg-[#28d681] text-[#0A0A0A] font-bold py-3 px-6 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRunning ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Analisando...
              </>
            ) : (
              <>
                <Search size={18} />
                Analisar
              </>
            )}
          </button>
        </form>
        {!isConnected && (
          <p className="text-red-500 text-xs mt-2">Conectando ao assistente...</p>
        )}
      </div>

      <div className="flex-1 bg-[#111111] border border-gray-800/60 rounded-xl p-5 overflow-hidden flex flex-col shadow-sm">
        <div className="flex items-center gap-2 mb-4 text-gray-400 border-b border-gray-800/60 pb-3 flex-shrink-0">
          <TerminalSquare size={18} className="text-[#2EED8F]" />
          <h2 className="text-sm font-semibold uppercase tracking-wider">Terminal do Assistente</h2>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar font-mono text-xs pr-4">
          {!hasStartedAnalysis && logs.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 opacity-50">
              <Search size={32} className="mb-4" />
              <p>O relatório será gerado ao vivo após clicar em "Analisar".</p>
            </div>
          ) : (
            <div className="space-y-3">
              {logs.map((log, index) => (
                <div key={index} className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                  <span className="text-gray-500 mr-2">[{new Date().toLocaleTimeString()}]</span>
                  {log}
                </div>
              ))}
              {isRunning && (
                <div className="flex items-center gap-2 text-[#2EED8F] animate-pulse py-2">
                  <Loader2 size={14} className="animate-spin" />
                  <span>Aguardando resposta do agente...</span>
                </div>
              )}
              <div ref={logsEndRef} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
