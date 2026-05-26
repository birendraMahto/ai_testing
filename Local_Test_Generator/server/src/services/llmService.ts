// Unified LLM service — routes to the correct provider

import { LLMProvider, GenerateRequest, TestCase } from '../types';
import { buildTestCasePrompt } from '../prompts/testCasePrompt';

async function callOllama(prompt: string, model: string, baseUrl: string = 'http://localhost:11434'): Promise<string> {
  const response = await fetch(`${baseUrl}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      prompt,
      stream: false,
      options: { temperature: 0.3 }
    }),
  });
  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Ollama error: ${err}`);
  }
  const data = await response.json();
  return data.response;
}

async function callLMStudio(prompt: string, model: string, baseUrl: string = 'http://localhost:1234'): Promise<string> {
  const response = await fetch(`${baseUrl}/v1/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      stream: false,
    }),
  });
  if (!response.ok) {
    const err = await response.text();
    throw new Error(`LM Studio error: ${err}`);
  }
  const data = await response.json();
  return data.choices[0].message.content;
}

async function callOpenAI(prompt: string, model: string, apiKey: string, baseUrl?: string): Promise<string> {
  const url = baseUrl || 'https://api.openai.com/v1';
  const response = await fetch(`${url}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: model || 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
    }),
  });
  if (!response.ok) {
    const err = await response.text();
    throw new Error(`OpenAI error: ${err}`);
  }
  const data = await response.json();
  return data.choices[0].message.content;
}

async function callClaude(prompt: string, model: string, apiKey: string): Promise<string> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: model || 'claude-sonnet-4-20250514',
      max_tokens: 8192,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
    }),
  });
  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Claude error: ${err}`);
  }
  const data = await response.json();
  return data.content[0].text;
}

async function callGemini(prompt: string, model: string, apiKey: string): Promise<string> {
  const modelName = model || 'gemini-2.0-flash';
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.3 },
      }),
    }
  );
  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Gemini error: ${err}`);
  }
  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}

async function callGroq(prompt: string, model: string, apiKey: string): Promise<string> {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: model || 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
    }),
  });
  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Groq error: ${err}`);
  }
  const data = await response.json();
  return data.choices[0].message.content;
}

async function callGrok(prompt: string, model: string, apiKey: string): Promise<string> {
  const response = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: model || 'grok-3',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
    }),
  });
  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Grok error: ${err}`);
  }
  const data = await response.json();
  return data.choices[0].message.content;
}

export async function generateTestCases(req: GenerateRequest): Promise<{ testCases: TestCase[]; rawResponse: string }> {
  const fullPrompt = buildTestCasePrompt(
    req.fileContent ? `${req.prompt}\n\n--- Uploaded Document Content ---\n${req.fileContent}` : req.prompt
  );

  let rawResponse: string;
  const baseUrl = req.baseUrl;
  const apiKey = req.apiKey || '';

  switch (req.provider) {
    case 'ollama':
      rawResponse = await callOllama(fullPrompt, req.model, baseUrl || 'http://localhost:11434');
      break;
    case 'lmstudio':
      rawResponse = await callLMStudio(fullPrompt, req.model, baseUrl || 'http://localhost:1234');
      break;
    case 'openai':
      rawResponse = await callOpenAI(fullPrompt, req.model, apiKey, baseUrl);
      break;
    case 'claude':
      rawResponse = await callClaude(fullPrompt, req.model, apiKey);
      break;
    case 'gemini':
      rawResponse = await callGemini(fullPrompt, req.model, apiKey);
      break;
    case 'grok':
      rawResponse = await callGrok(fullPrompt, req.model, apiKey);
      break;
    case 'groq':
      rawResponse = await callGroq(fullPrompt, req.model, apiKey);
      break;
    default:
      throw new Error(`Unsupported LLM provider: ${req.provider}`);
  }

  // Parse the JSON response from the LLM
  const testCases = parseTestCasesFromResponse(rawResponse);

  return { testCases, rawResponse };
}

function parseTestCasesFromResponse(response: string): TestCase[] {
  try {
    // Try to extract JSON array from the response
    let jsonStr = response.trim();

    // Remove markdown code fences if present
    const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1].trim();
    }

    // Find the JSON array
    const arrayStart = jsonStr.indexOf('[');
    const arrayEnd = jsonStr.lastIndexOf(']');
    if (arrayStart !== -1 && arrayEnd !== -1) {
      jsonStr = jsonStr.substring(arrayStart, arrayEnd + 1);
    }

    const parsed = JSON.parse(jsonStr);

    if (!Array.isArray(parsed)) {
      throw new Error('Response is not an array');
    }

    return parsed.map((tc: any, idx: number) => ({
      testCaseId: tc.testCaseId || `TC-${String(idx + 1).padStart(3, '0')}`,
      testType: tc.testType || 'Functional',
      category: tc.category || 'Web Application',
      summary: tc.summary || '',
      preconditions: tc.preconditions || 'None',
      steps: tc.steps || '',
      testData: tc.testData || 'N/A',
      expectedResult: tc.expectedResult || '',
      priority: tc.priority || 'Medium',
      severity: tc.severity || 'Major',
    }));
  } catch (error: any) {
    console.error('Failed to parse LLM response as JSON:', error.message);
    // Return a single test case with the raw response if parsing fails
    return [{
      testCaseId: 'TC-001',
      testType: 'Functional',
      category: 'Web Application',
      summary: 'Raw LLM Response (parsing failed)',
      preconditions: 'N/A',
      steps: response,
      testData: 'N/A',
      expectedResult: 'Please review the raw response above',
      priority: 'Medium',
      severity: 'Major',
    }];
  }
}
