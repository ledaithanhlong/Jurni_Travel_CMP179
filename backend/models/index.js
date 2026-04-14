import mongoose from 'mongoose';
import { env } from '../config/env.js';
import User from './user.js';
import Booking from './booking.js';
import Notification from './notification.js';
import Voucher from './voucher.js';
import Testimonial from './testimonial.js';
import ChatMessage from './chatMessage.js';
import ChatConversation from './chatConversation.js';
import Hotel from './hotel.js';
import Flight from './flight.js';
import Car from './car.js';
import Activity from './activity.js';
import Review from './review.js';

const db = {
    isMongo: true,
    User,
    Booking,
    Notification,
    Voucher,
    Testimonial,
    ChatMessage,
    ChatConversation,
    Hotel,
    Flight,
    Car,
    Activity,
    Review,
};

db.connect = async () => {
    if (mongoose.connection.readyState === 1) {
        return mongoose.connection;
    }

    const rawUri = String(env.db.mongoUri || '').trim();
    const defaultBase = 'mongodb://127.0.0.1:27017';
    let uri = rawUri || defaultBase;

    if (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) {
        uri = `mongodb://${uri}`;
    }

    const hasDbNameInUri = /^mongodb(?:\+srv)?:\/\/[^/]+\/[^?]+/i.test(uri);
    if (!hasDbNameInUri && env.db.mongoName) {
        const [base, query] = uri.split('?');
        uri = `${base.replace(/\/$/, '')}/${env.db.mongoName}${query ? `?${query}` : ''}`;
    }

    try {
        await mongoose.connect(uri);

        try {
            const cols = await mongoose.connection.db.listCollections().toArray();
            for (const c of cols) {
                const col = mongoose.connection.db.collection(c.name);
                const idxs = await col.indexes();
                const legacy = idxs.find((idx) => idx?.name === 'user_1_tour_1' || (idx?.key?.user === 1 && idx?.key?.tour === 1));
                if (legacy) {
                    await col.dropIndex(legacy.name);
                }
            }
            await Review.syncIndexes();
        } catch (e) {
        }

        return mongoose.connection;
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
};

export default db;
