export default (sequelize, DataTypes) => {
  const Activity = sequelize.define('Activity', {
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    location: { type: DataTypes.STRING },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    duration: { type: DataTypes.STRING },
    description: { type: DataTypes.TEXT },
    image_url: { type: DataTypes.STRING },
    category: { type: DataTypes.STRING }, // Keep for legacy if needed, but we'll use associations
    includes: { type: DataTypes.JSON },
    meeting_point: { type: DataTypes.STRING },
    policies: { type: DataTypes.JSON }
  }, {
    tableName: 'Activities',
    timestamps: true
  });

  Activity.associate = (models) => {
    Activity.hasMany(models.Booking, { foreignKey: 'activity_id', as: 'bookings' });
    Activity.hasMany(models.ActivityMedia, { foreignKey: 'activity_id', as: 'media' });
    Activity.belongsToMany(models.Category, {
      through: 'ActivityCategories',
      foreignKey: 'activity_id',
      otherKey: 'category_id',
      as: 'categories'
    });
  };

  return Activity;
};
