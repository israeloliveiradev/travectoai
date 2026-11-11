import { Request, Response } from 'express';
import { IndexTravelDocumentUseCase } from '../../application/use-cases/index-travel-document.use-case.js';
import { ListIndexedDocumentsUseCase } from '../../application/use-cases/list-indexed-documents.use-case.js';
import { QueryDestinationContextUseCase } from '../../application/use-cases/query-destination-context.use-case.js';
import { IVectorStoreRepository } from '../../domain/repositories/vector-store.interface.js';
import { IndexDocumentSchema } from '../dtos/index-document.dto.js';
import { QueryRagSchema } from '../dtos/query-rag.dto.js';

export class RagController {
  constructor(
    private readonly indexUseCase: IndexTravelDocumentUseCase,
    private readonly listUseCase: ListIndexedDocumentsUseCase,
    private readonly queryUseCase: QueryDestinationContextUseCase,
    private readonly vectorStore: IVectorStoreRepository
  ) { }

  async list(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.listUseCase.execute();
      res.status(200).json({ success: true, data: result });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao listar documentos RAG';
      res.status(500).json({ success: false, error: message });
    }
  }

  async index(req: Request, res: Response): Promise<void> {
    try {
      const parsed = IndexDocumentSchema.parse(req.body);
      const document = await this.indexUseCase.execute(parsed);
      res.status(201).json({ success: true, data: document });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Falha na indexação';
      res.status(400).json({ success: false, error: message });
    }
  }

  async query(req: Request, res: Response): Promise<void> {
    try {
      const parsed = QueryRagSchema.parse(req.body);
      const citations = await this.queryUseCase.execute({
        query: parsed.query,
        destination: parsed.destination,
        limit: parsed.limit,
      });
      res.status(200).json({ success: true, data: citations });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Falha na busca vetorial';
      res.status(400).json({ success: false, error: message });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = String(req.params.id);
      const deleted = await this.vectorStore.deleteDocument(id);
      if (!deleted) {
        res.status(404).json({ success: false, error: 'Documento não encontrado.' });
        return;
      }
      res.status(200).json({ success: true, message: 'Documento removido do índice vetorial.' });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao remover documento';
      res.status(500).json({ success: false, error: message });
    }
  }
}
