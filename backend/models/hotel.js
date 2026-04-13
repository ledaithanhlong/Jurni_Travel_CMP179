import { randomUUID } from 'crypto';
import mongoose from 'mongoose';

const hotelSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            default: () => randomUUID(),
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        location: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        star_rating: {
            type: Number,
            default: 0,
        },
        description: {
            type: String,
        },
        image_url: {
            type: String,
        },
        images: {
            type: [String],
            default: [],
        },
        check_in_time: {
            type: String,
            default: '14:00',
        },
        check_out_time: {
            type: String,
            default: '12:00',
        },
        total_rooms: {
            type: Number,
        },
        total_floors: {
            type: Number,
        },
        room_types: {
            type: [mongoose.Schema.Types.Mixed],
            default: [],
        },
        amenities: {
            type: [String],
            default: [],
        },
        policies: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
        },
        nearby_attractions: {
            type: [mongoose.Schema.Types.Mixed],
            default: [],
        },
        public_transport: {
            type: [mongoose.Schema.Types.Mixed],
            default: [],
        },
        has_breakfast: {
            type: Boolean,
            default: false,
        },
        has_parking: {
            type: Boolean,
            default: false,
        },
        has_wifi: {
            type: Boolean,
            default: true,
        },
        has_pool: {
            type: Boolean,
            default: false,
        },
        has_restaurant: {
            type: Boolean,
            default: false,
        },
        has_gym: {
            type: Boolean,
            default: false,
        },
        has_spa: {
            type: Boolean,
            default: false,
        },
        allows_pets: {
            type: Boolean,
            default: false,
        },
        is_smoking_allowed: {
            type: Boolean,
            default: false,
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'approved',
        },
        approval_note: {
            type: String,
        },
    },
    {
        collection: 'hotels',
        timestamps: true,
        versionKey: false,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

hotelSchema.virtual('id').get(function () {
    return this._id;
});

const Hotel = mongoose.model('Hotel', hotelSchema);

export default Hotel;
