import { Op } from 'sequelize';
import db from '../models/index.js';

export const listVouchers = async (req, res, next) => {
  try {
    const now = new Date();
    const rows = await db.Voucher.findAll({
      where: { expiry_date: { [Op.gte]: now } },
      order: [['expiry_date', 'ASC']],
    });
    return res.json(rows);
  } catch (e) {
    return next(e);
  }
};

export const createVoucher = async (req, res, next) => {
  try {
    const created = await db.Voucher.create(req.body);
    return res.status(201).json(created);
  } catch (e) {
    return next(e);
  }
};

export const updateVoucher = async (req, res, next) => {
  try {
    const row = await db.Voucher.findByPk(req.params.id);
    if (!row) {
      return res.status(404).json({ error: 'Not found' });
    }

    await row.update(req.body);
    return res.json(row);
  } catch (e) {
    return next(e);
  }
};

export const deleteVoucher = async (req, res, next) => {
  try {
    const row = await db.Voucher.findByPk(req.params.id);
    if (!row) {
      return res.status(404).json({ error: 'Not found' });
    }

    await row.destroy();
    return res.json({ ok: true });
  } catch (e) {
    return next(e);
  }
};

export const getAllVouchers = async (req, res, next) => {
  try {
    const rows = await db.Voucher.findAll({ order: [['id', 'DESC']] });
    return res.json(rows);
  } catch (e) {
    return next(e);
  }
};


