import { IMCPClient } from '../../../domain/repositories/mcp-client.interface.js';
import { TravectoStateType } from '../travecto-graph-state.js';
import { WeatherToolOutput } from '../../mcp/tools/weather-forecast.tool.js';
import { CurrencyToolOutput } from '../../mcp/tools/currency-exchange.tool.js';

export function createCallMcpToolsNode(mcpClient: IMCPClient) {
  return async function callMcpToolsNode(
    state: TravectoStateType
  ): Promise<Partial<TravectoStateType>> {
    const prefs = state.preferences;
    if (!prefs) {
      throw new Error('Preferências ausentes no nó call_mcp_tools.');
    }

    const month = (prefs.dateRange.startDate ? prefs.dateRange.startDate.getMonth() : new Date().getMonth()) + 1;

    const [weatherResult, currencyResult] = await Promise.all([
      mcpClient.callTool<WeatherToolOutput>('weather_forecast_tool', {
        destination: prefs.destination,
        month,
        durationDays: prefs.days,
      }),
      mcpClient.callTool<CurrencyToolOutput>('currency_exchange_tool', {
        destination: prefs.destination,
        baseCurrency: prefs.budget.currency,
        amount: prefs.budget.amount,
      }),
    ]);

    const weatherData = weatherResult.data;
    const currencyData = currencyResult.data;

    const logs: string[] = [
      `[call_mcp_tools] weather_forecast_tool -> ${weatherData?.season || 'Clima OK'} (${weatherData?.temperatureAverage || 'N/A'}, UV: ${weatherData?.uvIndex || 'Normal'})`,
      `[call_mcp_tools] currency_exchange_tool -> ${currencyData?.formattedConversion || 'Câmbio calculado'}`,
    ];

    return {
      currentStep: 'call_mcp_tools',
      mcpWeather: weatherData,
      mcpCurrency: currencyData,
      stepLogs: logs,
    };
  };
}

