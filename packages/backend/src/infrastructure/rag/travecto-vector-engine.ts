import { randomUUID } from 'crypto';
import {
  ChunkCitation,
  DocumentChunk,
  IndexedDocument,
  IVectorStoreRepository,
} from '../../domain/repositories/vector-store.interface.js';

export class TravectoVectorEngine implements IVectorStoreRepository {
  private documents: Map<string, IndexedDocument> = new Map();
  private chunks: Map<string, DocumentChunk> = new Map();
  private vocabulary: Map<string, number> = new Map();
  private idfMap: Map<string, number> = new Map();

  private readonly chunkSize = 600;
  private readonly chunkOverlap = 120;

  async addDocument(
    title: string,
    destination: string,
    content: string,
    metadata: Record<string, unknown> = {}
  ): Promise<IndexedDocument> {
    const documentId = randomUUID();
    const splitChunks = this.splitTextRecursively(content, title, destination);

    const docChunks: DocumentChunk[] = splitChunks.map((chunkText, index) => {
      const chunkId = `${documentId}-chk-${index + 1}`;
      return {
        id: chunkId,
        documentId,
        source: `${title} (Seção ${index + 1})`,
        content: chunkText,
        metadata: {
          destination: destination.toLowerCase(),
          chunkIndex: index + 1,
          ...metadata,
        },
      };
    });

    for (const chunk of docChunks) {
      this.chunks.set(chunk.id, chunk);
    }

    const words = content.trim().split(/\s+/).filter(Boolean);
    const preview = content.slice(0, 180).replace(/\s+/g, ' ') + (content.length > 180 ? '...' : '');

    const indexedDoc: IndexedDocument = {
      id: documentId,
      title,
      destination,
      chunkCount: docChunks.length,
      wordCount: words.length,
      createdAt: new Date().toISOString(),
      preview,
    };

    this.documents.set(documentId, indexedDoc);
    this.rebuildTfidfIndex();

    return indexedDoc;
  }

  async similaritySearch(
    query: string,
    k: number = 4,
    destinationFilter?: string
  ): Promise<ChunkCitation[]> {
    if (this.chunks.size === 0) {
      return [];
    }

    const queryTokens = this.tokenize(query);
    if (queryTokens.length === 0) {
      return [];
    }

    const queryVector = this.computeQueryVector(queryTokens);
    const results: { chunk: DocumentChunk; score: number }[] = [];

    const normDestinationFilter = destinationFilter?.trim().toLowerCase();

    for (const chunk of this.chunks.values()) {
      if (normDestinationFilter) {
        const chunkDest = String(chunk.metadata.destination || '').toLowerCase();
        if (!chunkDest.includes(normDestinationFilter) && !normDestinationFilter.includes(chunkDest)) {
          continue;
        }
      }

      const chunkVector = chunk.embedding || this.computeTextVector(chunk.content);
      const score = this.cosineSimilarity(queryVector, chunkVector);

      if (score > 0.05) {
        results.push({ chunk, score });
      }
    }

    results.sort((a, b) => b.score - a.score);

    return results.slice(0, k).map(({ chunk, score }) => ({
      chunkId: chunk.id,
      source: chunk.source,
      content: chunk.content,
      score: Number(score.toFixed(4)),
      metadata: chunk.metadata,
    }));
  }

  async listDocuments(): Promise<IndexedDocument[]> {
    return Array.from(this.documents.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async deleteDocument(id: string): Promise<boolean> {
    if (!this.documents.has(id)) {
      return false;
    }
    this.documents.delete(id);

    for (const [chunkId, chunk] of this.chunks.entries()) {
      if (chunk.documentId === id) {
        this.chunks.delete(chunkId);
      }
    }

    this.rebuildTfidfIndex();
    return true;
  }

  async getStats(): Promise<{ totalDocuments: number; totalChunks: number }> {
    return {
      totalDocuments: this.documents.size,
      totalChunks: this.chunks.size,
    };
  }

  private splitTextRecursively(text: string, title: string, destination: string): string[] {
    const rawSections = text.split(/(?=\n#{1,3}\s)/g);
    const chunks: string[] = [];

    for (const section of rawSections) {
      const cleanSection = section.trim();
      if (!cleanSection) continue;

      if (cleanSection.length <= this.chunkSize) {
        chunks.push(cleanSection);
        continue;
      }

      const paragraphs = cleanSection.split(/\n\s*\n/);
      let currentChunk = '';

      for (const paragraph of paragraphs) {
        if ((currentChunk + '\n\n' + paragraph).length <= this.chunkSize) {
          currentChunk = currentChunk ? `${currentChunk}\n\n${paragraph}` : paragraph;
        } else {
          if (currentChunk) {
            chunks.push(currentChunk.trim());
          }
          if (paragraph.length > this.chunkSize) {
            let start = 0;
            while (start < paragraph.length) {
              const slice = paragraph.slice(start, start + this.chunkSize);
              chunks.push(slice.trim());
              start += this.chunkSize - this.chunkOverlap;
            }
            currentChunk = '';
          } else {
            currentChunk = paragraph;
          }
        }
      }

      if (currentChunk.trim()) {
        chunks.push(currentChunk.trim());
      }
    }

    return chunks.length > 0 ? chunks : [text.slice(0, this.chunkSize)];
  }

  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((word) => word.length > 2);
  }

  private rebuildTfidfIndex(): void {
    const allChunks = Array.from(this.chunks.values());
    const docCount = allChunks.length;
    if (docCount === 0) return;

    this.vocabulary.clear();
    this.idfMap.clear();

    const docFreq = new Map<string, number>();

    allChunks.forEach((chunk) => {
      const tokens = new Set(this.tokenize(chunk.content));
      tokens.forEach((token) => {
        docFreq.set(token, (docFreq.get(token) || 0) + 1);
      });
    });

    let index = 0;
    docFreq.forEach((df, token) => {
      this.vocabulary.set(token, index++);
      const idf = Math.log(1 + docCount / (1 + df)) + 1;
      this.idfMap.set(token, idf);
    });

    allChunks.forEach((chunk) => {
      chunk.embedding = this.computeTextVector(chunk.content);
    });
  }

  private computeTextVector(text: string): number[] {
    const tokens = this.tokenize(text);
    const vector = new Array(this.vocabulary.size).fill(0);
    const tf = new Map<string, number>();

    tokens.forEach((t) => tf.set(t, (tf.get(t) || 0) + 1));

    tf.forEach((count, token) => {
      const idx = this.vocabulary.get(token);
      if (idx !== undefined) {
        const idf = this.idfMap.get(token) || 1;
        vector[idx] = (count / tokens.length) * idf;
      }
    });

    return this.normalizeVector(vector);
  }

  private computeQueryVector(tokens: string[]): number[] {
    const vector = new Array(this.vocabulary.size).fill(0);
    const tf = new Map<string, number>();

    tokens.forEach((t) => tf.set(t, (tf.get(t) || 0) + 1));

    tf.forEach((count, token) => {
      const idx = this.vocabulary.get(token);
      if (idx !== undefined) {
        const idf = this.idfMap.get(token) || 1;
        vector[idx] = (count / tokens.length) * idf * 1.5;
      }
    });

    return this.normalizeVector(vector);
  }

  private normalizeVector(vector: number[]): number[] {
    const mag = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
    if (mag === 0) return vector;
    return vector.map((val) => val / mag);
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length || a.length === 0) return 0;
    let dot = 0;
    for (let i = 0; i < a.length; i++) {
      dot += a[i] * b[i];
    }
    return Math.max(0, dot);
  }
}

