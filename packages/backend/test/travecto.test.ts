import test from 'node:test';
import assert from 'node:assert';
import { Budget } from '../src/domain/value-objects/budget.vo.js';
import { DateRange } from '../src/domain/value-objects/date-range.vo.js';
import { TravelStyle } from '../src/domain/value-objects/travel-style.vo.js';
import { DestinationPreference } from '../src/domain/entities/destination-preference.entity.js';
import {
  Ok,
  Err,
  isSuccess,
  isFailure,
  Result,
} from '../src/domain/types/common.types.js';
import { TravectoVectorEngine } from '../src/infrastructure/rag/travecto-vector-engine.js';
import { TravectoMCPServer } from '../src/infrastructure/mcp/mcp-server.js';
import { MCPClientAdapter } from '../src/infrastructure/mcp/mcp-client-adapter.js';
import { TravectoGraphOrchestrator } from '../src/infrastructure/langgraph/travecto-graph-orchestrator.js';

test('Travecto Domain - Value Objects & Entity Validation', () => {
  const budget = Budget.create(6000, 'BRL', 'moderate');
  assert.strictEqual(budget.amount, 6000);
  assert.strictEqual(budget.currency, 'BRL');
  assert.strictEqual(budget.tier, 'moderate');

  const dateRange = DateRange.fromDays(5);
  assert.strictEqual(dateRange.durationInDays, 5);

  const style = TravelStyle.create('cultural', 'balanced');
  assert.strictEqual(style.type, 'cultural');
  assert.ok(style.focusKeywords.length > 0);

  const pref = new DestinationPreference({
    destination: 'Tóquio',
    days: 4,
    budget,
    style,
    travelersCount: 2,
    specialInterests: ['gastronomia', 'templos'],
  });

  assert.strictEqual(pref.destination, 'Tóquio');
  assert.strictEqual(pref.days, 4);

  // Negative budget throws
  assert.throws(() => Budget.create(-100, 'BRL'), /não pode ser negativo/);

  // Invalid days range throws
  assert.throws(
    () =>
      new DestinationPreference({
        destination: 'Paris',
        days: 0,
        budget,
        style,
        travelersCount: 1,
        specialInterests: [],
      }),
    /entre 1 e 30/
  );
});

test('Travecto Domain - Advanced Types: Result Pattern & Type Guards', () => {
  const successRes: Result<number, string> = Ok(42);
  const failureRes: Result<number, string> = Err('Erro na operação');

  assert.strictEqual(isSuccess(successRes), true);
  assert.strictEqual(isFailure(successRes), false);
  if (isSuccess(successRes)) {
    assert.strictEqual(successRes.data, 42);
  }

  assert.strictEqual(isSuccess(failureRes), false);
  assert.strictEqual(isFailure(failureRes), true);
  if (isFailure(failureRes)) {
    assert.strictEqual(failureRes.error, 'Erro na operação');
  }
});

test('Travecto Infrastructure - Vector Engine Indexing & Semantic Search', async () => {
  const engine = new TravectoVectorEngine();
  const doc = await engine.addDocument(
    'Guia Teste Tóquio',
    'Tóquio',
    '# Templos e Shinkansen\nRegras de bagagem no Shinkansen exigem reserva de assentos para malas grandes. Visite o templo Senso-ji em Asakusa pela manhã para evitar filas.'
  );

  assert.ok(doc.id);
  assert.strictEqual(doc.chunkCount >= 1, true);

  const searchResults = await engine.similaritySearch('bagagem shinkansen trem', 3, 'Tóquio');
  assert.ok(searchResults.length > 0);
  assert.ok(searchResults[0].content.includes('Shinkansen'));
  assert.ok(searchResults[0].score > 0);

  // Empty query returns empty array
  const emptyResults = await engine.similaritySearch('', 3);
  assert.strictEqual(emptyResults.length, 0);
});

test('Travecto Infrastructure - MCP Tools Execution', async () => {
  const server = new TravectoMCPServer();
  const client = new MCPClientAdapter(server);

  const tools = await client.listTools();
  assert.strictEqual(tools.length, 2);

  const weather = await client.callTool('weather_forecast_tool', { destination: 'Paris', month: 6 });
  assert.strictEqual(weather.success, true);
  assert.ok(weather.data);

  const currency = await client.callTool('currency_exchange_tool', {
    destination: 'Tóquio',
    baseCurrency: 'BRL',
    amount: 1000,
  });
  assert.strictEqual(currency.success, true);
  assert.ok(currency.data);

  // Non-existent tool returns error gracefully without throwing
  const unknownTool = await client.callTool('non_existent_tool', {});
  assert.strictEqual(unknownTool.success, false);
  assert.ok(unknownTool.error?.includes('não encontrada'));
});

test('Travecto Infrastructure - LangGraph Orchestrator Execution Flow', async () => {
  const vectorEngine = new TravectoVectorEngine();
  await vectorEngine.addDocument(
    'Guia Local Roma',
    'Roma',
    '# Coliseu e Fontes\nNo Coliseu, mochilas volumosas são proibidas. Refresque-se com água gelada gratuita nas fontes Nasoni espalhadas por toda a cidade.'
  );

  const mcpServer = new TravectoMCPServer();
  const mcpClient = new MCPClientAdapter(mcpServer);
  const orchestrator = new TravectoGraphOrchestrator(vectorEngine, mcpClient);

  const budget = Budget.create(8000, 'BRL', 'moderate');
  const style = TravelStyle.create('cultural', 'balanced');
  const pref = new DestinationPreference({
    destination: 'Roma',
    days: 3,
    budget,
    style,
    travelersCount: 2,
    specialInterests: ['história', 'gastronomia'],
  });

  const executedSteps: string[] = [];

  const itinerary = await orchestrator.orchestrate(pref, (step) => {
    executedSteps.push(`${step.step}:${step.status}`);
  });

  assert.ok(itinerary);
  assert.strictEqual(itinerary.days.length, 3);
  assert.strictEqual(itinerary.destination, 'Roma');
  assert.ok(itinerary.weatherInfo);
  assert.ok(itinerary.currencyConversion);
  assert.ok(executedSteps.some((s) => s.startsWith('collect_preferences')));
  assert.ok(executedSteps.some((s) => s.startsWith('retrieve_context')));
  assert.ok(executedSteps.some((s) => s.startsWith('call_mcp_tools')));
  assert.ok(executedSteps.some((s) => s.startsWith('synthesize_itinerary')));
});

test('Travecto Infrastructure - Worst Case Data Hardening (break-ui)', async () => {
  const vectorEngine = new TravectoVectorEngine();
  const mcpServer = new TravectoMCPServer();
  const mcpClient = new MCPClientAdapter(mcpServer);
  const orchestrator = new TravectoGraphOrchestrator(vectorEngine, mcpClient);

  // 1-day trip with non-latin destination and extreme budget
  const extremeBudget = Budget.create(1489750, 'BRL', 'luxury');
  const pref = new DestinationPreference({
    destination: 'Llanfairpwllgwyngyllgogerychwyrndrobwllllantysiliogogogoch & 斯瓦尔巴群岛',
    days: 1,
    budget: extremeBudget,
    style: TravelStyle.create('adventure', 'fast'),
    travelersCount: 8,
    specialInterests: ['ártico', 'polos', 'nevasca'],
  });

  const itinerary = await orchestrator.orchestrate(pref);
  assert.strictEqual(itinerary.days.length, 1);
  assert.strictEqual(itinerary.totalEstimatedCost > 0, true);
  assert.ok(itinerary.title.includes('Llanfairpwllgwyngyllgogerychwyrndrobwllllantysiliogogogoch'));
});
