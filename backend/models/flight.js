import { randomUUID } from 'crypto';
import mongoose from 'mongoose';

const flightSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            default: () => randomUUID(),
        },
        airline: {
            type: String,
            required: true,
        },
        flight_number: {
            type: String,
            required: true,
        },
        departure_city: {
            type: String,
            required: true,
        },
        arrival_city: {
            type: String,
            required: true,
        },
        departure_time: {
            type: Date,
            required: true,
        },
        arrival_time: {
            type: Date,
            required: true,
        },
        image_url: {
            type: String,
        },
        amenities: {
            type: [String],
            default: [],
        },
        policies: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
        },
        aircraft: {
            type: String,
        },
        ticket_options: {
            type: [mongoose.Schema.Types.Mixed],
            default: [],
        },
    },
    {
        collection: 'flights',
        timestamps: true,
        versionKey: false,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

flightSchema.virtual('id').get(function () {
    return this._id;
});

const Flight = mongoose.model('Flight', flightSchema);

export default Flight;
