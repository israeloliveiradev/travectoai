import { z } from 'zod';

export const QueryRagSchema = z.object({
  query: z.string().min(2, 'O texto da consulta semântica é obrigatório.'),
  destination: z.string().optional(),
  limit: z.number().int().min(1).max(20).default(5),
});

export type QueryRagInput = z.infer<typeof QueryRagSchema>;

