import { Router } from 'express';
import { listUsers, updateUser, deleteUser } from '../controllers/user.controller.js';
import { clerkAuth, requireRole, syncUser } from '../middlewares/auth.js';

const router = Router();

router.get('/me', clerkAuth, syncUser, (req, res) => {
    res.json({
        success: true,
        user: req.user
    });
});

router.get('/', listUsers);
router.put('/:id', clerkAuth, requireRole('admin'), updateUser);
router.delete('/:id', clerkAuth, requireRole('admin'), deleteUser);
export default router;

