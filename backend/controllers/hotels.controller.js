import db from '../models/index.js';

export const listHotels = async (req, res, next) => {
    try {
        const { location, status } = req.query;
        const filter = {};
        if (location) filter.location = { $regex: location, $options: 'i' };
        if (status) filter.status = status;
        else filter.status = 'approved';

        const rows = await db.Hotel.find(filter).sort({ createdAt: -1 });
        return res.json(rows);
    } catch (e) {
        return next(e);
    }
};

export const getHotel = async (req, res, next) => {
    try {
        const row = await db.Hotel.findById(req.params.id);
        if (!row) return res.status(404).json({ error: 'Not found' });
        return res.json(row);
    } catch (e) {
        return next(e);
    }
};

export const createHotel = async (req, res, next) => {
    try {
        const created = await db.Hotel.create(req.body);
        return res.status(201).json(created);
    } catch (e) {
        return next(e);
    }
};

export const updateHotel = async (req, res, next) => {
    try {
        const row = await db.Hotel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!row) return res.status(404).json({ error: 'Not found' });
        return res.json(row);
    } catch (e) {
        return next(e);
    }
};

export const deleteHotel = async (req, res, next) => {
    try {
        const row = await db.Hotel.findByIdAndDelete(req.params.id);
        if (!row) return res.status(404).json({ error: 'Not found' });
        return res.json({ ok: true });
    } catch (e) {
        return next(e);
    }
};
