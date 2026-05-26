// Shared TypeScript interfaces for the backend

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

export interface GenerateRequest {
  prompt: string;
  fileContent?: string;
  fileName?: string;
  provider: LLMProvider;
  model: string;
  apiKey?: string;
  baseUrl?: string;
}

export interface GenerateResponse {
  testCases: TestCase[];
  rawResponse: string;
  model: string;
  provider: string;
  timestamp: string;
}

export type LLMProvider = 'ollama' | 'lmstudio' | 'openai' | 'claude' | 'gemini' | 'grok' | 'groq';

export interface LLMConfig {
  provider: LLMProvider;
  model: string;
  apiKey?: string;
  baseUrl?: string;
  port?: number;
}

export interface DetectedModel {
  name: string;
  provider: 'ollama' | 'lmstudio';
  size?: string;
  modified?: string;
}

export interface ConnectionTestResult {
  success: boolean;
  message: string;
  models?: string[];
}

export interface UploadedFile {
  originalName: string;
  extractedText: string;
  mimeType: string;
  size: number;
}
