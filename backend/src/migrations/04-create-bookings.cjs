'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Bookings', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER.UNSIGNED
            },
            user_id: {
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: false,
                references: { model: 'Users', key: 'id' },
                onUpdate: 'CASCADE',
                // Don't cascade delete bookings if user is deleted, strictly speaking, 
                // but for now CASCADE is easier for dev. 
                // In prod, Set Null or Restrict is better. using CASCADE for dev speed.
                onDelete: 'CASCADE'
            },

            // Explicit Foreign Keys for Services
            hotel_id: {
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: true,
                references: { model: 'Hotels', key: 'id' },
                onDelete: 'SET NULL'
            },
            flight_id: {
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: true,
                references: { model: 'Flights', key: 'id' },
                onDelete: 'SET NULL'
            },
            car_id: {
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: true,
                references: { model: 'Cars', key: 'id' },
                onDelete: 'SET NULL'
            },
            activity_id: {
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: true,
                references: { model: 'Activities', key: 'id' },
                onDelete: 'SET NULL'
            },

            // Core Booking Details
            start_date: { type: Sequelize.DATE, allowNull: true },
            end_date: { type: Sequelize.DATE, allowNull: true },
            quantity: { type: Sequelize.INTEGER.UNSIGNED, defaultValue: 1 },

            // OPTIMIZED VARIANT COLUMN (No generic JSON)
            item_variant: {
                type: Sequelize.STRING,
                allowNull: true,
                comment: 'e.g. Deluxe Room, Economy Class'
            },

            total_price: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
            status: {
                type: Sequelize.ENUM('pending', 'confirmed', 'completed', 'cancelled', 'refunded'),
                defaultValue: 'pending',
                allowNull: false
            },

            // Customer Info (Snapshot)
            customer_name: { type: Sequelize.STRING },
            customer_email: { type: Sequelize.STRING },
            customer_phone: { type: Sequelize.STRING },

            // Payment Info
            payment_method: { type: Sequelize.STRING },
            transaction_id: { type: Sequelize.STRING },

            createdAt: { allowNull: false, type: Sequelize.DATE },
            updatedAt: { allowNull: false, type: Sequelize.DATE }
        });

        // Indexes for optimization
        await queryInterface.addIndex('Bookings', ['user_id']);
        await queryInterface.addIndex('Bookings', ['status']);
        await queryInterface.addIndex('Bookings', ['transaction_id']);
        await queryInterface.addIndex('Bookings', ['createdAt']);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Bookings');
    }
};
