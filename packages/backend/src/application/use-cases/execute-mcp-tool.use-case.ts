import {
  IMCPClient,
  MCPToolDefinition,
  MCPToolResult,
} from '../../domain/repositories/mcp-client.interface.js';

export interface ExecuteMcpToolCommand {
  toolName: string;
  arguments: Record<string, unknown>;
}

export class ExecuteMcpToolUseCase {
  constructor(private readonly mcpClient: IMCPClient) {}

  async listTools(): Promise<MCPToolDefinition[]> {
    return this.mcpClient.listTools();
  }

  async execute(command: ExecuteMcpToolCommand): Promise<MCPToolResult> {
    if (!command.toolName) {
      throw new Error('O nome da ferramenta MCP é obrigatório.');
    }
    return this.mcpClient.callTool(command.toolName, command.arguments || {});
  }
}

