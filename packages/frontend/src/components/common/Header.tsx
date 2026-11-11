import React from 'react';
import {
  Compass,
  Database,
  Cpu,
  GraduationCap,
  Sparkles,
  MapPin,
  CheckCircle2,
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'planner' | 'rag' | 'mcp' | 'academic';
  onTabChange: (tab: 'planner' | 'rag' | 'mcp' | 'academic') => void;
  chunksCount?: number;
  toolsCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  chunksCount = 18,
  toolsCount = 2,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Tagline */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onTabChange('planner')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 ring-1 ring-emerald-400/30">
              <Compass className="w-6 h-6 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold tracking-tight text-white">Travecto</span>
                <span className="px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded">
                  v1.0 Clean Arch
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Trajeto + Vetores Semânticos • LangGraph & MCP
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={() => onTabChange('planner')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'planner'
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm shadow-emerald-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Planejador</span>
            </button>

            <button
              onClick={() => onTabChange('rag')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'rag'
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm shadow-emerald-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <Database className="w-4 h-4 text-emerald-400" />
              <span>Base RAG</span>
            </button>

            <button
              onClick={() => onTabChange('mcp')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'mcp'
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm shadow-emerald-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>Console MCP</span>
            </button>

            <button
              onClick={() => onTabChange('academic')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'academic'
                  ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30 shadow-sm shadow-purple-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-purple-400" />
              <span className="hidden sm:inline">Banca Avaliadora</span>
              <span className="sm:hidden">Banca</span>
            </button>
          </nav>

          {/* Engine Status Pills */}
          <div className="hidden lg:flex items-center space-x-3 text-xs">
            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-slate-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-mono text-[11px]">LangGraph</span>
            </div>

            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
              <span>RAG: {chunksCount} chunks</span>
            </div>

            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>MCP: {toolsCount} tools</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

