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

export type LLMProvider = 'openai' | 'anthropic' | 'gemini' | 'groq' | 'kimik2' | 'ollama' | 'lmstudio';

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
  originalResumeText: string;
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
    displayName: 'Chat GPT',
    models: ['gpt-4o', 'gpt-4o-mini', 'gpt-3.5-turbo'],
  },
  {
    provider: 'anthropic',
    displayName: 'Claude',
    models: ['claude-3-5-sonnet-20240620', 'claude-3-haiku-20240307'],
  },
  {
    provider: 'gemini',
    displayName: 'Gemini',
    models: ['gemini-2.0-flash', 'gemini-1.5-flash'],
  },
  {
    provider: 'groq',
    displayName: 'Groq',
    models: ['llama3-8b-8192', 'llama3-70b-8192', 'mixtral-8x7b-32768', 'gemma2-9b-it'],
  },
  {
    provider: 'kimik2',
    displayName: 'kimik2',
    models: ['kimik-v2-chat'], // Placeholder free model
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
