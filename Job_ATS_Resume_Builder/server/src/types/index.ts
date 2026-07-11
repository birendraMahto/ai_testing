// ===== LLM Connection Types =====
export interface LLMConnection {
  id: string;
  connectionName: string;
  provider: LLMProvider;
  modelName: string;
  apiKey: string;
  createdAt: string;
  updatedAt: string;
}

export type LLMProvider = 'openai' | 'anthropic' | 'gemini' | 'ollama' | 'lmstudio';

export interface TestConnectionRequest {
  provider: LLMProvider;
  modelName: string;
  apiKey: string;
}

export interface CreateConnectionRequest {
  connectionName: string;
  provider: LLMProvider;
  modelName: string;
  apiKey: string;
}

export interface UpdateConnectionRequest {
  provider?: LLMProvider;
  modelName?: string;
  apiKey?: string;
}

// ===== Analysis Types =====
export interface AnalysisResult {
  id: string;
  connectionId: string;
  connectionName: string;
  jobDescription: string;
  resumeFileName: string;
  scores: ResumeScores;
  feedback: ResumeFeedback;
  rawResponse: string;
  createdAt: string;
}

export interface ResumeScores {
  overall: number;
  effectivity: number;
  layoutDesign: number;
  contentRelevance: number;
  grammarSyntax: number;
  impact: number;
}

export interface ResumeFeedback {
  positives: string[];
  improvements: string[];
  missingKeywords: string[];
  suggestions: string[];
}

// ===== Resume Builder Types =====
export interface BuiltResume {
  id: string;
  analysisId: string;
  content: string;
  createdAt: string;
}

// ===== API Response Types =====
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

// ===== LLM Provider Config =====
export interface ProviderModels {
  provider: LLMProvider;
  displayName: string;
  models: string[];
}

export const PROVIDER_MODELS: ProviderModels[] = [
  {
    provider: 'openai',
    displayName: 'OpenAI',
    models: ['gpt-4o-mini', 'gpt-3.5-turbo'],
  },
  {
    provider: 'anthropic',
    displayName: 'Anthropic (Claude)',
    models: ['claude-3-haiku-20240307'],
  },
  {
    provider: 'gemini',
    displayName: 'Google (Gemini)',
    models: ['gemini-2.0-flash', 'gemini-1.5-flash'],
  },
  {
    provider: 'ollama',
    displayName: 'Local (Ollama)',
    models: [], // Will be dynamically populated
  },
  {
    provider: 'lmstudio',
    displayName: 'Local (LM Studio)',
    models: [], // Will be dynamically populated
  },
];
