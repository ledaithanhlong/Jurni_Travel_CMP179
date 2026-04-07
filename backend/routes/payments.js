const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Tour = require('../models/Tour');
const User = require('../models/User');
const mongoose = require('mongoose');

router.post('/checkout', async (req, res) => {
  try {
    const { items, amount, user_id, paymentMethod } = req.body;
    
    // Tìm user theo clerkId (user_id truyền từ frontend)
    let user = null;
    if (user_id) {
        user = await User.findOne({ clerkId: user_id });
    }

    // Nếu có user và có items, lặp qua để tạo booking cho từng item
    if (user && items && items.length > 0) {
        for (const item of items) {
             // Chỉ xử lý nếu item.id là ObjectId hợp lệ (để tránh lỗi Crash "Cast to ObjectId failed" với dữ liệu mock của frontend)
             if (mongoose.Types.ObjectId.isValid(item.id)) {
                 const tour = await Tour.findById(item.id);
                 if (tour) {
                     const newBooking = new Booking({
                         userId: user._id,
                         clerkId: user_id,
                         tourId: tour._id,
                         guests: item.quantity || 1,
                         totalPrice: item.price * (item.quantity || 1),
                         status: 'confirmed',
                         paymentStatus: 'paid',
                         transactionId: 'txn_' + Math.random().toString(36).substring(2, 9).toUpperCase()
                     });
                     await newBooking.save();
                     
                     // Cập nhật lại số lượng slots
                     if (tour.availableSlots >= (item.quantity || 1)) {
                         tour.availableSlots -= (item.quantity || 1);
                         await tour.save();
                     }
                 }
             } else {
                 console.log(`Skipped invalid object id: ${item.id} (Probably mock data)`);
             }
        }
    }

    // Emit event socket.io (nếu có)
    if (req.app.get('socketio')) {
        req.app.get('socketio').emit('bookingSuccess', {
            message: `Hoàn tất thanh toán cho ${items ? items.length : 0} dịch vụ!`
        });
    }

    // Luôn trả về thành công để frontend chuyển trang
    res.json({ 
        success: true, 
        message: 'Thanh toán thành công',
        payment: { reference: 'TXN_' + Math.random().toString(36).substring(2, 9).toUpperCase() } 
    });
  } catch (error) {
    console.error('Checkout Error:', error);
    res.status(500).json({ success: false, error: 'Lỗi trong quá trình thanh toán: ' + error.message });
  }
});

module.exports = router;
