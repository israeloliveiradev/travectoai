import React, { useState } from 'react';
import {
  Cpu,
  CloudSun,
  Coins,
  Play,
  Terminal,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
} from 'lucide-react';
import { useMcpTools } from '../../hooks/useMcpTools.js';

export const McpConsole: React.FC = () => {
  const { tools, lastResult, isLoading, isRunning, error, runTool } = useMcpTools();

  const [selectedTool, setSelectedTool] = useState<string>('weather_forecast_tool');
  const [weatherArgs, setWeatherArgs] = useState({
    destination: 'Tóquio',
    month: 4,
    durationDays: 5,
  });
  const [currencyArgs, setCurrencyArgs] = useState({
    destination: 'Tóquio',
    baseCurrency: 'BRL',
    targetCurrency: 'JPY',
    amount: 5000,
  });
  const [copied, setCopied] = useState<boolean>(false);

  const handleRun = async () => {
    if (selectedTool === 'weather_forecast_tool') {
      await runTool('weather_forecast_tool', weatherArgs);
    } else {
      await runTool('currency_exchange_tool', currencyArgs);
    }
  };

  const handleCopyJson = () => {
    if (!lastResult) return;
    navigator.clipboard.writeText(JSON.stringify(lastResult, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-2xl font-extrabold text-white flex items-center space-x-2.5">
          <Cpu className="w-6 h-6 text-cyan-400" />
          <span>Console de Ferramentas MCP (Model Context Protocol)</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Execução direta e padronizada das ferramentas expostas pelo servidor MCP do Travecto.
        </p>
      </div>

      {/* Tools Selector */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Weather Tool Card */}
        <div
          onClick={() => setSelectedTool('weather_forecast_tool')}
          className={`cursor-pointer rounded-2xl p-5 border transition-all ${
            selectedTool === 'weather_forecast_tool'
              ? 'bg-slate-900/90 border-amber-500/60 shadow-lg shadow-amber-500/10 ring-1 ring-amber-400/40'
              : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-amber-500/20 text-amber-300">
                <CloudSun className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white font-mono">
                  weather_forecast_tool
                </h3>
                <span className="text-[10px] text-amber-400 font-medium uppercase">
                  MCP Tool • Clima & Sazonalidade
                </span>
              </div>
            </div>
            {selectedTool === 'weather_forecast_tool' && (
              <span className="text-xs text-amber-400 font-bold">● Selecionada</span>
            )}
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Calcula previsão climática, amplitudes térmicas, probabilidade de chuva e alertas sazonais para o destino planejado.
          </p>
        </div>

        {/* Currency Tool Card */}
        <div
          onClick={() => setSelectedTool('currency_exchange_tool')}
          className={`cursor-pointer rounded-2xl p-5 border transition-all ${
            selectedTool === 'currency_exchange_tool'
              ? 'bg-slate-900/90 border-teal-500/60 shadow-lg shadow-teal-500/10 ring-1 ring-teal-400/40'
              : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-teal-500/20 text-teal-300">
                <Coins className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white font-mono">
                  currency_exchange_tool
                </h3>
                <span className="text-[10px] text-teal-400 font-medium uppercase">
                  MCP Tool • Câmbio & Poder de Compra
                </span>
              </div>
            </div>
            {selectedTool === 'currency_exchange_tool' && (
              <span className="text-xs text-teal-400 font-bold">● Selecionada</span>
            )}
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Executa cotações de câmbio, conversão de moedas, dicas financeiras locais (cartão vs espécie) e taxas de caixas eletrônicos.
          </p>
        </div>
      </div>

      {/* Tool Runner Workbench */}
      <div className="bg-slate-900/60 rounded-2xl border border-slate-800/80 p-6 shadow-xl">
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Painel de Testes: {selectedTool}
            </h3>
          </div>

          <button
            onClick={handleRun}
            disabled={isRunning}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 disabled:opacity-50 transition-all"
          >
            {isRunning ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4 fill-slate-950" />
            )}
            <span>{isRunning ? 'Chamando MCP...' : 'Disparar Chamada MCP'}</span>
          </button>
        </div>

        {/* Inputs based on selected tool */}
        {selectedTool === 'weather_forecast_tool' ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Destino
              </label>
              <input
                type="text"
                value={weatherArgs.destination}
                onChange={(e) =>
                  setWeatherArgs({ ...weatherArgs, destination: e.target.value })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Mês (1 a 12)
              </label>
              <input
                type="number"
                min={1}
                max={12}
                value={weatherArgs.month}
                onChange={(e) =>
                  setWeatherArgs({ ...weatherArgs, month: parseInt(e.target.value) || 1 })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Duração (Dias)
              </label>
              <input
                type="number"
                min={1}
                max={30}
                value={weatherArgs.durationDays}
                onChange={(e) =>
                  setWeatherArgs({
                    ...weatherArgs,
                    durationDays: parseInt(e.target.value) || 1,
                  })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Destino
              </label>
              <input
                type="text"
                value={currencyArgs.destination}
                onChange={(e) =>
                  setCurrencyArgs({ ...currencyArgs, destination: e.target.value })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Moeda Origem
              </label>
              <input
                type="text"
                value={currencyArgs.baseCurrency}
                onChange={(e) =>
                  setCurrencyArgs({ ...currencyArgs, baseCurrency: e.target.value.toUpperCase() })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 uppercase"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Moeda Destino
              </label>
              <input
                type="text"
                value={currencyArgs.targetCurrency}
                onChange={(e) =>
                  setCurrencyArgs({ ...currencyArgs, targetCurrency: e.target.value.toUpperCase() })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 uppercase"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Montante
              </label>
              <input
                type="number"
                value={currencyArgs.amount}
                onChange={(e) =>
                  setCurrencyArgs({ ...currencyArgs, amount: parseFloat(e.target.value) || 0 })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        )}

        {/* Output Area */}
        {lastResult && (
          <div className="space-y-3 pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-emerald-400 flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Resposta do Servidor MCP ({lastResult.toolName})</span>
              </span>
              <button
                onClick={handleCopyJson}
                className="text-[11px] text-slate-400 hover:text-white flex items-center space-x-1"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copiado!' : 'Copiar JSON'}</span>
              </button>
            </div>

            <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-300 overflow-x-auto max-h-80">
              {JSON.stringify(lastResult, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

