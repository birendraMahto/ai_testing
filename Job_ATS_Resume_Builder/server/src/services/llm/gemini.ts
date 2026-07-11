import { GoogleGenerativeAI } from '@google/generative-ai';

export async function callGemini(
  apiKey: string,
  model: string,
  prompt: string
): Promise<string> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const genModel = genAI.getGenerativeModel({ model });

  const result = await genModel.generateContent(prompt);
  const response = result.response;
  const text = response.text();

  if (!text) {
    throw new Error('No response content from Gemini');
  }
  return text;
}

export async function testGemini(apiKey: string, model: string): Promise<boolean> {
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const genModel = genAI.getGenerativeModel({ model });

    const result = await genModel.generateContent('Say "Connection successful" in one sentence.');
    const text = result.response.text();
    return !!text;
  } catch (error) {
    console.error('Gemini test failed:', error);
    throw error;
  }
}
