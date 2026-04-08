import db from '../models/index.js';

const paymentMethods = [
  {
    id: 'card',
    name: 'Thẻ quốc tế (Visa / Mastercard)',
    type: 'card',
    feePercent: 0.018,
    feeFixed: 0,
    description: 'Thanh toán tức thời với thẻ Visa, Mastercard hoặc JCB.',
  },
  {
    id: 'momo',
    name: 'Ví điện tử MoMo',
    type: 'ewallet',
    feePercent: 0.012,
    feeFixed: 2000,
    description: 'Quét mã QR hoặc xác nhận trên ứng dụng MoMo.',
  },
  {
    id: 'zalopay',
    name: 'Ví ZaloPay',
    type: 'ewallet',
    feePercent: 0.01,
    feeFixed: 1500,
    description: 'Xác nhận giao dịch qua ứng dụng ZaloPay.',
  },
  {
    id: 'bank_transfer',
    name: 'Chuyển khoản ngân hàng',
    type: 'bank',
    feePercent: 0,
    feeFixed: 0,
    description: 'Miễn phí. Hoàn tất trong vòng 15 phút kể từ khi nhận tiền.',
  },
];

export const getPaymentConfig = async (req, res, next) => {
  try {
    res.json({
      currency: 'VND',
      paymentMethods,
      bankAccount: {
        name: 'CÔNG TY TNHH DU LỊCH JURNI',
        bank: 'Vietcombank - CN Tân Định',
        accountNumber: '0451 2345 6789',
      },
      notes: 'Phí giao dịch có thể thay đổi tùy theo ngân hàng phát hành.',
    });
  } catch (e) {
    next(e);
  }
};

export const processPayment = async (req, res, next) => {
  try {
    const {
      amount,
      currency = 'VND',
      paymentMethod,
      customer,
      items = [],
      booking,
    } = req.body || {};

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ error: 'Số tiền thanh toán không hợp lệ.' });
    }

    if (!paymentMethod) {
      return res.status(400).json({ error: 'Vui lòng chọn phương thức thanh toán.' });
    }

    const method = paymentMethods.find((m) => m.id === paymentMethod);
    if (!method) {
      return res.status(400).json({ error: 'Phương thức thanh toán không được hỗ trợ.' });
    }

    if (!customer?.name || !customer?.email) {
      return res.status(400).json({ error: 'Thiếu thông tin liên hệ của khách hàng.' });
    }

    const amountNumber = Number(amount);
    const fee = amountNumber * method.feePercent + method.feeFixed;
    const transactionReference = `PAY-${Date.now()}`;

    let bookingRecord = null;
    const createdBookings = [];

    // Use a default system user ID to avoid foreign key constraint issues
    // Customer info is stored in customer_name, customer_email, customer_phone fields
    // We'll use user_id = 1 as a system/guest user
    const systemUserId = 1;

    // Ensure system user exists in database
    try {
      await db.User.findOrCreate({
        where: { id: systemUserId },
        defaults: {
          name: 'System User',
          email: 'system@jurni.com',
          role: 'user',
        }
      });
    } catch (userErr) {
      console.log('System user setup error:', userErr.message);
    }

    // Prioritize looping through items if provided and requested
    if (items && Array.isArray(items) && items.length > 0) {
      for (const item of items) {
        let subServiceType = null;
        let subServiceId = null;

        // Detect service type from item
        if (item.type === 'hotel' || item.type === 'Khách sạn' || item.id?.includes('hotel')) {
          subServiceType = 'hotel';
          subServiceId = item.id?.split('-')[1] || item.id;
        } else if (item.type === 'flight' || item.type === 'Chuyến bay' || item.id?.includes('flight')) {
          subServiceType = 'flight';
          subServiceId = item.id?.split('-')[1] || item.id;
        } else if (item.type === 'car' || item.type === 'Thuê xe' || item.id?.includes('car')) {
          subServiceType = 'car';
          subServiceId = item.id?.split('-')[1] || item.id;
        } else if (item.type === 'activity' || item.type === 'Hoạt động' || item.id?.includes('activity')) {
          subServiceType = 'activity';
          subServiceId = item.id?.split('-')[1] || item.id;
        }

        if (subServiceType) {
          // Extract details
          const details = item.details || {};
          const startDate = details.checkIn || details.startDate || details.pickupDate || details.departureTime || details.date;
          const endDate = details.checkOut || details.endDate || details.dropoffDate || details.arrivalTime;

          const bookingData = {
            user_id: systemUserId,
            // service_type: subServiceType, // Removed
            // service_id: subServiceId || 1, // Removed
            total_price: item.price * item.quantity,
            status: 'pending',
            customer_name: customer.name,
            customer_email: customer.email,
            customer_phone: customer.phone,
            payment_method: method.name,
            transaction_id: transactionReference,

            start_date: startDate ? new Date(startDate) : null,
            end_date: endDate ? new Date(endDate) : null,
            quantity: item.quantity || 1,
            item_variant: details.roomType || details.ticketType || details.ticketClass || details.carType || details.activityType || null
          };

          // Set Explicit FK
          if (subServiceType === 'hotel') bookingData.hotel_id = subServiceId;
          else if (subServiceType === 'flight') bookingData.flight_id = subServiceId;
          else if (subServiceType === 'car') bookingData.car_id = subServiceId;
          else if (subServiceType === 'activity') bookingData.activity_id = subServiceId;

          const newBooking = await db.Booking.create(bookingData);
          createdBookings.push(newBooking);
        }
      }
      // If we created multiple, maybe return the list
      bookingRecord = createdBookings;
    }
    // Fallback to single booking object (legacy support or single item)
    else if (booking?.service_type && booking?.service_id) {
      // Legacy handling of single item booking from simplified payload
      // Map to explicit FK based on incoming service_type
      // Note: Frontend should ideally send 'items' array. This is fallback.
      if (systemUserId) {
        // Handle single booking legacy
        const details = booking.details || {};
        const startDate = details.checkIn || details.startDate || booking.checkIn;
        const endDate = details.checkOut || details.endDate || booking.checkOut;

        const bookingData = {
          user_id: systemUserId,
          total_price: amountNumber, // Total amount
          status: 'pending',
          customer_name: customer.name,
          customer_email: customer.email,
          customer_phone: customer.phone,
          payment_method: method.name,
          transaction_id: transactionReference,

          start_date: startDate ? new Date(startDate) : null,
          end_date: endDate ? new Date(endDate) : null,
          quantity: booking.quantity || 1,
          item_variant: details.roomType || details.ticketType || details.ticketClass || details.carType || details.activityType || null
        };

        // Set Explicit FK
        if (booking.service_type === 'hotel') bookingData.hotel_id = booking.service_id;
        else if (booking.service_type === 'flight') bookingData.flight_id = booking.service_id;
        else if (booking.service_type === 'car') bookingData.car_id = booking.service_id;
        else if (booking.service_type === 'activity') bookingData.activity_id = booking.service_id;

        bookingRecord = await db.Booking.create(bookingData);
      }
    }

    res.status(201).json({
      success: true,
      message: 'Thanh toán thành công. Hóa đơn đã được gửi tới email của bạn.',
      payment: {
        reference: transactionReference,
        status: 'succeeded',
        method: method.id,
        amount: amountNumber,
        currency,
        fee: Number(fee.toFixed(0)),
        processedAt: new Date().toISOString(),
      },
      booking: bookingRecord,
      customer,
      items,
    });
  } catch (e) {
    next(e);
  }
};


