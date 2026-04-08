import { randomUUID } from 'crypto';
import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            default: () => randomUUID(),
        },
        user_id: {
            type: String,
            ref: 'User',
            required: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        message: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: ['booking', 'order_status', 'promotion', 'system'],
            default: 'system',
        },
        action_url: {
            type: String,
            default: null,
        },
        is_read: {
            type: Boolean,
            default: false,
        },
    },
    {
        collection: 'notifications',
        timestamps: true,
        versionKey: false,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

notificationSchema.virtual('id').get(function () {
    return this._id;
});

notificationSchema.virtual('created_at').get(function () {
    return this.createdAt;
});

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
