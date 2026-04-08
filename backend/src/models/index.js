import { Sequelize, DataTypes } from 'sequelize';
import { env } from '../config/env.js';

// Import models
import UserModel from './user.js';
import BookingModel from './booking.js';
import ActivityModel from './activity.js';
import FlightModel from './flight.js';
import CarModel from './car.js';
import HotelModel from './hotel.js';
import RoomModel from './room.js';
import GalleryImageModel from './galleryImage.js';
import NotificationModel from './notification.js';
import TeamMemberModel from './teammember.js';
import TestimonialModel from './testimonial.js';
import VoucherModel from './voucher.js';
import CareerValueModel from './careerValue.js';

// Create Sequelize instance
const sequelize = new Sequelize(env.db.name, env.db.user, env.db.pass, {
  host: env.db.host,
  port: env.db.port,
  dialect: env.db.dialect,
  charset: env.db.charset,
  collate: env.db.collate,
  logging: env.nodeEnv === 'development' ? console.log : false,
  pool: env.db.pool,
  dialectOptions: {
    charset: env.db.charset,
    collate: env.db.collate,
    supportBigNumbers: true,
    bigNumberStrings: true,
    dateStrings: true,
    typeCast: true
  },
  define: {
    charset: env.db.charset,
    collate: env.db.collate
  },
  timezone: '+07:00' // Múi giờ Việt Nam
});

// Initialize models
const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Register models
db.User = UserModel(sequelize, DataTypes);
db.Booking = BookingModel(sequelize, DataTypes);
db.Activity = ActivityModel(sequelize, DataTypes);
db.Flight = FlightModel(sequelize, DataTypes);
db.Car = CarModel(sequelize, DataTypes);
db.Hotel = HotelModel(sequelize, DataTypes);
db.Room = RoomModel(sequelize, DataTypes);
db.GalleryImage = GalleryImageModel(sequelize, DataTypes);
db.Notification = NotificationModel(sequelize, DataTypes);
db.TeamMember = TeamMemberModel(sequelize, DataTypes);
db.Testimonial = TestimonialModel(sequelize, DataTypes);
db.Voucher = VoucherModel(sequelize, DataTypes);
db.CareerValue = CareerValueModel(sequelize, DataTypes);

// Call associate methods to set up relationships
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

export default db;