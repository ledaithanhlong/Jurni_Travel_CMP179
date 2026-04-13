import db from '../models/index.js';

export const listVouchers = async (req, res, next) => {
    try {
        const now = new Date();
        const rows = await db.Voucher.find({
            expiry_date: { $gte: now },
            is_active: true
        }).sort({ expiry_date: 1 });
        return res.json(rows);
    } catch (e) {
        return next(e);
    }
};

export const createVoucher = async (req, res, next) => {
    try {
        const created = await db.Voucher.create(req.body);

        // Broadcast notification for new voucher/promotion
        const users = await db.User.find({}, '_id');
        await Promise.all(
            users.map((user) =>
                db.Notification.create({
                    user_id: user._id,
                    title: 'Khuyến mãi mới!',
                    message: `Mã giảm giá mới ${created.code} đã sẵn sàng. Giảm ngay ${created.discount_percent ? created.discount_percent + '%' : created.discount_amount + 'đ'}.`,
                    type: 'promotion',
                    action_url: '/vouchers',
                })
            )
        );

        return res.status(201).json(created);
    } catch (e) {
        return next(e);
    }
};

export const updateVoucher = async (req, res, next) => {
    try {
        const row = await db.Voucher.findById(req.params.id);
        if (!row) {
            return res.status(404).json({ error: 'Not found' });
        }

        Object.assign(row, req.body);
        await row.save();
        return res.json(row);
    } catch (e) {
        return next(e);
    }
};

export const deleteVoucher = async (req, res, next) => {
    try {
        const row = await db.Voucher.findById(req.params.id);
        if (!row) {
            return res.status(404).json({ error: 'Not found' });
        }

        await row.deleteOne();
        return res.json({ ok: true });
    } catch (e) {
        return next(e);
    }
};

export const getAllVouchers = async (req, res, next) => {
    try {
        const rows = await db.Voucher.find().sort({ createdAt: -1 });
        return res.json(rows);
    } catch (e) {
        return next(e);
    }
};
