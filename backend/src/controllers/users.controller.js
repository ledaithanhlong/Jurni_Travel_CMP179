import db from '../models/index.js';

export const listUsers = async (req, res, next) => {
  try {
    const { includeDisabled = 'false' } = req.query;

    const whereCondition = includeDisabled === 'true' ? {} : { isDisable: false };

    const rows = await db.User.findAll({
      where: whereCondition,
      order: [['id', 'DESC']],
      attributes: ['id', 'name', 'email', 'role', 'isDisable', 'createdAt', 'updatedAt']
    });
    res.json(rows);
  } catch (e) {
    console.error('Error in listUsers:', e);
    next(e);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const row = await db.User.findByPk(req.params.id);
    if (!row) return res.status(404).json({ error: 'Not found' });
    await row.update(req.body);
    res.json(row);
  } catch (e) { next(e); }
};

export const deleteUser = async (req, res, next) => {
  try {
    const row = await db.User.findByPk(req.params.id);
    if (!row) return res.status(404).json({ error: 'Không tìm thấy người dùng' });

    if (row.isDisable) {
      return res.status(400).json({ error: 'Người dùng đã bị vô hiệu hóa' });
    }

    await row.update({ isDisable: true });
    res.json({
      success: true,
      message: 'Vô hiệu hóa người dùng thành công',
      user: {
        id: row.id,
        name: row.name,
        email: row.email,
        isDisable: row.isDisable
      }
    });
  } catch (e) {
    console.error('Error in deleteUser:', e);
    next(e);
  }
};

export const enableUser = async (req, res, next) => {
  try {
    const row = await db.User.findByPk(req.params.id);
    if (!row) return res.status(404).json({ error: 'Không tìm thấy người dùng' });

    if (!row.isDisable) {
      return res.status(400).json({ error: 'Người dùng đang hoạt động' });
    }

    await row.update({ isDisable: false });
    res.json({
      success: true,
      message: 'Kích hoạt lại người dùng thành công',
      user: {
        id: row.id,
        name: row.name,
        email: row.email,
        isDisable: row.isDisable
      }
    });
  } catch (e) {
    console.error('Error in enableUser:', e);
    next(e);
  }
};

// Thêm function để quản lý role user
export const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    const userId = req.params.id;

    // Validation role
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({
        error: 'Invalid role',
        message: 'Role phải là "user" hoặc "admin"'
      });
    }

    const user = await db.User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'Không tìm thấy người dùng' });
    }

    // Không cho phép tự thay đổi role của chính mình
    if (req.user && req.user.id === parseInt(userId)) {
      return res.status(400).json({
        error: 'Cannot change own role',
        message: 'Bạn không thể thay đổi role của chính mình'
      });
    }

    const oldRole = user.role;
    await user.update({ role });

    console.log(`Role updated for user ${user.email}: ${oldRole} -> ${role}`);

    res.json({
      success: true,
      message: `Đã cập nhật role từ "${oldRole}" thành "${role}"`,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        updatedAt: user.updatedAt
      }
    });
  } catch (e) {
    console.error('Error in updateUserRole:', e);
    next(e);
  }
};

// Function để lấy thống kê user theo role
export const getUserStats = async (req, res, next) => {
  try {
    const stats = await db.User.findAll({
      attributes: [
        'role',
        'isDisable',
        [db.sequelize.fn('COUNT', '*'), 'count']
      ],
      group: ['role', 'isDisable'],
      raw: true
    });

    const summary = {
      total: 0,
      active: 0,
      disabled: 0,
      admins: 0,
      users: 0
    };

    stats.forEach(stat => {
      const count = parseInt(stat.count);
      summary.total += count;

      if (stat.isDisable) {
        summary.disabled += count;
      } else {
        summary.active += count;
        if (stat.role === 'admin') {
          summary.admins += count;
        } else {
          summary.users += count;
        }
      }
    });

    res.json({
      summary,
      details: stats
    });
  } catch (e) {
    console.error('Error in getUserStats:', e);
    next(e);
  }
};
