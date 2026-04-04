import { Router } from 'express';
import { clerkAuth, requireAuth } from '../middlewares/auth.js';
import { addFavorite, listFavorites, removeFavorite, checkFavorite } from '../controllers/favorites.controller.js';

const router = Router();
router.get('/', clerkAuth, requireAuth, listFavorites);
router.post('/', clerkAuth, requireAuth, addFavorite);
router.delete('/:id', clerkAuth, requireAuth, removeFavorite);
router.get('/check/:serviceType/:serviceId', clerkAuth, requireAuth, checkFavorite);
export default router;


