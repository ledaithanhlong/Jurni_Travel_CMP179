export default (sequelize, DataTypes) => {
    const TeamMember = sequelize.define('TeamMember', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING, allowNull: false },
        role: { type: DataTypes.STRING, allowNull: false },
        bio: { type: DataTypes.TEXT },
        initials: { type: DataTypes.STRING },
        imageUrl: { type: DataTypes.STRING },
        color: { type: DataTypes.STRING, defaultValue: 'bg-blue-500' },
        group: { type: DataTypes.STRING, defaultValue: 'staff' }
    }, {
        tableName: 'TeamMembers',
        timestamps: true
    });

    return TeamMember;
};
