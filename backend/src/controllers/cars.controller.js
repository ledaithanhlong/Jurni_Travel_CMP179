import db from '../models/index.js';

export const listCars = async (req, res, next) => {
  try {
    const rows = await db.Car.findAll({ order: [['id', 'DESC']] });
    res.json(rows);
  } catch (e) { next(e); }
};

export const createCar = async (req, res, next) => {
  try {
    const created = await db.Car.create(req.body);
    res.status(201).json(created);
  } catch (e) { next(e); }
};

export const updateCar = async (req, res, next) => {
  try {
    const row = await db.Car.findByPk(req.params.id);
    if (!row) return res.status(404).json({ error: 'Not found' });
    await row.update(req.body);
    res.json(row);
  } catch (e) { next(e); }
};

export const deleteCar = async (req, res, next) => {
  try {
    const row = await db.Car.findByPk(req.params.id);
    if (!row) return res.status(404).json({ error: 'Not found' });
    await row.destroy();
    res.json({ ok: true });
  } catch (e) { next(e); }
};


