const Booking = require('../models/Booking');
const User = require('../models/User');
const Tour = require('../models/Tour');

exports.getStats = async (req, res) => {
  try {
    // 1. Doanh thu (tổng tiền từ các booking đã thanh toán/xác nhận)
    const revenueStats = await Booking.aggregate([
      { $match: { status: { $in: ['confirmed', 'completed'] } } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } }
    ]);
    const totalRevenue = revenueStats.length > 0 ? revenueStats[0].totalRevenue : 0;

    // 2. Thống kê đơn hàng (tổng số và trạng thái)
    const totalBookings = await Booking.countDocuments();
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });
    const cancelledBookings = await Booking.countDocuments({ status: 'cancelled' });

    // 3. Theo dõi người dùng (tổng số)
    const totalUsers = await User.countDocuments();

    // 4. Doanh thu theo tháng (cho biểu đồ)
    const monthlyRevenue = await Booking.aggregate([
      { $match: { status: { $in: ['confirmed', 'completed'] } } },
      {
        $group: {
          _id: { $month: '$createdAt' },
          revenue: { $sum: '$totalPrice' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    res.json({
      success: true,
      data: {
        totalRevenue,
        totalBookings,
        pendingBookings,
        confirmedBookings,
        cancelledBookings,
        totalUsers,
        monthlyRevenue
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
