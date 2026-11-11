import { MCPToolDefinition, MCPToolResult } from '../../domain/repositories/mcp-client.interface.js';
import {
  executeWeatherForecastTool,
  weatherForecastToolDefinition,
} from './tools/weather-forecast.tool.js';
import {
  currencyExchangeToolDefinition,
  executeCurrencyExchangeTool,
} from './tools/currency-exchange.tool.js';

export class TravectoMCPServer {
  private tools: Map<string, { definition: MCPToolDefinition; handler: (args: Record<string, unknown>) => Promise<MCPToolResult> }> = new Map();

  constructor() {
    this.registerTool(weatherForecastToolDefinition, executeWeatherForecastTool);
    this.registerTool(currencyExchangeToolDefinition, executeCurrencyExchangeTool);
  }

  registerTool(
    definition: MCPToolDefinition,
    handler: (args: Record<string, unknown>) => Promise<MCPToolResult>
  ): void {
    this.tools.set(definition.name, { definition, handler });
  }

  listTools(): MCPToolDefinition[] {
    return Array.from(this.tools.values()).map((t) => t.definition);
  }

  async handleCallTool(
    name: string,
    args: Record<string, unknown>
  ): Promise<MCPToolResult> {
    const tool = this.tools.get(name);
    if (!tool) {
      return {
        success: false,
        toolName: name,
        timestamp: new Date().toISOString(),
        data: null,
        error: `Ferramenta MCP '${name}' não encontrada no servidor Travecto MCP.`,
      };
    }

    try {
      return await tool.handler(args);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      return {
        success: false,
        toolName: name,
        timestamp: new Date().toISOString(),
        data: null,
        error: `Falha na execução da tool MCP ${name}: ${message}`,
      };
    }
  }
}

