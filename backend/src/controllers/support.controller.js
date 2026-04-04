import db from '../models/index.js';

// POST /api/support-requests — Khách gửi yêu cầu hỗ trợ
export async function createRequest(req, res) {
    try {
        const { name, email, content } = req.body;

        if (!name || !email || !content) {
            return res.status(400).json({ success: false, error: 'Vui lòng điền đầy đủ thông tin.' });
        }

        const request = await db.SupportRequest.create({ name, email, content });

        res.status(201).json({ success: true, request });
    } catch (error) {
        console.error('Error creating support request:', error);
        res.status(500).json({ success: false, error: 'Không thể gửi yêu cầu. Vui lòng thử lại.' });
    }
}

// GET /api/support-requests — Admin lấy danh sách
export async function getRequests(req, res) {
    try {
        const { status } = req.query;
        const where = status ? { status } : {};

        const requests = await db.SupportRequest.findAll({
            where,
            order: [['created_at', 'DESC']],
        });

        res.json({ success: true, requests });
    } catch (error) {
        console.error('Error fetching support requests:', error);
        res.status(500).json({ success: false, error: 'Không thể lấy danh sách yêu cầu.' });
    }
}

// PUT /api/support-requests/:id/status — Admin đổi trạng thái
export async function updateStatus(req, res) {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['pending', 'resolved'].includes(status)) {
            return res.status(400).json({ success: false, error: 'Trạng thái không hợp lệ.' });
        }

        await db.SupportRequest.update({ status }, { where: { id } });

        res.json({ success: true, message: 'Đã cập nhật trạng thái.' });
    } catch (error) {
        console.error('Error updating support request status:', error);
        res.status(500).json({ success: false, error: 'Không thể cập nhật trạng thái.' });
    }
}
