import classNames from 'classnames';
import { PenTool, CheckCircle2, Loader2, Wand2, Globe, Search, Target } from 'lucide-react';
import React, { useState, useEffect } from 'react';

const DOCTORALIA_TERMS = [
  'psic├│logo especialista em autismo em adultos',
  'hipnose cl├¡nica ericksoniana online',
  'psicoterapia breve estrat├®gica com hipnose',
  'tratamento para burnout autista',
  'avalia├º├úo de autismo em adultos Goi├ónia',
  'hipnoterapia para ansiedade online',
];

export const MarketingFactory: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'writer' | 'radar'>('writer');
  const [keyword, setKeyword] = useState('');
  const [title, setTitle] = useState('');
  const [metaDesc, setMetaDesc] = useState('');
  const [content, setContent] = useState('');
  const [score, setScore] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  // SEO Calculation Logic from Repo 5
  useEffect(() => {
    let s = 0;
    const kw = keyword.toLowerCase().trim();
    if (!kw) {
      setScore(0);
      return;
    }

    if (title.toLowerCase().includes(kw)) s += 30;
    if (content.toLowerCase().includes(kw)) s += 20;
    if (metaDesc.toLowerCase().includes(kw)) s += 20;
    if (content.split(/\s+/).length > 500) s += 20;
    if (title.length >= 40 && title.length <= 60) s += 10;

    setScore(s);
  }, [title, content, keyword, metaDesc]);

  const handleGenerate = async (): Promise<void> => {
    setIsGenerating(true);
    // Antigravity Engine Simulation
    setTimeout(() => {
      setTitle(`Guia Completo: ${keyword.charAt(0).toUpperCase() + keyword.slice(1)}`);
      setContent(
        `A busca por ${keyword} tem crescido exponencialmente. No Instituto Lawrence, entendemos que cada paciente ├® ├║nico...`
      );
      setMetaDesc(
        `Descubra como a ${keyword} pode transformar sua vida. Atendimento especializado em Goi├ónia e Online. Saiba mais.`
      );
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      {/* Sub-Navigation Hub */}
      <div className="flex items-center justify-between p-4 glass-dark rounded-2xl border border-white/5 mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveTab('writer')}
            className={classNames(
              'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all',
              activeTab === 'writer'
                ? 'bg-[#2EED8F] text-[#0A0A0A] shadow-[0_0_20px_rgba(46,237,143,0.3)]'
                : 'text-gray-500 hover:text-white'
            )}
          >
            <PenTool size={18} />
            Editor SEO Expert
          </button>
          <button
            onClick={() => setActiveTab('radar')}
            className={classNames(
              'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all',
              activeTab === 'radar'
                ? 'bg-[#2EED8F] text-[#0A0A0A] shadow-[0_0_20px_rgba(46,237,143,0.3)]'
                : 'text-gray-500 hover:text-white'
            )}
          >
            <Target size={18} />
            Radar de Rankings
          </button>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-black/40 rounded-lg border border-white/5 text-[10px] font-mono text-gray-500 uppercase tracking-widest">
          Status: Gemini Advanced Connected
        </div>
      </div>

      {activeTab === 'writer' ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* Main Editor */}
          <div className="lg:col-span-3 space-y-6">
            <div className="glass-dark rounded-3xl border border-white/5 p-8 space-y-6">
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                    <Search size={12} className="text-[#2EED8F]" /> Palavra-Chave Foco
                  </label>
                  <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="Ex: hipnose para ansiedade em goi├ónia"
                    className="bg-[#0D0D0D] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#2EED8F]/50 transition-all font-medium"
                  />
                  <div className="flex flex-wrap gap-2 mt-1">
                    {DOCTORALIA_TERMS.slice(0, 3).map((term) => (
                      <button
                        key={term}
                        onClick={() => setKeyword(term)}
                        className="text-[9px] bg-white/5 hover:bg-white/10 text-gray-400 px-2 py-1 rounded transition-colors uppercase tracking-tight border border-white/5"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-4 border-t border-white/5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                    T├¡tulo do Artigo (H1)
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="T├¡tulo otimizado para clique..."
                    className="bg-transparent border-none text-2xl font-bold text-white focus:outline-none placeholder:text-gray-700"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                    Meta Description
                  </label>
                  <textarea
                    value={metaDesc}
                    onChange={(e) => setMetaDesc(e.target.value)}
                    rows={2}
                    placeholder="Resumo persuasivo para o buscador..."
                    className="bg-[#0D0D0D] border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-300 focus:outline-none focus:border-[#2EED8F]/50 transition-all resize-none"
                  />
                </div>

                <div className="flex flex-col gap-2 pt-4">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                    Conte├║do Profundo
                  </label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={12}
                    placeholder="Use o Gemini Pro para carregar a estrutura aqui..."
                    className="bg-[#0D0D0D] border border-white/10 rounded-2xl px-6 py-6 text-lg text-gray-300 focus:outline-none focus:border-[#2EED8F]/50 transition-all font-serif leading-relaxed"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: Analysis & Actions */}
          <div className="lg:col-span-1 space-y-6">
            {/* SEO Score Circle */}
            <div className="glass rounded-3xl border border-white/5 p-8 flex flex-col items-center text-center">
              <div className="relative w-32 h-32 flex items-center justify-center mb-4">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="58"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-white/5"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="58"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={364}
                    strokeDashoffset={364 - (364 * score) / 100}
                    className={classNames(
                      'transition-all duration-1000',
                      score > 70 ? 'text-[#2EED8F]' : 'text-amber-500'
                    )}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-white">{score}</span>
                  <span className="text-[10px] text-gray-500 font-bold">SEO SCORE</span>
                </div>
              </div>
              <p className="text-xs text-gray-400 italic">
                "Siga o M├®todo Abidus para atingir 100/100"
              </p>
            </div>

            {/* Main Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full h-14 bg-gradient-to-r from-[#2EED8F] to-[#1DA1F2] rounded-2xl flex items-center justify-center gap-3 text-[#0A0A0A] font-black uppercase tracking-widest hover:scale-[1.02] transition-transform active:scale-95 disabled:opacity-50"
              >
                {isGenerating ? <Loader2 className="animate-spin" /> : <Wand2 size={20} />}
                Gerar com IA Pro
              </button>
              <button className="w-full h-14 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl flex items-center justify-center gap-3 text-white font-bold uppercase tracking-widest transition-all">
                <Globe size={18} />
                Agendar Publica├º├úo
              </button>
            </div>

            {/* Checklist */}
            <div className="p-6 glass-dark rounded-2xl border border-white/5 space-y-4">
              <h4 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">
                Checklist Expert
              </h4>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-xs">
                  <CheckCircle2
                    size={14}
                    className={
                      title.includes(keyword) && keyword ? 'text-[#2EED8F]' : 'text-gray-700'
                    }
                  />
                  KW no T├¡tulo Principal
                </li>
                <li className="flex items-center gap-2 text-xs">
                  <CheckCircle2
                    size={14}
                    className={content.length > 500 ? 'text-[#2EED8F]' : 'text-gray-700'}
                  />
                  Densidade de Conte├║do
                </li>
                <li className="flex items-center gap-2 text-xs">
                  <CheckCircle2
                    size={14}
                    className={metaDesc.length > 120 ? 'text-[#2EED8F]' : 'text-gray-700'}
                  />
                  Meta-Description Vendedora
                </li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        /* Radar View (Placeholder for now) */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {DOCTORALIA_TERMS.map((term) => (
            <div
              key={term}
              className="glass-dark p-6 rounded-2xl border border-white/5 flex items-center justify-between group hover:border-[#2EED8F]/30 transition-all cursor-pointer"
            >
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                  Ranking Doctoralia
                </span>
                <span className="text-sm font-bold text-white">{term}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-lg font-black text-[#2EED8F]">Top 3</span>
                <span className="text-[9px] text-[#2EED8F]/50 px-2 py-0.5 bg-[#2EED8F]/5 rounded uppercase">
                  Est├ível
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
