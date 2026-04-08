import db from '../models/index.js';

export const listCareerValues = async (req, res, next) => {
    try {
        const values = await db.CareerValue.findAll({
            order: [['order', 'ASC'], ['createdAt', 'ASC']]
        });
        res.json(values);
    } catch (error) {
        next(error);
    }
};

export const createCareerValue = async (req, res, next) => {
    try {
        const { title, description, image_url, order } = req.body;
        const newValue = await db.CareerValue.create({
            title,
            description,
            image_url,
            order
        });
        res.status(201).json(newValue);
    } catch (error) {
        next(error);
    }
};

export const updateCareerValue = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, description, image_url, order } = req.body;

        const value = await db.CareerValue.findByPk(id);
        if (!value) {
            return res.status(404).json({ message: 'Career Value not found' });
        }

        await value.update({
            title,
            description,
            image_url,
            order
        });

        res.json(value);
    } catch (error) {
        next(error);
    }
};

export const deleteCareerValue = async (req, res, next) => {
    try {
        const { id } = req.params;
        const value = await db.CareerValue.findByPk(id);
        if (!value) {
            return res.status(404).json({ message: 'Career Value not found' });
        }

        await value.destroy();
        res.json({ message: 'Career Value deleted successfully' });
    } catch (error) {
        next(error);
    }
};
