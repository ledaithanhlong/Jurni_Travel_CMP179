import mongoose from 'mongoose';
import { env } from '../config/env.js';
import User from './user.js';

const db = {
    isMongo: true,
    User,
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

    await mongoose.connect(uri);
    return mongoose.connection;
};

export default db;
