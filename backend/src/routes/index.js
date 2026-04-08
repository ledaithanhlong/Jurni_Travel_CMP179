import { Router } from 'express';

// Import all route modules
import activitiesRoutes from './activities.routes.js';
import authRoutes from './auth.routes.js';
import bookingsRoutes from './bookings.routes.js';
import careerValuesRoutes from './careerValues.routes.js';
import carsRoutes from './cars.routes.js';
import chatRoutes from './chat.routes.js';
import flightsRoutes from './flights.routes.js';
import galleryRoutes from './gallery.routes.js';
import hotelsRoutes from './hotels.routes.js';
import notificationsRoutes from './notifications.routes.js';
import paymentsRoutes from './payments.routes.js';
import teamRoutes from './team.routes.js';
import testimonialsRoutes from './testimonials.routes.js';
import usersRoutes from './users.routes.js';
import vouchersRoutes from './vouchers.routes.js';

const router = Router();

// Mount all routes
router.use('/activities', activitiesRoutes);
router.use('/auth', authRoutes);
router.use('/bookings', bookingsRoutes);
router.use('/chat', chatRoutes);
router.use('/career-values', careerValuesRoutes);
router.use('/cars', carsRoutes);
router.use('/flights', flightsRoutes);
router.use('/gallery', galleryRoutes);
router.use('/hotels', hotelsRoutes);
router.use('/notifications', notificationsRoutes);
router.use('/payments', paymentsRoutes);
router.use('/team', teamRoutes);
router.use('/testimonials', testimonialsRoutes);
router.use('/users', usersRoutes);
router.use('/vouchers', vouchersRoutes);

export default router;