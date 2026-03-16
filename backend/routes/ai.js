const express = require('express');
const router = express.Router();
const { analyzeText, analyzeUrl } = require('../controllers/aiController');

// POST /api/ai/analyze-text  — analyze a text snippet for scam signals
router.post('/analyze-text', analyzeText);

// POST /api/ai/analyze-url   — analyze a URL for phishing / fraud signals
router.post('/analyze-url', analyzeUrl);

module.exports = router;
