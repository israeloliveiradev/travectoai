import { Router } from 'express';
import { ItineraryController } from './controllers/itinerary.controller.js';
import { RagController } from './controllers/rag.controller.js';
import { McpController } from './controllers/mcp.controller.js';
import { HealthController } from './controllers/health.controller.js';

export function createRouter(
  itineraryController: ItineraryController,
  ragController: RagController,
  mcpController: McpController,
  healthController: HealthController
): Router {
  const router = Router();

  // Health & Inspection
  router.get('/health', (req, res) => healthController.check(req, res));

  // Itinerary & LangGraph Agent
  router.post('/itinerary/generate', (req, res) => itineraryController.generate(req, res));
  router.post('/itinerary/stream', (req, res) => itineraryController.stream(req, res));

  // RAG Vector Engine
  router.get('/rag/documents', (req, res) => ragController.list(req, res));
  router.post('/rag/index', (req, res) => ragController.index(req, res));
  router.post('/rag/query', (req, res) => ragController.query(req, res));
  router.delete('/rag/documents/:id', (req, res) => ragController.delete(req, res));

  // MCP Tools
  router.get('/mcp/tools', (req, res) => mcpController.listTools(req, res));
  router.post('/mcp/execute', (req, res) => mcpController.execute(req, res));

  return router;
}

