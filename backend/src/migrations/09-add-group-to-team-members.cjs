'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('TeamMembers', 'group', {
            type: Sequelize.STRING,
            defaultValue: 'staff',
            allowNull: false,
        });

        // Update existing members to be cofounders
        await queryInterface.sequelize.query(
            "UPDATE TeamMembers SET `group` = 'cofounder' WHERE 1=1"
        );
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('TeamMembers', 'group');
    }
};
