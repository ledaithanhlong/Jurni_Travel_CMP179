'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Add missing fields to Hotels table
        await queryInterface.addColumn('Hotels', 'images', {
            type: Sequelize.JSON,
            defaultValue: []
        });

        await queryInterface.addColumn('Hotels', 'nearby_attractions', {
            type: Sequelize.JSON,
            allowNull: true
        });

        await queryInterface.addColumn('Hotels', 'public_transport', {
            type: Sequelize.JSON,
            allowNull: true
        });

        await queryInterface.addColumn('Hotels', 'has_breakfast', {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        });

        await queryInterface.addColumn('Hotels', 'has_parking', {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        });

        await queryInterface.addColumn('Hotels', 'has_wifi', {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        });

        await queryInterface.addColumn('Hotels', 'has_pool', {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        });

        await queryInterface.addColumn('Hotels', 'has_restaurant', {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        });

        await queryInterface.addColumn('Hotels', 'has_gym', {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        });

        await queryInterface.addColumn('Hotels', 'has_spa', {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        });

        await queryInterface.addColumn('Hotels', 'allows_pets', {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        });

        await queryInterface.addColumn('Hotels', 'is_smoking_allowed', {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        });

        await queryInterface.addColumn('Hotels', 'status', {
            type: Sequelize.ENUM('pending', 'approved', 'rejected'),
            defaultValue: 'pending'
        });

        await queryInterface.addColumn('Hotels', 'approved_by', {
            type: Sequelize.INTEGER.UNSIGNED,
            allowNull: true
        });

        await queryInterface.addColumn('Hotels', 'approved_at', {
            type: Sequelize.DATE,
            allowNull: true
        });

        await queryInterface.addColumn('Hotels', 'approval_note', {
            type: Sequelize.TEXT,
            allowNull: true
        });

        // Add missing room_type field to Rooms table
        await queryInterface.addColumn('Rooms', 'room_type', {
            type: Sequelize.STRING,
            allowNull: true
        });
    },

    down: async (queryInterface, Sequelize) => {
        // Revert all changes
        await queryInterface.removeColumn('Rooms', 'room_type');
        await queryInterface.removeColumn('Hotels', 'approval_note');
        await queryInterface.removeColumn('Hotels', 'approved_at');
        await queryInterface.removeColumn('Hotels', 'approved_by');
        await queryInterface.removeColumn('Hotels', 'status');
        await queryInterface.removeColumn('Hotels', 'is_smoking_allowed');
        await queryInterface.removeColumn('Hotels', 'allows_pets');
        await queryInterface.removeColumn('Hotels', 'has_spa');
        await queryInterface.removeColumn('Hotels', 'has_gym');
        await queryInterface.removeColumn('Hotels', 'has_restaurant');
        await queryInterface.removeColumn('Hotels', 'has_pool');
        await queryInterface.removeColumn('Hotels', 'has_wifi');
        await queryInterface.removeColumn('Hotels', 'has_parking');
        await queryInterface.removeColumn('Hotels', 'has_breakfast');
        await queryInterface.removeColumn('Hotels', 'public_transport');
        await queryInterface.removeColumn('Hotels', 'nearby_attractions');
        await queryInterface.removeColumn('Hotels', 'images');
    }
};
