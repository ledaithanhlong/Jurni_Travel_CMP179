import { Router } from 'express';
import authRouter from './auth.routes.js';
import usersRouter from './users.routes.js';
import hotelsRouter from './hotels.routes.js';
import flightsRouter from './flights.routes.js';
import carsRouter from './cars.routes.js';
import activitiesRouter from './activities.routes.js';
import bookingsRouter from './bookings.routes.js';
import favoritesRouter from './favorites.routes.js';
import vouchersRouter from './vouchers.routes.js';
import notificationsRouter from './notifications.routes.js';
import uploadRouter from './upload.routes.js';
import paymentsRouter from './payments.routes.js';
import teamRouter from './team.routes.js';
import careerValuesRouter from './careerValues.routes.js';
import galleryRouter from './gallery.routes.js';
import testimonialsRouter from './testimonials.routes.js';
import adminRouter from './admin.routes.js';
import chatRouter from './chat.routes.js';
import supportRouter from './support.routes.js';
import categoriesRouter from './categories.routes.js';
import reviewsRouter from './reviews.routes.js';
import mediaRouter from './media.routes.js';

const router = Router();

router.use('/auth', authRouter);
router.use('/users', usersRouter);
router.use('/hotels', hotelsRouter);
router.use('/flights', flightsRouter);
router.use('/cars', carsRouter);
router.use('/activities', activitiesRouter);
router.use('/bookings', bookingsRouter);
router.use('/favorites', favoritesRouter);
router.use('/vouchers', vouchersRouter);
router.use('/notifications', notificationsRouter);
router.use('/upload', uploadRouter);
router.use('/payments', paymentsRouter);
router.use('/team', teamRouter);
router.use('/career-values', careerValuesRouter);
router.use('/gallery', galleryRouter);
router.use('/testimonials', testimonialsRouter);
router.use('/admin', adminRouter);
router.use('/chat', chatRouter);
router.use('/support-requests', supportRouter);
router.use('/categories', categoriesRouter);
router.use('/reviews', reviewsRouter);
router.use('/media', mediaRouter);

export default router;


