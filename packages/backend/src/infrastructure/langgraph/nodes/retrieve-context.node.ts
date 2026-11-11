import { IVectorStoreRepository } from '../../../domain/repositories/vector-store.interface.js';
import { TravectoStateType } from '../travecto-graph-state.js';

export function createRetrieveContextNode(vectorStore: IVectorStoreRepository) {
  return async function retrieveContextNode(
    state: TravectoStateType
  ): Promise<Partial<TravectoStateType>> {
    const prefs = state.preferences;
    if (!prefs) {
      throw new Error('Preferências ausentes no nó retrieve_context.');
    }

    const queryTerms = [
      prefs.destination,
      prefs.style.type,
      ...prefs.style.focusKeywords,
      ...prefs.specialInterests,
    ].join(' ');

    const citations = await vectorStore.similaritySearch(
      queryTerms,
      6,
      prefs.destination
    );

    const log = `[retrieve_context] Busca semântica executada para "${prefs.destination}". ${citations.length} fragmentos recuperados com sucesso.`;

    const summary = citations.length > 0
      ? citations.map((c, i) => `[Fonte ${i + 1}: ${c.source}] ${c.content}`).join('\n\n')
      : `Nenhum guia local específico encontrado para ${prefs.destination}. Utilizando base de conhecimento geral.`;

    return {
      currentStep: 'retrieve_context',
      ragContext: {
        summary,
        citations: citations.map((c) => ({
          chunkId: c.chunkId,
          source: c.source,
          content: c.content,
          relevanceScore: c.score,
        })),
      },
      stepLogs: [log],
    };
  };
}

