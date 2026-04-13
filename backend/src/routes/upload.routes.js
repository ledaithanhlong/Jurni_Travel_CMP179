import { Router } from 'express';
import multer from 'multer';
import cloudinary from '../config/cloudinary.js';
import { clerkAuth, requireRole } from '../middlewares/auth.js';
import fs from 'fs';

const upload = multer({ dest: 'tmp/' });
const router = Router();

import { env } from '../config/env.js';
import path from 'path';

router.post('/', clerkAuth, requireRole('admin'), upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    if (env.cloudinary && env.cloudinary.cloudName) {
      // Use Cloudinary if configured
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'traveloka-clone',
        resource_type: 'auto'
      });
      fs.unlinkSync(req.file.path);
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


