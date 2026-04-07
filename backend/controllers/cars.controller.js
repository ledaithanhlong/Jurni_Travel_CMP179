import db from '../models/index.js';

export const listCars = async (req, res, next) => {
    try {
        const { type, available } = req.query;
        const filter = {};
        if (type) filter.type = { $regex: type, $options: 'i' };
        if (available !== undefined) filter.available = available === 'true';

        const rows = await db.Car.find(filter).sort({ price_per_day: 1 });
        return res.json(rows);
    } catch (e) {
        return next(e);
    }
};

export const getCar = async (req, res, next) => {
    try {
        const row = await db.Car.findById(req.params.id);
        if (!row) return res.status(404).json({ error: 'Not found' });
        return res.json(row);
    } catch (e) {
        return next(e);
    }
};

export const createCar = async (req, res, next) => {
    try {
        const created = await db.Car.create(req.body);
        return res.status(201).json(created);
    } catch (e) {
        return next(e);
    }
};

export const updateCar = async (req, res, next) => {
    try {
        const row = await db.Car.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!row) return res.status(404).json({ error: 'Not found' });
        return res.json(row);
    } catch (e) {
        return next(e);
    }
};

export const deleteCar = async (req, res, next) => {
    try {
        const row = await db.Car.findByIdAndDelete(req.params.id);
        if (!row) return res.status(404).json({ error: 'Not found' });
        return res.json({ ok: true });
    } catch (e) {
        return next(e);
    }
};
