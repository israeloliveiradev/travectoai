import {
  ChunkCitation,
  IVectorStoreRepository,
} from '../../domain/repositories/vector-store.interface.js';

export interface QueryDestinationCommand {
  query: string;
  destination?: string;
  limit?: number;
}

export class QueryDestinationContextUseCase {
  constructor(private readonly vectorStore: IVectorStoreRepository) {}

  async execute(command: QueryDestinationCommand): Promise<ChunkCitation[]> {
    if (!command.query || command.query.trim().length === 0) {
      throw new Error('A consulta semântica não pode ser vazia.');
    }
    return this.vectorStore.similaritySearch(
      command.query,
      command.limit || 4,
      command.destination
    );
  }
}

