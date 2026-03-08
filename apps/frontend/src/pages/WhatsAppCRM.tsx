import { MessageSquareText, Tags, Bot, Zap, Copy, Check, Edit3, Send } from 'lucide-react';
import React, { useState } from 'react';

export const WhatsAppCRM: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'hub' | 'tags'>('hub');
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState([
    {
      role: 'system',
      content: '📱 Hub de Agentes Clínicos Ativo. Como posso ajudar com este paciente?',
    },
  ]);
  const [suggestedReply] = useState<string | null>(
    'Olá! Parabéns por tomar a decisão de cuidar de sua saúde mental hoje. Poderia compartilhar de forma breve qual o momento pelo qual está passando? Assim garantimos que somos a melhor ajuda para você.'
  );

  const handleSendMessage = (): void => {
    if (!chatInput.trim()) return;
    setChatHistory([...chatHistory, { role: 'user', content: chatInput }]);
    setChatInput('');
    // Mock response from agents
    setTimeout(() => {
      setChatHistory((prev) => [
        ...prev,
        {
          role: 'system',
          content:
            'Analisando o quadro... Sugiro mantermos o foco no "Acolhimento Ativo" e "Alinhamento de Expectativas". Já preparei uma nova sugestão de resposta rápida baseada nos princípios clínicos.',
        },
      ]);
    }, 1000);
  };

  const copyToClipboard = (): void => {
    if (suggestedReply) {
      void navigator.clipboard.writeText(suggestedReply);
      alert('Copiado para a área de transferência!');
    }
  };

  return (
    <div className="flex h-full w-full bg-[#070707] overflow-hidden rounded-xl border border-white/5 relative">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#2EED8F]/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none z-0"></div>

      {/* Esquerda: WhatsApp Web WebView (approx 66% = 2/3) */}
      <div className="flex-[2] flex flex-col h-full border-r border-white/5 relative z-10 bg-[#111]">
        <div className="flex items-center justify-between p-3 border-b border-white/5 bg-[#0D0D0D]">
          <h2 className="text-sm font-bold text-gray-200 flex items-center gap-2">
            <MessageSquareText size={16} className="text-[#2EED8F]" />
            WhatsApp Integrado
          </h2>
          <div className="text-xs text-gray-500 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#2EED8F] animate-pulse"></span>
            Online
          </div>
        </div>
        {/* Usando webview do Electron para embutir o WhatsApp web */}
        <webview
          src="https://web.whatsapp.com/"
          className="w-full flex-1"
          useragent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
        />
      </div>

      {/* Direita: Ferramentas da Aba (approx 33% = 1/3) */}
      <div className="flex-[1] flex flex-col h-full bg-[#0D0D0D]/50 relative z-10">
        {/* Header Tools */}
        <div className="p-4 border-b border-white/5">
          <h3 className="text-base font-bold text-white mb-1">Painel de Atendimento</h3>
          <p className="text-xs text-gray-400">Hub Especialista & Categorização</p>
        </div>

        {/* Tabs */}
        <div className="flex px-4 border-b border-white/5 mt-2">
          <button
            className={`flex-1 pb-2 text-xs font-semibold uppercase tracking-wider ${activeTab === 'hub' ? 'text-[#2EED8F] border-b-2 border-[#2EED8F]' : 'text-gray-500 hover:text-gray-300'}`}
            onClick={() => setActiveTab('hub')}
          >
            Hub Clínico
          </button>
          <button
            className={`flex-1 pb-2 text-xs font-semibold uppercase tracking-wider ${activeTab === 'tags' ? 'text-[#2EED8F] border-b-2 border-[#2EED8F]' : 'text-gray-500 hover:text-gray-300'}`}
            onClick={() => setActiveTab('tags')}
          >
            Paciente & Tags
          </button>
        </div>

        {/* Tab Content: Hub Clínico */}
        <div
          className={`flex-1 flex flex-col overflow-hidden ${activeTab === 'hub' ? '' : 'hidden'}`}
        >
          {/* Box de Sugestão Ativa */}
          <div className="p-4 border-b border-white/5 bg-[#151515]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[#2EED8F] flex items-center gap-1 uppercase tracking-wider">
                <Zap size={12} />
                Sugestão Ativa
              </span>
              <div className="flex gap-2">
                <button
                  title="Editar"
                  className="p-1 hover:bg-white/5 rounded text-gray-400 hover:text-white transition-colors"
                >
                  <Edit3 size={14} />
                </button>
                <button
                  onClick={copyToClipboard}
                  title="Copiar"
                  className="p-1 hover:bg-white/5 rounded text-gray-400 hover:text-[#2EED8F] transition-colors"
                >
                  <Copy size={14} />
                </button>
              </div>
            </div>

            <div className="mb-3">
              <p className="text-sm text-gray-300 italic bg-black/40 p-3 rounded-lg border border-white/5">
                "{suggestedReply}"
              </p>
            </div>

            <button
              onClick={copyToClipboard}
              className="w-full py-2 bg-[#2EED8F]/10 hover:bg-[#2EED8F]/20 text-[#2EED8F] border border-[#2EED8F]/20 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <Check size={16} /> Utilizar Resposta
            </button>
          </div>

          {/* Chat com Agents */}
          <div className="flex-1 flex flex-col overflow-hidden bg-black/20">
            <div className="p-2 border-b border-white/5 flex items-center gap-2 bg-[#111]">
              <Bot size={14} className="text-[#2EED8F]" />
              <span className="text-xs font-bold text-gray-300">Discussão com Hub de Agentes</span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {chatHistory.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-xl text-sm ${msg.role === 'user' ? 'bg-[#2EED8F]/20 border border-[#2EED8F]/30 text-white rounded-br-none' : 'bg-[#151515] border border-white/5 text-gray-300 rounded-bl-none'}`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 border-t border-white/5 bg-[#0D0D0D]">
              <div className="flex items-center gap-2 relative">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Discutir caso com o Hub..."
                  className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg py-2 pl-3 pr-10 text-sm text-white focus:outline-none focus:border-[#2EED8F]/50 transition-colors"
                />
                <button
                  onClick={handleSendMessage}
                  className="absolute right-2 p-1.5 bg-[#2EED8F] rounded-md text-black hover:bg-[#25c477] transition-colors"
                >
                  <Send size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Content: Tags & Categoriza├º├úo */}
        <div
          className={`flex-1 flex flex-col p-4 overflow-y-auto custom-scrollbar ${activeTab === 'tags' ? '' : 'hidden'}`}
        >
          <div className="mb-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-2">
              <Tags size={14} />
              Categorização (n8n Sync)
            </h4>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">
                  Motivo do Contato (Intenção)
                </label>
                <select className="w-full bg-[#151515] border border-white/10 rounded-lg p-2 text-sm text-gray-200 outline-none focus:border-[#2EED8F]/50">
                  <option>Avaliação TEA Adulto</option>
                  <option>Ansiedade / Pânico</option>
                  <option>Trauma Extremo</option>
                  <option>Hipnose Ericksoniana</option>
                  <option>Dúvida de Valores</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-400 mb-1 block">Estágio de Consciência</label>
                <select className="w-full bg-[#151515] border border-white/10 rounded-lg p-2 text-sm text-gray-200 outline-none focus:border-[#2EED8F]/50">
                  <option>Preparação/Ação (Pronto p/ Agendar)</option>
                  <option>Contemplação (Precisa de Dúvidas)</option>
                  <option>Pré-contemplação (Só Curioso)</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-400 mb-1 block">
                  Risco Clínico Identificado?
                </label>
                <select className="w-full bg-[#151515] border border-white/10 rounded-lg p-2 text-sm text-gray-200 outline-none focus:border-[#2EED8F]/50">
                  <option>Normal (Zero red flags)</option>
                  <option>Baixo (Ansiedade Controlada)</option>
                  <option>Médio (Sintomas Agudos)</option>
                  <option className="text-red-500 font-bold">ALTO (Psicose / Tentativa)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
              Atributos do Lead
            </h4>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-md border border-blue-500/30 cursor-pointer hover:bg-blue-500/30">
                Vim pelo Google
              </span>
              <span className="px-2 py-1 bg-pink-500/20 text-pink-400 text-xs rounded-md border border-pink-500/30 cursor-pointer hover:bg-pink-500/30">
                Vim pelo Instagram
              </span>
              <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-md border border-yellow-500/30 cursor-pointer hover:bg-yellow-500/30">
                Particular
              </span>
              <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-md border border-purple-500/30 cursor-pointer hover:bg-purple-500/30">
                Plano de Saúde
              </span>
              <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-md border border-green-500/30 cursor-pointer hover:bg-green-500/30">
                + Adicionar Atributo
              </span>
            </div>
          </div>

          <button className="mt-auto w-full py-2.5 bg-[#151515] hover:bg-white/5 border border-white/10 rounded-lg text-sm font-semibold transition-colors flex justify-center items-center gap-2">
            Salvar Ficha no CRM
          </button>
        </div>
      </div>
    </div>
  );
};
