import { randomUUID } from 'crypto';
import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema(
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
        role: {
            type: String,
            required: true,
            trim: true,
        },
        quote: {
            type: String,
            required: true,
        },
        avatar_url: {
            type: String,
            default: null,
        },
        order: {
            type: Number,
            default: 0,
        },
    },
    {
        collection: 'testimonials',
        timestamps: true,
        versionKey: false,
    }
);

const Testimonial = mongoose.model('Testimonial', testimonialSchema);

export default Testimonial;
