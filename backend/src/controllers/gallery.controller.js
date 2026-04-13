import db from '../models/index.js';

export const listGalleryImages = async (req, res, next) => {
    try {
        const images = await db.GalleryImage.findAll({
            order: [['order', 'ASC'], ['createdAt', 'ASC']]
        });
        res.json(images);
    } catch (error) {
        next(error);
    }
};

export const createGalleryImage = async (req, res, next) => {
    try {
        const { url, caption, col_span, row_span, order } = req.body;
        const newItem = await db.GalleryImage.create({
            url, caption, col_span, row_span, order
        });
        res.status(201).json(newItem);
    } catch (error) {
        next(error);
    }
};

export const updateGalleryImage = async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = req.body;

        const item = await db.GalleryImage.findByPk(id);
        if (!item) return res.status(404).json({ message: 'Not found' });

        await item.update(data);
        res.json(item);
    } catch (error) {
        next(error);
    }
};

export const deleteGalleryImage = async (req, res, next) => {
    try {
        const { id } = req.params;
        const item = await db.GalleryImage.findByPk(id);
        if (!item) return res.status(404).json({ message: 'Not found' });

        await item.destroy();
        res.json({ message: 'Deleted' });
    } catch (error) {
        next(error);
    }
};
