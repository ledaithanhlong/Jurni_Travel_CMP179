import { Router } from 'express';
import authRouter from './auth.routes.js';
import usersRouter from './users.routes.js';
import bookingsRouter from './bookings.routes.js';
import notificationsRouter from './notifications.routes.js';
import vouchersRouter from './vouchers.routes.js';
import testimonialsRouter from './testimonials.routes.js';
import hotelsRouter from './hotels.routes.js';
import flightsRouter from './flights.routes.js';
import carsRouter from './cars.routes.js';
import activitiesRouter from './activities.routes.js';
import paymentsRouter from './payments.routes.js';

const v1Router = Router();

v1Router.use('/auth', authRouter);
v1Router.use('/users', usersRouter);
v1Router.use('/bookings', bookingsRouter);
v1Router.use('/notifications', notificationsRouter);
v1Router.use('/vouchers', vouchersRouter);
v1Router.use('/testimonials', testimonialsRouter);
v1Router.use('/hotels', hotelsRouter);
v1Router.use('/flights', flightsRouter);
v1Router.use('/cars', carsRouter);
v1Router.use('/activities', activitiesRouter);
v1Router.use('/payments', paymentsRouter);

const router = Router();
router.use('/v1', v1Router);

export default router;
