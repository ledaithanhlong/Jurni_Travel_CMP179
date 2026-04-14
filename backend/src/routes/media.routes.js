import { Router } from 'express';
import { clerkAuth, requireRole } from '../middlewares/auth.js';
import db from '../models/index.js';
import fs from 'fs';
import path from 'path';
import cloudinary from '../config/cloudinary.js';
import { env } from '../config/env.js';

const router = Router();

router.get('/', clerkAuth, requireRole('admin'), async (req, res, next) => {
  try {
    const { category, limit = 60, offset = 0 } = req.query;

    const where = {};
    if (category && category !== 'all') where.category = String(category);

    const rows = await db.MediaAsset.findAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: Math.min(Number(limit) || 60, 200),
      offset: Number(offset) || 0,
      include: [{ model: db.User, as: 'createdBy', attributes: ['id', 'name', 'email'] }]
    });

    const count = await db.MediaAsset.count({ where });
    res.json({ items: rows.map((r) => r.toJSON()), count });
  } catch (e) {
    next(e);
  }
});

router.delete('/:id', clerkAuth, requireRole('admin'), async (req, res, next) => {
  try {
    const row = await db.MediaAsset.findByPk(req.params.id);
    if (!row) return res.status(404).json({ error: 'Not found' });

    const publicId = row.public_id ? String(row.public_id) : null;
    const url = row.url ? String(row.url) : null;

    await row.destroy();

    if (publicId && env.cloudinary && env.cloudinary.cloudName) {
      try {
        await cloudinary.uploader.destroy(publicId);
      } catch {
      }
    }

    if (publicId && url && url.includes('/uploads/')) {
      try {
        const fileName = publicId;
        const projectRoot = path.join(process.cwd());
        const filePath = path.join(projectRoot, 'uploads', fileName);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      } catch {
      }
    }

    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

export default router;

