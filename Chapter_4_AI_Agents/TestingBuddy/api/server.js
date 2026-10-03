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

// Generate Document
app.post('/api/generate/document', async (req, res) => {
  try {
    const { ticketDetails, options, llmConnection, documentType } = req.body;
    const result = await llmService.generateDocument(ticketDetails, options, llmConnection, documentType);
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

const multer = require('multer');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

const upload = multer({ dest: 'uploads/' });

// Extract text from uploaded document
app.post('/api/extract-text', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const filePath = req.file.path;
    const originalName = req.file.originalname.toLowerCase();
    let text = '';

    if (originalName.endsWith('.pdf')) {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      text = data.text;
    } else if (originalName.endsWith('.docx')) {
      const result = await mammoth.extractRawText({ path: filePath });
      text = result.value;
    } else if (originalName.endsWith('.txt') || originalName.endsWith('.md')) {
      text = fs.readFileSync(filePath, 'utf8');
    } else {
      fs.unlinkSync(filePath); // Cleanup
      return res.status(400).json({ error: 'Unsupported file type. Please upload a PDF, DOCX, or TXT file.' });
    }

    fs.unlinkSync(filePath); // Cleanup
    res.json({ text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to extract text from file' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
