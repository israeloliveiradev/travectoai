import {
  IMCPClient,
  MCPToolDefinition,
  MCPToolResult,
} from '../../domain/repositories/mcp-client.interface.js';
import { TravectoMCPServer } from './mcp-server.js';

export class MCPClientAdapter implements IMCPClient {
  constructor(private readonly server: TravectoMCPServer) {}

  async listTools(): Promise<MCPToolDefinition[]> {
    return this.server.listTools();
  }

  async callTool<T = unknown>(
    name: string,
    args: Record<string, unknown>
  ): Promise<MCPToolResult<T>> {
    const result = await this.server.handleCallTool(name, args);
    return result as MCPToolResult<T>;
  }
}

