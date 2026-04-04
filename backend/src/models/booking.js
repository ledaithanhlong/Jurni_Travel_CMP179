export default (sequelize, DataTypes) => {
  const Booking = sequelize.define('Booking', {
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },

    // Explicit Foreign Keys
    hotel_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    flight_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    car_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    activity_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },

    start_date: { type: DataTypes.DATE, allowNull: true },
    end_date: { type: DataTypes.DATE, allowNull: true },
    quantity: { type: DataTypes.INTEGER.UNSIGNED, defaultValue: 1 },

    // Optimized variant column
    item_variant: { type: DataTypes.STRING, allowNull: true },

    total_price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    status: { type: DataTypes.ENUM('pending', 'confirmed', 'completed', 'cancelled', 'refunded'), defaultValue: 'pending' },

    // Customer Info
    customer_name: { type: DataTypes.STRING },
    customer_email: { type: DataTypes.STRING },
    customer_phone: { type: DataTypes.STRING },

    // Payment
    payment_method: { type: DataTypes.STRING },
    transaction_id: { type: DataTypes.STRING }
  }, {
    tableName: 'Bookings',
    timestamps: true
  });

  Booking.associate = (models) => {
    Booking.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    Booking.belongsTo(models.Hotel, { foreignKey: 'hotel_id', as: 'hotel' });
    Booking.belongsTo(models.Flight, { foreignKey: 'flight_id', as: 'flight' });
    Booking.belongsTo(models.Car, { foreignKey: 'car_id', as: 'car' });
    Booking.belongsTo(models.Activity, { foreignKey: 'activity_id', as: 'activity' });
  };

  return Booking;
};
