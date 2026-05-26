// Route: POST /api/export — Export test cases as CSV or Excel

import { Router, Request, Response } from 'express';
import { testCasesToCSV, testCasesToExcel } from '../services/exportService';
import { TestCase } from '../types';

const router = Router();

router.post('/csv', (req: Request, res: Response) => {
  try {
    const { testCases } = req.body as { testCases: TestCase[] };
    if (!testCases || !Array.isArray(testCases)) {
      return res.status(400).json({ error: 'testCases array is required.' });
    }

    const csv = testCasesToCSV(testCases);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=test_cases.csv');
    return res.send(csv);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

router.post('/excel', async (req: Request, res: Response) => {
  try {
    const { testCases } = req.body as { testCases: TestCase[] };
    if (!testCases || !Array.isArray(testCases)) {
      return res.status(400).json({ error: 'testCases array is required.' });
    }

    const buffer = await testCasesToExcel(testCases);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=test_cases.xlsx');
    return res.send(buffer);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;
