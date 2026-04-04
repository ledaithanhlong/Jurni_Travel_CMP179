export default (sequelize, DataTypes) => {
  const Favorite = sequelize.define('Favorite', {
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    service_type: { type: DataTypes.ENUM('hotel', 'flight', 'car', 'activity'), allowNull: false },
    service_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    name: { type: DataTypes.STRING },
    meta: { type: DataTypes.TEXT },
    price: { type: DataTypes.DECIMAL(10, 2) }
  }, {
    tableName: 'Favorites',
    timestamps: true
  });

  Favorite.associate = (models) => {
    Favorite.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
  };

  return Favorite;
};
