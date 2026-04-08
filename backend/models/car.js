import { randomUUID } from 'crypto';
import mongoose from 'mongoose';

const carSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            default: () => randomUUID(),
        },
        company: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            required: true,
        },
        seats: {
            type: Number,
            required: true,
        },
        price_per_day: {
            type: Number,
            required: true,
        },
        available: {
            type: Boolean,
            default: true,
        },
        image_url: {
            type: String,
        },
        description: {
            type: String,
        },
        specifications: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
        },
        amenities: {
            type: [String],
            default: [],
        },
    },
    {
        collection: 'cars',
        timestamps: true,
        versionKey: false,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

carSchema.virtual('id').get(function () {
    return this._id;
});

const Car = mongoose.model('Car', carSchema);

export default Car;
