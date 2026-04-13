export default (sequelize, DataTypes) => {
  const ActivityMedia = sequelize.define('ActivityMedia', {
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    activity_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },

    // 'image' or 'video'
    type: { type: DataTypes.ENUM('image', 'video'), allowNull: false, defaultValue: 'image' },
    url: { type: DataTypes.STRING, allowNull: false },

    // Used for Cloudinary delete/update later
    public_id: { type: DataTypes.STRING, allowNull: true },

    caption: { type: DataTypes.STRING, allowNull: true },
    is_thumbnail: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    sort_order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  }, {
    tableName: 'ActivityMedia',
    timestamps: true
  });

  ActivityMedia.associate = (models) => {
    ActivityMedia.belongsTo(models.Activity, { foreignKey: 'activity_id', as: 'activity' });
  };

  return ActivityMedia;
};

