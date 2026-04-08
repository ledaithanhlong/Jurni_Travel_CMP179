export default (sequelize, DataTypes) => {
    const GalleryImage = sequelize.define('GalleryImage', {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
        },
        url: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        caption: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        col_span: {
            type: DataTypes.INTEGER,
            defaultValue: 1, // 1 or 2
        },
        row_span: {
            type: DataTypes.INTEGER,
            defaultValue: 1, // 1 or 2
        },
        order: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        }
    }, {
        tableName: 'GalleryImages',
        timestamps: true,
    });

    return GalleryImage;
};
