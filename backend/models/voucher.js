import { randomUUID } from 'crypto';
import mongoose from 'mongoose';

const voucherSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            default: () => randomUUID(),
        },
        code: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            uppercase: true,
        },
        discount_percent: {
            type: Number,
            default: null,
        },
        discount_amount: {
            type: Number,
            default: null,
        },
        min_spend: {
            type: Number,
            default: 0,
        },
        max_discount: {
            type: Number,
            default: null,
        },
        start_date: {
            type: Date,
            default: Date.now,
        },
        expiry_date: {
            type: Date,
            required: true,
        },
        usage_limit: {
            type: Number,
            default: null,
        },
        current_usage: {
            type: Number,
            default: 0,
        },
        is_active: {
            type: Boolean,
            default: true,
        },
    },
    {
        collection: 'vouchers',
        timestamps: true,
        versionKey: false,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

voucherSchema.virtual('id').get(function () {
    return this._id;
});

const Voucher = mongoose.model('Voucher', voucherSchema);

export default Voucher;
