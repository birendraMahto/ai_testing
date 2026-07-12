import { Router, Request, Response } from 'express';
import fs from 'fs';
import { upload } from '../middleware/upload';
import { parseResume } from '../services/parser';
import { scrapeUrl } from '../services/scraper';
import { buildCoverLetterPrompt } from '../services/promptBuilder';
import { callLLM } from '../services/llm/factory';
import { getConnectionById } from '../db/store';

const router = Router();

router.post('/', upload.single('resume'), async (req: Request, res: Response) => {
  try {
    const { jobDescription, connectionId } = req.body;
    const file = req.file;

    if (!jobDescription) {
      res.status(400).json({ success: false, error: 'Job description or URL is required' });
      return;
    }

    if (!connectionId) {
      res.status(400).json({ success: false, error: 'Connection ID is required. Please configure LLM settings first.' });
      return;
    }

    if (!file) {
      res.status(400).json({ success: false, error: 'Resume file is required (.pdf or .docx)' });
      return;
    }

    const connection = getConnectionById(connectionId);
    if (!connection) {
      res.status(404).json({ success: false, error: 'LLM connection not found' });
      return;
    }

    // Process job description (scrape if URL)
    let jdText = jobDescription;
    if (jobDescription.startsWith('http://') || jobDescription.startsWith('https://')) {
      jdText = await scrapeUrl(jobDescription);
    }

    // Parse resume
    const resumeText = await parseResume(file.path);

    // Build prompt
    const prompt = buildCoverLetterPrompt(resumeText, jdText);

    // Call LLM
    const generatedContent = await callLLM(
      connection.provider,
      connection.apiKey,
      connection.modelName,
      prompt
    );

    // Clean up uploaded file
    try {
      fs.unlinkSync(file.path);
    } catch {
      // Ignore cleanup errors
    }

    res.json({ success: true, data: { content: generatedContent } });
  } catch (error: any) {
    console.error('Cover letter generation error:', error);
    res.status(500).json({
      success: false,
      error: `Generation failed: ${error.message}`,
    });
  }
});

export default router;
