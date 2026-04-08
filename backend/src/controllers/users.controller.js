import db from '../models/index.js';

export const listUsers = async (req, res, next) => {
  try {
    const rows = await db.User.findAll({
      order: [['id', 'DESC']],
      attributes: ['id', 'name', 'email', 'role', 'createdAt', 'updatedAt'] // Chỉ lấy các trường cần thiết
    });
    res.json(rows);
  } catch (e) {
    console.error('Error in listUsers:', e);
    next(e);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const row = await db.User.findByPk(req.params.id);
    if (!row) return res.status(404).json({ error: 'Not found' });
    await row.update(req.body);
    res.json(row);
  } catch (e) { next(e); }
};

export const deleteUser = async (req, res, next) => {
  try {
    const row = await db.User.findByPk(req.params.id);
    if (!row) return res.status(404).json({ error: 'Not found' });
    await row.destroy();
    res.json({ ok: true });
  } catch (e) { next(e); }
};

