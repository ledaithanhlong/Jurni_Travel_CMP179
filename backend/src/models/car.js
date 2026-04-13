export default (sequelize, DataTypes) => {
  const Car = sequelize.define('Car', {
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    company: { type: DataTypes.STRING, allowNull: false },
    model: { type: DataTypes.STRING },
    type: { type: DataTypes.STRING },
    price_per_day: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    seats: { type: DataTypes.INTEGER },
    location: { type: DataTypes.STRING },
    image_url: { type: DataTypes.STRING },
    available: { type: DataTypes.BOOLEAN, defaultValue: true },
    description: { type: DataTypes.TEXT },
    specifications: { type: DataTypes.JSON },
    amenities: { type: DataTypes.JSON }
  }, {
    tableName: 'Cars',
    timestamps: true
  });

  Car.associate = (models) => {
    Car.hasMany(models.Booking, { foreignKey: 'car_id', as: 'bookings' });
  };

  return Car;
};
