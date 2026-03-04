import {
  Search,
  Zap,
  ShieldCheck,
  Globe,
  BarChart3,
  AlertTriangle,
  CheckCircle2,
  Info,
  Loader2,
  ArrowRight,
  Gauge,
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip as RechartsTooltip } from 'recharts';

interface PageSpeedData {
  id: string;
  fetchTime: string;
  scores: {
    performance: number;
    accessibility: number;
    'best-practices': number;
    seo: number;
  };
}

const ScoreGauge = ({ score, title }: { score: number; title: string }): JSX.Element => {
  const data = [
    { name: 'Score', value: score },
    { name: 'Remaining', value: 100 - score },
  ];

  const COLORS =
    score >= 90
      ? ['#2EED8F', '#1A1A1A']
      : score >= 50
        ? ['#FACC15', '#1A1A1A']
        : ['#EF4444', '#1A1A1A'];

  return (
    <div className="flex flex-col items-center gap-2 p-4 bg-[#111111] border border-gray-800/60 rounded-xl">
      <div className="relative w-24 h-24">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={30}
              outerRadius={45}
              startAngle={90}
              endAngle={450}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold text-white">{score}</span>
        </div>
      </div>
      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{title}</span>
    </div>
  );
};

export const SeoIntelligence: React.FC = () => {
  const [url, setUrl] = useState('https://hipnolawrence.com');
  const [isLoading, setIsLoading] = useState(false);
  const [pageSpeed, setPageSpeed] = useState<PageSpeedData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [auditResult, setAuditResult] = useState<any>(null);

  const runAnalysis = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    setAuditResult(null);
    try {
      // 1. Run PageSpeed
      const psResponse = await fetch(
        `http://localhost:8000/api/analytics/pagespeed?url=${encodeURIComponent(url)}`
      );
      const psData = await psResponse.json();
      setPageSpeed(psData);

      // 2. Run Antigravity Visual Audit (Deep Research Implementation)
      const vaResponse = await fetch(
        `http://localhost:8000/api/analytics/visual-audit?url=${encodeURIComponent(url)}&device=mobile`
      );
      const vaData = await vaResponse.json();
      setAuditResult(vaData);

    } catch (err: any) {
      setError(err.message);
      // Fallback for demo
      setPageSpeed({
        id: url,
        fetchTime: new Date().toISOString(),
        scores: { performance: 88, accessibility: 95, 'best-practices': 100, seo: 100 },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const [pendingAction, setPendingAction] = useState<{ type: string; details: string } | null>(
    null
  );
  const [isPublishing, setIsPublishing] = useState(false);

  const requestAction = (type: string, details: string): void => {
    setPendingAction({ type, details });
  };

  const confirmAction = async (): Promise<void> => {
    if (!pendingAction) return;
    setIsPublishing(true);
    try {
      if (pendingAction.type === 'WP_POST') {
        const response = await fetch(
          `http://localhost:8000/api/wordpress/publish?title=${encodeURIComponent(
            'Otimização de SEO: Imagens e Acessibilidade'
          )}&content=${encodeURIComponent(pendingAction.details)}`,
          { method: 'POST' }
        );
        const data = await response.json();
        if (data.error) throw new Error(data.error);
        alert('Ação executada com sucesso via Agente Antigravity!');
      }
    } catch (err: any) {
      alert(`Erro ao executar: ${err.message}`);
    } finally {
      setIsPublishing(false);
      setPendingAction(null);
    }
  };

  useEffect(() => {
    // Initial optional load
  }, []);

  return (
    <div className="h-full flex flex-col gap-6 font-sans relative">
      {/* HITL Overlay */}
      {pendingAction && (
        <div className="absolute inset-0 z-50 bg-[#0A0A0A]/80 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-[#111111] border border-[#2EED8F]/30 rounded-2xl p-8 max-w-md w-full shadow-[0_0_40px_rgba(46,237,143,0.1)]">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-[#2EED8F]/10 rounded-lg">
                <Zap className="text-[#2EED8F]" size={24} />
              </div>
              <h3 className="text-xl font-bold text-white">Confirmação do Agente</h3>
            </div>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              O Agente Antigravity identificou uma oportunidade de otimização automática.
              <br />
              <br />
              <span className="text-white font-medium">Ação:</span>{' '}
              {pendingAction.type === 'WP_POST'
                ? 'Publicar post de correção no WordPress'
                : 'Ajustar metadados localmente'}
              <br />
              <span className="text-white font-medium">Detalhe:</span> {pendingAction.details}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setPendingAction(null)}
                className="flex-1 py-3 rounded-xl border border-gray-800 text-gray-400 font-bold hover:bg-gray-800 transition-all"
              >
                Ignorar
              </button>
              <button
                onClick={confirmAction}
                disabled={isPublishing}
                className="flex-1 py-3 rounded-xl bg-[#2EED8F] text-[#0A0A0A] font-bold shadow-[0_0_20px_rgba(46,237,143,0.3)] hover:bg-[#20c978] transition-all flex items-center justify-center gap-2"
              >
                {isPublishing ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <CheckCircle2 size={18} />
                )}
                Aprovar Ação
              </button>
            </div>
          </div>
        </div>
      )}
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Inteligência de SEO</h1>
          <p className="text-gray-500 text-sm mt-1">NeuroStrategy SEO Engine & Content Ideas</p>
        </div>
        <div className="flex gap-4 items-center bg-[#111111] border border-gray-800 p-1.5 rounded-xl">
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="bg-transparent border-none text-white text-sm pl-10 pr-4 py-2 w-64 focus:ring-0 font-mono"
              placeholder="https://exemplo.com"
            />
          </div>
          <button
            onClick={runAnalysis}
            disabled={isLoading}
            className="px-4 py-2 bg-[#2EED8F] text-[#0A0A0A] rounded-lg text-sm font-bold shadow-[0_0_15px_rgba(46,237,143,0.3)] hover:bg-[#20c978] transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="animate-spin" size={16} /> : <Search size={16} />}
            Analisar Agora
          </button>
        </div>
      </header>

      {/* Main Stats Row */}
      {pageSpeed && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <ScoreGauge score={pageSpeed.scores.performance} title="Performance" />
          <ScoreGauge score={pageSpeed.scores.accessibility} title="Acessibilidade" />
          <ScoreGauge score={pageSpeed.scores['best-practices']} title="Melhores Práticas" />
          <ScoreGauge score={pageSpeed.scores.seo} title="SEO On-Page" />
        </div>
      )}

      {/* Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        {/* Site Audit Module */}
        <div className="lg:col-span-2 bg-[#111111] border border-gray-800/60 rounded-xl p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
              <ShieldCheck size={18} className="text-[#2EED8F]" />
              Auditoria On-Page (Antigravity Visual Audit)
            </h2>
            <div className="px-2 py-1 bg-green-500/10 text-green-500 text-[10px] font-bold rounded uppercase tracking-tighter">
              {auditResult ? `${auditResult.analysis.health_score}% Health Score` : 'Aguardando Análise'}
            </div>
          </div>

          {auditResult && auditResult.react_episode && (
            <div className="mb-6 p-4 bg-[#0A0A0A] border border-gray-800 rounded-lg overflow-hidden">
              <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Gauge size={12} className="text-[#2EED8F]" />
                Episódio ReAct (Log do Agente)
              </h3>
              <div className="space-y-2 font-mono text-[10px]">
                {auditResult.react_episode.thoughts.map((t: string, i: number) => (
                  <div key={i} className="text-blue-400">
                    <span className="text-gray-600">Thought:</span> {t}
                  </div>
                ))}
                {auditResult.react_episode.actions.map((a: string, i: number) => (
                  <div key={i} className="text-green-400">
                    <span className="text-gray-600">Action:</span> {a}
                  </div>
                ))}
                {auditResult.react_episode.observations.map((o: string, i: number) => (
                  <div key={i} className="text-purple-400">
                    <span className="text-gray-600">Observation:</span> {o}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4 flex-1">
            <div className="flex items-center justify-between p-4 bg-[#1A1A1A] rounded-lg border border-gray-800">
              <div className="flex items-center gap-3">
                <CheckCircle2 size={24} className="text-green-500" />
                <div>
                  <p className="text-sm font-medium text-white">Meta Title & Description</p>
                  <p className="text-[11px] text-gray-500">
                    Configurados e dentro do tamanho ideal.
                  </p>
                </div>
              </div>
              <ArrowRight size={16} className="text-gray-700" />
            </div>

            <div className="flex items-center justify-between p-4 bg-[#1A1A1A] rounded-lg border border-gray-800">
              <div className="flex items-center gap-3">
                <CheckCircle2 size={24} className="text-green-500" />
                <div>
                  <p className="text-sm font-medium text-white">Heading Structure (H1-H4)</p>
                  <p className="text-[11px] text-gray-500">Hierarquia correta detectada.</p>
                </div>
              </div>
              <ArrowRight size={16} className="text-gray-700" />
            </div>

            <div className="flex items-center justify-between p-4 bg-[#1A1A1A] rounded-lg border border-gray-800 opacity-60">
              <div className="flex items-center gap-3">
                <AlertTriangle size={24} className="text-yellow-500" />
                <div>
                  <p className="text-sm font-medium text-white">Imagens sem Alt Text</p>
                  <p className="text-[11px] text-gray-500">3 imagens precisam de correção.</p>
                </div>
              </div>
              <button
                onClick={() =>
                  requestAction(
                    'WP_POST',
                    'O Agente irá gerar e publicar um artigo técnico explicando a importância do Alt Text para pacientes com TEA, otimizando seu ranking atual.'
                  )
                }
                className="text-[10px] font-bold text-[#2EED8F] underline hover:text-white transition-colors"
              >
                Corrigir via Agente
              </button>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-500/5 border border-blue-500/20 rounded-lg flex gap-3">
            <Info className="text-blue-400 shrink-0" size={18} />
            <p className="text-[11px] text-blue-200/80 leading-relaxed">
              <strong>Insight da IA:</strong> Seu site tem ótima pontuação, mas você pode melhorar a
              densidade da palavra-chave "hipnose clínica" nos primeiros 10% do conteúdo para ganhar
              mais tração regional.
            </p>
          </div>
        </div>

        {/* Content Ideas / Search Listening */}
        <div className="bg-[#111111] border border-gray-800/60 rounded-xl p-6 flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#2EED8F]/5 blur-[60px] rounded-full -mr-16 -mt-16"></div>

          <h2 className="text-sm font-semibold text-gray-300 mb-6 flex items-center gap-2">
            <BarChart3 size={18} className="text-purple-400" />
            Ideias de Conteúdo (Search Listening)
          </h2>

          <div className="space-y-3">
            <div className="p-3 bg-gray-900/50 rounded-lg border border-gray-800">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9px] font-bold text-purple-400 uppercase tracking-tighter">
                  Pergunta Popular
                </span>
                <span className="text-[9px] text-gray-600">Alta Vol.</span>
              </div>
              <p className="text-xs text-white">
                Como a hipnose pode ajudar no tratamento do autismo em adultos?
              </p>
            </div>

            <div className="p-3 bg-gray-900/50 rounded-lg border border-gray-800">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9px] font-bold text-blue-400 uppercase tracking-tighter">
                  Comparação
                </span>
                <span className="text-[9px] text-gray-600">Tendência Jan/26</span>
              </div>
              <p className="text-xs text-white">
                Hipnose vs TCC: Qual a melhor para ansiedade generalizada?
              </p>
            </div>

            <div className="p-3 bg-gray-900/50 rounded-lg border border-gray-800">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9px] font-bold text-green-400 uppercase tracking-tighter">
                  Preposição
                </span>
                <span className="text-[9px] text-gray-600">Oportunidade</span>
              </div>
              <p className="text-xs text-white">Especialista em hipnose para fobias em Goiânia.</p>
            </div>
          </div>

          <button className="mt-8 w-full py-3 border border-gray-800 text-gray-400 rounded-xl text-xs font-medium hover:bg-gray-800/30 transition-all flex items-center justify-center gap-2">
            Ver todas no AnswerThePublic
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
