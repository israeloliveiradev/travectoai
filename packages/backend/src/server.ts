import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GenerateItineraryUseCase } from './application/use-cases/generate-itinerary.use-case.js';
import { IndexTravelDocumentUseCase } from './application/use-cases/index-travel-document.use-case.js';
import { ListIndexedDocumentsUseCase } from './application/use-cases/list-indexed-documents.use-case.js';
import { QueryDestinationContextUseCase } from './application/use-cases/query-destination-context.use-case.js';
import { ExecuteMcpToolUseCase } from './application/use-cases/execute-mcp-tool.use-case.js';
import { TravectoVectorEngine } from './infrastructure/rag/travecto-vector-engine.js';
import { DEFAULT_TRAVEL_GUIDES } from './infrastructure/rag/default-travel-guides.js';
import { TravectoMCPServer } from './infrastructure/mcp/mcp-server.js';
import { MCPClientAdapter } from './infrastructure/mcp/mcp-client-adapter.js';
import { TravectoGraphOrchestrator } from './infrastructure/langgraph/travecto-graph-orchestrator.js';
import { ItineraryController } from './presentation/controllers/itinerary.controller.js';
import { RagController } from './presentation/controllers/rag.controller.js';
import { McpController } from './presentation/controllers/mcp.controller.js';
import { HealthController } from './presentation/controllers/health.controller.js';
import { createRouter } from './presentation/routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Infrastructure Singletons
const vectorEngine = new TravectoVectorEngine();
const mcpServer = new TravectoMCPServer();
const mcpClient = new MCPClientAdapter(mcpServer);
const graphOrchestrator = new TravectoGraphOrchestrator(vectorEngine, mcpClient);

// Application Use Cases
const generateItineraryUseCase = new GenerateItineraryUseCase(graphOrchestrator);
const indexDocumentUseCase = new IndexTravelDocumentUseCase(vectorEngine);
const listDocumentsUseCase = new ListIndexedDocumentsUseCase(vectorEngine);
const queryDestinationUseCase = new QueryDestinationContextUseCase(vectorEngine);
const executeMcpToolUseCase = new ExecuteMcpToolUseCase(mcpClient);

// Presentation Controllers
const itineraryController = new ItineraryController(generateItineraryUseCase);
const ragController = new RagController(
  indexDocumentUseCase,
  listDocumentsUseCase,
  queryDestinationUseCase,
  vectorEngine
);
const mcpController = new McpController(executeMcpToolUseCase);
const healthController = new HealthController(vectorEngine, mcpClient);

// Mount API Routes
const apiRouter = createRouter(
  itineraryController,
  ragController,
  mcpController,
  healthController
);
app.use('/api', apiRouter);

async function bootstrap() {
  console.log('🚀 [Travecto Core] Inicializando motor de viagens com Clean Architecture...');

  for (const guide of DEFAULT_TRAVEL_GUIDES) {
    await vectorEngine.addDocument(
      guide.title,
      guide.destination,
      guide.content,
      guide.metadata
    );
  }

  const stats = await vectorEngine.getStats();
  console.log(`📚 [Travecto RAG] Base vetorial populada com sucesso: ${stats.totalDocuments} guias e ${stats.totalChunks} chunks.`);
  console.log(`🔌 [Travecto MCP] Servidor MCP ativo com ferramentas: [weather_forecast_tool, currency_exchange_tool].`);
  console.log(`🕸️  [Travecto LangGraph] Grafo compilado: collect_preferences -> retrieve_context -> call_mcp_tools -> synthesize_itinerary.`);

  app.listen(PORT, () => {
    console.log(`⚡ [Travecto Backend] Servidor rodando em http://localhost:${PORT}`);
    console.log(`🔍 [Health Check] http://localhost:${PORT}/api/health`);
  });
}

bootstrap().catch((err) => {
  console.error('❌ Falha na inicialização do Travecto Backend:', err);
  process.exit(1);
});

