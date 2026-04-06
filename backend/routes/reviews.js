const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { requireAuth } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

router.get('/tour/:tourId', reviewController.getTourReviews);
router.get('/service/:serviceType/:serviceId', reviewController.getServiceReviews);
router.post('/', requireAuth, upload.array('images', 5), reviewController.createReview);
router.put('/:id', requireAuth, upload.array('images', 5), reviewController.updateReview);
router.delete('/:id', requireAuth, reviewController.deleteReview);

module.exports = router;
