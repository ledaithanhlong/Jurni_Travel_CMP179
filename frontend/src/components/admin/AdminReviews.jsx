import React, { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function AdminReviews() {
  const { getToken } = useAuth();
  const [filter, setFilter] = useState('pending');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState(null);

  const filterOptions = useMemo(() => ([
    { id: 'pending', label: 'Chờ duyệt' },
    { id: 'approved', label: 'Đã duyệt' },
    { id: 'hidden', label: 'Đã ẩn' },
    { id: 'all', label: 'Tất cả' }
  ]), []);

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const token = await getToken();
      const res = await axios.get(`${API_URL}/reviews/admin`, {
        params: filter === 'all' ? {} : { status: filter },
        headers: { Authorization: `Bearer ${token}` }
      });
      setItems(res.data?.items || []);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError(err?.response?.data?.message || err?.response?.data?.error || 'Không thể tải danh sách đánh giá.');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [filter, getToken]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const updateStatus = useCallback(async (id, status) => {
    try {
      setUpdatingId(id);
      const token = await getToken();
      await axios.patch(`${API_URL}/reviews/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchReviews();
    } catch (err) {
      console.error('Error updating review status:', err);
      alert('Không thể cập nhật trạng thái đánh giá.');
    } finally {
      setUpdatingId(null);
    }
  }, [fetchReviews, getToken]);

  const deleteReview = useCallback(async (id) => {
    const ok = window.confirm('Xoá đánh giá này?');
    if (!ok) return;

    try {
      setUpdatingId(id);
      const token = await getToken();
      await axios.delete(`${API_URL}/reviews/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchReviews();
    } catch (err) {
      console.error('Error deleting review:', err);
      alert('Không thể xoá đánh giá.');
    } finally {
      setUpdatingId(null);
    }
  }, [fetchReviews, getToken]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />)}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Đánh giá & Bình luận</h2>
          <p className="text-sm text-gray-500 mt-1">Duyệt/ẩn/xoá nội dung review của người dùng</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {filterOptions.map(opt => (
            <button
              key={opt.id}
              onClick={() => setFilter(opt.id)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${filter === opt.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      {items.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p>Không có đánh giá nào</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((r) => (
            <div key={r.id} className="rounded-2xl border border-gray-200 bg-white p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                      {r.service_type}#{r.service_id}
                    </span>
                    <span className="text-xs text-gray-400">Booking #{r.booking_id}</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${r.status === 'approved'
                      ? 'bg-green-100 text-green-700'
                      : r.status === 'hidden'
                        ? 'bg-gray-200 text-gray-700'
                        : 'bg-orange-100 text-orange-700'
                      }`}>
                      {r.status === 'approved' ? 'Đã duyệt' : r.status === 'hidden' ? 'Đã ẩn' : 'Chờ duyệt'}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(r.createdAt).toLocaleString('vi-VN')}
                    </span>
                  </div>
                  <p className="font-bold text-gray-900 mt-2">
                    {r.user?.name || 'Người dùng'} <span className="text-sm font-normal text-gray-500">{r.user?.email ? `(${r.user.email})` : ''}</span>
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    {[1, 2, 3, 4, 5].map(v => (
                      <span key={v} className={v <= Number(r.rating) ? 'text-yellow-500' : 'text-gray-300'}>★</span>
                    ))}
                    <span className="ml-2 text-sm text-gray-600">{Number(r.rating)}/5</span>
                  </div>
                  {r.comment && (
                    <p className="text-gray-700 mt-3 whitespace-pre-wrap">{r.comment}</p>
                  )}
                </div>

                <div className="flex-shrink-0 flex flex-col gap-2">
                  <button
                    onClick={() => updateStatus(r.id, 'approved')}
                    disabled={updatingId === r.id}
                    className="rounded-lg bg-green-600 px-4 py-2 text-xs font-semibold text-white hover:bg-green-700 transition disabled:opacity-60"
                  >
                    Duyệt
                  </button>
                  <button
                    onClick={() => updateStatus(r.id, 'hidden')}
                    disabled={updatingId === r.id}
                    className="rounded-lg bg-gray-700 px-4 py-2 text-xs font-semibold text-white hover:bg-gray-800 transition disabled:opacity-60"
                  >
                    Ẩn
                  </button>
                  <button
                    onClick={() => updateStatus(r.id, 'pending')}
                    disabled={updatingId === r.id}
                    className="rounded-lg bg-orange-600 px-4 py-2 text-xs font-semibold text-white hover:bg-orange-700 transition disabled:opacity-60"
                  >
                    Chờ duyệt
                  </button>
                  <button
                    onClick={() => deleteReview(r.id)}
                    disabled={updatingId === r.id}
                    className="rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700 transition disabled:opacity-60"
                  >
                    Xoá
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
