const express = require('express');
const cors = require('cors');
require('dotenv').config();

const toolService = require('./services/toolService');
const llmService = require('./services/llmService');
const exportService = require('./services/exportService');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'TestingBuddy.ai API is running' });
});

// Fetch ticket details
app.post('/api/tickets/fetch', async (req, res) => {
  try {
    const { ticketId, toolConnection } = req.body;
    const ticket = await toolService.fetchTicketDetails(ticketId, toolConnection);
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generate Test Plan
app.post('/api/generate/test-plan', async (req, res) => {
  try {
    const { ticketDetails, options, llmConnection } = req.body;
    const result = await llmService.generateTestPlan(ticketDetails, options, llmConnection);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Download Word Document
app.post('/api/download/plan', async (req, res) => {
  try {
    const { plan } = req.body;
    const buffer = await exportService.generateWordDocument(plan);
    res.setHeader('Content-Disposition', 'attachment; filename=TestPlan.docx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.send(buffer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Download Excel Document
app.post('/api/download/cases', async (req, res) => {
  try {
    const { cases } = req.body;
    const buffer = await exportService.generateExcelDocument(cases);
    res.setHeader('Content-Disposition', 'attachment; filename=TestCases.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
