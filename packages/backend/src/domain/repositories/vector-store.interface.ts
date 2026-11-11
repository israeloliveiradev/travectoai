export interface IndexedDocument {
  id: string;
  title: string;
  destination: string;
  chunkCount: number;
  wordCount: number;
  createdAt: string;
  preview: string;
}

export interface DocumentChunk {
  id: string;
  documentId: string;
  source: string;
  content: string;
  metadata: {
    destination: string;
    section?: string;
    chunkIndex: number;
    [key: string]: unknown;
  };
  embedding?: number[];
}

export interface ChunkCitation {
  chunkId: string;
  source: string;
  content: string;
  score: number;
  metadata?: Record<string, unknown>;
}

export interface IVectorStoreRepository {
  addDocument(
    title: string,
    destination: string,
    content: string,
    metadata?: Record<string, unknown>
  ): Promise<IndexedDocument>;
  similaritySearch(
    query: string,
    k?: number,
    destinationFilter?: string
  ): Promise<ChunkCitation[]>;
  listDocuments(): Promise<IndexedDocument[]>;
  deleteDocument(id: string): Promise<boolean>;
  getStats(): Promise<{ totalDocuments: number; totalChunks: number }>;
}

