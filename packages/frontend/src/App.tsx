import React, { useState, useEffect } from 'react';
import { Header } from './components/common/Header.js';
import { GraphStateVisualizer } from './components/planner/GraphStateVisualizer.js';
import { TravelPreferenceForm } from './components/planner/TravelPreferenceForm.js';
import { ItineraryViewer } from './components/planner/ItineraryViewer.js';
import { RagDashboard } from './components/rag/RagDashboard.js';
import { McpConsole } from './components/mcp/McpConsole.js';
import { AcademicEvaluationView } from './components/academic/AcademicEvaluationView.js';
import { BreakUiToggle, UiDataMode } from './components/common/BreakUiToggle.js';
import { WORST_CASE_ITINERARY } from './fixtures/worst-case-itinerary.js';
import { useItineraryPlanner } from './hooks/useItineraryPlanner.js';
import { checkHealth } from './services/api.js';
import { SystemHealth } from './types/index.js';
import { Compass, AlertCircle, RefreshCw, ShieldAlert } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'planner' | 'rag' | 'mcp' | 'academic'>('planner');
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [uiMode, setUiMode] = useState<UiDataMode>('demo');

  const {
    itinerary,
    isLoading,
    currentStep,
    stepEvents,
    error,
    planTrip,
    reset,
  } = useItineraryPlanner();

  const loadHealth = async () => {
    try {
      const data = await checkHealth();
      setHealth(data);
    } catch {
      // Backend may be starting up
    }
  };

  useEffect(() => {
    loadHealth();
    const interval = setInterval(loadHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  const displayItinerary = uiMode === 'worst-case' ? WORST_CASE_ITINERARY : itinerary;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-300">
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        chunksCount={health?.metrics.rag.totalChunks || 16}
        toolsCount={health?.metrics.mcp.registeredToolsCount || 2}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-12">
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center justify-between shadow-lg">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
            <button
              onClick={reset}
              className="text-xs font-semibold px-2.5 py-1 rounded-md bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 transition-colors"
            >
              Tentar Novamente
            </button>
          </div>
        )}

        {/* Tab 1: Planner & Itinerary */}
        {activeTab === 'planner' && (
          <div className="space-y-8">
            {/* LangGraph State Machine Visualizer */}
            <GraphStateVisualizer
              currentStep={currentStep}
              stepEvents={stepEvents}
              isLoading={isLoading}
            />

            {/* Worst Case Notice Banner when active */}
            {uiMode === 'worst-case' && (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ShieldAlert className="w-4 h-4 shrink-0 text-amber-400" />
                  <span>
                    <strong>Modo Worst Case Ativo (Skill break-ui):</strong> Exibindo dados extremos de estresse (destino com 72 caracteres contínuos sem espaço, orçamento milionário e citações polares longas).
                  </span>
                </div>
                <button
                  onClick={() => setUiMode('demo')}
                  className="px-2.5 py-1 rounded-md bg-amber-400 text-slate-950 font-bold text-[11px] shrink-0"
                >
                  Voltar ao Demo
                </button>
              </div>
            )}

            {/* If no itinerary yet and not in worst-case, show form; otherwise show Itinerary */}
            {!displayItinerary ? (
              <TravelPreferenceForm onSubmit={planTrip} isLoading={isLoading} />
            ) : (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                  <div className="text-xs text-slate-400 truncate">
                    Roteiro ativo para: <strong className="text-white">{displayItinerary.destination}</strong> ({displayItinerary.days.length} dias)
                  </div>
                  <button
                    onClick={() => {
                      if (uiMode === 'worst-case') {
                        setUiMode('demo');
                      }
                      reset();
                    }}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-[0.97] text-xs font-semibold text-slate-200 border border-slate-700 transition-[transform,background-color] duration-150 shrink-0 self-start sm:self-auto"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Planejar Outra Viagem</span>
                  </button>
                </div>

                <ItineraryViewer itinerary={displayItinerary} />
              </div>
            )}
          </div>
        )}

        {/* Tab 2: RAG Vector Engine Dashboard */}
        {activeTab === 'rag' && <RagDashboard />}

        {/* Tab 3: MCP Console */}
        {activeTab === 'mcp' && <McpConsole />}

        {/* Tab 4: Academic & Architecture Board */}
        {activeTab === 'academic' && <AcademicEvaluationView />}
      </main>

      {/* Break UI Bottom Floating Segmented Control */}
      <BreakUiToggle mode={uiMode} onModeChange={setUiMode} />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <Compass className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-slate-400">Travecto AI Core</span>
            <span>•</span>
            <span>TypeScript & Clean Architecture</span>
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            LangGraph StateGraph • Vector RAG Engine • Model Context Protocol (MCP)
          </div>
        </div>
      </footer>
    </div>
  );
};
