module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('Notifications', 'action_url', {
            type: Sequelize.STRING,
            allowNull: true,
            after: 'type'
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('Notifications', 'action_url');
    }
};
