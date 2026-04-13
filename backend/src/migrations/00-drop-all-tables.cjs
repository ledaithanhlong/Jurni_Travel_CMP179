'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Drop tables in reverse order of dependency
        await queryInterface.dropTable('Bookings', { cascade: true, force: true }).catch(() => { });
        await queryInterface.dropTable('Favorites', { cascade: true, force: true }).catch(() => { });
        await queryInterface.dropTable('Notifications', { cascade: true, force: true }).catch(() => { });
        await queryInterface.dropTable('Vouchers', { cascade: true, force: true }).catch(() => { });
        await queryInterface.dropTable('Reviews', { cascade: true, force: true }).catch(() => { });

        await queryInterface.dropTable('Rooms', { cascade: true, force: true }).catch(() => { });

        await queryInterface.dropTable('Activities', { cascade: true, force: true }).catch(() => { });
        await queryInterface.dropTable('Cars', { cascade: true, force: true }).catch(() => { });
        await queryInterface.dropTable('Flights', { cascade: true, force: true }).catch(() => { });
        await queryInterface.dropTable('Hotels', { cascade: true, force: true }).catch(() => { });

        await queryInterface.dropTable('Users', { cascade: true, force: true }).catch(() => { });
        await queryInterface.dropTable('SequelizeMeta', { cascade: true, force: true }).catch(() => { }); // Optional: clear migration history
    },

    down: async (queryInterface, Sequelize) => {
        // No down action for dropping all tables
    }
};
