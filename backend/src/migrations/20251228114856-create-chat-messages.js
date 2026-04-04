'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('chat_messages', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    conversation_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'chat_conversations',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    sender_type: {
      type: Sequelize.ENUM('customer', 'agent', 'ai'),
      allowNull: false,
    },
    sender_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    message: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    timestamp: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
  });

  // Add index for faster queries
  await queryInterface.addIndex('chat_messages', ['conversation_id']);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('chat_messages');
}

