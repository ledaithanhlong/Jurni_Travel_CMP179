import express from 'express';
import * as supportController from '../controllers/support.controller.js';

const router = express.Router();

// Khách gửi yêu cầu hỗ trợ
router.post('/', supportController.createRequest);

// Admin: lấy danh sách yêu cầu (có thể filter ?status=pending)
router.get('/', supportController.getRequests);

// Admin: đổi trạng thái yêu cầu
router.put('/:id/status', supportController.updateStatus);

export default router;
