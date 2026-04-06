import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const serviceTypeLabel = {
  hotel: 'Khách sạn',
  flight: 'Vé máy bay',
  car: 'Thuê xe',
  activity: 'Hoạt động',
  tour: 'Tour',
  other: 'Khác'
};

export default function FavoritesPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { getToken } = useAuth();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const token = await getToken();
        const res = await axios.get(`${API}/favorites/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!mounted) return;
        setRows(res.data?.data || []);
      } catch (err) {
        if (!mounted) return;
        setError(err.response?.data?.error || 'Không thể tải danh sách yêu thích. Vui lòng thử lại sau.');
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [getToken]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-blue-100 bg-blue-50/60 px-4 py-3 text-sm text-blue-700/80">
        Đang tải danh sách yêu thích của bạn...
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
          ☆
        </div>
        <h2 className="mt-4 text-xl font-semibold text-blue-900">Danh sách yêu thích đang trống</h2>
        <p className="mt-2 text-sm text-blue-700/80">
          Thêm những địa điểm hoặc dịch vụ bạn yêu thích để theo dõi và đặt nhanh chóng hơn.
        </p>
        <a
          href="/"
          className="mt-4 inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-semibold text-white transition"
          style={{ backgroundColor: '#FF6B35' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FF8C42'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FF6B35'}
        >
          Khám phá dịch vụ
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-blue-900">Danh sách yêu thích của bạn</h1>
        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
          {rows.length} mục
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {rows.map((item) => {
          const data = item.data || {};
          const title = data.title || data.name || `Mục yêu thích #${item.serviceId}`;
          const location = data.location || '';
          const imageUrl = data.image_url || data.image || (Array.isArray(data.images) ? data.images[0] : '');

          const type = item.serviceType || 'other';
          let href = '/';
          if (type === 'hotel') href = `/hotels/${item.serviceId}`;
          if (type === 'activity') href = `/activities/${item.serviceId}`;
          if (type === 'flight') href = '/flights';
          if (type === 'car') href = '/cars';
          if (type === 'tour') href = `/activities/${item.serviceId}`;

          return (
            <div
              key={item._id}
              className="group rounded-3xl border border-blue-100 bg-white/80 p-5 shadow shadow-blue-100/40 transition hover:-translate-y-1 hover:border-orange-400 hover:shadow-lg"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="text-xs uppercase tracking-[0.3em] text-blue-500">
                    {serviceTypeLabel[type] || type}
                  </p>
                  <p className="mt-2 text-lg font-semibold text-blue-900">
                    {title}
                  </p>
                  {location ? (
                    <p className="mt-1 text-sm text-blue-700/80 line-clamp-2">
                      {location}
                    </p>
                  ) : null}
                </div>
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={title}
                    className="h-20 w-24 rounded-xl object-cover shadow-sm"
                  />
                ) : null}
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-blue-600/80">
                <span>
                  Đã lưu ngày{' '}
                  {item.createdAt ? new Date(item.createdAt).toLocaleDateString('vi-VN') : 'Không xác định'}
                </span>
                <a
                  href={href}
                  className="text-sm font-semibold text-orange-600 hover:text-orange-700 transition"
                >
                  Xem chi tiết →
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

