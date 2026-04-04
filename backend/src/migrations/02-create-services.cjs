'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // --- HOTELS ---
        await queryInterface.createTable('Hotels', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER.UNSIGNED
            },
            name: { type: Sequelize.STRING, allowNull: false },
            location: { type: Sequelize.STRING, allowNull: false },
            address: { type: Sequelize.STRING },
            price: { type: Sequelize.DECIMAL(10, 2), defaultValue: 0 },
            star_rating: { type: Sequelize.FLOAT, defaultValue: 0 },
            check_in_time: { type: Sequelize.STRING, allowNull: true },
            check_out_time: { type: Sequelize.STRING, allowNull: true },
            total_floors: { type: Sequelize.INTEGER },
            description: { type: Sequelize.TEXT },
            image_url: { type: Sequelize.STRING },
            amenities: { type: Sequelize.JSON },
            policies: { type: Sequelize.JSON },
            createdAt: { allowNull: false, type: Sequelize.DATE },
            updatedAt: { allowNull: false, type: Sequelize.DATE }
        });
        await queryInterface.addIndex('Hotels', ['location']);
        await queryInterface.addIndex('Hotels', ['price']);

        // --- ROOMS ---
        await queryInterface.createTable('Rooms', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER.UNSIGNED
            },
            hotel_id: {
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: false,
                references: { model: 'Hotels', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            name: { type: Sequelize.STRING, allowNull: false },
            type: { type: Sequelize.STRING }, // e.g. Single, Double, Suite
            price: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
            capacity: { type: Sequelize.INTEGER },
            quantity: { type: Sequelize.INTEGER, defaultValue: 1 },
            available: { type: Sequelize.BOOLEAN, defaultValue: true },
            image_url: { type: Sequelize.STRING },
            createdAt: { allowNull: false, type: Sequelize.DATE },
            updatedAt: { allowNull: false, type: Sequelize.DATE }
        });
        await queryInterface.addIndex('Rooms', ['hotel_id']);

        // --- FLIGHTS ---
        await queryInterface.createTable('Flights', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER.UNSIGNED
            },
            airline: { type: Sequelize.STRING, allowNull: false },
            flight_number: { type: Sequelize.STRING, allowNull: false },
            origin: { type: Sequelize.STRING, allowNull: false }, // Store code like 'SGN' or city name
            destination: { type: Sequelize.STRING, allowNull: false },
            departure_time: { type: Sequelize.DATE, allowNull: false },
            arrival_time: { type: Sequelize.DATE, allowNull: false },
            price: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
            seats_available: { type: Sequelize.INTEGER, defaultValue: 0 },
            image_url: { type: Sequelize.STRING },
            flight_type: { type: Sequelize.STRING }, // One-way, Round-trip
            ticket_options: { type: Sequelize.JSON }, // Classes: Economy, Business...
            createdAt: { allowNull: false, type: Sequelize.DATE },
            updatedAt: { allowNull: false, type: Sequelize.DATE }
        });
        await queryInterface.addIndex('Flights', ['origin', 'destination']);
        await queryInterface.addIndex('Flights', ['departure_time']);

        // --- CARS ---
        await queryInterface.createTable('Cars', {
            id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER.UNSIGNED },
            company: { type: Sequelize.STRING, allowNull: false },
            model: { type: Sequelize.STRING },
            type: { type: Sequelize.STRING }, // Sedan, SUV
            price_per_day: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
            seats: { type: Sequelize.INTEGER },
            location: { type: Sequelize.STRING },
            image_url: { type: Sequelize.STRING },
            available: { type: Sequelize.BOOLEAN, defaultValue: true },
            description: { type: Sequelize.TEXT },
            specifications: { type: Sequelize.JSON },
            amenities: { type: Sequelize.JSON },
            createdAt: { allowNull: false, type: Sequelize.DATE },
            updatedAt: { allowNull: false, type: Sequelize.DATE }
        });

        // --- ACTIVITIES ---
        await queryInterface.createTable('Activities', {
            id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER.UNSIGNED },
            name: { type: Sequelize.STRING, allowNull: false },
            location: { type: Sequelize.STRING },
            price: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
            duration: { type: Sequelize.STRING },
            description: { type: Sequelize.TEXT },
            image_url: { type: Sequelize.STRING },
            category: { type: Sequelize.STRING },
            includes: { type: Sequelize.JSON },
            meeting_point: { type: Sequelize.STRING },
            policies: { type: Sequelize.JSON },
            createdAt: { allowNull: false, type: Sequelize.DATE },
            updatedAt: { allowNull: false, type: Sequelize.DATE }
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Activities');
        await queryInterface.dropTable('Cars');
        await queryInterface.dropTable('Flights');
        await queryInterface.dropTable('Rooms');
        await queryInterface.dropTable('Hotels');
    }
};
