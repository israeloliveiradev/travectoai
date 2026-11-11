import { Request, Response } from 'express';
import { IVectorStoreRepository } from '../../domain/repositories/vector-store.interface.js';
import { IMCPClient } from '../../domain/repositories/mcp-client.interface.js';

export class HealthController {
  constructor(
    private readonly vectorStore: IVectorStoreRepository,
    private readonly mcpClient: IMCPClient
  ) {}

  async check(req: Request, res: Response): Promise<void> {
    try {
      const stats = await this.vectorStore.getStats();
      const tools = await this.mcpClient.listTools();

      res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'Travecto Backend & Agent Orchestrator',
        version: '1.0.0',
        architecture: {
          style: 'Clean Architecture (Domain, Application, Infrastructure, Presentation)',
          agentOrchestrator: 'LangGraph StateGraph (4 Nodes: collect_preferences, retrieve_context, call_mcp_tools, synthesize_itinerary)',
          vectorEngine: 'Travecto Vector Engine (Recursive Splitting + TF-IDF Vectorizer + Cosine Similarity)',
          mcpServer: 'Model Context Protocol (weather_forecast_tool, currency_exchange_tool)',
        },
        metrics: {
          rag: {
            indexedDocuments: stats.totalDocuments,
            totalChunks: stats.totalChunks,
          },
          mcp: {
            registeredToolsCount: tools.length,
            tools: tools.map((t) => t.name),
          },
        },
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Falha na verificação de saúde';
      res.status(500).json({ status: 'unhealthy', error: message });
    }
  }
}

