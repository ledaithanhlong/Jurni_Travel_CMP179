import { randomUUID } from 'crypto';
import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            default: () => randomUUID(),
        },
        name: {
            type: String,
            required: true,
        },
        location: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        duration: {
            type: String,
        },
        category: {
            type: String,
        },
        description: {
            type: String,
        },
        image_url: {
            type: String,
        },
        highlights: {
            type: [String],
            default: [],
        },
        includes: {
            type: [String],
            default: [],
        },
        meeting_point: {
            type: String,
        },
        policies: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
        },
    },
    {
        collection: 'activities',
        timestamps: true,
        versionKey: false,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

activitySchema.virtual('id').get(function () {
    return this._id;
});

const Activity = mongoose.model('Activity', activitySchema);

export default Activity;
