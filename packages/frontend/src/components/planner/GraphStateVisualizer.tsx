import React from 'react';
import {
  SlidersHorizontal,
  Database,
  Cpu,
  FileCheck2,
  CheckCircle2,
  Loader2,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import { OrchestrationStepEvent, OrchestrationStepName } from '../../types/index.js';

interface GraphStateVisualizerProps {
  currentStep: OrchestrationStepName | null;
  stepEvents: OrchestrationStepEvent[];
  isLoading: boolean;
}

interface NodeConfig {
  id: OrchestrationStepName;
  label: string;
  sublabel: string;
  icon: React.ElementType;
}

const NODES: NodeConfig[] = [
  {
    id: 'collect_preferences',
    label: '1. collect_preferences',
    sublabel: 'Validação de Perfil & Orçamento',
    icon: SlidersHorizontal,
  },
  {
    id: 'retrieve_context',
    label: '2. retrieve_context',
    sublabel: 'RAG Vetorial & Citações',
    icon: Database,
  },
  {
    id: 'call_mcp_tools',
    label: '3. call_mcp_tools',
    sublabel: 'Protocolo MCP (Clima & Câmbio)',
    icon: Cpu,
  },
  {
    id: 'synthesize_itinerary',
    label: '4. synthesize_itinerary',
    sublabel: 'Síntese & Alocação de Turnos',
    icon: FileCheck2,
  },
];

export const GraphStateVisualizer: React.FC<GraphStateVisualizerProps> = ({
  currentStep,
  stepEvents,
  isLoading,
}) => {
  const getNodeStatus = (nodeId: OrchestrationStepName) => {
    const nodeOrder: OrchestrationStepName[] = [
      'collect_preferences',
      'retrieve_context',
      'call_mcp_tools',
      'synthesize_itinerary',
      'completed',
    ];

    const currentIndex = currentStep ? nodeOrder.indexOf(currentStep) : -1;
    const nodeIndex = nodeOrder.indexOf(nodeId);

    if (currentStep === 'completed') return 'completed';
    if (currentIndex > nodeIndex) return 'completed';
    if (currentIndex === nodeIndex) return isLoading ? 'active' : 'completed';
    return 'pending';
  };

  const getLatestMessage = (nodeId: OrchestrationStepName) => {
    const matches = stepEvents.filter((e) => e.step === nodeId);
    if (matches.length === 0) return null;
    return matches[matches.length - 1].message;
  };

  return (
    <div className="w-full bg-slate-900/60 rounded-2xl border border-slate-800/80 p-5 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <h3 className="text-sm font-semibold text-slate-200 tracking-wide uppercase">
            Grafo de Estados LangGraph (Travecto Workflow)
          </h3>
        </div>
        <span className="text-xs font-mono text-slate-400 bg-slate-800/80 px-2 py-1 rounded border border-slate-700">
          State: {currentStep || 'IDLE'}
        </span>
      </div>

      {/* Nodes Line */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 relative">
        {NODES.map((node, index) => {
          const status = getNodeStatus(node.id);
          const Icon = node.icon;
          const msg = getLatestMessage(node.id);

          return (
            <div key={node.id} className="relative group">
              <div
                className={`flex flex-col h-full rounded-xl p-3.5 border transition-all duration-300 ${
                  status === 'active'
                    ? 'bg-emerald-950/40 border-emerald-500 shadow-lg shadow-emerald-500/20 ring-1 ring-emerald-400/50'
                    : status === 'completed'
                    ? 'bg-slate-900/90 border-teal-500/50'
                    : 'bg-slate-950/40 border-slate-800/80 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`p-2 rounded-lg ${
                      status === 'active'
                        ? 'bg-emerald-500 text-slate-950'
                        : status === 'completed'
                        ? 'bg-teal-500/20 text-teal-300'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  <div>
                    {status === 'active' && (
                      <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
                    )}
                    {status === 'completed' && (
                      <CheckCircle2 className="w-4 h-4 text-teal-400" />
                    )}
                    {status === 'pending' && (
                      <span className="text-[10px] text-slate-500 font-mono">STANDBY</span>
                    )}
                  </div>
                </div>

                <div className="font-mono text-xs font-semibold text-slate-200 mb-0.5">
                  {node.label}
                </div>
                <div className="text-[11px] text-slate-400 leading-snug">
                  {node.sublabel}
                </div>

                {msg && (
                  <div className="mt-2.5 pt-2 border-t border-slate-800/60 text-[10px] text-slate-300 line-clamp-2 italic font-sans">
                    "{msg}"
                  </div>
                )}
              </div>

              {index < NODES.length - 1 && (
                <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-slate-600">
                  <ArrowRight className="w-4 h-4 text-slate-500" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Real-time Event Feed */}
      {stepEvents.length > 0 && (
        <div className="mt-4 pt-3 border-t border-slate-800/80">
          <div className="text-[11px] font-mono text-slate-400 mb-1.5 flex items-center justify-between">
            <span>Últimos eventos do grafo ({stepEvents.length} disparos):</span>
            <span className="text-emerald-400 text-[10px]">LangGraph Streaming SSE</span>
          </div>
          <div className="max-h-24 overflow-y-auto space-y-1 font-mono text-[11px] bg-slate-950/80 p-2.5 rounded-lg border border-slate-800">
            {stepEvents.slice(-4).map((e, idx) => (
              <div key={idx} className="flex items-start space-x-2 text-slate-300">
                <span className="text-slate-500 text-[10px] whitespace-nowrap">
                  {new Date(e.timestamp).toLocaleTimeString()}
                </span>
                <span className="text-emerald-400 font-semibold uppercase text-[10px]">
                  [{e.step}]
                </span>
                <span className="text-slate-300 line-clamp-1">{e.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

