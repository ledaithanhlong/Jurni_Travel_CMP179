export default (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    slug: { type: DataTypes.STRING, allowNull: false, unique: true },
    icon: { type: DataTypes.STRING, allowNull: true },
    description: { type: DataTypes.TEXT, allowNull: true },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true }
  }, {
    tableName: 'Categories',
    timestamps: true
  });

  Category.associate = (models) => {
    Category.belongsToMany(models.Activity, {
      through: models.ActivityCategory,
      foreignKey: 'category_id',
      otherKey: 'activity_id',
      as: 'activities'
    });
  };

  return Category;
};
