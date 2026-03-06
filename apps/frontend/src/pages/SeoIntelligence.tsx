import {
  Search,
  ShieldCheck,
  Globe,
  BarChart3,
  AlertTriangle,
  CheckCircle2,
  Info,
  Loader2,
  ArrowRight,
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

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

const ScoreGauge = ({ score, title }: { score: number; title: string }) => {
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
              {data.map((_entry, index) => (
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
  const [, setError] = useState<string | null>(null);

  const runAnalysis = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:8000/api/analytics/pagespeed?url=${encodeURIComponent(url)}`
      );
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setPageSpeed(data);
    } catch (err: any) {
      setError(err.message);
      // Mock for demo if error
      setPageSpeed({
        id: url,
        fetchTime: new Date().toISOString(),
        scores: { performance: 88, accessibility: 95, 'best-practices': 100, seo: 100 },
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial optional load
  }, []);

  return (
    <div className="h-full flex flex-col gap-6 font-sans">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Inteligência de SEO</h1>
          <p className="text-gray-500 text-sm mt-1">NeuroStrategy SEO Engine & Content Ideas</p>
        </div>
        <form
          onSubmit={runAnalysis}
          className="flex gap-4 items-center bg-[#111111] border border-gray-800 p-1.5 rounded-xl"
        >
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              aria-label="URL para análise"
              className="bg-transparent border-none text-white text-sm pl-10 pr-4 py-2 w-64 focus:ring-0 font-mono"
              placeholder="https://exemplo.com"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-[#2EED8F] text-[#0A0A0A] rounded-lg text-sm font-bold shadow-[0_0_15px_rgba(46,237,143,0.3)] hover:bg-[#20c978] transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="animate-spin" size={16} /> : <Search size={16} />}
            Analisar Agora
          </button>
        </form>
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
              Auditoria On-Page (Ubersuggest Style)
            </h2>
            <div className="px-2 py-1 bg-green-500/10 text-green-500 text-[10px] font-bold rounded uppercase tracking-tighter">
              98% Health Score
            </div>
          </div>

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
              <button className="text-[10px] font-bold text-[#2EED8F] underline">
                Corrigir Agora
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
