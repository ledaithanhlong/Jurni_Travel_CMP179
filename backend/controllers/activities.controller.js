import db from '../models/index.js';

export const listActivities = async (req, res, next) => {
    try {
        const { location, category } = req.query;
        const filter = {};
        if (location) filter.location = { $regex: location, $options: 'i' };
        if (category) filter.category = category;

        const rows = await db.Activity.find(filter).sort({ createdAt: -1 });
        return res.json(rows);
    } catch (e) {
        return next(e);
    }
};

export const getActivity = async (req, res, next) => {
    try {
        const row = await db.Activity.findById(req.params.id);
        if (!row) return res.status(404).json({ error: 'Not found' });
        return res.json(row);
    } catch (e) {
        return next(e);
    }
};

export const createActivity = async (req, res, next) => {
    try {
        const created = await db.Activity.create(req.body);
        return res.status(201).json(created);
    } catch (e) {
        return next(e);
    }
};

export const updateActivity = async (req, res, next) => {
    try {
        const row = await db.Activity.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!row) return res.status(404).json({ error: 'Not found' });
        return res.json(row);
    } catch (e) {
        return next(e);
    }
};

export const deleteActivity = async (req, res, next) => {
    try {
        const row = await db.Activity.findByIdAndDelete(req.params.id);
        if (!row) return res.status(404).json({ error: 'Not found' });
        return res.json({ ok: true });
    } catch (e) {
        return next(e);
    }
};
