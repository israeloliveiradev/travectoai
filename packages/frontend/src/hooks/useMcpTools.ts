import { useState, useEffect, useCallback } from 'react';
import { MCPToolDefinition, MCPToolResult } from '../types/index.js';
import { executeMcpTool, listMcpTools } from '../services/api.js';

export function useMcpTools() {
  const [tools, setTools] = useState<MCPToolDefinition[]>([]);
  const [lastResult, setLastResult] = useState<MCPToolResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTools = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await listMcpTools();
      setTools(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao listar tools MCP');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTools();
  }, [fetchTools]);

  const runTool = useCallback(
    async (toolName: string, args: Record<string, unknown>) => {
      setIsRunning(true);
      setError(null);
      try {
        const result = await executeMcpTool(toolName, args);
        setLastResult(result);
        return result;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Erro na execução da tool';
        setError(msg);
        throw err;
      } finally {
        setIsRunning(false);
      }
    },
    []
  );

  return {
    tools,
    lastResult,
    isLoading,
    isRunning,
    error,
    refresh: fetchTools,
    runTool,
  };
}

