const Review = require('../models/Review');
const Tour = require('../models/Tour');
const User = require('../models/User');
const Booking = require('../models/Booking');

const resolveTourIdFromInput = async ({ tourId, serviceType, serviceId }) => {
  if (tourId) return String(tourId);
  const type = String(serviceType || '').trim();
  const id = String(serviceId || '').trim();
  if (!type || !id) return null;
  const externalKey = `web:${type}:${id}`;
  const tour = await Tour.findOne({ externalKey });
  return tour ? String(tour._id) : null;
};

// Create review
exports.createReview = async (req, res) => {
  try {
    const { tourId, serviceType, serviceId, rating, comment } = req.body;
    const clerkId = req.auth.userId;

    // Handle multiple uploaded files from multer/cloudinary
    const images = req.files ? req.files.map(file => file.path) : [];

    // Find internal user ID
    const user = await User.findOne({ clerkId });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const resolvedTourId = await resolveTourIdFromInput({ tourId, serviceType, serviceId });
    if (!resolvedTourId) {
      return res.status(404).json({ success: false, message: 'Tour not found' });
    }

    // Strictly check if user has a confirmed/completed booking for this tour
    const hasBooked = await Booking.findOne({ 
      userId: user._id, 
      tourId: resolvedTourId, 
      status: { $in: ['confirmed', 'completed'] } 
    });

    if (!hasBooked) {
      return res.status(403).json({ 
        success: false, 
        message: 'Bạn chỉ có thể đánh giá những tour đã tham gia.' 
      });
    }

    const review = await Review.create({
      userId: user._id,
      tourId: resolvedTourId,
      rating,
      comment,
      images
    });

    res.status(201).json({ success: true, data: review });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get reviews for a tour
exports.getTourReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ tourId: req.params.tourId })
      .populate('userId', 'firstName lastName photoUrl')
      .sort('-createdAt');
    res.json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getServiceReviews = async (req, res) => {
  try {
    const { serviceType, serviceId } = req.params;
    const resolvedTourId = await resolveTourIdFromInput({ tourId: null, serviceType, serviceId });
    if (!resolvedTourId) {
      return res.json({ success: true, data: [] });
    }
    const reviews = await Review.find({ tourId: resolvedTourId })
      .populate('userId', 'firstName lastName photoUrl')
      .sort('-createdAt');
    res.json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update review
exports.updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const clerkId = req.auth.userId;
    const user = await User.findOne({ clerkId });

    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });

    // Check authorization
    if (review.userId.toString() !== user._id.toString() && user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    // Handle new images if uploaded
    let images = review.images;
    if (req.files && req.files.length > 0) {
      images = req.files.map(file => file.path);
    }

    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      { rating, comment, images },
      { new: true }
    );

    res.json({ success: true, data: updatedReview });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete review
exports.deleteReview = async (req, res) => {
  try {
    const clerkId = req.auth.userId;
    const user = await User.findOne({ clerkId });

    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });

    if (review.userId.toString() !== user._id.toString() && user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    await Review.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
