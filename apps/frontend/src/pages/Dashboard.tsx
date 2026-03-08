import {
  TrendingUp,
  Users,
  DollarSign,
  Target,
  Zap,
  Activity,
  Loader2,
} from 'lucide-react';
import { useMemo, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useAgentSocket } from '../hooks/useAgentSocket';

interface AdData {
  date: string;
  campaign: string;
  cliques: number;
  impressoes: number;
  custo: number;
  conversoes: number;
  cpa: number;
  roas: number;
}

interface GA4CityData {
  city: string;
  activeUsers: string;
}

interface NeuroInsight {
  id: string;
  title: string;
  category: string;
  description: string;
  actions: string; // JSON string
  confidence: number;
  created_at: string;
}

interface ReportActivity {
  id: string;
  task: string;
  type: string;
  created_at: string;
  url?: string;
}

const InsightCard = ({
  insight,
  onAction
}: {
  insight: NeuroInsight;
  onAction: (type: string, id: string) => void
}) => {
  const actionsList = useMemo(() => {
    try {
      const parsed = JSON.parse(insight.actions);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, [insight.actions]);

  const categoryColor = useMemo(() => {
    switch (insight.category.toLowerCase()) {
      case 'priority': return 'text-red-400 border-red-500/20 bg-red-500/5';
      case 'opportunity': return 'text-[#2EED8F] border-[#2EED8F]/20 bg-[#2EED8F]/5';
      case 'risk': return 'text-orange-400 border-orange-500/20 bg-orange-500/5';
      default: return 'text-blue-400 border-blue-500/20 bg-blue-500/5';
    }
  }, [insight.category]);

  return (
    <div className="bg-[#151515] border border-gray-800/40 rounded-xl p-5 hover:border-[#2EED8F]/30 transition-all group shadow-sm flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border ${categoryColor}`}>
          {insight.category}
        </div>
        <div className="text-[10px] text-gray-600 font-mono">
          {new Date(insight.created_at).toLocaleDateString()}
        </div>
      </div>

      <h3 className="text-white font-bold text-lg mb-2 group-hover:text-[#2EED8F] transition-colors leading-tight">
        {insight.title}
      </h3>

      <div className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-4 prose prose-invert prose-p:my-0">
        <ReactMarkdown>
          {insight.description}
        </ReactMarkdown>
      </div>

      {actionsList.length > 0 && (
        <div className="space-y-2 mb-6">
          {actionsList.slice(0, 2).map((action, i) => (
            <div key={i} className="flex items-center gap-2 text-[11px] text-gray-500">
              <div className="w-1 h-1 rounded-full bg-[#2EED8F]"></div>
              <span className="truncate">{action}</span>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-3 pt-4 border-t border-gray-800/60 mt-auto">
        <button
          onClick={() => onAction('implement', insight.id)}
          className="flex-1 bg-[#2EED8F] hover:bg-[#20c978] text-[#0A0A0A] py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 active:scale-95"
        >
          <Zap size={14} /> Implementar
        </button>
        <button
          onClick={() => onAction('study', insight.id)}
          className="flex-1 bg-white/5 hover:bg-white/10 text-gray-300 py-2 rounded-lg text-xs font-bold border border-white/5 transition-all flex items-center justify-center gap-2 active:scale-95"
        >
          <Activity size={14} /> Estudar
        </button>
      </div>
    </div>
  );
};

export const Dashboard: React.FC = () => {
  const [adsData, setAdsData] = useState<AdData[]>([]);
  const [gaData, setGaData] = useState<GA4CityData[]>([]);
  const [insights, setInsights] = useState<NeuroInsight[]>([]);
  const [reports, setReports] = useState<ReportActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGaLoading, setIsGaLoading] = useState(true);

  const { isConnected, isRunning, sendTask } = useAgentSocket('ws://localhost:8000/ws');

  const fetchData = async (): Promise<void> => {
    setIsLoading(true);
    try {
      // Fetch Metrics from Spreadsheet
      const sheetResponse = await fetch(
        'https://corsproxy.io/?url=' +
        encodeURIComponent(
          'https://docs.google.com/spreadsheets/d/1vAho1pFtyn8StKdZHrSrzSksFnY281g8BTA_hKbHsKw/export?format=csv'
        )
      );
      const csvText = await sheetResponse.text();
      const rows = csvText.split('\n');
      const data: AdData[] = [];
      for (let i = 1; i < rows.length; i++) {
        const cols = rows[i].split(',');
        if (cols.length > 15 && cols[1]) {
          data.push({
            date: cols[1].trim(),
            campaign: cols[3].trim().replace(/^"|"$/g, ''),
            cliques: parseInt(cols[4]) || 0,
            impressoes: parseInt(cols[5]) || 0,
            custo: parseFloat(cols[8]) || 0,
            conversoes: parseFloat(cols[12]) || 0,
            cpa: parseFloat(cols[13]) || 0,
            roas: parseFloat(cols[16]) || 0,
          });
        }
      }
      setAdsData(data);

      // Fetch NeuroInsights from our new API
      const insightsRes = await fetch('http://localhost:8000/api/dashboard/insights');
      const insightsData = await insightsRes.json();
      setInsights(Array.isArray(insightsData) ? insightsData : []);

      // Fetch Reports from our new API
      const reportsRes = await fetch('http://localhost:8000/api/reports/latest');
      const reportsData = await reportsRes.json();
      setReports(Array.isArray(reportsData) ? reportsData : []);

    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchGA4Data = async (): Promise<void> => {
    setIsGaLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/analytics/active-users');
      const data = await response.json();
      if (Array.isArray(data)) setGaData(data);
    } catch (error) {
      console.error('Failed to fetch GA4 data:', error);
    } finally {
      setIsGaLoading(false);
    }
  };

  useEffect(() => {
    void fetchData();
    void fetchGA4Data();
  }, []);

  useEffect(() => {
    if (!isRunning && hasStartedAudit) {
      void fetchData();
    }
  }, [isRunning]);

  const [hasStartedAudit, setHasStartedAudit] = useState(false);

  const handleUpdateAll = async () => {
    setHasStartedAudit(true);
    // 1. Refresh regular data
    await Promise.all([fetchData(), fetchGA4Data()]);

    // 2. Trigger Global AI Audit via LAM
    if (isConnected && !isRunning) {
      const prompt = `Realize um diagnóstico estratégico global do ecossistema www.hipnolawrence.com. 
Protocolo:
1. Auditoria Abidus (Posicionamento e Concorrência).
2. Auditoria SEO Técnica e On-Page.
3. Validação de Compliance YMYL (Saúde).
Gere novos NeuroInsights e salve no banco de dados para atualização do Painel Central.`;
      sendTask(prompt);
    }
  };

  const totalCost = useMemo(() => adsData.reduce((acc, curr) => acc + curr.custo, 0), [adsData]);
  const totalConversions = useMemo(() => adsData.reduce((acc, curr) => acc + curr.conversoes, 0), [adsData]);
  const avgCpa = totalConversions > 0 ? (totalCost / totalConversions).toFixed(2) : '0.00';

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-[#0A0A0A]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-[#2EED8F]" size={48} />
          <p className="text-gray-500 font-mono text-xs animate-pulse text-center">Iniciando Hub Estratégico...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-6 font-sans">
      <header className="flex justify-between items-end flex-shrink-0 px-2">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Painel Estratégico</h1>
          <p className="text-gray-500 text-sm mt-1">Visão consolidada de inteligência e performance clínica.</p>
        </div>
        <button
          onClick={handleUpdateAll}
          disabled={isRunning}
          className="px-6 py-2 bg-[#2EED8F] border border-[#2EED8F]/20 text-[#0A0A0A] rounded-xl text-xs font-bold hover:bg-[#28d681] transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50 shadow-[0_0_20px_rgba(46,237,143,0.15)]"
        >
          {isRunning ? (
            <>
              <Loader2 size={14} className="animate-spin" /> Rodando Diagnóstico...
            </>
          ) : (
            <>
              <Zap size={14} /> Atualizar Tudo
            </>
          )}
        </button>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 flex-shrink-0">
        <div className="bg-[#111111] border border-gray-800/40 rounded-2xl p-5 flex items-center gap-5 shadow-sm">
          <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl"><DollarSign size={24} /></div>
          <div>
            <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Investimento</p>
            <p className="text-2xl font-bold text-white font-mono tracking-tighter">R$ {totalCost.toFixed(2)}</p>
          </div>
        </div>
        <div className="bg-[#111111] border border-gray-800/40 rounded-2xl p-5 flex items-center gap-5 shadow-sm">
          <div className="p-3 bg-[#2EED8F]/10 text-[#2EED8F] rounded-xl"><TrendingUp size={24} /></div>
          <div>
            <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Conversões</p>
            <p className="text-2xl font-bold text-white font-mono tracking-tighter">{totalConversions}</p>
          </div>
        </div>
        <div className="bg-[#111111] border border-gray-800/40 rounded-2xl p-5 flex items-center gap-5 shadow-sm">
          <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl"><Target size={24} /></div>
          <div>
            <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">CPA Médio</p>
            <p className="text-2xl font-bold text-white font-mono tracking-tighter">R$ {avgCpa}</p>
          </div>
        </div>
        <div className="bg-[#111111] border border-gray-800/40 rounded-2xl p-5 flex items-center gap-5 shadow-sm">
          <div className="p-3 bg-orange-500/10 text-orange-400 rounded-xl"><Users size={24} /></div>
          <div>
            <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Usuários Ativos</p>
            <p className="text-2xl font-bold text-white font-mono tracking-tighter">{gaData.reduce((acc, c) => acc + parseInt(c.activeUsers || '0'), 0)}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex gap-6 min-h-0">
        {/* Main Insights Column */}
        <div className="flex-[2.5] flex flex-col gap-4 overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <Zap size={20} className="text-[#2EED8F]" />
              <h2 className="text-sm font-black uppercase tracking-[0.2em] text-gray-200">Neuro Engine Insights</h2>
            </div>
            <span className="text-[10px] text-[#2EED8F] bg-[#2EED8F]/10 px-2 py-0.5 rounded-full font-bold">LIVE INTELLIGENCE</span>
          </div>

          <div className="flex-1 overflow-y-auto pr-3 custom-scrollbar">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-6">
              {insights.length > 0 ? (
                insights.map((insight) => (
                  <InsightCard
                    key={insight.id}
                    insight={insight}
                    onAction={(type, id) => console.log('Action:', type, 'Insight ID:', id)}
                  />
                ))
              ) : (
                <div className="col-span-full py-32 flex flex-col items-center justify-center bg-[#111111]/50 rounded-3xl border border-dashed border-gray-800/60">
                  <Activity className="text-gray-700 mb-4" size={40} />
                  <p className="text-gray-500 italic text-sm">Nenhuma recomendação disponível.</p>
                  <p className="text-gray-600 text-xs mt-1 text-center max-w-xs">Gere análises de campo (Abidus) ou SEO para alimentar o motor de inteligência.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Activity & Geo Column */}
        <div className="flex-1 flex flex-col gap-6 overflow-hidden">
          {/* Recent Activity */}
          <div className="flex flex-col gap-4 overflow-hidden h-[60%]">
            <div className="flex items-center gap-2">
              <Activity size={18} className="text-purple-400" />
              <h2 className="text-sm font-bold uppercase tracking-widest text-gray-300">Auditorias Recentes</h2>
            </div>
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
              {reports.length > 0 ? (
                reports.map((report) => (
                  <div key={report.id} className="bg-[#111111] border border-gray-800/40 p-4 rounded-2xl group hover:bg-[#151515] hover:border-[#2EED8F]/20 transition-all cursor-pointer shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[9px] uppercase font-bold text-[#2EED8F]/80 bg-[#2EED8F]/10 px-1.5 py-0.5 rounded truncate">
                        {report.type.replace('_', ' ')}
                      </span>
                      <span className="text-[8px] text-gray-600 font-mono">
                        {new Date(report.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-white text-[11px] font-bold leading-tight mb-1 group-hover:text-[#2EED8F] transition-colors">
                      {report.task.length > 60 ? report.task.substring(0, 60) + '...' : report.task}
                    </p>
                    {report.url && (
                      <div className="text-[9px] text-gray-600 truncate italic">
                        {new URL(report.url).hostname}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="py-20 text-center border border-dashed border-gray-900 rounded-2xl">
                  <p className="text-gray-700 text-[10px] italic">Sem atividade recente.</p>
                </div>
              )}
            </div>
          </div>

          {/* Geo Data */}
          <div className="bg-[#111111] border border-gray-800/40 rounded-2xl p-5 mt-auto shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest border-b border-gray-800 pb-2 flex-1">
                Geo-Realtime (GA4)
              </h3>
            </div>
            <div className="space-y-3">
              {isGaLoading ? (
                <Loader2 className="animate-spin text-gray-800 mx-auto" size={16} />
              ) : gaData.length > 0 ? (
                gaData.slice(0, 4).map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center group">
                    <span className="text-[10px] text-gray-400 group-hover:text-white transition-colors">{item.city}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-[#2EED8F]">{item.activeUsers}</span>
                      <div className="w-1.5 h-1.5 rounded-full bg-[#2EED8F] animate-pulse"></div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-[10px] text-gray-700 italic">Dados geo indisponíveis.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
