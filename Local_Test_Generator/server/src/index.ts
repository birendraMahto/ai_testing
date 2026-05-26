// Express server entry point

import express from 'express';
import cors from 'cors';
import path from 'path';

import generateRouter from './routes/generate';
import llmRouter from './routes/llm';
import uploadRouter from './routes/upload';
import exportRouter from './routes/export';

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes
app.use('/api/generate', generateRouter);
app.use('/api/llm', llmRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/export', exportRouter);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Test Case Generator Server running on http://localhost:${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/api/health`);
  console.log(`   LLM detect:   http://localhost:${PORT}/api/llm/detect\n`);
});

export default app;
