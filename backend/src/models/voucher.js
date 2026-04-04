export default (sequelize, DataTypes) => {
  const Voucher = sequelize.define('Voucher', {
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    code: { type: DataTypes.STRING, allowNull: false, unique: true },
    discount_percent: { type: DataTypes.INTEGER },
    discount_amount: { type: DataTypes.DECIMAL(10, 2) },
    min_spend: { type: DataTypes.DECIMAL(10, 2) },
    max_discount: { type: DataTypes.DECIMAL(10, 2) },
    start_date: { type: DataTypes.DATE },
    expiry_date: { type: DataTypes.DATE },
    usage_limit: { type: DataTypes.INTEGER }
  }, {
    tableName: 'Vouchers',
    timestamps: true
  });

  return Voucher;
};
