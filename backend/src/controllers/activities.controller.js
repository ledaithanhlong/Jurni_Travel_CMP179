import db from '../models/index.js';

export const listActivities = async (req, res, next) => {
  try {
    const rows = await db.Activity.findAll({ order: [['id', 'DESC']] });
    res.json(rows);
  } catch (e) { next(e); }
};

export const createActivity = async (req, res, next) => {
  try {
    const created = await db.Activity.create(req.body);
    res.status(201).json(created);
  } catch (e) { next(e); }
};

export const updateActivity = async (req, res, next) => {
  try {
    const row = await db.Activity.findByPk(req.params.id);
    if (!row) return res.status(404).json({ error: 'Not found' });
    await row.update(req.body);
    res.json(row);
  } catch (e) { next(e); }
};

export const deleteActivity = async (req, res, next) => {
  try {
    const row = await db.Activity.findByPk(req.params.id);
    if (!row) return res.status(404).json({ error: 'Not found' });
    await row.destroy();
    res.json({ ok: true });
  } catch (e) { next(e); }
};


