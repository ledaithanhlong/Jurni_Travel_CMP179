'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Add missing fields to Flights table
        await queryInterface.addColumn('Flights', 'departure_city', {
            type: Sequelize.STRING,
            allowNull: true // Allow null initially for existing records
        });

        await queryInterface.addColumn('Flights', 'arrival_city', {
            type: Sequelize.STRING,
            allowNull: true // Allow null initially for existing records
        });

        await queryInterface.addColumn('Flights', 'available_seats', {
            type: Sequelize.INTEGER,
            defaultValue: 0
        });

        await queryInterface.addColumn('Flights', 'aircraft', {
            type: Sequelize.STRING,
            defaultValue: 'Airbus A320'
        });

        await queryInterface.addColumn('Flights', 'amenities', {
            type: Sequelize.JSON,
            allowNull: true
        });

        await queryInterface.addColumn('Flights', 'policies', {
            type: Sequelize.JSON,
            allowNull: true
        });

        // Copy data from origin to departure_city and destination to arrival_city
        await queryInterface.sequelize.query(`
            UPDATE Flights 
            SET departure_city = origin, arrival_city = destination 
            WHERE departure_city IS NULL OR arrival_city IS NULL
        `);
    },

    down: async (queryInterface, Sequelize) => {
        // Revert all changes
        await queryInterface.removeColumn('Flights', 'policies');
        await queryInterface.removeColumn('Flights', 'amenities');
        await queryInterface.removeColumn('Flights', 'aircraft');
        await queryInterface.removeColumn('Flights', 'available_seats');
        await queryInterface.removeColumn('Flights', 'arrival_city');
        await queryInterface.removeColumn('Flights', 'departure_city');
    }
};
