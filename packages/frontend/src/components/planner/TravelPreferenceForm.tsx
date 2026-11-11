import React, { useState } from 'react';
import {
  MapPin,
  Calendar,
  Wallet,
  Compass,
  Users,
  Sparkles,
  Tag,
  Flame,
} from 'lucide-react';
import {
  BudgetTier,
  TravelPace,
  TravelPreferenceFormValues,
  TravelStyleType,
} from '../../types/index.js';

interface TravelPreferenceFormProps {
  onSubmit: (form: TravelPreferenceFormValues) => void;
  isLoading: boolean;
}

const PRESETS = [
  {
    label: '🇯🇵 Tóquio Cultural & Futuro',
    destination: 'Tóquio',
    days: 4,
    budgetAmount: 12000,
    budgetCurrency: 'BRL',
    styleType: 'cultural' as TravelStyleType,
    stylePace: 'balanced' as TravelPace,
    travelersCount: 2,
    specialInterests: ['templos', 'shinkansen', 'gastronomia', 'akihabara'],
  },
  {
    label: '🇫🇷 Paris Arte & Bistrôs',
    destination: 'Paris',
    days: 3,
    budgetAmount: 9000,
    budgetCurrency: 'BRL',
    styleType: 'gastronomic' as TravelStyleType,
    stylePace: 'balanced' as TravelPace,
    travelersCount: 2,
    specialInterests: ['louvre', 'montmartre', 'bistros', 'sena'],
  },
  {
    label: '🇧🇷 Rio Praias & Boemia',
    destination: 'Rio de Janeiro',
    days: 3,
    budgetAmount: 4500,
    budgetCurrency: 'BRL',
    styleType: 'relax' as TravelStyleType,
    stylePace: 'slow' as TravelPace,
    travelersCount: 2,
    specialInterests: ['arpoador', 'santa teresa', 'corcovado', 'samba'],
  },
  {
    label: '🇮🇹 Roma Imperial & Trattorias',
    destination: 'Roma',
    days: 4,
    budgetAmount: 8500,
    budgetCurrency: 'BRL',
    styleType: 'cultural' as TravelStyleType,
    stylePace: 'balanced' as TravelPace,
    travelersCount: 2,
    specialInterests: ['coliseu', 'vaticano', 'trastevere', 'fontanas'],
  },
];

export const TravelPreferenceForm: React.FC<TravelPreferenceFormProps> = ({
  onSubmit,
  isLoading,
}) => {
  const [destination, setDestination] = useState<string>('Tóquio');
  const [days, setDays] = useState<number>(4);
  const [budgetAmount, setBudgetAmount] = useState<number>(10000);
  const [budgetCurrency, setBudgetCurrency] = useState<string>('BRL');
  const [styleType, setStyleType] = useState<TravelStyleType>('cultural');
  const [stylePace, setStylePace] = useState<TravelPace>('balanced');
  const [travelersCount, setTravelersCount] = useState<number>(2);
  const [specialInterestsText, setSpecialInterestsText] = useState<string>(
    'templos, gastronomia, shinkansen, sakura'
  );

  const applyPreset = (preset: (typeof PRESETS)[0]) => {
    setDestination(preset.destination);
    setDays(preset.days);
    setBudgetAmount(preset.budgetAmount);
    setBudgetCurrency(preset.budgetCurrency);
    setStyleType(preset.styleType);
    setStylePace(preset.stylePace);
    setTravelersCount(preset.travelersCount);
    setSpecialInterestsText(preset.specialInterests.join(', '));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const interests = specialInterestsText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    onSubmit({
      destination,
      days,
      budgetAmount,
      budgetCurrency,
      styleType,
      stylePace,
      travelersCount,
      specialInterests: interests,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-slate-900/60 rounded-2xl border border-slate-800/80 p-6 shadow-xl"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <Compass className="w-5 h-5 text-emerald-400" />
            <span>Configurar Viagem Personalizada</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            O Travecto orquestrará RAG semântico nos guias locais e MCP em tempo real.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="mt-3 sm:mt-0 flex flex-wrap gap-1.5 items-center">
          <span className="text-[11px] text-slate-400 flex items-center mr-1">
            <Flame className="w-3.5 h-3.5 text-amber-400 mr-1" /> Presets:
          </span>
          {PRESETS.map((p) => (
            <button
              key={p.destination}
              type="button"
              onClick={() => applyPreset(p)}
              className="text-xs px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700/80 active:scale-[0.97] text-slate-200 border border-slate-700/80 hover:border-emerald-500/50 transition-[transform,background-color,border-color] duration-150 ease-out shrink-0"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Destination */}
        <div className="lg:col-span-2">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center space-x-1.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>Destino Principal</span>
          </label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Ex: Tóquio, Paris, Rio de Janeiro, Roma..."
            required
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
          />
        </div>

        {/* Duration (Days) */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center space-x-1.5">
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            <span>Duração (Dias)</span>
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              min={1}
              max={15}
              value={days}
              onChange={(e) => setDays(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
            />
            <span className="text-xs text-slate-400 font-medium">dias</span>
          </div>
        </div>

        {/* Travelers */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center space-x-1.5">
            <Users className="w-3.5 h-3.5 text-emerald-400" />
            <span>Viajantes</span>
          </label>
          <input
            type="number"
            min={1}
            max={10}
            value={travelersCount}
            onChange={(e) => setTravelersCount(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
          />
        </div>

        {/* Budget */}
        <div className="lg:col-span-2">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center space-x-1.5">
            <Wallet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Orçamento Previsto</span>
          </label>
          <div className="flex space-x-2">
            <select
              value={budgetCurrency}
              onChange={(e) => setBudgetCurrency(e.target.value)}
              className="bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            >
              <option value="BRL">BRL (R$)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
            </select>
            <input
              type="number"
              step={100}
              min={500}
              value={budgetAmount}
              onChange={(e) => setBudgetAmount(Math.max(100, parseInt(e.target.value) || 100))}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
            />
          </div>
        </div>

        {/* Travel Style */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Estilo de Viagem
          </label>
          <select
            value={styleType}
            onChange={(e) => setStyleType(e.target.value as TravelStyleType)}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          >
            <option value="cultural">🏛️ Cultural & Histórico</option>
            <option value="gastronomic">🍷 Gastronômico</option>
            <option value="adventure">🧗 Aventura & Trilhas</option>
            <option value="relax">🏖️ Relax & Praias</option>
            <option value="budget">🎒 Econômico / Mochilão</option>
            <option value="luxury">✨ Luxo & Conforto</option>
            <option value="family">👨‍👩‍👦 Família</option>
          </select>
        </div>

        {/* Pace */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Ritmo do Roteiro
          </label>
          <select
            value={stylePace}
            onChange={(e) => setStylePace(e.target.value as TravelPace)}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          >
            <option value="slow">Tranquilo (Poucas paradas)</option>
            <option value="balanced">Equilibrado (Recomendado)</option>
            <option value="fast">Intenso (Aproveitamento total)</option>
          </select>
        </div>

        {/* Special Interests */}
        <div className="lg:col-span-4">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center space-x-1.5">
            <Tag className="w-3.5 h-3.5 text-emerald-400" />
            <span>Interesses Especiais & Palavras-chave (Separados por vírgula)</span>
          </label>
          <input
            type="text"
            value={specialInterestsText}
            onChange={(e) => setSpecialInterestsText(e.target.value)}
            placeholder="Ex: museus, cafés charmosos, compras, parques naturais, mercados de rua..."
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 active:scale-[0.97] text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-[transform,background-color,box-shadow] duration-150 ease-out"
        >
          <Sparkles className="w-4 h-4 stroke-[2.5]" />
          <span>
            {isLoading ? 'Orquestrando Grafo LangGraph...' : 'Gerar Roteiro Travecto'}
          </span>
        </button>
      </div>
    </form>
  );
};

