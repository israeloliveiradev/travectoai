import { z } from 'zod';

export const ExecuteMcpSchema = z.object({
  toolName: z.string().min(1, 'O nome da ferramenta MCP é obrigatório.'),
  arguments: z.record(z.unknown()).default({}),
});

export type ExecuteMcpInput = z.infer<typeof ExecuteMcpSchema>;

