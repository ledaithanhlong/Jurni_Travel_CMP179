export default (sequelize, DataTypes) => {
    const ChatConversation = sequelize.define('ChatConversation', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        customer_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        customer_email: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        user_id: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Clerk user ID if logged in',
        },
        conversation_type: {
            type: DataTypes.ENUM('ai', 'human'),
            allowNull: false,
            defaultValue: 'human',
        },
        status: {
            type: DataTypes.ENUM('active', 'waiting', 'closed'),
            allowNull: false,
            defaultValue: 'waiting',
        },
        assigned_agent_id: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Admin user ID who is handling this chat',
        },
        last_message_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    }, {
        tableName: 'chat_conversations',
        timestamps: true,
        underscored: true,
    });

    ChatConversation.associate = (models) => {
        ChatConversation.hasMany(models.ChatMessage, {
            foreignKey: 'conversation_id',
            as: 'messages',
        });
    };

    return ChatConversation;
};
