import db from '../models/index.js';

const { Category } = db;

export const listCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      order: [['name', 'ASC']]
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name, slug, icon, description } = req.body;
    const category = await Category.create({ name, slug, icon, description });
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, icon, description, is_active } = req.body;
    const category = await Category.findByPk(id);
    if (!category) return res.status(404).json({ error: 'Category not found' });

    await category.update({ name, slug, icon, description, is_active });
    res.json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id);
    if (!category) return res.status(404).json({ error: 'Category not found' });

    await category.destroy();
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
