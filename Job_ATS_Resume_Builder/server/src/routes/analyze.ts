import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import { upload } from '../middleware/upload';
import { parseResume } from '../services/parser';
import { buildAnalysisPrompt } from '../services/promptBuilder';
import { callLLM } from '../services/llm/factory';
import { getConnectionById } from '../db/store';
import { createHistory } from '../db/store';
import { AnalysisResult, ResumeScores, ResumeFeedback } from '../types';

const router = Router();

// POST /api/analyze — Analyze resume against JD
router.post('/', upload.single('resume'), async (req: Request, res: Response) => {
  try {
    const { jobDescription, connectionId } = req.body;
    const file = req.file;

    // Validations
    if (!jobDescription) {
      res.status(400).json({ success: false, error: 'Job description is required' });
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

    // Get LLM connection
    const connection = getConnectionById(connectionId);
    if (!connection) {
      res.status(404).json({ success: false, error: 'LLM connection not found' });
      return;
    }

    // Parse resume
    const resumeText = await parseResume(file.path);

    // Build prompt
    const prompt = buildAnalysisPrompt(resumeText, jobDescription);

    // Call LLM
    const rawResponse = await callLLM(
      connection.provider,
      connection.apiKey,
      connection.modelName,
      prompt
    );

    // Parse scores from response
    const { scores, feedback } = parseAnalysisResponse(rawResponse);

    // Save to history
    const result: AnalysisResult = {
      id: uuidv4(),
      connectionId: connection.id,
      connectionName: connection.connectionName,
      jobDescription,
      resumeFileName: file.originalname,
      scores,
      feedback,
      rawResponse,
      createdAt: new Date().toISOString(),
    };

    createHistory(result);

    // Clean up uploaded file after processing
    try {
      fs.unlinkSync(file.path);
    } catch {
      // Ignore cleanup errors
    }

    res.json({ success: true, data: result });
  } catch (error: any) {
    console.error('Analysis error:', error);
    res.status(500).json({
      success: false,
      error: `Analysis failed: ${error.message}`,
    });
  }
});

/**
 * Parse the LLM response to extract scores and feedback.
 * Looks for a JSON block in the response.
 */
function parseAnalysisResponse(response: string): {
  scores: ResumeScores;
  feedback: ResumeFeedback;
} {
  // Default scores
  let scores: ResumeScores = {
    overall: 0,
    effectivity: 0,
    layoutDesign: 0,
    contentRelevance: 0,
    grammarSyntax: 0,
    impact: 0,
  };

  let feedback: ResumeFeedback = {
    positives: [],
    improvements: [],
    missingKeywords: [],
    suggestions: [],
  };

  try {
    // Try to extract JSON block from response
    const jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch && jsonMatch[1]) {
      const parsed = JSON.parse(jsonMatch[1]);
      if (parsed.scores) {
        scores = { ...scores, ...parsed.scores };
      }
      if (parsed.feedback) {
        feedback = { ...feedback, ...parsed.feedback };
      }
    } else {
      // Try to parse score numbers from text using regex
      const scorePatterns: { key: keyof ResumeScores; pattern: RegExp }[] = [
        { key: 'overall', pattern: /overall\s*(?:result)?[:\s]*\[?\s*(\d+(?:\.\d+)?)\s*(?:\/\s*10)?/i },
        { key: 'effectivity', pattern: /effectiv(?:ity|eness)[:\s]*\[?\s*(\d+(?:\.\d+)?)\s*(?:\/\s*10)?/i },
        { key: 'layoutDesign', pattern: /layout\s*(?:and\s*)?design[:\s]*\[?\s*(\d+(?:\.\d+)?)\s*(?:\/\s*10)?/i },
        { key: 'contentRelevance', pattern: /content\s*relevance[:\s]*\[?\s*(\d+(?:\.\d+)?)\s*(?:\/\s*10)?/i },
        { key: 'grammarSyntax', pattern: /grammar\s*(?:and\s*)?syntax[:\s]*\[?\s*(\d+(?:\.\d+)?)\s*(?:\/\s*10)?/i },
        { key: 'impact', pattern: /impact[:\s]*\[?\s*(\d+(?:\.\d+)?)\s*(?:\/\s*10)?/i },
      ];

      for (const { key, pattern } of scorePatterns) {
        const match = response.match(pattern);
        if (match && match[1]) {
          scores[key] = parseFloat(match[1]);
        }
      }

      // Extract feedback sections from markdown
      feedback.positives = extractListItems(response, /✅[^🙈\n]*/g);
      feedback.improvements = extractListItems(response, /🙈[^\n]*/g);
      feedback.missingKeywords = extractListItems(response, /missing\s*keywords?[:\s]*([\s\S]*?)(?=\n##|\n\*\*|$)/i);
      feedback.suggestions = extractListItems(response, /suggestions?[:\s]*([\s\S]*?)(?=\n##|\n\*\*|$)/i);
    }
  } catch (error) {
    console.error('Failed to parse analysis response:', error);
  }

  return { scores, feedback };
}

function extractListItems(text: string, pattern: RegExp): string[] {
  const matches = text.match(pattern);
  if (!matches) return [];
  return matches.map((m) => m.replace(/^[✅🙈\-*\s]+/, '').trim()).filter((m) => m.length > 0);
}

export default router;
