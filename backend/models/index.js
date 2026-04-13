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
        return mongoose.connection;
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
};

export default db;
