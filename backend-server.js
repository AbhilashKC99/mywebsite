const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static files from current directory

// API Key configuration (you can set this as an environment variable)
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || 'your-api-key-here';

// API endpoint to get the API key
app.get('/api/get-api-key', (req, res) => {
  if (OPENAI_API_KEY && OPENAI_API_KEY !== 'your-api-key-here') {
    res.json({ apiKey: OPENAI_API_KEY });
  } else {
    res.status(404).json({ error: 'API key not configured' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  console.log(`Frontend accessible at http://localhost:${PORT}/resume/`);
  console.log(`API key configured: ${OPENAI_API_KEY ? 'Yes' : 'No'}`);
});

module.exports = app;
