import { Router } from 'express';
import teamController from '../controllers/team.controller.js';
import { clerkAuth, requireRole } from '../middlewares/auth.js';
import { cacheMiddleware } from '../middlewares/cache.js';

const router = Router();

router.get('/', cacheMiddleware(300), teamController.getAll);
router.post('/', clerkAuth, requireRole('admin'), teamController.create);
router.put('/:id', clerkAuth, requireRole('admin'), teamController.update);
router.delete('/:id', clerkAuth, requireRole('admin'), teamController.remove);

export default router;
