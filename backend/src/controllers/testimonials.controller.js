import db from '../models/index.js';

export const listTestimonials = async (req, res, next) => {
    try {
        const items = await db.Testimonial.findAll({
            order: [['order', 'ASC'], ['createdAt', 'ASC']]
        });
        res.json(items);
    } catch (error) {
        next(error);
    }
};

export const createTestimonial = async (req, res, next) => {
    try {
        const { name, role, quote, avatar_url, order } = req.body;
        const newItem = await db.Testimonial.create({
            name, role, quote, avatar_url, order
        });
        res.status(201).json(newItem);
    } catch (error) {
        next(error);
    }
};

export const updateTestimonial = async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = req.body;

        const item = await db.Testimonial.findByPk(id);
        if (!item) return res.status(404).json({ message: 'Not found' });

        await item.update(data);
        res.json(item);
    } catch (error) {
        next(error);
    }
};

export const deleteTestimonial = async (req, res, next) => {
    try {
        const { id } = req.params;
        const item = await db.Testimonial.findByPk(id);
        if (!item) return res.status(404).json({ message: 'Not found' });

        await item.destroy();
        res.json({ message: 'Deleted' });
    } catch (error) {
        next(error);
    }
};
