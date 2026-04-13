export default (sequelize, DataTypes) => {
  const Flight = sequelize.define('Flight', {
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    airline: { type: DataTypes.STRING, allowNull: false },
    flight_number: { type: DataTypes.STRING, allowNull: false },
    origin: { type: DataTypes.STRING, allowNull: false },
    destination: { type: DataTypes.STRING, allowNull: false },
    departure_city: { type: DataTypes.STRING, allowNull: false },
    arrival_city: { type: DataTypes.STRING, allowNull: false },
    departure_time: { type: DataTypes.DATE, allowNull: false },
    arrival_time: { type: DataTypes.DATE, allowNull: false },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    seats_available: { type: DataTypes.INTEGER, defaultValue: 0 },
    available_seats: { type: DataTypes.INTEGER, defaultValue: 0 },
    image_url: { type: DataTypes.STRING },
    flight_type: { type: DataTypes.STRING },
    aircraft: { type: DataTypes.STRING, defaultValue: 'Airbus A320' },
    amenities: { type: DataTypes.JSON },
    policies: { type: DataTypes.JSON },
    ticket_options: { type: DataTypes.JSON }
  }, {
    tableName: 'Flights',
    timestamps: true
  });

  Flight.associate = (models) => {
    Flight.hasMany(models.Booking, { foreignKey: 'flight_id', as: 'bookings' });
  };

  return Flight;
};
