import classNames from 'classnames';
import {
  LayoutDashboard,
  Search,
  Sparkles,
  BarChart3,
  Megaphone,
  Fingerprint,
  Settings,
  ShieldCheck,
  Zap,
  MessageSquareText,
  Code2,
} from 'lucide-react';
import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';

export const MainLayout: React.FC = () => {
  const navLinkClass = ({ isActive }: { isActive: boolean }): string =>
    classNames(
      'flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group relative',
      isActive
        ? 'bg-[#2EED8F]/10 text-[#2EED8F]'
        : 'text-gray-400 hover:text-white hover:bg-white/5'
    );

  const activeIndicator = (isActive: boolean): React.ReactNode =>
    isActive && (
      <div className="absolute left-0 w-1 h-5 bg-[#2EED8F] rounded-r-full shadow-[0_0_10px_#2EED8F]" />
    );

  return (
    <div className="flex h-screen w-full bg-[#070707] text-gray-300 overflow-hidden selection:bg-[#2EED8F]/20">
      {/* Sidebar - Ultra Premium */}
      <aside className="w-72 flex-shrink-0 flex flex-col border-r border-white/5 bg-[#0D0D0D]/80 backdrop-blur-3xl overflow-y-auto custom-scrollbar">
        {/* App Branding */}
        <div className="p-6 pb-2">
          <div className="flex items-center gap-3 mb-1">
            <div className="relative group">
              <div className="absolute -inset-1 bg-[#2EED8F] rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative w-10 h-10 bg-[#151515] rounded-xl flex items-center justify-center border border-white/10">
                <ShieldCheck className="text-[#2EED8F]" size={22} />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-white tracking-tight">NeuroStrategy</span>
              <div className="flex items-center gap-1.5">
                <span className="flex h-1.5 w-1.5 rounded-full bg-[#2EED8F] animate-pulse"></span>
                <span className="text-[10px] text-gray-500 font-mono tracking-tighter uppercase">
                  OS v5.2 Active
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Global Search / Quick Action */}
        <div className="px-4 py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
            <input
              type="text"
              placeholder="Search or Command..."
              className="w-full bg-[#151515] border border-white/5 rounded-lg py-2 pl-9 pr-4 text-xs focus:outline-none focus:border-[#2EED8F]/50 transition-colors"
            />
          </div>
        </div>

        {/* Navigation Groups */}
        <div className="flex-1 px-3 space-y-6 pt-2 pb-8 overflow-y-auto custom-scrollbar">
          {/* Main Intelligence */}
          <section>
            <h2 className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.2em] mb-3 px-3">
              Brain & Intel
            </h2>
            <nav className="space-y-1">
              <NavLink to="/" end className={navLinkClass}>
                {({ isActive }) => (
                  <>
                    {activeIndicator(isActive)}
                    <LayoutDashboard
                      size={18}
                      className={isActive ? 'text-[#2EED8F]' : 'text-gray-500'}
                    />
                    <span className="text-sm font-medium">Painel Central</span>
                  </>
                )}
              </NavLink>
              <NavLink to="/navigator" className={navLinkClass}>
                {({ isActive }) => (
                  <>
                    {activeIndicator(isActive)}
                    <Zap size={18} className={isActive ? 'text-[#2EED8F]' : 'text-gray-500'} />
                    <span className="text-sm font-medium">Navegador Autônomo</span>
                  </>
                )}
              </NavLink>
              <NavLink to="/jules-workspace" className={navLinkClass}>
                {({ isActive }) => (
                  <>
                    {activeIndicator(isActive)}
                    <Code2 size={18} className={isActive ? 'text-[#2EED8F]' : 'text-gray-500'} />
                    <span className="text-sm font-medium">Jules Copilot</span>
                  </>
                )}
              </NavLink>
            </nav>
          </section>

          {/* Marketing Core */}
          <section>
            <h2 className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.2em] mb-3 px-3">
              Marketing Hub
            </h2>
            <nav className="space-y-1">
              <NavLink to="/seo-intelligence" className={navLinkClass}>
                {({ isActive }) => (
                  <>
                    {activeIndicator(isActive)}
                    <Sparkles size={18} className={isActive ? 'text-[#2EED8F]' : 'text-gray-500'} />
                    <span className="text-sm font-medium">Agente de SEO</span>
                  </>
                )}
              </NavLink>
              <NavLink to="/abidus-analysis" className={navLinkClass}>
                {({ isActive }) => (
                  <>
                    {activeIndicator(isActive)}
                    <Fingerprint
                      size={18}
                      className={isActive ? 'text-[#2EED8F]' : 'text-gray-500'}
                    />
                    <span className="text-sm font-medium">Análise de Campo</span>
                  </>
                )}
              </NavLink>
              <NavLink to="/marketing-factory" className={navLinkClass}>
                {({ isActive }) => (
                  <>
                    {activeIndicator(isActive)}
                    <Megaphone
                      size={18}
                      className={isActive ? 'text-[#2EED8F]' : 'text-gray-500'}
                    />
                    <span className="text-sm font-medium">Criação & Copy</span>
                  </>
                )}
              </NavLink>
              <NavLink to="/whatsapp-crm" className={navLinkClass}>
                {({ isActive }) => (
                  <>
                    {activeIndicator(isActive)}
                    <MessageSquareText
                      size={18}
                      className={isActive ? 'text-[#2EED8F]' : 'text-gray-500'}
                    />
                    <span className="text-sm font-medium">WhatsApp CRM</span>
                  </>
                )}
              </NavLink>
            </nav>
          </section>

          {/* Analytics & Tools */}
          <section>
            <h2 className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.2em] mb-3 px-3">
              Data & Ecosystem
            </h2>
            <nav className="space-y-1">
              <NavLink to="/analytics" className={navLinkClass}>
                {({ isActive }) => (
                  <>
                    {activeIndicator(isActive)}
                    <BarChart3 size={18} className={isActive ? 'text-[#2EED8F]' : 'text-gray-500'} />
                    <span className="text-sm font-medium">Métricas Reais</span>
                  </>
                )}
              </NavLink>
              <NavLink to="/settings" className={navLinkClass}>
                {({ isActive }) => (
                  <>
                    {activeIndicator(isActive)}
                    <Settings size={18} className={isActive ? 'text-[#2EED8F]' : 'text-gray-500'} />
                    <span className="text-sm font-medium">Configurações</span>
                  </>
                )}
              </NavLink>
            </nav>
          </section>
        </div>

        {/* User / Org Footer */}
        <div className="p-4 bg-[#0D0D0D] border-t border-white/5">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-white/5 border border-white/5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2EED8F] to-[#1DA1F2] flex items-center justify-center text-[#0A0A0A] font-bold text-xs">
              VL
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-white truncate">Victor Lawrence</span>
              <span className="text-[10px] text-[#2EED8F] font-mono">Tier: Master Explorer</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#070707] overflow-hidden">
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-8 relative">
          {/* Subtle Ambient Background */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#2EED8F]/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

          <div className="relative h-full animate-fade-in flex flex-col">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};
