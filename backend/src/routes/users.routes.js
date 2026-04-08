import { Router } from 'express';
import { deleteUser, listUsers, updateUser, enableUser, updateUserRole, getUserStats } from '../controllers/users.controller.js';
import { clerkAuth, requireRole } from '../middlewares/auth.js';
import { UpdateUserValidator, UserIdValidator, validatedResult, UpdateRoleValidator } from '../middlewares/validator.js';

const router = Router();

// GET /users - Lấy danh sách người dùng (chỉ admin)
// Query parameter: ?includeDisabled=true để bao gồm cả user bị vô hiệu hóa
router.get('/', clerkAuth, requireRole('admin'), listUsers);

// GET /users/stats - Thống kê user (chỉ admin)
router.get('/stats', clerkAuth, requireRole('admin'), getUserStats);

// PUT /users/:id - Cập nhật thông tin người dùng (chỉ admin)
router.put('/:id',
    clerkAuth,
    requireRole('admin'),
    UserIdValidator,
    UpdateUserValidator,
    validatedResult,
    updateUser
);

// PATCH /users/:id/role - Cập nhật role người dùng (chỉ admin)
router.patch('/:id/role',
    clerkAuth,
    requireRole('admin'),
    UserIdValidator,
    UpdateRoleValidator,
    validatedResult,
    updateUserRole
);

// DELETE /users/:id - Vô hiệu hóa người dùng (soft delete - chỉ admin)
router.delete('/:id',
    clerkAuth,
    requireRole('admin'),
    UserIdValidator,
    validatedResult,
    deleteUser
);

// PATCH /users/:id/enable - Kích hoạt lại người dùng (chỉ admin)
router.patch('/:id/enable',
    clerkAuth,
    requireRole('admin'),
    UserIdValidator,
    validatedResult,
    enableUser
);

export default router;

