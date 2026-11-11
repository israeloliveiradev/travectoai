import React, { useState } from 'react';
import {
  Calendar,
  CloudSun,
  Coins,
  MapPin,
  Clock,
  Sparkles,
  BookOpen,
  DollarSign,
  Sun,
  Sunset,
  Moon,
  ExternalLink,
  Printer,
  Copy,
  Check,
  Info,
  ShieldAlert,
} from 'lucide-react';
import { DocumentCitation, Itinerary, TimeSlot } from '../../types/index.js';

interface ItineraryViewerProps {
  itinerary: Itinerary;
}

export const ItineraryViewer: React.FC<ItineraryViewerProps> = ({ itinerary }) => {
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [activeCitation, setActiveCitation] = useState<DocumentCitation | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const activeDayPlan = itinerary.days.find((d) => d.dayNumber === selectedDay) || itinerary.days[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(itinerary, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(val);
  };

  const getShiftIcon = (slot: TimeSlot) => {
    switch (slot) {
      case 'morning':
        return <Sun className="w-4 h-4 text-amber-400 shrink-0" />;
      case 'afternoon':
        return <Sunset className="w-4 h-4 text-orange-400 shrink-0" />;
      case 'evening':
        return <Moon className="w-4 h-4 text-indigo-400 shrink-0" />;
    }
  };

  const getShiftLabel = (slot: TimeSlot) => {
    switch (slot) {
      case 'morning':
        return 'Manhã';
      case 'afternoon':
        return 'Tarde';
      case 'evening':
        return 'Noite';
    }
  };

  return (
    <div className="space-y-6 min-w-0">
      {/* Top Banner & Overview */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900/90 to-emerald-950/40 rounded-2xl border border-emerald-500/30 p-6 shadow-2xl relative overflow-hidden min-w-0">
        <div className="absolute top-0 right-0 -mt-6 -mr-6 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-6 border-b border-slate-800 min-w-0">
          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 mb-1">
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">ROTEIRO GERADO PELO TRAVECTO GRAPH</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight break-words [overflow-wrap:anywhere]">
              {itinerary.title}
            </h1>
            <p className="text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed break-words [overflow-wrap:anywhere]">
              {itinerary.summary}
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0 self-start">
            <button
              onClick={handleCopy}
              className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-[0.97] text-slate-200 text-xs font-medium border border-slate-700 transition-[transform,background-color] duration-150 ease-out shrink-0"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> : <Copy className="w-3.5 h-3.5 shrink-0" />}
              <span>{copied ? 'Copiado JSON!' : 'Copiar JSON'}</span>
            </button>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-[0.97] text-slate-200 text-xs font-medium border border-slate-700 transition-[transform,background-color] duration-150 ease-out shrink-0"
            >
              <Printer className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>Imprimir</span>
            </button>
          </div>
        </div>

        {/* Real-time MCP Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {/* Weather MCP Card */}
          <div className="bg-slate-950/70 rounded-xl p-4 border border-slate-800/80 flex flex-col justify-between min-w-0">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center space-x-1.5 shrink-0">
                  <CloudSun className="w-4 h-4 shrink-0" />
                  <span>Clima & Sazonalidade (MCP)</span>
                </span>
                <span className="text-[10px] font-mono bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded shrink-0 whitespace-nowrap">
                  {itinerary.weatherInfo.season}
                </span>
              </div>
              <div className="text-base sm:text-lg font-bold text-white mb-1 tabular-nums break-words [overflow-wrap:anywhere]">
                {itinerary.weatherInfo.temperatureRange}
              </div>
              <p className="text-xs text-slate-300 mb-2 leading-relaxed break-words [overflow-wrap:anywhere]">
                {itinerary.weatherInfo.advice}
              </p>
            </div>
            <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-slate-400">
              <span className="truncate">Chuva: {itinerary.weatherInfo.rainyProbability}</span>
              <span className="text-slate-300 italic truncate">{itinerary.weatherInfo.bestClothing}</span>
            </div>
          </div>

          {/* Currency MCP Card */}
          <div className="bg-slate-950/70 rounded-xl p-4 border border-slate-800/80 flex flex-col justify-between min-w-0">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center space-x-1.5 shrink-0">
                  <Coins className="w-4 h-4 shrink-0" />
                  <span>Câmbio & Finanças (MCP)</span>
                </span>
                <span className="text-[10px] font-mono bg-teal-500/10 text-teal-300 border border-teal-500/20 px-2 py-0.5 rounded shrink-0 whitespace-nowrap tabular-nums">
                  1 {itinerary.currencyConversion.baseCurrency} = {itinerary.currencyConversion.exchangeRate} {itinerary.currencyConversion.targetCurrency}
                </span>
              </div>
              <div className="text-base sm:text-lg font-bold text-white mb-1 tabular-nums break-words [overflow-wrap:anywhere]">
                {itinerary.currencyConversion.formattedConversion}
              </div>
              <p className="text-xs text-slate-300 mb-2 leading-relaxed break-words [overflow-wrap:anywhere]">
                {itinerary.currencyConversion.practicalTip}
              </p>
            </div>
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span>Custo Total Estimado:</span>
              <span className="font-semibold text-emerald-400 tabular-nums">
                {itinerary.budget.currency} {formatCurrency(itinerary.totalEstimatedCost)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Day Navigation Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-thin">
        {itinerary.days.map((day) => (
          <button
            key={day.dayNumber}
            onClick={() => setSelectedDay(day.dayNumber)}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-[transform,background-color] duration-150 ease-out active:scale-[0.97] flex items-center space-x-2 shrink-0 ${selectedDay === day.dayNumber
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/25 ring-2 ring-emerald-400'
                : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
          >
            <span>Dia {day.dayNumber}</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded tabular-nums ${selectedDay === day.dayNumber
                  ? 'bg-slate-950/20 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-400'
                }`}
            >
              {day.date}
            </span>
          </button>
        ))}
      </div>

      {/* Selected Day Content */}
      <div className="bg-slate-900/60 rounded-2xl border border-slate-800/80 p-6 shadow-xl min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-6 border-b border-slate-800">
          <div className="min-w-0">
            <span className="text-xs font-mono uppercase text-emerald-400 font-semibold tracking-wider">
              Plano Diário do Roteiro
            </span>
            <h2 className="text-xl font-bold text-white mt-0.5 break-words [overflow-wrap:anywhere]">
              {activeDayPlan.theme}
            </h2>
          </div>
          <div className="text-xs text-slate-400 font-mono shrink-0">
            Estimativa Diária:{' '}
            <span className="text-emerald-400 font-bold tabular-nums">
              {itinerary.budget.currency} {formatCurrency(activeDayPlan.dayCostEstimate)}
            </span>
          </div>
        </div>

        {/* Shifts List: Morning, Afternoon, Evening */}
        <div className="space-y-5">
          {(['morning', 'afternoon', 'evening'] as TimeSlot[]).map((slot, slotIdx) => {
            const activities = activeDayPlan[slot];
            if (!activities || activities.length === 0) return null;

            return (
              <div key={slot} className="space-y-3 min-w-0">
                <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-300">
                  {getShiftIcon(slot)}
                  <span>Turno: {getShiftLabel(slot)}</span>
                </div>

                {activities.map((act, actIdx) => (
                  <div
                    key={act.id}
                    style={{ animationDelay: `${(slotIdx * 2 + actIdx) * 40}ms` }}
                    className="bg-slate-950/70 rounded-xl p-5 border border-slate-800/80 hover:border-slate-700 transition-[border-color,background-color] duration-150 group min-w-0"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2 min-w-0">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 shrink-0">
                            {act.category}
                          </span>
                          <span className="text-xs text-slate-400 flex items-center space-x-1 shrink-0">
                            <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                            <span className="break-words [overflow-wrap:anywhere]">{act.location}</span>
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors break-words [overflow-wrap:anywhere]">
                          {act.title}
                        </h3>
                      </div>

                      <div className="text-xs font-mono font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 px-2.5 py-1 rounded-lg shrink-0 self-start tabular-nums whitespace-nowrap">
                        Previsto: {itinerary.budget.currency} {formatCurrency(act.estimatedCost)}
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed mb-3 break-words [overflow-wrap:anywhere]">
                      {act.description}
                    </p>

                    {act.localTip && (
                      <div className="bg-amber-950/20 border-l-2 border-amber-400 px-3 py-2 rounded-r-lg text-xs text-amber-200 mb-3 flex items-start space-x-2 min-w-0">
                        <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <div className="min-w-0 break-words [overflow-wrap:anywhere]">
                          <strong className="font-semibold text-amber-300">Dica Local do Especialista: </strong>
                          {act.localTip}
                        </div>
                      </div>
                    )}

                    {/* Source Citations */}
                    {act.sourceCitations && act.sourceCitations.length > 0 && (
                      <div className="pt-2 border-t border-slate-800/60 flex flex-wrap items-center gap-2 min-w-0">
                        <span className="text-[11px] text-slate-400 flex items-center space-x-1 shrink-0">
                          <BookOpen className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span>Embasado por:</span>
                        </span>
                        {act.sourceCitations.map((source, idx) => {
                          const matchedCitation = itinerary.citations.find(
                            (c) => c.source === source
                          );
                          return (
                            <button
                              key={idx}
                              onClick={() => matchedCitation && setActiveCitation(matchedCitation)}
                              className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 hover:bg-emerald-500/20 active:scale-[0.97] transition-[transform,background-color] duration-150 flex items-center space-x-1 max-w-full truncate"
                            >
                              <span className="truncate">{source}</span>
                              <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* Citations Summary Box */}
      {itinerary.citations.length > 0 && (
        <div className="bg-slate-900/60 rounded-2xl border border-slate-800/80 p-5 shadow-lg min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <BookOpen className="w-4 h-4 text-emerald-400 shrink-0" />
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Citações dos Guias Locais (RAG Evidence Engine)
            </h4>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            Cada atividade acima foi fundamentada através de recuperação vetorial nos seguintes fragmentos extraídos de manuais locais indexados:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 min-w-0">
            {itinerary.citations.map((c, i) => (
              <div
                key={c.chunkId || i}
                onClick={() => setActiveCitation(c)}
                className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-emerald-500/50 cursor-pointer active:scale-[0.99] transition-[transform,border-color] duration-150 min-w-0"
              >
                <div className="flex items-center justify-between text-[11px] font-semibold text-emerald-400 mb-1 gap-2">
                  <span className="truncate">{c.source}</span>
                  {c.relevanceScore !== undefined && (
                    <span className="font-mono text-slate-400 shrink-0 tabular-nums">
                      Score: {(c.relevanceScore * 100).toFixed(1)}%
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-300 line-clamp-2 break-words [overflow-wrap:anywhere]">
                  {c.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Citation Detail Modal */}
      {activeCitation && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative transform transition-[transform,opacity] duration-200 ease-out animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-emerald-400 shrink-0" />
                <h3 className="text-base font-bold text-white">
                  Fragmento de Guia Recuperado por RAG
                </h3>
              </div>
              <button
                onClick={() => setActiveCitation(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="text-xs font-mono text-emerald-400 break-words">
                Origem: <strong className="text-white">{activeCitation.source}</strong>
              </div>
              {activeCitation.relevanceScore !== undefined && (
                <div className="text-xs font-mono text-slate-400">
                  Relevância Semântica: <span className="text-emerald-400 tabular-nums">{(activeCitation.relevanceScore * 100).toFixed(2)}%</span>
                </div>
              )}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-wrap max-h-72 overflow-y-auto break-words [overflow-wrap:anywhere]">
                {activeCitation.content}
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setActiveCitation(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-[0.97] text-xs font-semibold text-white transition-[transform,background-color] duration-150"
              >
                Fechar Visualização
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
