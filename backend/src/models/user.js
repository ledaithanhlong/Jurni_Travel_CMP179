export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Tên không được để trống'
        },
        len: {
          args: [2, 50],
          msg: 'Tên phải từ 2 đến 50 ký tự'
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: 'Email không hợp lệ'
        },
        notEmpty: {
          msg: 'Email không được để trống'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isStrongPassword(value) {
          if (value && value.length < 8) {
            throw new Error('Mật khẩu phải có ít nhất 8 ký tự');
          }
        }
      }
    },
    role: {
      type: DataTypes.ENUM('user', 'admin'),
      defaultValue: 'user',
      validate: {
        isIn: {
          args: [['user', 'admin']],
          msg: 'Role phải là user hoặc admin'
        }
      }
    },
    clerkId: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isValidClerkId(value) {
          if (value && typeof value !== 'string') {
            throw new Error('ClerkId phải là chuỗi');
          }
        }
      }
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isValidPhone(value) {
          if (value && !/^(\+84|84|0)(3|5|7|8|9)[0-9]{8}$/.test(value)) {
            throw new Error('Số điện thoại không hợp lệ');
          }
        }
      }
    },
    isDisable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      validate: {
        isBoolean: {
          msg: 'isDisable phải là true hoặc false'
        }
      }
    }
  }, {
    tableName: 'Users',
    timestamps: true,
    hooks: {
      beforeValidate: (user, options) => {
        // Trim whitespace cho name và email
        if (user.name) user.name = user.name.trim();
        if (user.email) user.email = user.email.trim().toLowerCase();
      }
    }
  });

  User.associate = (models) => {
    User.hasMany(models.Booking, { foreignKey: 'user_id', as: 'bookings' });
    User.hasMany(models.Notification, { foreignKey: 'user_id', as: 'notifications' });
  };

  return User;
};
