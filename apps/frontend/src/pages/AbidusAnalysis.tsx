import React, { useState } from 'react';
import {
  Search,
  BarChart,
  Settings,
  Key,
  MapPin,
  HeartPulse,
  MousePointerClick,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Loader2
} from 'lucide-react';

const MetricCard = ({ title, icon: Icon, children }: { title: string, icon: React.ElementType, children: React.ReactNode }) => (
  <div className="bg-[#111111] border border-gray-800/60 rounded-xl p-5 shadow-sm flex flex-col h-full">
    <div className="flex items-center gap-3 mb-4">
      <div className="p-2 rounded-lg bg-[#2EED8F]/10 text-[#2EED8F]">
        <Icon size={20} />
      </div>
      <h3 className="text-sm font-bold text-white uppercase tracking-wider">{title}</h3>
    </div>
    <div className="flex-1 text-gray-400 text-sm">
      {children}
    </div>
  </div>
);

const StatusItem = ({ label, status, value }: { label: string, status: 'good' | 'warning' | 'error', value?: string }) => {
  const icons = {
    good: <CheckCircle2 size={16} className="text-[#2EED8F]" />,
    warning: <AlertCircle size={16} className="text-yellow-500" />,
    error: <XCircle size={16} className="text-red-500" />
  };

  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-800/40 last:border-0">
      <div className="flex items-center gap-2">
        {icons[status]}
        <span>{label}</span>
      </div>
      {value && <span className="text-white font-mono text-xs">{value}</span>}
    </div>
  );
};

export const AbidusAnalysis: React.FC = () => {
  const [url, setUrl] = useState('www.hipnolawrence.com');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setIsAnalyzing(true);
    setShowResults(false);

    // Simulate analysis delay
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowResults(true);
    }, 2000);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Análises Abidus</h1>
        <p className="text-gray-400 text-sm">Plataforma de auditoria avançada em SEO, SEM e Compliance YMYL.</p>
      </div>

      <div className="bg-[#111111] border border-gray-800/60 rounded-xl p-5 shadow-sm mb-8">
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
            />
          </div>
          <button
            type="submit"
            disabled={isAnalyzing}
            className="bg-[#2EED8F] hover:bg-[#28d681] text-[#0A0A0A] font-bold py-3 px-6 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAnalyzing ? (
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
      </div>

      {showResults && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

          <MetricCard title="Otimização On-Page" icon={BarChart}>
            <p className="text-xs mb-3 text-gray-500">Padrão Rank Math</p>
            <StatusItem label="Focus Keyword" status="good" value="Encontrada na URL" />
            <StatusItem label="Densidade da Palavra" status="warning" value="0.8% (Ideal 1-2%)" />
            <StatusItem label="Legibilidade do Texto" status="good" value="Flesch Score: 68" />
            <StatusItem label="UX: Core Web Vitals" status="warning" value="LCP: 2.8s" />
          </MetricCard>

          <MetricCard title="Auditoria Técnica" icon={Settings}>
            <p className="text-xs mb-3 text-gray-500">Padrão SEO META in 1 CLICK</p>
            <StatusItem label="H1 Tag" status="good" value="1 Encontrada" />
            <StatusItem label="H2/H3 Hierarquia" status="warning" value="H3 antes do H2" />
            <StatusItem label="Imagens sem Alt" status="error" value="3 Imagens" />
            <StatusItem label="Word Count" status="good" value="1,245 palavras" />
          </MetricCard>

          <MetricCard title="Validação de Palavras-Chave" icon={Key}>
            <p className="text-xs mb-3 text-gray-500">Padrão Ubersuggest</p>
            <StatusItem label="Volume de Busca (Mensal)" status="good" value="8,400" />
            <StatusItem label="SEO Difficulty (SD)" status="good" value="34/100" />
            <StatusItem label="CPC Médio" status="warning" value="R$ 4.50" />
            <StatusItem label="Variações Long-Tail" status="good" value="12 identificadas" />
          </MetricCard>

          <MetricCard title="SEO Local e Silos" icon={MapPin}>
            <p className="text-xs mb-3 text-gray-500">Estrutura Geográfica</p>
            <StatusItem label="Consistência NAP" status="good" value="Verificada" />
            <StatusItem label="Modificadores Geográficos" status="good" value="Presentes no H1" />
            <StatusItem label="Silos Locais" status="warning" value="Links internos fracos" />
            <StatusItem label="Imagens Geotagueadas" status="error" value="Não encontradas" />
          </MetricCard>

          <MetricCard title="Saúde (YMYL) e Compliance" icon={HeartPulse}>
            <p className="text-xs mb-3 text-gray-500">Compliance CFP e E-A-T</p>
            <StatusItem label="Promessas de Cura" status="good" value="Nenhuma" />
            <StatusItem label="Depoimentos com Garantias" status="error" value="1 Detectado" />
            <StatusItem label="Autoridade (E-A-T)" status="good" value="Bio do autor clara" />
            <StatusItem label="Termos Sensíveis" status="warning" value="2 Ocorrências" />
          </MetricCard>

          <MetricCard title="Sinergia Google Ads" icon={MousePointerClick}>
            <p className="text-xs mb-3 text-gray-500">Estrutura STAGs</p>
            <StatusItem label="Congruência LP/Anúncio" status="good" value="Alta (92%)" />
            <StatusItem label="Estrutura STAGs" status="warning" value="Grupos muito amplos" />
            <StatusItem label="Palavras Negativas" status="good" value="Lista aplicada" />
            <StatusItem label="Índice de Qualidade Est." status="good" value="8/10" />
          </MetricCard>

        </div>
      )}

      {!showResults && !isAnalyzing && (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-500 border-2 border-dashed border-gray-800/60 rounded-xl p-8">
          <Search size={48} className="mb-4 text-gray-700" />
          <p>Digite uma URL acima e clique em "Analisar" para gerar os relatórios Abidus.</p>
        </div>
      )}
    </div>
  );
};
