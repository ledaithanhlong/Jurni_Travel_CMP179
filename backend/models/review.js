import { randomUUID } from 'crypto';
import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            default: () => randomUUID(),
        },
        booking_id: {
            type: String,
            required: true,
            unique: true,
        },
        user_id: {
            type: String,
            ref: 'User',
            required: true,
        },
        service_type: {
            type: String,
            enum: ['hotel', 'flight', 'car', 'activity'],
            required: true,
        },
        service_id: {
            type: String,
            required: true,
        },
        rating: {
            type: Number,
            min: 1,
            max: 5,
            required: true,
        },
        comment: {
            type: String,
            default: null,
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'hidden'],
            default: 'pending',
        },
    },
    {
        collection: 'reviews',
        timestamps: true,
        versionKey: false,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

reviewSchema.virtual('id').get(function () {
    return this._id;
});

const Review = mongoose.model('Review', reviewSchema);

export default Review;
