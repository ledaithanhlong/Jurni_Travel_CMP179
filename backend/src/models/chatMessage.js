export default (sequelize, DataTypes) => {
  const ChatMessage = sequelize.define('ChatMessage', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    conversation_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    sender_type: {
      type: DataTypes.ENUM('customer', 'agent', 'ai'),
      allowNull: false
    },
    sender_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'ChatMessages',
    timestamps: false
  });

  ChatMessage.associate = (models) => {
    ChatMessage.belongsTo(models.ChatConversation, {
      foreignKey: 'conversation_id',
      as: 'conversation'
    });
  };

  return ChatMessage;
};
