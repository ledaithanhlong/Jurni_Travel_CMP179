import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function NotificationsPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { getToken } = useAuth();

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const res = await axios.get(`${API}/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRows(res.data || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Không thể tải thông báo. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      await loadNotifications();
    })();

    return () => {
      mounted = false;
    };
  }, [getToken]);

  const markAsRead = async (id) => {
    try {
      const token = await getToken();
      await axios.patch(`${API}/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await loadNotifications(); // Reload to update UI
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-blue-100 bg-blue-50/60 px-4 py-3 text-sm text-blue-700/80">
        Đang tải thông báo mới nhất...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
        {error}
      </div>
    );
  }

  if (!rows.length) {
    return (
      <div className="rounded-3xl border border-blue-100 bg-white/80 p-8 text-center shadow shadow-blue-100/50">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-3xl text-blue-500">
          🔔
        </div>
        <h2 className="mt-4 text-xl font-semibold text-blue-900">Chưa có thông báo mới</h2>
        <p className="mt-2 text-sm text-blue-700/80">
          Chúng tôi sẽ gửi thông báo khi có ưu đãi, cập nhật đặt chỗ hoặc nhắc nhở quan trọng cho bạn.
        </p>
        <a
          href="/vouchers"
          className="mt-4 inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition"
        >
          Xem ưu đãi hiện có
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-blue-900">Trung tâm thông báo</h1>
        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
          {rows.filter(r => !r.is_read).length} chưa đọc / {rows.length} tổng
        </span>
      </div>

      <div className="space-y-3">
        {rows.map((item) => (
          <div
            key={item.id}
            className={`rounded-3xl border p-5 shadow transition hover:shadow-lg ${item.is_read
                ? 'border-gray-200 bg-gray-50/50'
                : 'border-blue-200 bg-white/90 shadow-blue-100/40 hover:border-orange-400'
              }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-semibold text-blue-900">{item.title || 'Thông báo từ Jurni'}</p>
                  {!item.is_read && (
                    <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                  )}
                </div>
                <p className={`mt-2 text-sm leading-relaxed ${item.is_read ? 'text-gray-600' : 'text-blue-700/80'}`}>
                  {item.message}
                </p>
              </div>
              <span className="text-xs text-blue-600/70">
                {item.created_at ? new Date(item.created_at).toLocaleString('vi-VN') : '—'}
              </span>
            </div>
            <div className="mt-3 flex items-center gap-3">
              {item.action_url && (
                <a
                  href={item.action_url}
                  className="inline-flex items-center text-sm font-semibold text-orange-600 hover:text-orange-700 transition"
                >
                  Xem chi tiết →
                </a>
              )}
              {!item.is_read && (
                <button
                  onClick={() => markAsRead(item.id)}
                  className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition"
                >
                  Đánh dấu đã đọc
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

