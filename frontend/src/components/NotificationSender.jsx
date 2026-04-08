import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function NotificationSender() {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [actionUrl, setActionUrl] = useState('');
    const [broadcast, setBroadcast] = useState(true);
    const [userId, setUserId] = useState('');
    const [sending, setSending] = useState(false);
    const [result, setResult] = useState(null);
    const { getToken } = useAuth();

    const handleSend = async (e) => {
        e.preventDefault();

        if (!title || !message) {
            alert('Vui lòng nhập tiêu đề và nội dung thông báo');
            return;
        }

        if (!broadcast && !userId) {
            alert('Vui lòng nhập ID người dùng hoặc chọn gửi cho tất cả');
            return;
        }

        setSending(true);
        setResult(null);

        try {
            const token = await getToken();
            const payload = {
                title,
                message,
                action_url: actionUrl || undefined,
                broadcast,
            };

            if (!broadcast) {
                payload.user_id = parseInt(userId);
            }

            const res = await axios.post(`${API}/notifications/send`, payload, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setResult({ success: true, data: res.data });

            // Reset form
            setTitle('');
            setMessage('');
            setActionUrl('');
            setUserId('');
        } catch (err) {
            setResult({
                success: false,
                error: err.response?.data?.error || 'Không thể gửi thông báo. Vui lòng thử lại.'
            });
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="bg-white rounded-3xl shadow-lg border-2 border-blue-100 p-6">
            <h2 className="text-2xl font-bold text-blue-900 mb-6">Gửi thông báo</h2>

            <form onSubmit={handleSend} className="space-y-6">
                {/* Broadcast Toggle */}
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
                    <input
                        type="checkbox"
                        id="broadcast"
                        checked={broadcast}
                        onChange={(e) => setBroadcast(e.target.checked)}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <label htmlFor="broadcast" className="font-semibold text-blue-900 cursor-pointer">
                        Gửi cho tất cả người dùng
                    </label>
                </div>

                {/* User ID (if not broadcast) */}
                {!broadcast && (
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            ID người dùng
                        </label>
                        <input
                            type="number"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            placeholder="Nhập ID người dùng"
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
                        />
                    </div>
                )}

                {/* Title */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Tiêu đề <span className="text-rose-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Ví dụ: Ưu đãi đặc biệt"
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
                        required
                    />
                </div>

                {/* Message */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Nội dung <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Nhập nội dung thông báo..."
                        rows={4}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none resize-none"
                        required
                    />
                </div>

                {/* Action URL (optional) */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Link hành động (tùy chọn)
                    </label>
                    <input
                        type="url"
                        value={actionUrl}
                        onChange={(e) => setActionUrl(e.target.value)}
                        placeholder="https://example.com/promotion"
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                        Người dùng sẽ thấy nút "Xem chi tiết" nếu bạn cung cấp link này
                    </p>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={sending}
                    className="w-full bg-gradient-to-r from-blue-600 to-sky-600 text-white py-4 rounded-xl font-bold hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {sending ? 'Đang gửi...' : broadcast ? 'Gửi cho tất cả' : 'Gửi thông báo'}
                </button>
            </form>

            {/* Result Message */}
            {result && (
                <div className={`mt-6 p-4 rounded-xl ${result.success ? 'bg-green-50 border-2 border-green-200' : 'bg-rose-50 border-2 border-rose-200'}`}>
                    {result.success ? (
                        <div>
                            <p className="font-semibold text-green-900">✓ Gửi thành báo thành công!</p>
                            {result.data.count && (
                                <p className="text-sm text-green-700 mt-1">
                                    Đã gửi {result.data.count} thông báo
                                </p>
                            )}
                        </div>
                    ) : (
                        <p className="font-semibold text-rose-900">✗ {result.error}</p>
                    )}
                </div>
            )}
        </div>
    );
}
