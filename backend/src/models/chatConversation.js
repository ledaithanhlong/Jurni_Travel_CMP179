export default (sequelize, DataTypes) => {
  const ChatConversation = sequelize.define('ChatConversation', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    customer_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    customer_email: {
      type: DataTypes.STRING,
      allowNull: true
    },
    user_id: {
      type: DataTypes.STRING,
      allowNull: true
    },
    conversation_type: {
      type: DataTypes.ENUM('ai', 'human'),
      allowNull: false,
      defaultValue: 'human'
    },
    status: {
      type: DataTypes.ENUM('waiting', 'active', 'closed'),
      allowNull: false,
      defaultValue: 'waiting'
    },
    assigned_agent_id: {
      type: DataTypes.STRING,
      allowNull: true
    },
    last_message_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'ChatConversations',
    timestamps: true
  });

  ChatConversation.associate = (models) => {
    ChatConversation.hasMany(models.ChatMessage, {
      foreignKey: 'conversation_id',
      as: 'messages'
    });
  };

  return ChatConversation;
};
