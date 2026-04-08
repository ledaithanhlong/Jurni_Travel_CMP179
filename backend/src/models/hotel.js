export default (sequelize, DataTypes) => {
  const Hotel = sequelize.define('Hotel', {
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    location: { type: DataTypes.STRING, allowNull: false },
    address: { type: DataTypes.STRING },
    price: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    star_rating: { type: DataTypes.DECIMAL(2, 1) },
    description: { type: DataTypes.TEXT },
    image_url: { type: DataTypes.STRING },
    images: { type: DataTypes.JSON, defaultValue: [] },
    check_in_time: { type: DataTypes.STRING, allowNull: false },
    check_out_time: { type: DataTypes.STRING, allowNull: false },
    total_floors: { type: DataTypes.INTEGER },
    amenities: { type: DataTypes.JSON },
    policies: { type: DataTypes.JSON },
    nearby_attractions: { type: DataTypes.JSON },
    public_transport: { type: DataTypes.JSON },
    has_breakfast: { type: DataTypes.BOOLEAN, defaultValue: false },
    has_parking: { type: DataTypes.BOOLEAN, defaultValue: false },
    has_wifi: { type: DataTypes.BOOLEAN, defaultValue: true },
    has_pool: { type: DataTypes.BOOLEAN, defaultValue: false },
    has_restaurant: { type: DataTypes.BOOLEAN, defaultValue: false },
    has_gym: { type: DataTypes.BOOLEAN, defaultValue: false },
    has_spa: { type: DataTypes.BOOLEAN, defaultValue: false },
    allows_pets: { type: DataTypes.BOOLEAN, defaultValue: false },
    is_smoking_allowed: { type: DataTypes.BOOLEAN, defaultValue: false },
    status: { type: DataTypes.ENUM('pending', 'approved', 'rejected'), defaultValue: 'pending' },
    approved_by: { type: DataTypes.INTEGER.UNSIGNED },
    approved_at: { type: DataTypes.DATE },
    approval_note: { type: DataTypes.TEXT }
  }, {
    tableName: 'Hotels',
    timestamps: true
  });

  Hotel.associate = (models) => {
    Hotel.hasMany(models.Room, { foreignKey: 'hotel_id', as: 'rooms' });
    Hotel.hasMany(models.Booking, { foreignKey: 'hotel_id', as: 'bookings' });
  };

  return Hotel;
};
