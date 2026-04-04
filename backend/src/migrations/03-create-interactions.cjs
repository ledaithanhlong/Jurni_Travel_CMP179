'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // --- FAVORITES ---
        await queryInterface.createTable('Favorites', {
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
            createdAt: { allowNull: false, type: Sequelize.DATE },
            updatedAt: { allowNull: false, type: Sequelize.DATE }
        });
        await queryInterface.addIndex('Favorites', ['user_id']);

        // --- VOUCHERS ---
        await queryInterface.createTable('Vouchers', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER.UNSIGNED
            },
            code: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true
            },
            discount_percent: { type: Sequelize.INTEGER },
            discount_amount: { type: Sequelize.DECIMAL(10, 2) },
            min_spend: { type: Sequelize.DECIMAL(10, 2) },
            max_discount: { type: Sequelize.DECIMAL(10, 2) },
            start_date: { type: Sequelize.DATE },
            expiry_date: { type: Sequelize.DATE },
            usage_limit: { type: Sequelize.INTEGER },
            createdAt: { allowNull: false, type: Sequelize.DATE },
            updatedAt: { allowNull: false, type: Sequelize.DATE }
        });

        // --- NOTIFICATIONS ---
        await queryInterface.createTable('Notifications', {
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
                onDelete: 'CASCADE'
            },
            title: { type: Sequelize.STRING, allowNull: false },
            message: { type: Sequelize.TEXT },
            type: { type: Sequelize.STRING }, // 'booking', 'promo', 'system'
            is_read: { type: Sequelize.BOOLEAN, defaultValue: false },
            createdAt: { allowNull: false, type: Sequelize.DATE },
            updatedAt: { allowNull: false, type: Sequelize.DATE }
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Notifications');
        await queryInterface.dropTable('Vouchers');
        await queryInterface.dropTable('Favorites');
    }
};
