// API service — HTTP calls to backend

import axios from 'axios';
import type { GenerateResponse, DetectedModels, ConnectionTestResult, TestCase, LLMProvider } from '../types';

const API_BASE = 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 300000, // 5 min timeout for LLM generation
});

export async function generateTestCases(
  prompt: string,
  provider: LLMProvider,
  model: string,
  apiKey?: string,
  baseUrl?: string,
  fileContent?: string,
  fileName?: string,
): Promise<GenerateResponse> {
  const { data } = await api.post('/generate', {
    prompt,
    provider,
    model,
    apiKey,
    baseUrl,
    fileContent,
    fileName,
  });
  return data;
}

export async function detectLocalLLMs(
  ollamaHost?: string,
  ollamaPort?: number,
  lmstudioHost?: string,
  lmstudioPort?: number,
): Promise<DetectedModels> {
  const params: Record<string, string> = {};
  if (ollamaHost) params.ollamaHost = ollamaHost;
  if (ollamaPort) params.ollamaPort = String(ollamaPort);
  if (lmstudioHost) params.lmstudioHost = lmstudioHost;
  if (lmstudioPort) params.lmstudioPort = String(lmstudioPort);

  const { data } = await api.get('/llm/detect', { params });
  return data;
}

export async function testConnection(
  provider: LLMProvider,
  apiKey?: string,
  baseUrl?: string,
  port?: number,
): Promise<ConnectionTestResult> {
  const { data } = await api.post('/llm/test', { provider, apiKey, baseUrl, port });
  return data;
}

export async function uploadFile(file: File): Promise<{ originalName: string; extractedText: string; mimeType: string; size: number }> {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function exportCSV(testCases: TestCase[]): Promise<Blob> {
  const { data } = await api.post('/export/csv', { testCases }, { responseType: 'blob' });
  return data;
}

export async function exportExcel(testCases: TestCase[]): Promise<Blob> {
  const { data } = await api.post('/export/excel', { testCases }, { responseType: 'blob' });
  return data;
}
