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

export interface ProviderModels {
  provider: LLMProvider;
  displayName: string;
  models: string[];
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

// ===== History Summary =====
export interface HistorySummary {
  id: string;
  connectionName: string;
  resumeFileName: string;
  scores: ResumeScores;
  createdAt: string;
  jobDescriptionPreview: string;
}

// ===== Built Resume =====
export interface BuiltResume {
  id: string;
  analysisId: string;
  content: string;
  createdAt: string;
}

// ===== API Response =====
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
