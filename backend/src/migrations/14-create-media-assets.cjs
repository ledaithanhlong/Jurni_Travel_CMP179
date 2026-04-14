'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('MediaAssets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED
      },
      url: { type: Sequelize.STRING, allowNull: false },
      public_id: { type: Sequelize.STRING, allowNull: true },
      category: { type: Sequelize.STRING, allowNull: false, defaultValue: 'other' },
      entity_type: { type: Sequelize.STRING, allowNull: true },
      entity_id: { type: Sequelize.INTEGER.UNSIGNED, allowNull: true },
      created_by: { type: Sequelize.INTEGER.UNSIGNED, allowNull: true },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });

    await queryInterface.addIndex('MediaAssets', ['category']);
    await queryInterface.addIndex('MediaAssets', ['entity_type', 'entity_id']);
    await queryInterface.addIndex('MediaAssets', ['created_by']);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('MediaAssets');
  }
};

