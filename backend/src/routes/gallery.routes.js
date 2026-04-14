import { Router } from 'express';
import { listGalleryImages, createGalleryImage, updateGalleryImage, deleteGalleryImage } from '../controllers/gallery.controller.js';
import { clerkAuth, requireRole } from '../middlewares/auth.js';
import { cacheMiddleware } from '../middlewares/cache.js';

const router = Router();

router.get('/', cacheMiddleware(300), listGalleryImages);

// Admin
router.post('/', clerkAuth, requireRole('admin'), createGalleryImage);
router.put('/:id', clerkAuth, requireRole('admin'), updateGalleryImage);
router.delete('/:id', clerkAuth, requireRole('admin'), deleteGalleryImage);

export default router;
