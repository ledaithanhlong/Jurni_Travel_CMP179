'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async function(queryInterface, Sequelize) {
    await queryInterface.createTable('support_requests', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        content: {
            type: Sequelize.TEXT,
            allowNull: false,
        },
        status: {
            type: Sequelize.ENUM('pending', 'resolved'),
            allowNull: false,
            defaultValue: 'pending',
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
  },

  down: async function(queryInterface) {
    await queryInterface.dropTable('support_requests');
  }
};
