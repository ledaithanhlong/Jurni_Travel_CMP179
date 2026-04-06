require('dotenv').config();

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var mongoose = require('mongoose');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var toursRouter = require('./routes/tours');
var bookingsRouter = require('./routes/bookings');
var adminRouter = require('./routes/admin');
var reviewsRouter = require('./routes/reviews');
var favoritesRouter = require('./routes/favorites');
var paymentsRouter = require('./routes/payments');

var app = express();

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/jurni_travel_db')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/tours', toursRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/admin', adminRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/favorites', favoritesRouter);
app.use('/api/payments', paymentsRouter);

app.use(function(req, res) {
  res.status(404).json({ error: 'Not Found' });
});

app.use(function(err, req, res, next) {
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

module.exports = app;
