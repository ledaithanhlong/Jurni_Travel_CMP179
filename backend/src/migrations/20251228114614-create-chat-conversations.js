'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('chat_conversations', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    customer_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    customer_email: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    user_id: {
      type: Sequelize.STRING,
      allowNull: true,
      comment: 'Clerk user ID if logged in',
    },
    conversation_type: {
      type: Sequelize.ENUM('ai', 'human'),
      allowNull: false,
      defaultValue: 'human',
    },
    status: {
      type: Sequelize.ENUM('active', 'waiting', 'closed'),
      allowNull: false,
      defaultValue: 'waiting',
    },
    assigned_agent_id: {
      type: Sequelize.STRING,
      allowNull: true,
      comment: 'Admin user ID who is handling this chat',
    },
    last_message_at: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
    updated_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
    },
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('chat_conversations');
}

