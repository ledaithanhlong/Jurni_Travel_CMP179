import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const emptyForm = {
  name: '',
  slug: '',
  icon: '',
  description: '',
  is_active: true
};

export default function AdminCategories() {
  const { getToken } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const res = await axios.get(`${API}/categories`);
      setCategories(res.data || []);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = await getToken();
      if (editing) {
        await axios.put(`${API}/categories/${editing}`, form, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`${API}/categories`, form, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setShowForm(false);
      setEditing(null);
      setForm(emptyForm);
      loadCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Lỗi khi lưu danh mục');
    }
  };

  const handleEdit = (category) => {
    setEditing(category.id);
    setForm({
      name: category.name,
      slug: category.slug,
      icon: category.icon || '',
      description: category.description || '',
      is_active: category.is_active
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Bạn có chắc chắn muốn xóa danh mục này?')) return;
    try {
      const token = await getToken();
      await axios.delete(`${API}/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      loadCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  if (loading) return <div className="p-8 text-center">Đang tải...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Quản lý Danh mục</h2>
          <p className="text-sm text-gray-500">Phân loại tour và hoạt động du lịch</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditing(null); setForm(emptyForm); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
        >
          + Thêm danh mục
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold mb-4">{editing ? 'Sửa danh mục' : 'Thêm danh mục mới'}</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Tên danh mục</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Slug</label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Icon (Emoji hoặc URL)</label>
              <input
                type="text"
                value={form.icon}
                onChange={(e) => setForm({ ...form, icon: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            <div className="flex items-end pb-3">
               <label className="flex items-center gap-2 cursor-pointer">
                 <input
                   type="checkbox"
                   checked={form.is_active}
                   onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                 />
                 <span className="text-sm">Đang hoạt động</span>
               </label>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Mô tả</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
                rows="3"
              />
            </div>
            <div className="col-span-2 flex gap-2">
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                Lưu
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left">Danh mục</th>
              <th className="px-6 py-3 text-left">Slug</th>
              <th className="px-6 py-3 text-left">Trạng thái</th>
              <th className="px-6 py-3 text-left">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {categories.map((cat) => (
              <tr key={cat.id}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{cat.icon || '📁'}</span>
                    <div className="font-semibold text-gray-800">{cat.name}</div>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-500">{cat.slug}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${cat.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {cat.is_active ? 'Hoạt động' : 'Tắt'}
                  </span>
                </td>
                <td className="px-6 py-4">
                   <button onClick={() => handleEdit(cat)} className="text-blue-600 mr-4 hover:underline">Sửa</button>
                   <button onClick={() => handleDelete(cat.id)} className="text-red-500 hover:underline">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {categories.length === 0 && (
          <div className="p-8 text-center text-gray-500">Chưa có danh mục nào.</div>
        )}
      </div>
    </div>
  );
}
