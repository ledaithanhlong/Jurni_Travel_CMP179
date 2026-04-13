export default (sequelize, DataTypes) => {
  const MediaAsset = sequelize.define('MediaAsset', {
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    url: { type: DataTypes.STRING, allowNull: false },
    public_id: { type: DataTypes.STRING, allowNull: true },
    category: { type: DataTypes.STRING, allowNull: false, defaultValue: 'other' },
    entity_type: { type: DataTypes.STRING, allowNull: true },
    entity_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    created_by: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
  }, {
    tableName: 'MediaAssets',
    timestamps: true
  });

  MediaAsset.associate = (models) => {
    MediaAsset.belongsTo(models.User, { foreignKey: 'created_by', as: 'createdBy' });
  };

  return MediaAsset;
};

