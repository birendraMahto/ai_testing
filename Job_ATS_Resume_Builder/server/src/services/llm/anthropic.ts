import Anthropic from '@anthropic-ai/sdk';

export async function callAnthropic(
  apiKey: string,
  model: string,
  prompt: string
): Promise<string> {
  const client = new Anthropic({ apiKey });

  const response = await client.messages.create({
    model,
    max_tokens: 4096,
    messages: [{ role: 'user', content: prompt }],
  });

  const content = response.content[0];
  if (!content || content.type !== 'text') {
    throw new Error('No response content from Anthropic');
  }
  return content.text;
}

export async function testAnthropic(apiKey: string, model: string): Promise<boolean> {
  try {
    const client = new Anthropic({ apiKey });
    const response = await client.messages.create({
      model,
      max_tokens: 50,
      messages: [{ role: 'user', content: 'Say "Connection successful" in one sentence.' }],
    });
    return response.content.length > 0;
  } catch (error) {
    console.error('Anthropic test failed:', error);
    throw error;
  }
}
