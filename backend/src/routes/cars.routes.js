import { Router } from 'express';
import { clerkAuth, requireRole } from '../middlewares/auth.js';
import { listCars, createCar, updateCar, deleteCar } from '../controllers/cars.controller.js';

const router = Router();
router.get('/', listCars);
router.post('/', clerkAuth, requireRole('admin'), createCar);
router.put('/:id', clerkAuth, requireRole('admin'), updateCar);
router.delete('/:id', clerkAuth, requireRole('admin'), deleteCar);
export default router;


