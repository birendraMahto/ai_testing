// Route: POST /api/generate — Generate test cases using LLM

import { Router, Request, Response } from 'express';
import { generateTestCases } from '../services/llmService';
import { GenerateRequest } from '../types';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const { prompt, fileContent, fileName, provider, model, apiKey, baseUrl } = req.body as GenerateRequest;

    if (!prompt && !fileContent) {
      return res.status(400).json({ error: 'Either prompt or file content is required.' });
    }

    if (!provider || !model) {
      return res.status(400).json({ error: 'LLM provider and model are required.' });
    }

    console.log(`Generating test cases with ${provider}/${model}...`);

    const result = await generateTestCases({
      prompt: prompt || '',
      fileContent,
      fileName,
      provider,
      model,
      apiKey,
      baseUrl,
    });

    return res.json({
      testCases: result.testCases,
      rawResponse: result.rawResponse,
      model,
      provider,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Generation error:', error.message);
    return res.status(500).json({ error: error.message });
  }
});

export default router;
