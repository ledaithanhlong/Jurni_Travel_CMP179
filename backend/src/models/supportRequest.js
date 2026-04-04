export default (sequelize, DataTypes) => {
    const SupportRequest = sequelize.define('SupportRequest', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM('pending', 'resolved'),
            allowNull: false,
            defaultValue: 'pending',
        },
    }, {
        tableName: 'support_requests',
        timestamps: true,
        underscored: true,
    });

    return SupportRequest;
};
