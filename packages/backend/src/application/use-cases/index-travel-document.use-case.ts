import {
  IndexedDocument,
  IVectorStoreRepository,
} from '../../domain/repositories/vector-store.interface.js';

export interface IndexDocumentCommand {
  title: string;
  destination: string;
  content: string;
  metadata?: Record<string, unknown>;
}

export class IndexTravelDocumentUseCase {
  constructor(private readonly vectorStore: IVectorStoreRepository) {}

  async execute(command: IndexDocumentCommand): Promise<IndexedDocument> {
    if (!command.title || !command.destination || !command.content) {
      throw new Error('Título, destino e conteúdo são obrigatórios para indexação.');
    }
    return this.vectorStore.addDocument(
      command.title,
      command.destination,
      command.content,
      command.metadata
    );
  }
}

