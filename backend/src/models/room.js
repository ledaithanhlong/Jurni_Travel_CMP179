export default (sequelize, DataTypes) => {
  const Room = sequelize.define('Room', {
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    hotel_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.STRING },
    room_type: { type: DataTypes.STRING },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    capacity: { type: DataTypes.INTEGER },
    quantity: { type: DataTypes.INTEGER, defaultValue: 1 },
    available: { type: DataTypes.BOOLEAN, defaultValue: true },
    images: { type: DataTypes.JSON, defaultValue: [] }
  }, {
    tableName: 'Rooms',
    timestamps: true
  });

  Room.associate = (models) => {
    Room.belongsTo(models.Hotel, { foreignKey: 'hotel_id', as: 'hotel' });
  };

  return Room;
};
