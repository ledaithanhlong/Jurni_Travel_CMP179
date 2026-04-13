import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import { Tags } from 'lucide-react';

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
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Premium Header */}
      <div className="flex justify-between items-center bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">
            Quản lý <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Danh mục</span>
          </h2>
          <p className="text-sm text-gray-500 mt-1">Tạo và quản lý các phân loại cho dịch vụ của bạn</p>
        </div>
        {!showForm && (
          <button
            onClick={() => { setShowForm(true); setEditing(null); setForm(emptyForm); }}
            className="group bg-blue-600 text-white pl-4 pr-6 py-3 rounded-2xl hover:bg-blue-700 transition-all duration-300 shadow-lg shadow-blue-200 flex items-center gap-2 font-bold active:scale-95"
          >
            <span className="text-xl group-hover:rotate-90 transition-transform duration-300">+</span>
            Thêm danh mục
          </button>
        )}
      </div>

      {/* Modern Form Drawer style */}
      {showForm && (
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-blue-50 relative overflow-hidden animate-in slide-in-from-top duration-300">
          <div className="absolute top-0 left-0 w-2 h-full bg-blue-600"></div>
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-black text-xl text-gray-800">{editing ? 'Sửa danh mục' : 'Khởi tạo danh mục mới'}</h3>
            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Tên danh mục</label>
              <input
                type="text"
                placeholder="VD: Cắm trại, Leo núi..."
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-inner"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Slug (Đường dẫn)</label>
              <input
                type="text"
                placeholder="cam-trai-leo-nui"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-inner"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Biểu tượng (Icon)</label>
              <input
                type="text"
                placeholder="Nhập Emoji 🏕️ hoặc URL ảnh"
                value={form.icon}
                onChange={(e) => setForm({ ...form, icon: e.target.value })}
                className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-inner"
              />
            </div>

            <div className="flex items-center gap-4 bg-gray-50 rounded-2xl px-6 self-end h-[60px] shadow-inner mb-0.5">
               <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                <span className="ml-3 text-sm font-bold text-gray-600">Hiển thị công khai</span>
              </label>
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Mô tả chi tiết</label>
              <textarea
                placeholder="Mô tả về các loại tour thuộc danh mục này..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-inner min-h-[120px]"
              />
            </div>

            <div className="md:col-span-2 flex justify-end gap-3 pt-4 border-t border-gray-50">
              <button 
                type="button" 
                onClick={() => setShowForm(false)}
                className="px-8 py-3 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 transition"
              >
                Hủy bỏ
              </button>
              <button 
                type="submit" 
                className="px-10 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition active:scale-95"
              >
                {editing ? 'Cập nhật ngay' : 'Tạo danh mục'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Premium Table Content */}
      <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Danh mục</th>
                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Đường dẫn (Slug)</th>
                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest text-center">Trạng thái</th>
                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Quản lý</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {categories.map((cat) => (
                <tr key={cat.id} className="group hover:bg-blue-50/20 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
                        {cat.icon || '📁'}
                      </div>
                      <div>
                        <div className="font-black text-gray-900 leading-none">{cat.name}</div>
                        <div className="text-xs text-gray-400 mt-1.5 line-clamp-1 max-w-[200px]">{cat.description || 'Chưa có mô tả'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="bg-gray-100 text-gray-500 px-3 py-1.5 rounded-lg text-xs font-mono">
                      {cat.slug}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex justify-center">
                      <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        cat.is_active 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${cat.is_active ? 'bg-green-600 animate-pulse' : 'bg-red-600'}`}></span>
                        {cat.is_active ? 'Đang bật' : 'Đang tắt'}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex justify-end gap-2">
                       <button 
                        onClick={() => handleEdit(cat)} 
                        className="p-3 bg-white border border-gray-100 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white hover:border-blue-600 shadow-sm transition-all active:scale-90"
                        title="Sửa"
                       >
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                       </button>
                       <button 
                        onClick={() => handleDelete(cat.id)} 
                        className="p-3 bg-white border border-gray-100 text-red-500 rounded-xl hover:bg-red-500 hover:text-white hover:border-red-500 shadow-sm transition-all active:scale-90"
                        title="Xóa"
                       >
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {categories.length === 0 && (
            <div className="p-20 text-center flex flex-col items-center">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                <Tags className="w-10 h-10 text-gray-300" />
              </div>
              <p className="text-gray-900 font-black text-xl mb-1 text-center">Danh sách trống</p>
              <p className="text-gray-400 text-sm max-w-xs mx-auto text-center">Hãy bắt đầu khởi tạo danh mục đầu tiên để phân loại các dịch vụ của bạn.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
