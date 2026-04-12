'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const tableDesc = await queryInterface.describeTable('Activities');

    if (!tableDesc.itinerary) {
      await queryInterface.addColumn('Activities', 'itinerary', {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: null,
        comment: 'Daily itinerary: [{day, title, description, activities[]}]'
      });
    }

    if (!tableDesc.price_packages) {
      await queryInterface.addColumn('Activities', 'price_packages', {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: null,
        comment: 'Pricing packages: [{name, price, min_people, max_people, includes[]}]'
      });
    }

    if (!tableDesc.terms) {
      await queryInterface.addColumn('Activities', 'terms', {
        type: Sequelize.TEXT,
        allowNull: true,
        defaultValue: null,
        comment: 'Terms and conditions for customers'
      });
    }

    if (!tableDesc.notes) {
      await queryInterface.addColumn('Activities', 'notes', {
        type: Sequelize.TEXT,
        allowNull: true,
        defaultValue: null,
        comment: 'Additional notes for customers'
      });
    }
  },

  async down(queryInterface) {
    const tableDesc = await queryInterface.describeTable('Activities');

    if (tableDesc.itinerary) {
      await queryInterface.removeColumn('Activities', 'itinerary');
    }
    if (tableDesc.price_packages) {
      await queryInterface.removeColumn('Activities', 'price_packages');
    }
    if (tableDesc.terms) {
      await queryInterface.removeColumn('Activities', 'terms');
    }
    if (tableDesc.notes) {
      await queryInterface.removeColumn('Activities', 'notes');
    }
  }
};
