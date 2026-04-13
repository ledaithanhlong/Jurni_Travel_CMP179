'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ActivityMedia', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED
      },
      activity_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'Activities', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      type: {
        type: Sequelize.ENUM('image', 'video'),
        allowNull: false,
        defaultValue: 'image'
      },
      url: { type: Sequelize.STRING, allowNull: false },
      public_id: { type: Sequelize.STRING, allowNull: true },
      caption: { type: Sequelize.STRING, allowNull: true },
      is_thumbnail: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      sort_order: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });

    await queryInterface.addIndex('ActivityMedia', ['activity_id']);
    await queryInterface.addIndex('ActivityMedia', ['activity_id', 'sort_order']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('ActivityMedia');
  }
};

