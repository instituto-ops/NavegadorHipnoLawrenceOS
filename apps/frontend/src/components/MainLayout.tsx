import classNames from 'classnames';
import { Globe2, LayoutDashboard, Search, Sparkles } from 'lucide-react';
import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';

export const MainLayout: React.FC = () => {
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    classNames(
      'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium',
      isActive
        ? 'bg-[#2EED8F] text-[#0A0A0A] shadow-[0_0_15px_rgba(46,237,143,0.3)]'
        : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
    );

  return (
    <div className="flex h-screen w-full bg-[#0A0A0A] text-gray-200 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 flex flex-col border-r border-gray-800/60 bg-[#111111] overflow-y-auto custom-scrollbar p-4">
        {/* Logo / Header */}
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center border border-green-500/30">
            <Globe2 className="text-[#2EED8F]" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">Maestro OS</h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">
              Neural Assistant v5.1
            </p>
          </div>
        </div>

        {/* Navigation Groups */}
        <div className="flex-1 flex flex-col gap-6">
          <div>
            <h2 className="text-[11px] font-semibold text-gray-600 uppercase tracking-wider mb-3 px-2">
              Sistemas Core
            </h2>
            <nav className="flex flex-col gap-1">
              <NavLink to="/" end className={navLinkClass}>
                <Globe2 size={18} />
                <span>Navegador AI</span>
              </NavLink>
              <NavLink to="/dashboard" className={navLinkClass}>
                <LayoutDashboard size={18} className="text-[#2EED8F]" />
                <span>Painel de Análises</span>
              </NavLink>
              <NavLink to="/abidus-analysis" className={navLinkClass}>
                <Search size={18} className="text-[#2EED8F]" />
                <span>Análises Abidus</span>
              </NavLink>
              <NavLink to="/seo-intelligence" className={navLinkClass}>
                <Sparkles size={18} className="text-[#2EED8F]" />
                <span>Inteligência de SEO</span>
              </NavLink>
            </nav>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#0A0A0A] overflow-hidden">
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 relative">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
