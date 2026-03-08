import { Search, Loader2, TerminalSquare } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { useAgentSocket } from '../hooks/useAgentSocket';

export const AbidusAnalysis: React.FC = () => {
  const [url, setUrl] = useState('www.hipnolawrence.com');
  const [hasStartedAnalysis, setHasStartedAnalysis] = useState(false);
  const logsEndRef = useRef<HTMLDivElement>(null);

  const { logs, isConnected, isRunning, result, sendTask } = useAgentSocket('ws://localhost:8000/ws');
  const [initialResult, setInitialResult] = useState<string | null>(null);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  useEffect(() => {
    const fetchLatestReport = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/reports/latest?limit=1');
        const data = await res.json();
        if (data && data.length > 0 && data[0].type === 'abidus_analysis') {
          setInitialResult(data[0].content);
        }
      } catch (e) {
        console.error('Failed to fetch initial report:', e);
      }
    };
    fetchLatestReport();
  }, []);

  const displayResult = result || initialResult;

  const handleAnalyze = (e: React.FormEvent): void => {
    e.preventDefault();
    if (!url.trim() || !isConnected || isRunning) return;

    setHasStartedAnalysis(true);

    const prompt = `Realize uma auditoria estratégica "Abidus" para o site ${url}. 
Siga este protocolo:
1. GO_TO ${url}
2. EXTRACT o conteúdo principal da página, focando em serviços, títulos (H1-H3), metadados SEO e rodapé.
3. Se houver links para "Sobre" ou "Clínica", acesse-os e extraia o conteúdo para validar compliance CFP/CRP e YMYL.
O objetivo final é gerar um relatório técnico nos pilares: On-Page, Técnico, Concorrência, Local, Compliance Saúde (YMYL) e Ads.`;

    sendTask(prompt);
  };

  const handleUpdate = (): void => {
    setInitialResult(null);
    handleAnalyze({ preventDefault: () => { } } as React.FormEvent);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header & Input Section */}
      <div className="mb-6 flex-shrink-0">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-bold text-white">Análises Abidus</h1>
            <p className="text-gray-400 text-sm">
              Auditoria avançada em SEO, SEM e Compliance YMYL para Clínicas.
            </p>
          </div>
          {!isConnected && (
            <div className="px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
              <span className="text-[10px] text-red-500 font-bold uppercase tracking-wider">
                Offline
              </span>
            </div>
          )}
        </div>

        <div className="bg-[#111111] border border-gray-800/60 rounded-xl p-4 shadow-sm">
          <form onSubmit={handleAnalyze} className="flex gap-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="text-gray-500" size={18} />
              </div>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Ex: www.hipnolawrence.com"
                className="w-full bg-[#0A0A0A] border border-gray-800 text-white text-sm rounded-lg focus:ring-[#2EED8F] focus:border-[#2EED8F] block pl-10 p-3 outline-none transition-all"
                required
                disabled={isRunning || !isConnected}
              />
            </div>
            <button
              type="submit"
              disabled={isRunning || !isConnected}
              className="bg-[#2EED8F] hover:bg-[#28d681] text-[#0A0A0A] font-bold py-3 px-8 rounded-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(46,237,143,0.15)] active:scale-95"
            >
              {isRunning ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Auditoria em Andamento...
                </>
              ) : displayResult ? (
                <>
                  <Search size={18} />
                  Atualizar Auditoria
                </>
              ) : (
                <>
                  <Search size={18} />
                  Iniciar Auditoria
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex gap-6 overflow-hidden min-h-0">
        {/* Left Column: Report View */}
        <div className="flex-1 flex flex-col bg-[#111111] border border-gray-800/60 rounded-xl overflow-hidden shadow-sm">
          <div className="px-4 py-3 flex items-center justify-between border-b border-gray-800/60 bg-[#151515]">
            <div className="flex items-center gap-2">
              <TerminalSquare size={16} className="text-[#2EED8F]" />
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-300">
                Relatório de Inteligência Abidus
              </h2>
            </div>
            {result && (
              <span className="text-[10px] bg-[#2EED8F]/10 text-[#2EED8F] border border-[#2EED8F]/20 px-2 py-0.5 rounded uppercase font-bold tracking-tighter">
                Finalizado
              </span>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-[#0D0D0D]/30">
            {!displayResult ? (
              <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto">
                <div className="w-16 h-16 bg-[#1A1A1A] rounded-2xl flex items-center justify-center mb-6 border border-white/5">
                  <Search size={32} className={isRunning ? 'text-[#2EED8F] animate-pulse' : 'text-gray-600'} />
                </div>
                <h3 className="text-lg font-bold text-gray-200 mb-2">
                  {isRunning ? 'Auditoria em Processo' : 'Aguardando Início'}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {isRunning
                    ? 'O Agente Maestro está navegando no site agora mesmo para extrair métricas de SEO e compliance técnico.'
                    : 'Insira uma URL e clique em Iniciar para gerar um relatório completo de 6 pilares estratégicos.'}
                </p>
                {isRunning && (
                  <div className="mt-8 w-full max-w-[200px] bg-gray-800 h-1 rounded-full overflow-hidden">
                    <div className="bg-[#2EED8F] h-full animate-progress-indefinite"></div>
                  </div>
                )}
              </div>
            ) : (
              <div className="prose prose-invert max-w-none prose-p:leading-relaxed prose-headings:text-white prose-p:text-gray-300 prose-li:text-gray-300">
                <ReactMarkdown className="animate-fade-in pb-12 font-sans text-sm">
                  {displayResult}
                </ReactMarkdown>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Mini Terminal */}
        <div className="w-80 flex flex-col bg-[#111111] border border-gray-800/60 rounded-xl overflow-hidden shadow-sm flex-shrink-0">
          <div className="px-4 py-3 border-b border-gray-800/60 bg-[#151515] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gray-600"></span>
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
              Passos de Execução
            </h2>
          </div>
          <div className="flex-1 p-4 overflow-y-auto font-mono text-[10px] bg-[#0A0A0A] text-gray-400 pr-2 custom-scrollbar">
            {logs.length === 0 ? (
              <p className="opacity-20 italic">Aguardando comando...</p>
            ) : (
              <div className="space-y-2">
                {logs.map((log, index) => (
                  <div key={index} className="flex gap-2 leading-relaxed border-l border-white/5 pl-2">
                    <span className="text-gray-700 whitespace-nowrap">
                      {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                    <span className={log.includes('Error') ? 'text-red-500' : 'text-gray-400'}>
                      {log}
                    </span>
                  </div>
                ))}
                {isRunning && (
                  <div className="flex items-center gap-2 text-[#2EED8F] animate-pulse pt-1">
                    <Loader2 size={10} className="animate-spin" />
                    <span>Maestro navegando...</span>
                  </div>
                )}
                <div ref={logsEndRef} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
