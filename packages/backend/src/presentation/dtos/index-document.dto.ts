import { z } from 'zod';

export const IndexDocumentSchema = z.object({
  title: z.string().min(3, 'O título do documento deve conter no mínimo 3 caracteres.'),
  destination: z.string().min(2, 'O destino associado é obrigatório.'),
  content: z.string().min(20, 'O conteúdo do guia deve conter no mínimo 20 caracteres.'),
  metadata: z.record(z.unknown()).optional(),
});

export type IndexDocumentInput = z.infer<typeof IndexDocumentSchema>;

