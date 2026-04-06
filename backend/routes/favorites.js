const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');
const { requireAuth } = require('../middlewares/auth');

router.get('/my', requireAuth, favoriteController.getMyFavorites);
router.post('/toggle', requireAuth, favoriteController.toggleFavorite);

module.exports = router;
