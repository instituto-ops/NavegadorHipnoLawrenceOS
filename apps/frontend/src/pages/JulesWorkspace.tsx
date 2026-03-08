import { Terminal, Code2, Play, Sparkles } from 'lucide-react';
import React, { useState } from 'react';
import { JulesTerminal } from '../components/JulesTerminal';
import { useAgentSocket } from '../hooks/useAgentSocket';

export const JulesWorkspace: React.FC = () => {
  const [julesInput, setJulesInput] = useState('');

  const { julesLogs, isConnected, isJulesRunning, sendJulesCommand } =
    useAgentSocket('ws://localhost:8000/ws');

  const handleJulesSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (!julesInput.trim() || !isConnected || isJulesRunning) return;
    sendJulesCommand(julesInput);
    setJulesInput('');
  };

  const handleSuggestionClick = (command: string): void => {
    setJulesInput(command);
  };

  const suggestions = [
    {
      title: 'Status e Revisões',
      desc: 'Verificar a fila de Pull Requests no repositório.',
      command:
        'jules ask "Verifique a fila de Pull Requests e faça um resumo do que precisa ser revisado."',
    },
    {
      title: 'Corrigir Lint / CI',
      desc: 'Pedir ao Jules para consertar problemas de linting e type checking.',
      command:
        'jules ask "Analise os últimos logs de erro do CI/CD e sugira as correções necessárias nos arquivos afetados."',
    },
    {
      title: 'Refatoração Específica',
      desc: 'Exigir uma refatoração em um componente.',
      command:
        'jules ask "Refatore o componente x para melhor performance e legibilidade, garantindo tipagem estrita."',
    },
    {
      title: 'Atualizar Ambiente',
      desc: 'Sincronizar dependências e checar atualizações.',
      command:
        'jules ask "Verifique se há pacotes desatualizados no package.json que quebram o repositório."',
    },
  ];

  return (
    <div className="flex h-full w-full gap-6">
      {/* Coluna Esquerda: Sugestões e Hub Natural */}
      <div className="flex-[0.35] flex flex-col gap-4">
        <div className="bg-[#111] border border-white/5 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-blue-500/30">
              <Code2 className="text-blue-400" size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-200">Jules Copilot</h2>
              <p className="text-xs text-gray-500">Engenheiro de Software Autônomo</p>
            </div>
          </div>

          <p className="text-sm text-gray-400 mb-6 leading-relaxed">
            Use linguagem natural para pedir que o Jules revise código, aprove PRs ou conserte
            falhas de CI/CD. Clique nas sugestões abaixo para preencher o terminal.
          </p>

          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-600 mb-3 flex items-center gap-2">
            <Sparkles size={14} /> Pedidos Frequentes
          </h3>

          <div className="space-y-3">
            {suggestions.map((sug, i) => (
              <button
                key={i}
                onClick={() => handleSuggestionClick(sug.command)}
                className="w-full text-left p-3 rounded-lg bg-[#151515] border border-white/5 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-gray-300 group-hover:text-blue-400">
                    {sug.title}
                  </span>
                  <Play size={14} className="text-gray-600 group-hover:text-blue-400" />
                </div>
                <p className="text-xs text-gray-500 line-clamp-2">{sug.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Status de Conexão */}
        <div className="bg-[#111] border border-white/5 rounded-xl p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <Terminal className="text-gray-500" size={18} />
            <span className="text-sm font-medium text-gray-300">Conexão CLI</span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}
            ></span>
            <span className="text-xs font-mono text-gray-500">
              {isConnected ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>
      </div>

      {/* Coluna Direita: Jules Terminal */}
      <div className="flex-[0.65] flex flex-col min-w-0">
        <JulesTerminal
          logs={julesLogs}
          isRunning={isJulesRunning}
          isConnected={isConnected}
          input={julesInput}
          setInput={setJulesInput}
          onSubmit={handleJulesSubmit}
        />
      </div>
    </div>
  );
};
