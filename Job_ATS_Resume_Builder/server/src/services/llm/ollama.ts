export async function callOllama(
  _apiKey: string, // Not needed for local ollama usually
  model: string,
  prompt: string
): Promise<string> {
  const url = 'http://127.0.0.1:11434/api/generate';

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      prompt,
      stream: false,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Ollama API error: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  return data.response;
}

export async function testOllama(
  _apiKey: string,
  model: string
): Promise<boolean> {
  const url = 'http://127.0.0.1:11434/api/generate';

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      prompt: 'Hello',
      stream: false,
    }),
  });

  if (!response.ok) {
    throw new Error(`Ollama API error: ${response.status}`);
  }

  return true;
}
