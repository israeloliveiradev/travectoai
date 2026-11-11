export interface MCPToolParameter {
  type: string;
  description: string;
  required?: boolean;
}

export interface MCPToolDefinition {
  name: string;
  description: string;
  parameters: {
    type: 'object';
    properties: Record<string, MCPToolParameter>;
    required: string[];
  };
}

export interface MCPToolResult<T = unknown> {
  success: boolean;
  toolName: string;
  timestamp: string;
  data: T;
  error?: string;
}

export interface IMCPClient {
  listTools(): Promise<MCPToolDefinition[]>;
  callTool<T = unknown>(name: string, args: Record<string, unknown>): Promise<MCPToolResult<T>>;
}

