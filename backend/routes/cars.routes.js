import { Router } from 'express';
import { createCar, deleteCar, getCar, listCars, updateCar } from '../controllers/cars.controller.js';
import { clerkAuth, requireRole } from '../middlewares/auth.js';

const router = Router();

router.get('/', listCars);
router.get('/:id', getCar);
router.post('/', clerkAuth, requireRole('admin'), createCar);
router.put('/:id', clerkAuth, requireRole('admin'), updateCar);
router.delete('/:id', clerkAuth, requireRole('admin'), deleteCar);

export default router;
