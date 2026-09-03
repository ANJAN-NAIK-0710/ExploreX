import 'dotenv/config';
import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { apiRouter } from './server/routes/api';
import { ENV, validateEnvironment } from './server/config/env';

const app = express();
const PORT = ENV.PORT;

// Body parsers with raw body preservation for cryptographic signature verification
app.use(express.json({
  limit: '20mb',
  verify: (req: any, _res, buf) => {
    req.rawBody = buf.toString('utf8');
  }
}));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Static uploads directory for Magic Moments
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
app.use('/uploads', express.static(uploadDir));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    platform: 'ExploreX - Smart Tourism Platform',
    timestamp: new Date().toISOString()
  });
});

// Mount main API router under /api/v1
app.use('/api/v1', apiRouter);

// Also alias /api to /api/v1 for convenience
app.use('/api', apiRouter);

async function startServer() {
  validateEnvironment();

  if (ENV.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`🚀 ExploreX Server running on port ${PORT}`);
    checkMLServiceHealth();
  });
}

async function checkMLServiceHealth() {
  const mlUrl = ENV.ML_SERVICE_URL;
  try {
    const res = await fetch(`${mlUrl}/health`);
    if (res.ok) {
      const health = await res.json();
      console.log(`✅ ML Service connected: ${mlUrl}`);
      console.log(`   Status: ${health.status}`);
      console.log(`   Capabilities: ${(health.capabilities || []).join(', ')}`);
    } else {
      console.warn(`⚠️ ML Service responded with status ${res.status}`);
    }
  } catch (error) {
    console.warn(`⚠️ ML Service unavailable at ${mlUrl} — falling back to rule-based scoring`);
  }
}

startServer();

