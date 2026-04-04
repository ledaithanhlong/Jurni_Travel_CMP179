export default (sequelize, DataTypes) => {
    const ChatMessage = sequelize.define('ChatMessage', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        conversation_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'chat_conversations',
                key: 'id',
            },
        },
        sender_type: {
            type: DataTypes.ENUM('customer', 'agent', 'ai'),
            allowNull: false,
        },
        sender_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        timestamp: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    }, {
        tableName: 'chat_messages',
        timestamps: false,
        underscored: true,
    });

    ChatMessage.associate = (models) => {
        ChatMessage.belongsTo(models.ChatConversation, {
            foreignKey: 'conversation_id',
            as: 'conversation',
        });
    };

    return ChatMessage;
};
