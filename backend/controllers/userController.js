const User = require('../models/User');
const Booking = require('../models/Booking');

exports.syncClerkUser = async (req, res) => {
  try {
    const { clerkId, email, firstName, lastName, photoUrl } = req.body;
    
    // Determine role based on ADMIN_EMAILS env (with trim and lowercase for accuracy)
    const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim().toLowerCase());
    const userEmail = email.trim().toLowerCase();
    let user = await User.findOne({ $or: [{ clerkId }, { email: userEmail }] });
    
    if (user) {
      // Update info but preserve existing role
      user.clerkId = clerkId;
      user.firstName = firstName || user.firstName;
      user.lastName = lastName || user.lastName;
      user.photoUrl = photoUrl || user.photoUrl;
      await user.save();
    } else {
      // Create new user with role based on .env
      const role = adminEmails.includes(userEmail) ? 'admin' : 'user';
      user = new User({
        clerkId,
        email: userEmail,
        firstName,
        lastName,
        photoUrl,
        role
      });
      await user.save();
    }
    
    return res.status(200).json({ success: true, message: 'User synced/updated', user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    const clerkId = req.auth.userId; // From Clerk middleware
    const user = await User.findOne({ clerkId });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found in DB' });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateCurrentUser = async (req, res) => {
  try {
    const clerkId = req.auth.userId;
    const updates = req.body;
    const user = await User.findOneAndUpdate({ clerkId }, updates, { new: true });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getBookingHistory = async (req, res) => {
  try {
    const clerkId = req.auth.userId;
    const history = await Booking.find({ clerkId }).populate('tourId');
    res.json({ success: true, data: history });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Admin CRUD
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    const formatted = users.map(u => {
      const obj = u.toObject ? u.toObject() : u;
      obj.id = obj._id;
      obj.name = obj.firstName ? `${obj.firstName} ${obj.lastName}` : obj.email;
      return obj;
    });
    res.json({ success: true, data: formatted });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
