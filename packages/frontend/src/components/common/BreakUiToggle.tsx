import React from 'react';
import { ShieldAlert, Sparkles } from 'lucide-react';

export type UiDataMode = 'demo' | 'worst-case';

interface BreakUiToggleProps {
  mode: UiDataMode;
  onModeChange: (mode: UiDataMode) => void;
}

export const BreakUiToggle: React.FC<BreakUiToggleProps> = ({ mode, onModeChange }) => {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
      <div className="flex items-center space-x-1 bg-slate-900/90 backdrop-blur-md p-1 rounded-full border border-slate-700/80 shadow-2xl ring-1 ring-white/10 text-xs">
        <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 px-2.5 py-0.5 hidden sm:inline">
          break-ui tool
        </span>

        <button
          type="button"
          onClick={() => onModeChange('demo')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full font-medium transition-[background-color,color] duration-150 ${
            mode === 'demo'
              ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 shrink-0" />
          <span>Demo normal</span>
        </button>

        <button
          type="button"
          onClick={() => onModeChange('worst-case')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full font-medium transition-[background-color,color] duration-150 ${
            mode === 'worst-case'
              ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
          <span>Worst case</span>
        </button>
      </div>
    </div>
  );
};

