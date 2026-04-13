export default (sequelize, DataTypes) => {
  const ActivityCategory = sequelize.define('ActivityCategory', {
    activity_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'Activities',
        key: 'id'
      }
    },
    category_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'Categories',
        key: 'id'
      }
    }
  }, {
    tableName: 'ActivityCategories',
    timestamps: false
  });

  return ActivityCategory;
};
