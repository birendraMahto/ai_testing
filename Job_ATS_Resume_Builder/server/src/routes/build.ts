import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getHistoryById, getConnectionById, createResume, getResumeByAnalysisId } from '../db/store';
import { buildResumeBuilderPrompt } from '../services/promptBuilder';
import { callLLM } from '../services/llm/factory';
import { generateDOCX } from '../services/resumeGenerator';
import { BuiltResume } from '../types';

const router = Router();

// POST /api/build-resume — Generate improved resume
router.post('/', async (req: Request, res: Response) => {
  try {
    const { analysisId, connectionId } = req.body;

    if (!analysisId) {
      res.status(400).json({ success: false, error: 'Analysis ID is required' });
      return;
    }

    // Check if already built
    const existingResume = getResumeByAnalysisId(analysisId);
    if (existingResume) {
      res.json({ success: true, data: existingResume });
      return;
    }

    // Get analysis result
    const analysis = getHistoryById(analysisId);
    if (!analysis) {
      res.status(404).json({ success: false, error: 'Analysis result not found' });
      return;
    }

    // Get connection
    const connId = connectionId || analysis.connectionId;
    const connection = getConnectionById(connId);
    if (!connection) {
      res.status(404).json({ success: false, error: 'LLM connection not found' });
      return;
    }

    // Build prompt for resume improvement
    const prompt = buildResumeBuilderPrompt(
      analysis.originalResumeText || analysis.rawResponse, // Pass the original resume text (fallback to rawResponse for old records)
      analysis.jobDescription,
      analysis.rawResponse
    );

    // Call LLM to generate improved resume
    const improvedContent = await callLLM(
      connection.provider,
      connection.apiKey,
      connection.modelName,
      prompt
    );

    // Save built resume
    const builtResume: BuiltResume = {
      id: uuidv4(),
      analysisId,
      content: improvedContent,
      createdAt: new Date().toISOString(),
    };

    createResume(builtResume);

    res.json({ success: true, data: builtResume });
  } catch (error: any) {
    console.error('Resume build error:', error);
    res.status(500).json({
      success: false,
      error: `Resume building failed: ${error.message}`,
    });
  }
});

// POST /api/build-resume/download — Download built resume as DOCX
router.post('/download', async (req: Request, res: Response) => {
  try {
    const { resumeId, format } = req.body;

    if (!resumeId) {
      res.status(400).json({ success: false, error: 'Resume ID is required' });
      return;
    }

    const resume = getResumeByAnalysisId(resumeId);
    const directResume = resume || (() => {
      const { getAllResumes } = require('../db/store');
      const all = getAllResumes();
      return all.find((r: BuiltResume) => r.id === resumeId);
    })();

    if (!directResume) {
      res.status(404).json({ success: false, error: 'Built resume not found' });
      return;
    }

    if (format === 'docx') {
      const buffer = await generateDOCX(directResume.content);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      res.setHeader('Content-Disposition', 'attachment; filename="improved_resume.docx"');
      res.send(buffer);
    } else {
      // Default: return content as text for PDF generation on client
      res.json({ success: true, data: { content: directResume.content } });
    }
  } catch (error: any) {
    console.error('Download error:', error);
    res.status(500).json({
      success: false,
      error: `Download failed: ${error.message}`,
    });
  }
});

// POST /api/build-resume/download-text — Download generic text as DOCX
router.post('/download-text', async (req: Request, res: Response) => {
  try {
    const { content, filename = 'document.docx' } = req.body;

    if (!content) {
      res.status(400).json({ success: false, error: 'Content is required' });
      return;
    }

    const buffer = await generateDOCX(content);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(buffer);
  } catch (error: any) {
    console.error('Download error:', error);
    res.status(500).json({
      success: false,
      error: `Download failed: ${error.message}`,
    });
  }
});

export default router;
