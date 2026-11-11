import {
  IndexedDocument,
  IVectorStoreRepository,
} from '../../domain/repositories/vector-store.interface.js';

export interface ListDocumentsResult {
  documents: IndexedDocument[];
  stats: {
    totalDocuments: number;
    totalChunks: number;
  };
}

export class ListIndexedDocumentsUseCase {
  constructor(private readonly vectorStore: IVectorStoreRepository) {}

  async execute(): Promise<ListDocumentsResult> {
    const [documents, stats] = await Promise.all([
      this.vectorStore.listDocuments(),
      this.vectorStore.getStats(),
    ]);

    return { documents, stats };
  }
}

