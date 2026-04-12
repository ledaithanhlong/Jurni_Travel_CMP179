'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Reviews', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED
      },
      booking_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'Bookings', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      user_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'Users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      service_type: {
        type: Sequelize.ENUM('hotel', 'flight', 'car', 'activity'),
        allowNull: false
      },
      service_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false
      },
      rating: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false
      },
      comment: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('pending', 'approved', 'hidden'),
        allowNull: false,
        defaultValue: 'pending'
      },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });

    await queryInterface.addIndex('Reviews', ['booking_id'], { unique: true });
    await queryInterface.addIndex('Reviews', ['user_id']);
    await queryInterface.addIndex('Reviews', ['service_type', 'service_id']);
    await queryInterface.addIndex('Reviews', ['status']);
    await queryInterface.addIndex('Reviews', ['createdAt']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Reviews');
  }
};

