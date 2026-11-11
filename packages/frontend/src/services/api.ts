import {
  ChunkCitation,
  IndexedDocument,
  Itinerary,
  MCPToolDefinition,
  MCPToolResult,
  OrchestrationStepEvent,
  SystemHealth,
  TravelPreferenceFormValues,
} from '../types/index.js';

const API_BASE = '/api';

export async function checkHealth(): Promise<SystemHealth> {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error('Falha ao obter status de saúde do backend');
  return res.json();
}

export async function generateItinerary(
  form: TravelPreferenceFormValues
): Promise<Itinerary> {
  const payload = {
    destination: form.destination,
    days: form.days,
    budget: {
      amount: form.budgetAmount,
      currency: form.budgetCurrency,
      tier: form.budgetTier,
    },
    style: {
      type: form.styleType,
      pace: form.stylePace,
    },
    travelersCount: form.travelersCount,
    specialInterests: form.specialInterests,
    departureDate: form.departureDate,
  };

  const res = await fetch(`${API_BASE}/itinerary/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error || 'Falha ao gerar itinerário');
  }

  return json.data;
}

export function streamItinerary(
  form: TravelPreferenceFormValues,
  callbacks: {
    onStep: (event: OrchestrationStepEvent) => void;
    onCompleted: (itinerary: Itinerary) => void;
    onError: (err: string) => void;
  }
): () => void {
  const controller = new AbortController();

  const payload = {
    destination: form.destination,
    days: form.days,
    budget: {
      amount: form.budgetAmount,
      currency: form.budgetCurrency,
      tier: form.budgetTier,
    },
    style: {
      type: form.styleType,
      pace: form.stylePace,
    },
    travelersCount: form.travelersCount,
    specialInterests: form.specialInterests,
    departureDate: form.departureDate,
  };

  fetch(`${API_BASE}/itinerary/stream`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal: controller.signal,
  })
    .then(async (response) => {
      if (!response.ok || !response.body) {
        throw new Error('Falha ao conectar no stream SSE');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const block of lines) {
          if (!block.trim()) continue;

          let eventName = 'message';
          let dataText = '';

          const blockLines = block.split('\n');
          for (const line of blockLines) {
            if (line.startsWith('event:')) {
              eventName = line.replace('event:', '').trim();
            } else if (line.startsWith('data:')) {
              dataText = line.replace('data:', '').trim();
            }
          }

          if (dataText) {
            try {
              const parsed = JSON.parse(dataText);
              if (eventName === 'node_step') {
                callbacks.onStep(parsed as OrchestrationStepEvent);
              } else if (eventName === 'completed') {
                callbacks.onCompleted(parsed.itinerary as Itinerary);
              } else if (eventName === 'error') {
                callbacks.onError(parsed.error || 'Erro na orquestração');
              }
            } catch (e) {
              console.error('Falha ao decodificar evento SSE:', e);
            }
          }
        }
      }
    })
    .catch((err) => {
      if (err.name !== 'AbortError') {
        callbacks.onError(err.message || 'Erro de rede no stream do agente');
      }
    });

  return () => controller.abort();
}

export async function listRagDocuments(): Promise<{
  documents: IndexedDocument[];
  stats: { totalDocuments: number; totalChunks: number };
}> {
  const res = await fetch(`${API_BASE}/rag/documents`);
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.error || 'Erro ao carregar documentos RAG');
  return json.data;
}

export async function indexRagDocument(payload: {
  title: string;
  destination: string;
  content: string;
  metadata?: Record<string, unknown>;
}): Promise<IndexedDocument> {
  const res = await fetch(`${API_BASE}/rag/index`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.error || 'Erro ao indexar guia de viagem');
  return json.data;
}

export async function queryRag(payload: {
  query: string;
  destination?: string;
  limit?: number;
}): Promise<ChunkCitation[]> {
  const res = await fetch(`${API_BASE}/rag/query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.error || 'Erro ao consultar RAG');
  return json.data;
}

export async function deleteRagDocument(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/rag/documents/${id}`, {
    method: 'DELETE',
  });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.error || 'Erro ao deletar documento');
}

export async function listMcpTools(): Promise<MCPToolDefinition[]> {
  const res = await fetch(`${API_BASE}/mcp/tools`);
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.error || 'Erro ao carregar tools MCP');
  return json.data;
}

export async function executeMcpTool(
  toolName: string,
  args: Record<string, unknown>
): Promise<MCPToolResult> {
  const res = await fetch(`${API_BASE}/mcp/execute`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ toolName, arguments: args }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Erro ao executar ferramenta MCP');
  return json.data;
}

