module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('Favorites', 'name', {
            type: Sequelize.STRING,
            allowNull: true,
            after: 'service_id'
        });

        await queryInterface.addColumn('Favorites', 'meta', {
            type: Sequelize.TEXT,
            allowNull: true,
            after: 'name'
        });

        await queryInterface.addColumn('Favorites', 'price', {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: true,
            after: 'meta'
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('Favorites', 'name');
        await queryInterface.removeColumn('Favorites', 'meta');
        await queryInterface.removeColumn('Favorites', 'price');
    }
};
