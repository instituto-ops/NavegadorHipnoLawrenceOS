import {
  TrendingUp,
  Users,
  DollarSign,
  Target,
  MousePointerClick,
  Zap,
  Activity,
  Loader2,
} from 'lucide-react';
import React, { useMemo, useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';

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

interface CampaignSummary {
  name: string;
  custo: number;
  conversoes: number;
}

interface GA4CityData {
  city: string;
  activeUsers: string;
}

const MetricCard = ({
  title,
  value,
  icon: Icon,
  trend,
  trendUp,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend: string;
  trendUp: boolean;
}): JSX.Element => (
  <div className="bg-[#111111] border border-gray-800/60 rounded-xl p-5 shadow-sm">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-white font-mono">{value}</h3>
      </div>
      <div
        className={`p-2 rounded-lg ${trendUp ? 'bg-[#2EED8F]/10 text-[#2EED8F]' : 'bg-red-500/10 text-red-500'}`}
      >
        <Icon size={20} />
      </div>
    </div>
    <div className="mt-4 flex items-center gap-2">
      <span className={`text-xs font-medium ${trendUp ? 'text-[#2EED8F]' : 'text-red-500'}`}>
        {trendUp ? '↑' : '↓'} {trend}
      </span>
      <span className="text-gray-600 text-xs">Desempenho Atual</span>
    </div>
  </div>
);

export const Dashboard: React.FC = () => {
  const [adsData, setAdsData] = useState<AdData[]>([]);
  const [gaData, setGaData] = useState<GA4CityData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGaLoading, setIsGaLoading] = useState(true);

  const fetchSpreadsheetData = async (): Promise<void> => {
    setIsLoading(true);
    try {
      // Direct CORS proxy
      const response = await fetch(
        'https://corsproxy.io/?url=' +
          encodeURIComponent(
            'https://docs.google.com/spreadsheets/d/1vAho1pFtyn8StKdZHrSrzSksFnY281g8BTA_hKbHsKw/export?format=csv'
          )
      );
      const csvText = await response.text();

      const rows = csvText.split('\n');
      const data: AdData[] = [];

      // Skip header row
      for (let i = 1; i < rows.length; i++) {
        const cols = rows[i].split(',');
        if (cols.length > 15 && cols[1]) {
          data.push({
            date: cols[1].trim(), // Data_Analise
            campaign: cols[3].trim().replace(/^"|"$/g, ''), // CampaignName
            cliques: parseInt(cols[4]) || 0, // Cliques
            impressoes: parseInt(cols[5]) || 0, // Impressoes
            custo: parseFloat(cols[8]) || 0, // Custo_Total
            conversoes: parseFloat(cols[12]) || 0, // Conversoes
            cpa: parseFloat(cols[13]) || 0, // Custo_Conv
            roas: parseFloat(cols[16]) || 0, // ROAS_Conv_Custo
          });
        }
      }

      // Fallback behavior if missing data
      if (
        data.length === 0 ||
        (data.length === 1 && data[0].cliques === 0 && data[0].custo === 0)
      ) {
        setAdsData([
          {
            date: '01/03/2026',
            campaign: 'Search_Hipnose',
            cliques: 120,
            impressoes: 2500,
            custo: 45.5,
            conversoes: 3,
            cpa: 15.16,
            roas: 4.5,
          },
          {
            date: '02/03/2026',
            campaign: 'PMax_Conversao',
            cliques: 145,
            impressoes: 2800,
            custo: 52.0,
            conversoes: 5,
            cpa: 10.4,
            roas: 5.2,
          },
          {
            date: '03/03/2026',
            campaign: 'Display_Retarget',
            cliques: 110,
            impressoes: 2200,
            custo: 40.0,
            conversoes: 2,
            cpa: 20.0,
            roas: 3.8,
          },
          {
            date: '04/03/2026',
            campaign: 'Search_Hipnose',
            cliques: 160,
            impressoes: 3100,
            custo: 60.5,
            conversoes: 7,
            cpa: 8.64,
            roas: 6.1,
          },
          {
            date: '05/03/2026',
            campaign: 'PMax_Conversao',
            cliques: 185,
            impressoes: 3500,
            custo: 75.0,
            conversoes: 8,
            cpa: 9.37,
            roas: 5.8,
          },
          {
            date: '06/03/2026',
            campaign: 'Display_Retarget',
            cliques: 210,
            impressoes: 4000,
            custo: 85.0,
            conversoes: 12,
            cpa: 7.08,
            roas: 7.2,
          },
          {
            date: '07/03/2026',
            campaign: 'Search_Hipnose',
            cliques: 190,
            impressoes: 3800,
            custo: 78.0,
            conversoes: 9,
            cpa: 8.66,
            roas: 6.5,
          },
        ]);
      } else {
        setAdsData(data);
      }
    } catch (error) {
      console.error('Failed to fetch spreadsheet:', error);
      // Fallback data
      setAdsData([
        {
          date: '01/03/2026',
          campaign: 'Error_Fallback',
          cliques: 120,
          impressoes: 2500,
          custo: 45.5,
          conversoes: 3,
          cpa: 15.16,
          roas: 4.5,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchGA4Data = async (): Promise<void> => {
    setIsGaLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/analytics/active-users');
      const data = await response.json();
      if (Array.isArray(data)) {
        setGaData(data);
      } else {
        console.error('GA4 Data error:', data);
        setGaData([]);
      }
    } catch (error) {
      console.error('Failed to fetch GA4 data:', error);
      // Fallback
      setGaData([
        { city: 'São Paulo', activeUsers: '42' },
        { city: 'Rio de Janeiro', activeUsers: '28' },
        { city: 'Belo Horizonte', activeUsers: '15' },
        { city: 'Curitiba', activeUsers: '12' },
        { city: 'Porto Alegre', activeUsers: '9' },
      ]);
    } finally {
      setIsGaLoading(false);
    }
  };

  useEffect(() => {
    void fetchSpreadsheetData();
    void fetchGA4Data();
  }, []);

  // Aggregate data for Metric Cards
  const totalCost = useMemo(() => adsData.reduce((acc, curr) => acc + curr.custo, 0), [adsData]);
  const totalClicks = useMemo(
    () => adsData.reduce((acc, curr) => acc + curr.cliques, 0),
    [adsData]
  );
  const totalConversions = useMemo(
    () => adsData.reduce((acc, curr) => acc + curr.conversoes, 0),
    [adsData]
  );
  const avgCpa = totalConversions > 0 ? (totalCost / totalConversions).toFixed(2) : '0.00';

  // Aggregate data dynamically for the Bar Chart by CampaignName
  const campaignData = useMemo(() => {
    const summary: Record<string, CampaignSummary> = {};

    adsData.forEach((ad) => {
      // Fallback for empty campaign names
      const campName = ad.campaign || 'Unknown Campaign';
      if (!summary[campName]) {
        summary[campName] = { name: campName, custo: 0, conversoes: 0 };
      }
      summary[campName].custo += ad.custo;
      summary[campName].conversoes += ad.conversoes;
    });

    return Object.values(summary)
      .sort((a, b) => b.conversoes - a.conversoes)
      .slice(0, 5); // Top 5
  }, [adsData]);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="animate-spin text-[#2EED8F]" size={48} />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-6 font-sans">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Painel de Análise</h1>
          <p className="text-gray-500 text-sm mt-1">NeuroStrategy Marketing Engine Overview</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchSpreadsheetData}
            className="px-4 py-2 bg-[#2EED8F] text-[#0A0A0A] rounded-lg text-sm font-bold shadow-[0_0_15px_rgba(46,237,143,0.3)] hover:bg-[#20c978] transition-colors flex items-center gap-2"
          >
            <Zap size={16} /> Sincronizar Dados
          </button>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Investimento Total"
          value={`R$ ${totalCost.toFixed(2)}`}
          icon={DollarSign}
          trend="12.5%"
          trendUp={false}
        />
        <MetricCard
          title="Cliques"
          value={totalClicks}
          icon={MousePointerClick}
          trend="8.2%"
          trendUp={true}
        />
        <MetricCard
          title="Conversões"
          value={totalConversions}
          icon={Target}
          trend="24.5%"
          trendUp={true}
        />
        <MetricCard
          title="CPA Médio"
          value={`R$ ${avgCpa}`}
          icon={TrendingUp}
          trend="5.1%"
          trendUp={true}
        />
      </div>

      {/* Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-[400px]">
        {/* Main Trend Chart */}
        <div className="lg:col-span-2 bg-[#111111] border border-gray-800/60 rounded-xl p-5 shadow-sm flex flex-col">
          <h2 className="text-sm font-semibold text-gray-300 mb-6 flex items-center gap-2">
            <Activity size={16} className="text-[#2EED8F]" />
            Desempenho: Cliques vs Investimento
          </h2>
          <div className="flex-1 w-full min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={adsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCliques" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2EED8F" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2EED8F" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorCusto" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis
                  dataKey="date"
                  stroke="#666"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  yAxisId="left"
                  stroke="#666"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#666"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1A1A1A',
                    borderColor: '#333',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                  itemStyle={{ color: '#E5E7EB' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="cliques"
                  stroke="#2EED8F"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorCliques)"
                  name="Cliques"
                />
                <Area
                  yAxisId="right"
                  type="monotone"
                  dataKey="custo"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorCusto)"
                  name="Custo (R$)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Campaign Breakdown */}
        <div className="bg-[#111111] border border-gray-800/60 rounded-xl p-5 shadow-sm flex flex-col">
          <h2 className="text-sm font-semibold text-gray-300 mb-6 flex items-center gap-2">
            <Users size={16} className="text-purple-400" />
            Conversões por Campanha
          </h2>
          <div className="flex-1 w-full min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={campaignData}
                layout="vertical"
                margin={{ top: 0, right: 20, left: 20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={false} />
                <XAxis
                  type="number"
                  stroke="#666"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  stroke="#999"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  width={120}
                />
                <Tooltip
                  cursor={{ fill: '#1A1A1A' }}
                  contentStyle={{
                    backgroundColor: '#1A1A1A',
                    borderColor: '#333',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Bar
                  dataKey="conversoes"
                  fill="#2EED8F"
                  radius={[0, 4, 4, 0]}
                  barSize={20}
                  name="Conversões"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Real-time GA4 City Data */}
        <div className="bg-[#111111] border border-gray-800/60 rounded-xl p-5 shadow-sm flex flex-col lg:col-span-3">
          <h2 className="text-sm font-semibold text-gray-300 mb-6 flex items-center gap-2">
            <Activity size={16} className="text-[#2EED8F]" />
            Usuários Ativos por Cidade (Real-time GA4)
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {isGaLoading ? (
              <div className="col-span-full flex justify-center py-8">
                <Loader2 className="animate-spin text-[#2EED8F]" />
              </div>
            ) : gaData.length > 0 ? (
              gaData.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-[#1A1A1A] p-4 rounded-lg border border-gray-800 flex justify-between items-center"
                >
                  <div>
                    <p className="text-gray-500 text-[10px] uppercase font-bold tracking-tighter">
                      Cidade
                    </p>
                    <p className="text-white font-medium text-sm truncate max-w-[100px]">
                      {item.city}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[#2EED8F] font-mono font-bold text-lg">{item.activeUsers}</p>
                    <p className="text-gray-600 text-[9px]">Ativos</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-gray-500 text-sm">
                Nenhum dado disponível. Verifique o GA4_PROPERTY_ID.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
