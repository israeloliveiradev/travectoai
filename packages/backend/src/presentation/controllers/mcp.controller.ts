import { Request, Response } from 'express';
import { ExecuteMcpToolUseCase } from '../../application/use-cases/execute-mcp-tool.use-case.js';
import { ExecuteMcpSchema } from '../dtos/execute-mcp.dto.js';

export class McpController {
  constructor(private readonly executeUseCase: ExecuteMcpToolUseCase) {}

  async listTools(req: Request, res: Response): Promise<void> {
    try {
      const tools = await this.executeUseCase.listTools();
      res.status(200).json({ success: true, data: tools });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao listar ferramentas MCP';
      res.status(500).json({ success: false, error: message });
    }
  }

  async execute(req: Request, res: Response): Promise<void> {
    try {
      const parsed = ExecuteMcpSchema.parse(req.body);
      const result = await this.executeUseCase.execute({
        toolName: parsed.toolName,
        arguments: parsed.arguments,
      });

      res.status(200).json({
        success: result.success,
        data: result,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Falha na execução da ferramenta MCP';
      res.status(400).json({ success: false, error: message });
    }
  }
}

