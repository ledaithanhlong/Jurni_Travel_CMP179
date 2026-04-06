const express = require('express');
const router = express.Router();
const Tour = require('../models/Tour');
const { requireAuth } = require('../middlewares/auth');
const { authorize } = require('../middlewares/authorize');

router.get('/', async (req, res) => {
  try {
    const tours = await Tour.find().sort('-createdAt');
    res.json({ success: true, data: tours });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (!tour) return res.status(404).json({ success: false, message: 'Tour not found' });
    res.json({ success: true, data: tour });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

router.post('/', requireAuth, authorize('admin'), async (req, res) => {
  try {
    const tour = await Tour.create(req.body);
    res.status(201).json({ success: true, data: tour });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;

