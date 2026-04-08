import db from '../models/index.js';

const paymentMethods = [
    { id: 'visa', name: 'Visa', type: 'card', feePercent: 0.025, feeFixed: 0 },
    { id: 'mastercard', name: 'Mastercard', type: 'card', feePercent: 0.025, feeFixed: 0 },
    { id: 'amex', name: 'American Express', type: 'card', feePercent: 0.03, feeFixed: 0 },
    { id: 'atm-card', name: 'Thẻ ATM nội địa', type: 'atm', feePercent: 0.01, feeFixed: 0 },
    { id: 'momo', name: 'Ví MoMo', type: 'ewallet', feePercent: 0.01, feeFixed: 0 },
    { id: 'zalopay', name: 'ZaloPay', type: 'ewallet', feePercent: 0.01, feeFixed: 0 },
    { id: 'viettelpay', name: 'ViettelPay', type: 'ewallet', feePercent: 0.01, feeFixed: 0 },
    { id: 'vnpay-qr', name: 'VNPAY QR', type: 'qr', feePercent: 0, feeFixed: 0 },
    { id: 'bank-transfer', name: 'Chuyển khoản ngân hàng', type: 'bank', feePercent: 0, feeFixed: 0 },
];

export const getPaymentConfig = async (req, res, next) => {
    try {
        return res.json({
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

        const method = paymentMethods.find((m) => m.id === paymentMethod) || { name: paymentMethod, feePercent: 0, feeFixed: 0 };
        
        if (!customer?.name || !customer?.email) {
            return res.status(400).json({ error: 'Thiếu thông tin liên hệ của khách hàng.' });
        }

        const amountNumber = Number(amount);
        const transactionReference = `PAY-${Date.now()}`;

        let bookingRecord = null;
        const createdBookings = [];
        
        // Ensure user is identified
        let finalUserId = req.user?._id || req.user?.id;

        if (!finalUserId) {
            // Fallback if not logged in but email matches
            const user = await db.User.findOne({ email: customer.email });
            finalUserId = user?._id || user?.id;
        }

        if (!finalUserId) {
            let systemUser = await db.User.findOne({ email: 'system@jurni.com' });
            if (!systemUser) {
                systemUser = await db.User.create({
                    name: 'System User',
                    email: 'system@jurni.com',
                    role: 'user',
                });
            }
            finalUserId = systemUser._id;
        }

        const processItem = async (item) => {
            const details = item.details || {};
            const startDate = details.checkIn || details.startDate || details.pickupDate || details.departureTime || details.date;
            const endDate = details.checkOut || details.endDate || details.dropoffDate || details.arrivalTime;

            const bookingData = {
                user_id: finalUserId,
                total_price: Number(item.price || 0) * (Number(item.quantity) || 1),
                status: 'confirmed', // Mark as confirmed after payment
                customer_name: customer.name,
                customer_email: customer.email,
                customer_phone: customer.phone,
                payment_method: method.name,
                transaction_id: transactionReference,
                start_date: startDate ? new Date(startDate) : null,
                end_date: endDate ? new Date(endDate) : null,
                quantity: Number(item.quantity) || 1,
                item_variant: details.roomType || details.ticketType || details.ticketClass || details.carType || details.activityType || null,
            };

            // Map service types
            const type = String(item.type || '').toLowerCase();
            if (type.includes('hotel') || type.includes('khách sạn')) bookingData.hotel_id = item.id?.split('-')[1] || item.id;
            else if (type.includes('flight') || type.includes('chuyến bay')) bookingData.flight_id = item.id?.split('-')[1] || item.id;
            else if (type.includes('car') || type.includes('thuê xe')) bookingData.car_id = item.id?.split('-')[1] || item.id;
            else if (type.includes('activity') || type.includes('hoạt động')) bookingData.activity_id = item.id?.split('-')[1] || item.id;

            const newBooking = await db.Booking.create(bookingData);
            
            // Send notification
            await db.Notification.create({
                user_id: finalUserId,
                title: 'Thanh toán thành công',
                message: `Giao dịch ${transactionReference} cho ${item.name || 'dịch vụ'} đã thành công.`,
                type: 'booking',
                action_url: `/bookings/${newBooking._id}`,
            });

            return newBooking;
        };

        if (items && Array.isArray(items) && items.length > 0) {
            for (const item of items) {
                const b = await processItem(item);
                createdBookings.push(b);
            }
            bookingRecord = createdBookings;
        } else if (booking?.service_type) {
            const b = await processItem({
                ...booking,
                type: booking.service_type,
                id: booking.service_id,
                price: amountNumber / (booking.quantity || 1)
            });
            bookingRecord = b;
        }

        return res.status(201).json({
            success: true,
            message: 'Thanh toán thành công. Hóa đơn đã được gửi tới email của bạn.',
            payment: {
                reference: transactionReference,
                status: 'succeeded',
                method: method.id,
                amount: amountNumber,
                currency,
                processedAt: new Date().toISOString(),
            },
            booking: bookingRecord,
            customer,
            items,
        });
    } catch (e) {
        console.error('Payment processing error:', e);
        next(e);
    }
};
