import OpenAI from 'openai';

export async function callOpenAI(
  apiKey: string,
  model: string,
  prompt: string
): Promise<string> {
  const client = new OpenAI({ apiKey });

  const response = await client.chat.completions.create({
    model,
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    max_tokens: 4096,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error('No response content from OpenAI');
  }
  return content;
}

export async function testOpenAI(apiKey: string, model: string): Promise<boolean> {
  try {
    const client = new OpenAI({ apiKey });
    const response = await client.chat.completions.create({
      model,
      messages: [{ role: 'user', content: 'Say "Connection successful" in one sentence.' }],
      max_tokens: 50,
    });
    return !!response.choices[0]?.message?.content;
  } catch (error) {
    console.error('OpenAI test failed:', error);
    throw error;
  }
}
