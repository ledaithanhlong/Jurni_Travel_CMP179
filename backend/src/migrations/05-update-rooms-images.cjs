'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Remove old image_url column
        await queryInterface.removeColumn('Rooms', 'image_url');

        // Add new images column as JSON array
        await queryInterface.addColumn('Rooms', 'images', {
            type: Sequelize.JSON,
            defaultValue: []
        });
    },

    down: async (queryInterface, Sequelize) => {
        // Revert: remove images column
        await queryInterface.removeColumn('Rooms', 'images');

        // Add back image_url column
        await queryInterface.addColumn('Rooms', 'image_url', {
            type: Sequelize.STRING,
            allowNull: true
        });
    }
};
