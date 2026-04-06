const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Tour = require('../models/Tour');
const User = require('../models/User');

const isTransactionNotSupportedError = (error) => {
  const msg = String(error?.message || '');
  return msg.includes('Transaction numbers are only allowed') || msg.includes('replica set member') || msg.includes('mongos');
};

const parseCartItemCategory = (item) => {
  const rawId = String(item?.id || '');
  if (rawId.startsWith('hotel-')) return 'hotel';
  if (rawId.startsWith('flight-')) return 'flight';
  if (rawId.startsWith('car-')) return 'car';
  if (rawId.startsWith('activity-')) return 'activity';
  return 'activity';
};

const parseServiceId = (item) => {
  const details = item?.details || {};
  if (details.activity_id !== undefined && details.activity_id !== null) return String(details.activity_id);
  if (details.tour_id !== undefined && details.tour_id !== null) return String(details.tour_id);
  const rawId = String(item?.id || '');
  const parts = rawId.split('-');
  if (parts.length >= 2 && parts[1]) return String(parts[1]);
  return rawId || String(Date.now());
};

exports.checkout = async (req, res) => {
  try {
    const clerkId = req.auth.userId;
    const { items, customer, amount, paymentMethod } = req.body || {};

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, error: 'Không có sản phẩm để thanh toán.' });
    }

    const run = async (session) => {
      const userQuery = User.findOne({ clerkId });
      const user = session ? await userQuery.session(session) : await userQuery;
      if (!user) return { error: { status: 404, message: 'User not found' } };

      const transactionId = `pay_${Math.random().toString(36).slice(2, 11)}`;
      const createdBookings = [];

      for (const item of items) {
        const category = parseCartItemCategory(item);
        const serviceId = parseServiceId(item);
        const externalKey = `web:${category}:${serviceId}`;

        let tourQuery = Tour.findOne({ externalKey });
        let tour = session ? await tourQuery.session(session) : await tourQuery;
        if (!tour) {
          const title = String(item?.name || 'Dịch vụ');
          const location = String(item?.details?.location || item?.details?.address || '');
          const duration = String(item?.details?.duration || item?.details?.nights ? `${item.details.nights} đêm` : '');
          const image = String(item?.image || item?.details?.image_url || '');

          if (session) {
            const created = await Tour.create([{
              title,
              description: typeof item?.details === 'object' ? JSON.stringify(item.details) : String(item?.details || ''),
              price: Number(item?.price || 0),
              duration,
              location,
              images: image ? [image] : [],
              category,
              availableSlots: 10,
              externalKey,
              externalSource: 'web'
            }], { session });
            tour = created[0];
          } else {
            tour = await Tour.create({
              title,
              description: typeof item?.details === 'object' ? JSON.stringify(item.details) : String(item?.details || ''),
              price: Number(item?.price || 0),
              duration,
              location,
              images: image ? [image] : [],
              category,
              availableSlots: 10,
              externalKey,
              externalSource: 'web'
            });
          }
        }

        const guests = Number(item?.details?.participants || item?.details?.guests || item?.quantity || 1);
        const totalPrice = Number(item?.price || 0) * Number(item?.quantity || 1);

        if (Number(tour.availableSlots || 0) < guests) {
          throw new Error('Not enough slots available');
        }

        let booking = null;
        if (session) {
          const created = await Booking.create([{
            userId: user._id,
            clerkId,
            tourId: tour._id,
            guests,
            totalPrice,
            status: 'confirmed',
            paymentStatus: 'paid',
            transactionId
          }], { session });
          booking = created[0];
        } else {
          booking = await Booking.create({
            userId: user._id,
            clerkId,
            tourId: tour._id,
            guests,
            totalPrice,
            status: 'confirmed',
            paymentStatus: 'paid',
            transactionId
          });
        }

        createdBookings.push(booking);

        tour.availableSlots = Number(tour.availableSlots || 0) - guests;
        if (session) {
          await tour.save({ session });
        } else {
          await tour.save();
        }
      }

      return { user, transactionId, createdBookings };
    };

    let result = null;
    const session = await mongoose.startSession();
    try {
      session.startTransaction();
      result = await run(session);
      if (result?.error) {
        await session.abortTransaction();
        session.endSession();
        return res.status(result.error.status).json({ success: false, error: result.error.message });
      }
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction().catch(() => {});
      if (isTransactionNotSupportedError(error)) {
        result = await run(null);
        if (result?.error) {
          return res.status(result.error.status).json({ success: false, error: result.error.message });
        }
      } else {
        throw error;
      }
    } finally {
      session.endSession();
    }

    res.json({
      success: true,
      payment: {
        reference: result.transactionId,
        amount,
        paymentMethod,
        customer
      },
      bookings: result.createdBookings
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
