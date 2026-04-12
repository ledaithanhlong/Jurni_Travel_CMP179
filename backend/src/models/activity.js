export default (sequelize, DataTypes) => {
  const Activity = sequelize.define('Activity', {
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    location: { type: DataTypes.STRING },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    duration: { type: DataTypes.STRING },
    description: { type: DataTypes.TEXT },
    image_url: { type: DataTypes.STRING },
    category: { type: DataTypes.STRING },
    includes: { type: DataTypes.JSON },
    meeting_point: { type: DataTypes.STRING },
    policies: { type: DataTypes.JSON },
    itinerary: { type: DataTypes.JSON },        // [{day, title, description, activities[]}]
    price_packages: { type: DataTypes.JSON },   // [{name, price, min_people, max_people, includes[]}]
    terms: { type: DataTypes.TEXT },            // Điều khoản & lưu ý
    notes: { type: DataTypes.TEXT }             // Ghi chú bổ sung
  }, {
    tableName: 'Activities',
    timestamps: true
  });

  Activity.associate = (models) => {
    Activity.hasMany(models.Booking, { foreignKey: 'activity_id', as: 'bookings' });
  };

  return Activity;
};
