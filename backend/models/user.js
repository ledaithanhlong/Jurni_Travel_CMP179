import { randomUUID } from 'crypto';
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            default: randomUUID,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            default: null,
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },
        clerkId: {
            type: String,
            unique: true,
            sparse: true,
            default: null,
            trim: true,
        },
        phone: {
            type: String,
            default: null,
            trim: true,
        },
    },
    {
        collection: 'users',
        timestamps: true,
        versionKey: false,
    }
);

// Equivalent to Sequelize hasMany associations.
userSchema.virtual('bookings', {
    ref: 'Booking',
    localField: '_id',
    foreignField: 'userId',
});

userSchema.virtual('favorites', {
    ref: 'Favorite',
    localField: '_id',
    foreignField: 'userId',
});

userSchema.virtual('notifications', {
    ref: 'Notification',
    localField: '_id',
    foreignField: 'userId',
});

userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

const User = mongoose.model('User', userSchema);

export default User;