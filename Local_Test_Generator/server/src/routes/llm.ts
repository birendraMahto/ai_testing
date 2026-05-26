// Route: GET /api/llm/detect — Auto-detect local LLMs

import { Router, Request, Response } from 'express';
import { detectAllLocalLLMs } from '../utils/detectLLM';

const router = Router();

router.get('/detect', async (req: Request, res: Response) => {
  try {
    const ollamaHost = (req.query.ollamaHost as string) || 'http://localhost';
    const ollamaPort = parseInt(req.query.ollamaPort as string) || 11434;
    const lmstudioHost = (req.query.lmstudioHost as string) || 'http://localhost';
    const lmstudioPort = parseInt(req.query.lmstudioPort as string) || 1234;

    const result = await detectAllLocalLLMs(ollamaHost, ollamaPort, lmstudioHost, lmstudioPort);

    return res.json({
      ollama: {
        available: result.ollama.length > 0,
        models: result.ollama,
      },
      lmstudio: {
        available: result.lmstudio.length > 0,
        models: result.lmstudio,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// POST /api/llm/test — Test connection to a provider
router.post('/test', async (req: Request, res: Response) => {
  try {
    const { provider, apiKey, baseUrl, port } = req.body;

    switch (provider) {
      case 'ollama': {
        const url = baseUrl || `http://localhost:${port || 11434}`;
        const resp = await fetch(`${url}/api/tags`);
        if (!resp.ok) throw new Error('Cannot connect to Ollama');
        const data = await resp.json();
        return res.json({
          success: true,
          message: `Connected to Ollama. ${data.models?.length || 0} models available.`,
          models: (data.models || []).map((m: any) => m.name),
        });
      }
      case 'lmstudio': {
        const url = baseUrl || `http://localhost:${port || 1234}`;
        const resp = await fetch(`${url}/v1/models`);
        if (!resp.ok) throw new Error('Cannot connect to LM Studio');
        const data = await resp.json();
        return res.json({
          success: true,
          message: `Connected to LM Studio. ${data.data?.length || 0} models loaded.`,
          models: (data.data || []).map((m: any) => m.id),
        });
      }
      case 'openai': {
        if (!apiKey) return res.status(400).json({ success: false, message: 'API key required.' });
        const resp = await fetch('https://api.openai.com/v1/models', {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        if (!resp.ok) throw new Error('Invalid OpenAI API key');
        return res.json({ success: true, message: 'OpenAI API key is valid.' });
      }
      case 'claude': {
        if (!apiKey) return res.status(400).json({ success: false, message: 'API key required.' });
        const resp = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 10,
            messages: [{ role: 'user', content: 'test' }],
          }),
        });
        if (!resp.ok) {
          const err = await resp.text();
          if (err.includes('invalid')) throw new Error('Invalid Claude API key');
        }
        return res.json({ success: true, message: 'Claude API key is valid.' });
      }
      case 'gemini': {
        if (!apiKey) return res.status(400).json({ success: false, message: 'API key required.' });
        const resp = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
        );
        if (!resp.ok) throw new Error('Invalid Gemini API key');
        return res.json({ success: true, message: 'Gemini API key is valid.' });
      }
      case 'grok': {
        if (!apiKey) return res.status(400).json({ success: false, message: 'API key required.' });
        const resp = await fetch('https://api.x.ai/v1/models', {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        if (!resp.ok) throw new Error('Invalid Grok API key');
        return res.json({ success: true, message: 'Grok API key is valid.' });
      }
      case 'groq': {
        if (!apiKey) return res.status(400).json({ success: false, message: 'API key required.' });
        const resp = await fetch('https://api.groq.com/openai/v1/models', {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        if (!resp.ok) throw new Error('Invalid Groq API key');
        return res.json({ success: true, message: 'Groq API key is valid.' });
      }
      default:
        return res.status(400).json({ success: false, message: `Unknown provider: ${provider}` });
    }
  } catch (error: any) {
    return res.json({ success: false, message: error.message });
  }
});

export default router;
