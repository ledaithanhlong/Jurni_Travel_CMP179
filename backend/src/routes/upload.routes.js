import { Router } from 'express';
import multer from 'multer';
import cloudinary from '../config/cloudinary.js';
import { clerkAuth, requireRole } from '../middlewares/auth.js';
import fs from 'fs';

const upload = multer({ dest: 'tmp/' });
const router = Router();

router.post('/', clerkAuth, requireRole('admin'), upload.single('file'), async (req, res, next) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, { folder: 'traveloka-clone' });
    fs.unlinkSync(req.file.path);
    res.json({ url: result.secure_url, public_id: result.public_id });
  } catch (e) { next(e); }
});

export default router;


