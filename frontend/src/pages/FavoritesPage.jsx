import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const serviceTypeLabel = {
  hotel: 'Khách sạn',
  hotels: 'Khách sạn',
  flight: 'Vé máy bay',
  flights: 'Vé máy bay',
  car: 'Thuê xe',
  cars: 'Thuê xe',
  activity: 'Hoạt động',
  activities: 'Hoạt động',
};

const serviceTypeRoute = {
  hotel: 'hotels',
  flight: 'flights',
  car: 'cars',
  activity: 'activities',
};

export default function FavoritesPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { getToken } = useAuth();

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const res = await axios.get(`${API}/favorites`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRows(res.data || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Không thể tải danh sách yêu thích. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      await loadFavorites();
    })();

    return () => {
      mounted = false;
    };
  }, [getToken]);

  const handleDelete = async (id) => {
    if (!confirm('Bạn có chắc muốn xóa khỏi danh sách yêu thích?')) return;

    try {
      const token = await getToken();
      await axios.delete(`${API}/favorites/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await loadFavorites(); // Reload list
    } catch (err) {
      alert(err.response?.data?.error || 'Không thể xóa. Vui lòng thử lại.');
    }
  };

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
        {rows.map((item) => (
          <div
            key={item.id}
            className="group rounded-3xl border border-blue-100 bg-white/80 p-5 shadow shadow-blue-100/40 transition hover:-translate-y-1 hover:border-orange-400 hover:shadow-lg"
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex-1">
                <p className="text-xs uppercase tracking-[0.3em] text-blue-500">
                  {serviceTypeLabel[item.service_type] || item.service_type}
                </p>
                <p className="mt-2 text-lg font-semibold text-blue-900">
                  {item.name || `Dịch vụ #${item.service_id}`}
                </p>
                {item.meta && (
                  <p className="mt-1 text-sm text-blue-700/80 line-clamp-2">
                    {item.meta}
                  </p>
                )}
                {item.price && (
                  <p className="mt-2 text-xl font-bold" style={{ color: '#FF6B35' }}>
                    {new Intl.NumberFormat('vi-VN').format(item.price)} VND
                  </p>
                )}
              </div>
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                ID: {item.service_id}
              </span>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-blue-600/80">
              <span>
                Đã thêm ngày{' '}
                {item.created_at ? new Date(item.created_at).toLocaleDateString('vi-VN') : 'Không xác định'}
              </span>
              <div className="flex items-center gap-2">
                <a
                  href={`/${serviceTypeRoute[item.service_type] || item.service_type}/${item.service_id}`}
                  className="text-sm font-semibold text-orange-600 hover:text-orange-700 transition"
                >
                  Xem chi tiết →
                </a>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-sm font-semibold text-rose-600 hover:text-rose-700 transition"
                  title="Xóa khỏi yêu thích"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

