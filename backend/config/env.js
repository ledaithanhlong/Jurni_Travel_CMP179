import dotenv from 'dotenv';

dotenv.config();

export const env = {
    port: process.env.PORT || 5000,
    db: {
        mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/Jurni_db',
        mongoName: process.env.MONGODB_NAME || 'Jurni_db'
    },
    clerk: {
        publishableKey: process.env.CLERK_PUBLISHABLE_KEY || '',
        secretKey: process.env.CLERK_SECRET_KEY || ''
    },
    adminEmails: (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim()).filter(Boolean),
    cloudinary: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
        apiKey: process.env.CLOUDINARY_API_KEY || '',
        apiSecret: process.env.CLOUDINARY_API_SECRET || ''
    },
    tunnelUrl: process.env.TUNNEL_URL || '',
    frontendTunnelUrl: process.env.FRONTEND_TUNNEL_URL || ''
};


