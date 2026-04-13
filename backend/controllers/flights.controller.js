import db from '../models/index.js';

export const listFlights = async (req, res, next) => {
    try {
        const { departure_city, arrival_city } = req.query;
        const filter = {};
        if (departure_city) filter.departure_city = { $regex: departure_city, $options: 'i' };
        if (arrival_city) filter.arrival_city = { $regex: arrival_city, $options: 'i' };

        const rows = await db.Flight.find(filter).sort({ departure_time: 1 });
        return res.json(rows);
    } catch (e) {
        return next(e);
    }
};

export const getFlight = async (req, res, next) => {
    try {
        const row = await db.Flight.findById(req.params.id);
        if (!row) return res.status(404).json({ error: 'Not found' });
        return res.json(row);
    } catch (e) {
        return next(e);
    }
};

export const createFlight = async (req, res, next) => {
    try {
        const created = await db.Flight.create(req.body);
        return res.status(201).json(created);
    } catch (e) {
        return next(e);
    }
};

export const updateFlight = async (req, res, next) => {
    try {
        const row = await db.Flight.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!row) return res.status(404).json({ error: 'Not found' });
        return res.json(row);
    } catch (e) {
        return next(e);
    }
};

export const deleteFlight = async (req, res, next) => {
    try {
        const row = await db.Flight.findByIdAndDelete(req.params.id);
        if (!row) return res.status(404).json({ error: 'Not found' });
        return res.json({ ok: true });
    } catch (e) {
        return next(e);
    }
};
