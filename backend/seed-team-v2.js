
import { Sequelize, DataTypes } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_NAME || 'traveloka_clone',
    process.env.DB_USER || 'root',
    process.env.DB_PASS || null,
    {
        host: process.env.DB_HOST || '127.0.0.1',
        dialect: 'mysql',
        logging: false
    }
);

const TeamMember = sequelize.define('TeamMember', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.STRING, allowNull: false },
    bio: { type: DataTypes.TEXT },
    initials: { type: DataTypes.STRING },
    imageUrl: { type: DataTypes.STRING },
    color: { type: DataTypes.STRING, defaultValue: 'bg-blue-500' },
    group: { type: DataTypes.STRING, defaultValue: 'staff' },
    createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
}, {
    tableName: 'TeamMembers'
});

const newMembers = [
    // Managers (First 5)
    { name: 'Nguyễn Minh Anh', role: 'Head of Operations', bio: 'Hơn 10 năm kinh nghiệm trong vận hành và quản lý dự án du lịch.', group: 'manager' },
    { name: 'Trần Quốc Bảo', role: 'Technical Lead', bio: 'Chuyên gia kiến trúc hệ thống, đảm bảo nền tảng Jurni luôn mượt mà.', group: 'manager' },
    { name: 'Lê Hoàng Nam', role: 'Product Manager', bio: 'Định hướng phát triển sản phẩm, luôn lắng nghe phản hồi từ người dùng.', group: 'manager' },
    { name: 'Phạm Thị Thu Trang', role: 'Marketing Manager', bio: 'Người kể chuyện của Jurni, mang cảm hứng du lịch đến mọi người.', group: 'manager' },
    { name: 'Võ Thanh Tùng', role: 'Sales Manager', bio: 'Xây dựng mạng lưới đối tác rộng khắp để có giá tốt nhất.', group: 'manager' },

    // Staff (Rest 10)
    { name: 'Đặng Ngọc Hân', role: 'Senior Developer', bio: 'Full-stack developer yêu thích code sạch và hiệu năng cao.', group: 'staff' },
    { name: 'Bùi Đức Long', role: 'UI/UX Designer', bio: 'Tạo nên giao diện thân thiện và trải nghiệm người dùng tuyệt vời.', group: 'staff' },
    { name: 'Nguyễn Thị Mỹ Linh', role: 'Content Writer', bio: 'Sáng tạo nội dung, chia sẻ mẹo du lịch hữu ích.', group: 'staff' },
    { name: 'Trương Gia Huy', role: 'Customer Support', bio: 'Luôn sẵn sàng hỗ trợ bạn 24/7 với nụ cười thân thiện.', group: 'staff' },
    { name: 'Phan Khánh Vy', role: 'QA Engineer', bio: 'Đảm bảo mọi tính năng hoạt động hoàn hảo trước khi ra mắt.', group: 'staff' },
    { name: 'Hồ Quang Phúc', role: 'Data Analyst', bio: 'Phân tích dữ liệu để hiểu và phục vụ khách hàng tốt hơn.', group: 'staff' },
    { name: 'Đỗ Nhật Minh', role: 'Backend Developer', bio: 'Xây dựng API mạnh mẽ và bảo mật.', group: 'staff' },
    { name: 'Lý Thanh Trúc', role: 'HR Specialist', bio: 'Tuyển dụng và chăm sóc đời sống tinh thần cho team.', group: 'staff' },
    { name: 'Vũ Anh Tuấn', role: 'Frontend Developer', bio: 'Biến thiết kế thành giao diện sống động.', group: 'staff' },
    { name: 'Cao Thị Bảo Ngọc', role: 'Accountant', bio: 'Quản lý tài chính minh bạch và hiệu quả.', group: 'staff' },
];

const colors = [
    'bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-yellow-500',
    'bg-lime-500', 'bg-green-500', 'bg-emerald-500', 'bg-teal-500',
    'bg-cyan-500', 'bg-sky-500', 'bg-indigo-500', 'bg-violet-500',
    'bg-purple-500', 'bg-fuchsia-500', 'bg-pink-500', 'bg-rose-500'
];

const getInitials = (name) => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
        return parts[0][0] + parts[parts.length - 1][0];
    }
    return name[0] + (name[1] || '');
};

const seed = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        for (const member of newMembers) {
            const initials = getInitials(member.name);
            const color = colors[Math.floor(Math.random() * colors.length)];

            await TeamMember.create({
                ...member,
                initials,
                color
            });
            console.log(`Added ${member.name}`);
        }

        console.log('Seeding completed.');
        process.exit(0);
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(1);
    }
};

seed();
