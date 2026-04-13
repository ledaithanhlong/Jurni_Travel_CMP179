import { Router } from 'express';
import multer from 'multer';
import cloudinary from '../config/cloudinary.js';
import { clerkAuth, requireRole } from '../middlewares/auth.js';
import fs from 'fs';
import db from '../models/index.js';

const upload = multer({ dest: 'tmp/' });
const router = Router();

import { env } from '../config/env.js';
import path from 'path';

router.post('/', clerkAuth, requireRole('admin'), upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const category = req.body?.category ? String(req.body.category) : 'other';
    const entity_type = req.body?.entity_type ? String(req.body.entity_type) : null;
    const parsedEntityId = req.body?.entity_id !== undefined && req.body?.entity_id !== null && req.body?.entity_id !== ''
      ? Number(req.body.entity_id)
      : null;
    const entity_id = Number.isFinite(parsedEntityId) ? parsedEntityId : null;
    const created_by = req.user?.id || null;
    const replace = req.body?.replace === true || req.body?.replace === 'true' || req.body?.replace === '1' || req.body?.replace === 1;

    if (env.cloudinary && env.cloudinary.cloudName) {
      // Use Cloudinary if configured
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'traveloka-clone',
        resource_type: 'auto'
      });
      fs.unlinkSync(req.file.path);
      try {
        if (replace && entity_type && entity_id) {
          const existingRows = await db.MediaAsset.findAll({
            where: { category, entity_type, entity_id },
            order: [['createdAt', 'DESC']]
          });
          const existing = existingRows[0] || null;
          const prevPublicIds = existingRows
            .map((r) => (r?.public_id ? String(r.public_id) : null))
            .filter(Boolean);

          if (existing) {
            await existing.update({
              url: result.secure_url,
              public_id: result.public_id,
              created_by
            });
          } else {
            await db.MediaAsset.create({
              url: result.secure_url,
              public_id: result.public_id,
              category,
              entity_type,
              entity_id,
              created_by
            });
          }

          if (existingRows.length > 1) {
            await db.MediaAsset.destroy({ where: { id: existingRows.slice(1).map((r) => r.id) } });
          }

          for (const prevPublicId of prevPublicIds) {
            if (prevPublicId && prevPublicId !== result.public_id) {
            try {
              await cloudinary.uploader.destroy(prevPublicId);
            } catch {
            }
          }
          }
        } else {
          await db.MediaAsset.create({
            url: result.secure_url,
            public_id: result.public_id,
            category,
            entity_type,
            entity_id,
            created_by
          });
        }
      } catch {
      }
      return res.json({ url: result.secure_url, public_id: result.public_id });
    } else {
      // Fallback to local storage if Cloudinary is not configured
      const uploadsDir = path.join(process.cwd(), 'uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      
      const fileName = `${Date.now()}-${req.file.originalname.replace(/\s+/g, '-')}`;
      const destPath = path.join(uploadsDir, fileName);
      
      fs.renameSync(req.file.path, destPath);
      
      const host = req.get('host');
      const protocol = req.protocol;
      const fileUrl = `${protocol}://${host}/uploads/${fileName}`;
      try {
        if (replace && entity_type && entity_id) {
          const existingRows = await db.MediaAsset.findAll({
            where: { category, entity_type, entity_id },
            order: [['createdAt', 'DESC']]
          });
          const existing = existingRows[0] || null;
          const prevPublicIds = existingRows
            .map((r) => (r?.public_id ? String(r.public_id) : null))
            .filter(Boolean);

          if (existing) {
            await existing.update({
              url: fileUrl,
              public_id: fileName,
              created_by
            });
          } else {
            await db.MediaAsset.create({
              url: fileUrl,
              public_id: fileName,
              category,
              entity_type,
              entity_id,
              created_by
            });
          }

          if (existingRows.length > 1) {
            await db.MediaAsset.destroy({ where: { id: existingRows.slice(1).map((r) => r.id) } });
          }

          for (const prevPublicId of prevPublicIds) {
            if (prevPublicId && prevPublicId !== fileName) {
            try {
              const projectRoot = path.join(process.cwd());
              const oldPath = path.join(projectRoot, 'uploads', prevPublicId);
              if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            } catch {
            }
          }
          }
        } else {
          await db.MediaAsset.create({
            url: fileUrl,
            public_id: fileName,
            category,
            entity_type,
            entity_id,
            created_by
          });
        }
      } catch {
      }
      return res.json({ url: fileUrl, public_id: fileName });
    }
  } catch (e) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    next(e);
  }
});

export default router;


