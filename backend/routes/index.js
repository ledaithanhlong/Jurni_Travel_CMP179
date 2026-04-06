const express = require('express');
const router = express.Router();

router.get('/', function(req, res) {
  res.json({ ok: true, message: 'Jurni API' });
});

router.get('/health', function(req, res) {
  res.json({ ok: true });
});

module.exports = router;

