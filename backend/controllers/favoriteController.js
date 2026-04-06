const Favorite = require('../models/Favorite');
const User = require('../models/User');

// Add/Toggle favorite
exports.toggleFavorite = async (req, res) => {
  try {
    const { tourId, serviceType, serviceId, data } = req.body;
    const clerkId = req.auth.userId;

    const normalizedServiceType = tourId ? 'tour' : String(serviceType || '').trim();
    const normalizedServiceId = tourId ? String(tourId) : String(serviceId || '').trim();

    const user = await User.findOne({ clerkId });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (!normalizedServiceType || !normalizedServiceId) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin yêu thích (serviceType/serviceId hoặc tourId).'
      });
    }

    const existing = await Favorite.findOne({
      userId: user._id,
      serviceType: normalizedServiceType,
      serviceId: normalizedServiceId
    });
    if (existing) {
      await Favorite.findByIdAndDelete(existing._id);
      return res.json({ success: true, message: 'Removed from favorites' });
    }

    const favorite = await Favorite.create({
      userId: user._id,
      serviceType: normalizedServiceType,
      serviceId: normalizedServiceId,
      data
    });
    res.status(201).json({ success: true, data: favorite });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get current user favorites
exports.getMyFavorites = async (req, res) => {
  try {
    const clerkId = req.auth.userId;
    const user = await User.findOne({ clerkId });

    const favorites = await Favorite.find({
      userId: user._id,
      serviceType: { $exists: true },
      serviceId: { $exists: true }
    }).sort('-createdAt');
    res.json({ success: true, data: favorites });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
