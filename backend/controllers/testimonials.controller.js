import db from '../models/index.js';

export const listTestimonials = async (req, res, next) => {
    try {
        const items = await db.Testimonial.find().sort({ order: 1, createdAt: 1 });
        return res.json(items);
    } catch (error) {
        return next(error);
    }
};

export const createTestimonial = async (req, res, next) => {
    try {
        const { name, role, quote, avatar_url, order } = req.body;
        const newItem = await db.Testimonial.create({
            name,
            role,
            quote,
            avatar_url,
            order,
        });
        return res.status(201).json(newItem);
    } catch (error) {
        return next(error);
    }
};

export const updateTestimonial = async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = req.body;

        const item = await db.Testimonial.findById(id);
        if (!item) {
            return res.status(404).json({ message: 'Not found' });
        }

        Object.assign(item, data);
        await item.save();
        return res.json(item);
    } catch (error) {
        return next(error);
    }
};

export const deleteTestimonial = async (req, res, next) => {
    try {
        const { id } = req.params;
        const item = await db.Testimonial.findById(id);
        if (!item) {
            return res.status(404).json({ message: 'Not found' });
        }

        await item.deleteOne();
        return res.json({ message: 'Deleted' });
    } catch (error) {
        return next(error);
    }
};
