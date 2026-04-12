
import { Sequelize, DataTypes } from 'sequelize';
import dotenv from 'dotenv';

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
}, {
    tableName: 'TeamMembers'
});

const employees = [
    // Cấp điều hành (Executive)
    { name: 'Nguyễn Minh Anh', role: 'CEO – Giám đốc điều hành', group: 'executive', bio: 'Định hướng tầm nhìn và chiến lược phát triển toàn cầu cho Jurni.' },
    { name: 'Trần Quốc Bảo', role: 'COO – Giám đốc vận hành', group: 'executive', bio: 'Tối ưu hóa quy trình vận hành, đảm bảo hệ thống hoạt động trơn tru.' },
    { name: 'Lê Hoàng Nam', role: 'CTO – Giám đốc công nghệ', group: 'executive', bio: 'Kiến trúc sư trưởng, xây dựng nền tảng công nghệ vững chắc.' },
    { name: 'Phạm Thị Thu Trang', role: 'CFO – Giám đốc tài chính', group: 'executive', bio: 'Quản lý dòng vốn và chiến lược tài chính bền vững.' },
    { name: 'Võ Thanh Tùng', role: 'CPO – Giám đốc sản phẩm', group: 'executive', bio: 'Phát triển các dòng sản phẩm đột phá, mang lại giá trị thực.' },

    // Cấp quản lý cấp cao (Senior Management)
    { name: 'Đặng Ngọc Hân', role: 'Head of Department', group: 'senior_management', bio: 'Điều hành bộ phận phát triển thị trường và đối tác.' },
    { name: 'Bùi Đức Long', role: 'Director', group: 'senior_management', bio: 'Giám đốc khối kinh doanh, mở rộng mạng lưới khách hàng.' },
    { name: 'Nguyễn Thị Mỹ Linh', role: 'Product Manager', group: 'senior_management', bio: 'Quản lý vòng đời sản phẩm từ ý tưởng đến ra mắt.' },
    { name: 'Trương Gia Huy', role: 'Project Manager', group: 'senior_management', bio: 'Đảm bảo các dự án hoàn thành đúng tiến độ và chất lượng.' },

    // Cấp quản lý trung (Middle Management)
    { name: 'Phan Khánh Vy', role: 'Team Leader', group: 'middle_management', bio: 'Dẫn dắt đội ngũ sáng tạo nội dung và truyền thông.' },
    { name: 'Hồ Quang Phúc', role: 'Technical Lead', group: 'middle_management', bio: 'Chịu trách nhiệm về chất lượng mã nguồn và giải pháp kỹ thuật.' },
    { name: 'Đỗ Nhật Minh', role: 'Supervisor', group: 'middle_management', bio: 'Giám sát hoạt động chăm sóc khách hàng và xử lý sự cố.' },
    { name: 'Lý Thanh Trúc', role: 'Operations Manager', group: 'middle_management', bio: 'Quản lý vận hành hàng ngày tại văn phòng.' },

    // Cấp quản lý thấp (Junior Management)
    { name: 'Vũ Anh Tuấn', role: 'Senior Executive', group: 'junior_management', bio: 'Chuyên viên cao cấp, xử lý các nghiệp vụ phức tạp.' },
    { name: 'Cao Thị Bảo Ngọc', role: 'Executive', group: 'junior_management', bio: 'Chuyên viên hỗ trợ vận hành và báo cáo.' }
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
        console.log('DB Connected.');

        // Delete all except cofounders (Assuming IDs 1, 2, 3 or group='cofounder')
        // Safer to delete where group != 'cofounder'
        await TeamMember.destroy({
            where: {
                group: {
                    [Sequelize.Op.ne]: 'cofounder'
                }
            }
        });
        console.log('Cleared old employees.');

        for (const emp of employees) {
            const initials = getInitials(emp.name);
            const color = colors[Math.floor(Math.random() * colors.length)];

            await TeamMember.create({
                ...emp,
                initials,
                color
            });
            console.log(`Added ${emp.name} as ${emp.role}`);
        }

        console.log('Seeding V3 Completed.');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

seed();
