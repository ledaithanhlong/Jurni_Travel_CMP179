import React, { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function AdminMediaLibrary() {
  const { getToken } = useAuth();
  const [category, setCategory] = useState('all');
  const [items, setItems] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const tabs = useMemo(() => ([
    { id: 'all', label: 'Tất cả' },
    { id: 'hotel', label: 'Khách sạn' },
    { id: 'car', label: 'Xe' },
    { id: 'activity', label: 'Tour/Hoạt động' },
    { id: 'flight', label: 'Chuyến bay' },
    { id: 'team', label: 'Team' },
    { id: 'other', label: 'Khác' }
  ]), []);

  const fetchMedia = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const token = await getToken();
      const res = await axios.get(`${API_URL}/media`, {
        params: { category },
        headers: { Authorization: `Bearer ${token}` }
      });
      setItems(res.data?.items || []);
      setCount(Number(res.data?.count || 0));
    } catch (err) {
      console.error('Error fetching media:', err);
      setItems([]);
      setCount(0);
      setError(err?.response?.data?.message || err?.response?.data?.error || 'Không thể tải thư viện hình ảnh.');
    } finally {
      setLoading(false);
    }
  }, [category, getToken]);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  const copyUrl = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
    }
  };

  const deleteItem = async (id) => {
    const ok = window.confirm('Xoá ảnh này khỏi thư viện?');
    if (!ok) return;
    try {
      setDeletingId(id);
      const token = await getToken();
      await axios.delete(`${API_URL}/media/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchMedia();
    } catch (err) {
      console.error('Error deleting media:', err);
      alert(err?.response?.data?.message || err?.response?.data?.error || 'Không thể xoá ảnh.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quản lý thư viện hình ảnh</h2>
          <p className="text-sm text-gray-500 mt-1">
            Tổng: {count} ảnh
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setCategory(t.id)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${category === t.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="h-44 rounded-2xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p>Chưa có ảnh nào</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((it) => (
            <div key={it.id} className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
              <div className="aspect-video bg-gray-50">
                <img
                  src={it.url}
                  alt={it.category || 'media'}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-3 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                    {(it.category || 'other').toUpperCase()}
                  </span>
                  <span className="text-xs text-gray-400">
                    {it.createdAt ? new Date(it.createdAt).toLocaleString('vi-VN') : ''}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => copyUrl(it.url)}
                    className="flex-1 rounded-lg bg-blue-50 text-blue-700 px-3 py-2 text-xs font-semibold hover:bg-blue-100 transition"
                  >
                    Copy link
                  </button>
                  <button
                    onClick={() => deleteItem(it.id)}
                    disabled={deletingId === it.id}
                    className="rounded-lg bg-red-50 text-red-700 px-3 py-2 text-xs font-semibold hover:bg-red-100 transition disabled:opacity-60"
                  >
                    {deletingId === it.id ? '...' : 'Xoá'}
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

