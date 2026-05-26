// Shared TypeScript interfaces for the frontend

export interface TestCase {
  testCaseId: string;
  testType: 'Functional' | 'Non-Functional';
  category: 'API' | 'Web Application';
  summary: string;
  preconditions: string;
  steps: string;
  testData: string;
  expectedResult: string;
  priority: 'High' | 'Medium' | 'Low';
  severity: 'Critical' | 'Major' | 'Minor' | 'Trivial';
}

export interface GenerateResponse {
  testCases: TestCase[];
  rawResponse: string;
  model: string;
  provider: string;
  timestamp: string;
}

export type LLMProvider = 'ollama' | 'lmstudio' | 'openai' | 'claude' | 'gemini' | 'grok' | 'groq';

export interface LLMSettings {
  mode: 'local' | 'api';
  activeProvider: LLMProvider;
  activeModel: string;
  ollama: { host: string; port: number; model: string };
  lmstudio: { host: string; port: number; model: string };
  openai: { apiKey: string; model: string };
  claude: { apiKey: string; model: string };
  gemini: { apiKey: string; model: string };
  grok: { apiKey: string; model: string };
  groq: { apiKey: string; model: string };
}

export interface DetectedModels {
  ollama: { available: boolean; models: { name: string; provider: string; size?: string }[] };
  lmstudio: { available: boolean; models: { name: string; provider: string }[] };
}

export interface HistoryEntry {
  id: string;
  prompt: string;
  fileName?: string;
  testCases: TestCase[];
  model: string;
  provider: string;
  timestamp: string;
}

export interface ConnectionTestResult {
  success: boolean;
  message: string;
  models?: string[];
}

export const DEFAULT_SETTINGS: LLMSettings = {
  mode: 'local',
  activeProvider: 'ollama',
  activeModel: '',
  ollama: { host: 'http://localhost', port: 11434, model: '' },
  lmstudio: { host: 'http://localhost', port: 1234, model: '' },
  openai: { apiKey: '', model: 'gpt-4o' },
  claude: { apiKey: '', model: 'claude-sonnet-4-20250514' },
  gemini: { apiKey: '', model: 'gemini-2.0-flash' },
  grok: { apiKey: '', model: 'grok-3' },
  groq: { apiKey: '', model: 'llama-3.3-70b-versatile' },
};
