import { Router, Request, Response } from 'express';
import { getAllHistory, getHistoryById } from '../db/store';

const router = Router();

// GET /api/history — Get all analysis history
router.get('/', (_req: Request, res: Response) => {
  const history = getAllHistory();
  // Return summary data (without full rawResponse for list view)
  const summary = history.map((h) => ({
    id: h.id,
    connectionName: h.connectionName,
    resumeFileName: h.resumeFileName,
    scores: h.scores,
    createdAt: h.createdAt,
    jobDescriptionPreview: h.jobDescription.substring(0, 100) + (h.jobDescription.length > 100 ? '...' : ''),
  }));
  res.json({ success: true, data: summary });
});

// GET /api/history/:id — Get a specific analysis result
router.get('/:id', (req: Request, res: Response) => {
  const result = getHistoryById(req.params.id);
  if (!result) {
    res.status(404).json({ success: false, error: 'Analysis result not found' });
    return;
  }
  res.json({ success: true, data: result });
});

// DELETE /api/history — Clear all history
router.delete('/', (_req: Request, res: Response) => {
  const { clearHistory } = require('../db/store');
  clearHistory();
  res.json({ success: true, message: 'History cleared successfully' });
});

export default router;
