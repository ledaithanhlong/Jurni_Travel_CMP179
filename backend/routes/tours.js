const express = require('express');
const router = express.Router();
const Tour = require('../models/Tour');
const { requireAuth, authorize } = require('../middlewares/auth');

router.get('/', async (req, res) => {
  try {
    const tours = await Tour.find();
    const formatted = tours.map(t => {
      const obj = t.toObject ? t.toObject() : t;
      obj.id = obj._id;
      obj.name = obj.name || obj.title;
      obj.image_url = obj.image_url || (obj.images && obj.images[0]) || '';
      return obj;
    });
    res.json({ success: true, data: formatted });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Admin routes (Protected by Clerk Auth and Admin Role)
router.post('/', requireAuth, authorize('admin'), async (req, res) => {
  try {
    const payload = { ...req.body };
    if (payload.name && !payload.title) payload.title = payload.name;
    if (payload.image_url && !payload.images) payload.images = [payload.image_url];
    
    const tour = new Tour(payload);
    await tour.save();
    res.status(201).json({ success: true, data: tour });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (!tour) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: tour });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/:id', requireAuth, authorize('admin'), async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!tour) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: tour });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete('/:id', requireAuth, authorize('admin'), async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Tour deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
