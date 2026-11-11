import { useState, useEffect, useCallback } from 'react';
import { ChunkCitation, IndexedDocument } from '../types/index.js';
import {
  deleteRagDocument,
  indexRagDocument,
  listRagDocuments,
  queryRag,
} from '../services/api.js';

export function useRagEngine() {
  const [documents, setDocuments] = useState<IndexedDocument[]>([]);
  const [stats, setStats] = useState<{ totalDocuments: number; totalChunks: number }>({
    totalDocuments: 0,
    totalChunks: 0,
  });
  const [queryResults, setQueryResults] = useState<ChunkCitation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isIndexing, setIsIndexing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await listRagDocuments();
      setDocuments(data.documents);
      setStats(data.stats);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao listar guias');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const search = useCallback(
    async (query: string, destination?: string, limit = 4) => {
      if (!query.trim()) return;
      setIsSearching(true);
      setError(null);
      try {
        const results = await queryRag({ query, destination, limit });
        setQueryResults(results);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Erro na busca RAG');
      } finally {
        setIsSearching(false);
      }
    },
    []
  );

  const indexDocument = useCallback(
    async (payload: { title: string; destination: string; content: string }) => {
      setIsIndexing(true);
      setError(null);
      try {
        await indexRagDocument(payload);
        await fetchDocuments();
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Erro na indexação');
        throw err;
      } finally {
        setIsIndexing(false);
      }
    },
    [fetchDocuments]
  );

  const deleteDoc = useCallback(
    async (id: string) => {
      try {
        await deleteRagDocument(id);
        await fetchDocuments();
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Erro ao deletar guia');
      }
    },
    [fetchDocuments]
  );

  return {
    documents,
    stats,
    queryResults,
    isLoading,
    isSearching,
    isIndexing,
    error,
    refresh: fetchDocuments,
    search,
    indexDocument,
    deleteDoc,
  };
}

