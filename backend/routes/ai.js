const express = require('express');
const router = express.Router();
const http = require('http');

const AIML_URL = process.env.AIML_URL || 'http://localhost:5001';

// Helper to proxy requests to the Python AI service
function proxyToAI(aiPath, req, res) {
  const postData = JSON.stringify(req.body);
  const url = new URL(aiPath, AIML_URL);

  const options = {
    hostname: url.hostname,
    port: url.port,
    path: url.pathname,
    method: req.method,
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData),
    },
  };

  const proxyReq = http.request(options, (proxyRes) => {
    let data = '';
    proxyRes.on('data', (chunk) => { data += chunk; });
    proxyRes.on('end', () => {
      try {
        res.status(proxyRes.statusCode).json(JSON.parse(data));
      } catch {
        res.status(500).json({ message: 'Invalid response from AI service' });
      }
    });
  });

  proxyReq.on('error', () => {
    res.status(503).json({ message: 'AI service is unavailable. Make sure the Python server is running on port 5001.' });
  });

  proxyReq.write(postData);
  proxyReq.end();
}

// AI Blueprint Generation
router.post('/blueprint', (req, res) => proxyToAI('/api/ai/blueprint', req, res));

// AI Cost Estimation (ML model)
router.post('/estimate', (req, res) => proxyToAI('/api/ai/estimate', req, res));

// AI Quotation (ML model)
router.post('/quotation', (req, res) => proxyToAI('/api/ai/quotation', req, res));

// AI Budget Prediction (ML model)
router.post('/prediction', (req, res) => proxyToAI('/api/ai/prediction', req, res));

// AI Market Rates
router.get('/market-rates', (req, res) => {
  const url = new URL('/api/ai/market-rates', AIML_URL);
  http.get(url.href, (proxyRes) => {
    let data = '';
    proxyRes.on('data', (chunk) => { data += chunk; });
    proxyRes.on('end', () => {
      try {
        res.json(JSON.parse(data));
      } catch {
        res.status(500).json({ message: 'Invalid response from AI service' });
      }
    });
  }).on('error', () => {
    res.status(503).json({ message: 'AI service is unavailable.' });
  });
});

module.exports = router;
