// Auto-detect running local LLMs (Ollama and LM Studio)

import { DetectedModel } from '../types';

export async function detectOllama(host: string = 'http://localhost', port: number = 11434): Promise<DetectedModel[]> {
  try {
    const response = await fetch(`${host}:${port}/api/tags`);
    if (!response.ok) return [];
    const data = await response.json();
    return (data.models || []).map((m: any) => ({
      name: m.name,
      provider: 'ollama' as const,
      size: m.size ? `${(m.size / 1e9).toFixed(1)}GB` : undefined,
      modified: m.modified_at,
    }));
  } catch {
    return [];
  }
}

export async function detectLMStudio(host: string = 'http://localhost', port: number = 1234): Promise<DetectedModel[]> {
  try {
    const response = await fetch(`${host}:${port}/v1/models`);
    if (!response.ok) return [];
    const data = await response.json();
    return (data.data || []).map((m: any) => ({
      name: m.id,
      provider: 'lmstudio' as const,
    }));
  } catch {
    return [];
  }
}

export async function detectAllLocalLLMs(
  ollamaHost?: string,
  ollamaPort?: number,
  lmstudioHost?: string,
  lmstudioPort?: number
): Promise<{ ollama: DetectedModel[]; lmstudio: DetectedModel[] }> {
  const [ollama, lmstudio] = await Promise.all([
    detectOllama(ollamaHost, ollamaPort),
    detectLMStudio(lmstudioHost, lmstudioPort),
  ]);
  return { ollama, lmstudio };
}
