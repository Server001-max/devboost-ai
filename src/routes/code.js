const express = require('express');
const aiEngine = require('../core/ai-engine');
const router = express.Router();

// Analyze code
router.post('/analyze', async (req, res) => {
  try {
    const { code, language } = req.body;
    
    if (!code) {
      return res.status(400).json({ error: 'Code is required' });
    }

    const analysis = await aiEngine.analyzeCode(code, language);
    
    res.json({
      success: true,
      analysis
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Optimize code
router.post('/optimize', async (req, res) => {
  try {
    const { code, language } = req.body;
    
    if (!code) {
      return res.status(400).json({ error: 'Code is required' });
    }

    const result = await aiEngine.optimizeCode(code, language);
    
    res.json({
      success: true,
      result
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generate tests
router.post('/tests', async (req, res) => {
  try {
    const { code, language } = req.body;
    
    if (!code) {
      return res.status(400).json({ error: 'Code is required' });
    }

    const tests = await aiEngine.generateTests(code, language);
    
    res.json({
      success: true,
      tests
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Security scan
router.post('/security', async (req, res) => {
  try {
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({ error: 'Code is required' });
    }

    const result = await aiEngine.securityScan(code);
    
    res.json({
      success: true,
      result
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
