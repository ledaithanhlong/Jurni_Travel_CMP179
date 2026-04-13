'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('TeamMembers', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            role: {
                type: Sequelize.STRING,
                allowNull: false
            },
            bio: {
                type: Sequelize.TEXT
            },
            initials: {
                type: Sequelize.STRING
            },
            imageUrl: {
                type: Sequelize.STRING
            },
            color: {
                type: Sequelize.STRING,
                defaultValue: 'bg-blue-500'
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });

        // Seed initial data
        await queryInterface.bulkInsert('TeamMembers', [
            {
                name: 'Nguyễn Huy Sơn',
                role: 'Co-Founder',
                bio: 'Đóng vai trò chủ chốt trong việc định hướng chiến lược và phát triển sản phẩm. Sơn mang đến tư duy đổi mới và tầm nhìn dài hạn cho Jurni.',
                initials: 'HS',
                color: 'bg-blue-500',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Lê Đại Thanh Long',
                role: 'Co-Founder',
                bio: 'Chịu trách nhiệm về kiến trúc kỹ thuật và vận hành hệ thống. Long đảm bảo Jurni luôn hoạt động mượt mà, bảo mật và hiệu quả.',
                initials: 'TL',
                color: 'bg-orange-500',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Nguyễn Khắc Minh Hiếu',
                role: 'Co-Founder',
                bio: 'Tập trung vào trải nghiệm người dùng và thiết kế giao diện. Hiếu biến những ý tưởng phức tạp thành những trải nghiệm thân thiện và đẹp mắt.',
                initials: 'MH',
                color: 'bg-indigo-500',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('TeamMembers');
    }
};
