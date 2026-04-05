const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Welcome to Jurni Travel API' });
});

// Mock routes for the requested features:
router.post('/upload', (req, res) => {
  res.json({ success: true, message: 'Upload endpoint ready (Placeholder)' });
});

router.post('/transactions/checkout', (req, res) => {
  res.json({ success: true, message: 'Transaction created', transaction_id: 'txn_123' });
});

module.exports = router;
