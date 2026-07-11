export async function callLMStudio(
  _apiKey: string, // LM Studio usually doesn't need an API key
  model: string,
  prompt: string
): Promise<string> {
  const url = 'http://127.0.0.1:1234/v1/chat/completions';

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: prompt }],
      stream: false,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`LM Studio API error: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

export async function testLMStudio(
  _apiKey: string,
  model: string
): Promise<boolean> {
  const url = 'http://127.0.0.1:1234/v1/chat/completions';

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: 'Hello' }],
      max_tokens: 5,
      stream: false,
    }),
  });

  if (!response.ok) {
    throw new Error(`LM Studio API error: ${response.status}`);
  }

  return true;
}
