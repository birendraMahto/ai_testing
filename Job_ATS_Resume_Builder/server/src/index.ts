import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import connectionsRouter from './routes/connections';
import analyzeRouter from './routes/analyze';
import buildRouter from './routes/build';
import historyRouter from './routes/history';
import coverLetterRouter from './routes/coverLetter';
import followUpRouter from './routes/followUp';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow any localhost origin or no origin (like from Postman/curl)
    if (!origin || /^http:\/\/localhost:\d+$/.test(origin) || /^http:\/\/127\.0\.0\.1:\d+$/.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Routes
app.use('/api/connections', connectionsRouter);
app.use('/api/analyze', analyzeRouter);
app.use('/api/build-resume', buildRouter);
app.use('/api/history', historyRouter);
app.use('/api/cover-letter', coverLetterRouter);
app.use('/api/follow-up', followUpRouter);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ success: true, data: { status: 'Server running', timestamp: new Date().toISOString() } });
});

// Error handler (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`\n🚀 ATS Resume Builder Server running on http://localhost:${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/api/health\n`);
});

export default app;
