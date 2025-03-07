import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function setupStaticServing(app: express.Application) {
  // Serve static files from the public directory
  app.use(express.static(path.join(__dirname, 'public')));

  // Serve index.html for all routes (SPA support)
  app.get('*', (req, res) => {
    // Skip API routes
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ message: 'Not found' });
    }
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
} 