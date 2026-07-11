import { LLMProvider } from '../../types';
import { callOpenAI, testOpenAI } from './openai';
import { callAnthropic, testAnthropic } from './anthropic';
import { callGemini, testGemini } from './gemini';
import { callOllama, testOllama } from './ollama';

export async function callLLM(
  provider: LLMProvider,
  apiKey: string,
  model: string,
  prompt: string
): Promise<string> {
  switch (provider) {
    case 'openai':
      return callOpenAI(apiKey, model, prompt);
    case 'anthropic':
      return callAnthropic(apiKey, model, prompt);
    case 'gemini':
      return callGemini(apiKey, model, prompt);
    case 'ollama':
      return callOllama(apiKey, model, prompt);
    default:
      throw new Error(`Unsupported LLM provider: ${provider}`);
  }
}

export async function testLLMConnection(
  provider: LLMProvider,
  apiKey: string,
  model: string
): Promise<boolean> {
  switch (provider) {
    case 'openai':
      return testOpenAI(apiKey, model);
    case 'anthropic':
      return testAnthropic(apiKey, model);
    case 'gemini':
      return testGemini(apiKey, model);
    case 'ollama':
      return testOllama(apiKey, model);
    default:
      throw new Error(`Unsupported LLM provider: ${provider}`);
  }
}
