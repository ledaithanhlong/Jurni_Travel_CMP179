import { randomUUID } from 'crypto';
import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
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
        hotel_id: {
            type: String,
            default: null,
        },
        flight_id: {
            type: String,
            default: null,
        },
        car_id: {
            type: String,
            default: null,
        },
        activity_id: {
            type: String,
            default: null,
        },
        start_date: {
            type: Date,
            default: null,
        },
        end_date: {
            type: Date,
            default: null,
        },
        quantity: {
            type: Number,
            default: 1,
        },
        item_variant: {
            type: String,
            default: null,
        },
        total_price: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'completed', 'cancelled', 'refunded'],
            default: 'pending',
        },
        customer_name: {
            type: String,
            default: null,
        },
        customer_email: {
            type: String,
            default: null,
        },
        customer_phone: {
            type: String,
            default: null,
        },
        payment_method: {
            type: String,
            default: null,
        },
        transaction_id: {
            type: String,
            default: null,
        },
    },
    {
        collection: 'bookings',
        timestamps: true,
        versionKey: false,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

bookingSchema.virtual('id').get(function () {
    return this._id;
});

bookingSchema.virtual('created_at').get(function () {
    return this.createdAt;
});

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
