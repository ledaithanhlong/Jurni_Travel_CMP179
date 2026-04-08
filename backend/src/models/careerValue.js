export default (sequelize, DataTypes) => {
    const CareerValue = sequelize.define('CareerValue', {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        image_url: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        image_style: {
            type: DataTypes.JSON,
            allowNull: true,
        },
        order: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        }
    }, {
        tableName: 'CareerValues',
        timestamps: true,
    });

    return CareerValue;
};
