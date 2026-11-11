import { END, START, StateGraph } from '@langchain/langgraph';
import { DestinationPreference } from '../../domain/entities/destination-preference.entity.js';
import { Itinerary } from '../../domain/entities/itinerary.entity.js';
import { IMCPClient } from '../../domain/repositories/mcp-client.interface.js';
import {
  ITravelOrchestrator,
  OrchestrationStepEvent,
  OrchestrationStepName,
  StepCallback,
  StepStatus,
} from '../../domain/repositories/travel-orchestrator.interface.js';
import { IVectorStoreRepository } from '../../domain/repositories/vector-store.interface.js';
import { collectPreferencesNode } from './nodes/collect-preferences.node.js';
import { createRetrieveContextNode } from './nodes/retrieve-context.node.js';
import { createCallMcpToolsNode } from './nodes/call-mcp-tools.node.js';
import { synthesizeItineraryNode } from './nodes/synthesize-itinerary.node.js';
import {
  TravectoGraphAnnotation,
  TravectoStateType,
} from './travecto-graph-state.js';

export class TravectoGraphOrchestrator implements ITravelOrchestrator {
  private compiledWorkflow: ReturnType<typeof this.buildGraph>;

  constructor(
    private readonly vectorStore: IVectorStoreRepository,
    private readonly mcpClient: IMCPClient
  ) {
    this.compiledWorkflow = this.buildGraph();
  }

  private buildGraph() {
    const workflow = new StateGraph(TravectoGraphAnnotation)
      .addNode('collect_preferences', collectPreferencesNode)
      .addNode('retrieve_context', createRetrieveContextNode(this.vectorStore))
      .addNode('call_mcp_tools', createCallMcpToolsNode(this.mcpClient))
      .addNode('synthesize_itinerary', synthesizeItineraryNode)
      .addEdge(START, 'collect_preferences')
      .addEdge('collect_preferences', 'retrieve_context')
      .addEdge('retrieve_context', 'call_mcp_tools')
      .addEdge('call_mcp_tools', 'synthesize_itinerary')
      .addEdge('synthesize_itinerary', END);

    return workflow.compile();
  }

  async orchestrate(
    preferences: DestinationPreference,
    onStep?: StepCallback
  ): Promise<Itinerary> {
    const emit = (event: OrchestrationStepEvent) => {
      if (onStep) {
        onStep(event);
      }
    };

    emit({
      step: 'collect_preferences',
      status: 'started',
      message: `Iniciando Travecto Graph para destino: ${preferences.destination}...`,
      timestamp: new Date().toISOString(),
      data: { preferences },
    });

    const initialState: Partial<TravectoStateType> = {
      preferences,
      currentStep: 'idle',
      stepLogs: [],
      error: null,
    };

    try {
      emit({
        step: 'collect_preferences',
        status: 'in_progress',
        message: 'Coletando e normalizando restrições de orçamento, datas e estilo...',
        timestamp: new Date().toISOString(),
        data: { preferences },
      });

      const stream = await this.compiledWorkflow.stream(initialState, {
        streamMode: 'updates',
      });

      let finalState: Partial<TravectoStateType> = { ...initialState };

      for await (const update of stream) {
        const [nodeName, nodeState] = Object.entries(update)[0] as [
          string,
          Partial<TravectoStateType>,
        ];
        finalState = { ...finalState, ...nodeState };

        const stepKey = nodeName as OrchestrationStepName;

        if (stepKey === 'collect_preferences') {
          emit({
            step: 'collect_preferences',
            status: 'completed',
            message: `Preferências validadas para ${preferences.destination}.`,
            timestamp: new Date().toISOString(),
            data: { preferences },
          });
          emit({
            step: 'retrieve_context',
            status: 'started',
            message: 'Consultando base de conhecimento local via RAG vetorial...',
            timestamp: new Date().toISOString(),
          });
        } else if (stepKey === 'retrieve_context') {
          emit({
            step: 'retrieve_context',
            status: 'completed',
            message: `Contexto recuperado (${finalState.ragContext?.citations.length || 0} fragmentos citados).`,
            timestamp: new Date().toISOString(),
            data: { citations: finalState.ragContext?.citations },
          });
          emit({
            step: 'call_mcp_tools',
            status: 'started',
            message: 'Consultando ferramentas externas via protocolo MCP (Clima & Câmbio)...',
            timestamp: new Date().toISOString(),
          });
        } else if (stepKey === 'call_mcp_tools') {
          emit({
            step: 'call_mcp_tools',
            status: 'completed',
            message: 'Dados em tempo real de clima e taxa de câmbio recebidos via MCP.',
            timestamp: new Date().toISOString(),
            data: {
              weather: finalState.mcpWeather,
              currency: finalState.mcpCurrency,
            },
          });
          emit({
            step: 'synthesize_itinerary',
            status: 'started',
            message: 'Sintetizando roteiro consolidado com turnos diários e citações...',
            timestamp: new Date().toISOString(),
          });
        } else if (stepKey === 'synthesize_itinerary') {
          emit({
            step: 'synthesize_itinerary',
            status: 'completed',
            message: 'Roteiro gerado e validado com sucesso!',
            timestamp: new Date().toISOString(),
            data: { itinerary: finalState.itinerary || undefined },
          });
        }
      }

      if (!finalState.itinerary) {
        throw new Error('Falha na síntese do itinerário pelo grafo LangGraph.');
      }

      emit({
        step: 'completed',
        status: 'completed',
        message: 'Fluxo do Travecto Graph concluído.',
        timestamp: new Date().toISOString(),
        data: { itineraryId: finalState.itinerary.id },
      });

      return finalState.itinerary;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      emit({
        step: 'completed',
        status: 'failed',
        message: `Erro durante execução do grafo: ${message}`,
        timestamp: new Date().toISOString(),
      });
      throw err;
    }
  }
}
