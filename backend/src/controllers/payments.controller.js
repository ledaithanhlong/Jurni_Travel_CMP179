import db from '../models/index.js';
import { getAuth } from '@clerk/express';

const paymentMethods = [
  {
    id: 'internet-banking',
    name: 'Internet Banking',
    type: 'bank',
    feePercent: 0,
    feeFixed: 0,
    description: 'Thanh toán online qua tài khoản ngân hàng nội địa.',
  },
  {
    id: 'atm-card',
    name: 'Thẻ ATM nội địa',
    type: 'atm',
    feePercent: 0.01,
    feeFixed: 0,
    description: 'Thanh toán bằng thẻ ATM nội địa đã kích hoạt chức năng online.',
  },
  {
    id: 'momo',
    name: 'Ví MoMo',
    type: 'ewallet',
    feePercent: 0.01,
    feeFixed: 0,
    description: 'Quét mã hoặc xác nhận trên ứng dụng MoMo.',
  },
  {
    id: 'zalopay',
    name: 'ZaloPay',
    type: 'ewallet',
    feePercent: 0.01,
    feeFixed: 0,
    description: 'Xác nhận giao dịch qua ứng dụng ZaloPay.',
  },
  {
    id: 'viettelpay',
    name: 'ViettelPay',
    type: 'ewallet',
    feePercent: 0.01,
    feeFixed: 0,
    description: 'Thanh toán nhanh qua ViettelPay.',
  },
  {
    id: 'vnpay-qr',
    name: 'VNPAY QR',
    type: 'qr',
    feePercent: 0,
    feeFixed: 0,
    description: 'Quét mã QRPay hỗ trợ nhiều ngân hàng và ví liên kết.',
  },
  {
    id: 'visa',
    name: 'Visa',
    type: 'card',
    feePercent: 0.025,
    feeFixed: 0,
    description: 'Thanh toán bằng thẻ Visa Credit/Debit.',
  },
  {
    id: 'mastercard',
    name: 'Mastercard',
    type: 'card',
    feePercent: 0.025,
    feeFixed: 0,
    description: 'Thanh toán bằng thẻ Mastercard Credit/Debit.',
  },
  {
    id: 'amex',
    name: 'American Express',
    type: 'card',
    feePercent: 0.03,
    feeFixed: 0,
    description: 'Thanh toán bằng thẻ American Express.',
  },
  {
    id: 'paypal',
    name: 'PayPal',
    type: 'paypal',
    feePercent: 0.035,
    feeFixed: 0,
    description: 'Thanh toán quốc tế qua PayPal.',
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

    const auth = getAuth(req);
    const clerkId = auth?.userId;
    if (!clerkId) {
      return res.status(401).json({ error: 'Vui lòng đăng nhập để thanh toán.' });
    }

    let user = req.user || await db.User.findOne({ where: { clerkId } });
    let email = user?.email;
    if (!email && auth?.sessionClaims) {
      email = auth.sessionClaims.email ||
        auth.sessionClaims.primary_email_address ||
        (Array.isArray(auth.sessionClaims.email_addresses) ? auth.sessionClaims.email_addresses[0]?.email_address : null);
    }
    if (!email) email = customer.email;

    if (!user && email) {
      user = await db.User.findOne({ where: { email } });
      if (user && !user.clerkId) {
        await user.update({ clerkId });
      }
    }

    if (!user) {
      user = await db.User.create({
        clerkId,
        name: customer.name || (email ? email.split('@')[0] : 'User'),
        email: email || `${clerkId}@jurni.local`,
        role: 'user',
      });
    }

    const userId = user.id;

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
            user_id: userId,
            // service_type: subServiceType, // Removed
            // service_id: subServiceId || 1, // Removed
            total_price: item.price * item.quantity,
            status: 'confirmed', // Set to confirmed immediately after successful payment
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
          const numericServiceId = subServiceId !== null && subServiceId !== undefined && subServiceId !== '' ? Number(subServiceId) : null;
          if (subServiceType === 'hotel') bookingData.hotel_id = numericServiceId;
          else if (subServiceType === 'flight') bookingData.flight_id = numericServiceId;
          else if (subServiceType === 'car') bookingData.car_id = numericServiceId;
          else if (subServiceType === 'activity') bookingData.activity_id = numericServiceId;

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
      if (userId) {
        // Handle single booking legacy
        const details = booking.details || {};
        const startDate = details.checkIn || details.startDate || booking.checkIn;
        const endDate = details.checkOut || details.endDate || booking.checkOut;

        const bookingData = {
          user_id: userId,
          total_price: amountNumber, // Total amount
          status: 'confirmed', // Set to confirmed immediately after successful payment
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
        const numericServiceId = booking.service_id !== null && booking.service_id !== undefined && booking.service_id !== '' ? Number(booking.service_id) : null;
        if (booking.service_type === 'hotel') bookingData.hotel_id = numericServiceId;
        else if (booking.service_type === 'flight') bookingData.flight_id = numericServiceId;
        else if (booking.service_type === 'car') bookingData.car_id = numericServiceId;
        else if (booking.service_type === 'activity') bookingData.activity_id = numericServiceId;

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


