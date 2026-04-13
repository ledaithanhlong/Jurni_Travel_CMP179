export default (sequelize, DataTypes) => {
  const Review = sequelize.define('Review', {
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    booking_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    user_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    service_type: { type: DataTypes.ENUM('hotel', 'flight', 'car', 'activity'), allowNull: false },
    service_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    rating: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    comment: { type: DataTypes.TEXT, allowNull: true },
    status: { type: DataTypes.ENUM('pending', 'approved', 'hidden'), allowNull: false, defaultValue: 'pending' }
  }, {
    tableName: 'Reviews',
    timestamps: true
  });

  Review.associate = (models) => {
    Review.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    Review.belongsTo(models.Booking, { foreignKey: 'booking_id', as: 'booking' });
  };

  return Review;
};

