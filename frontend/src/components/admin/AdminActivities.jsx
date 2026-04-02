import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const UPLOAD_API = `${API}/upload`;

const CATEGORIES = [
  { value: 'Văn hóa & Lịch sử', icon: '🏛️', label: 'Văn hóa & Lịch sử' },
  { value: 'Thiên nhiên & Du lịch', icon: '🌴', label: 'Thiên nhiên & Du lịch' },
  { value: 'Giải trí & Vui chơi', icon: '🎢', label: 'Giải trí & Vui chơi' },
  { value: 'Thể thao & Mạo hiểm', icon: '🏄', label: 'Thể thao & Mạo hiểm' }
];

const emptyForm = {
  name: '',
  location: '',
  price: '',
  duration: '',
  category: '',
  description: '',
  image_url: '',
  highlights: [],
  includes: [],
  meeting_point: '',
  policies: {
    cancel: '',
    change: '',
    weather: '',
    children: ''
  }
};

export default function AdminActivities() {
  const { getToken } = useAuth();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState(emptyForm);

  // Dynamic lists inputs
  const [newHighlight, setNewHighlight] = useState('');
  const [newInclude, setNewInclude] = useState('');

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    try {
      const res = await axios.get(`${API}/activities`);
      setActivities(res.data || []);
    } catch (error) {
      console.error('Error loading activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const token = await getToken();
      const formData = new FormData();
      formData.append('file', file);

      const res = await axios.post(UPLOAD_API, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (res.data.url) {
        setForm(prev => ({ ...prev, image_url: res.data.url }));
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Lỗi khi upload hình ảnh');
    } finally {
      setUploading(false);
    }
  };

  const addHighlight = () => {
    if (newHighlight.trim()) {
      setForm(prev => ({
        ...prev,
        highlights: [...prev.highlights, newHighlight.trim()]
      }));
      setNewHighlight('');
    }
  };

  const removeHighlight = (index) => {
    setForm(prev => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index)
    }));
  };

  const addInclude = () => {
    if (newInclude.trim()) {
      setForm(prev => ({
        ...prev,
        includes: [...prev.includes, newInclude.trim()]
      }));
      setNewInclude('');
    }
  };

  const removeInclude = (index) => {
    setForm(prev => ({
      ...prev,
      includes: prev.includes.filter((_, i) => i !== index)
    }));
  };

  const updatePolicy = (field, value) => {
    setForm(prev => ({
      ...prev,
      policies: {
        ...prev.policies,
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = await getToken();

      if (!form.name || !form.location || !form.price) {
        alert('Vui lòng nhập đủ thông tin bắt buộc!');
        return;
      }

      const data = {
        name: form.name,
        location: form.location,
        price: Number(form.price),
        duration: form.duration || null,
        category: form.category || null,
        description: form.description || null,
        image_url: form.image_url || null,
        includes: form.includes.length > 0 ? form.includes : null,
        meeting_point: form.meeting_point || null,
        policies: Object.values(form.policies).some(v => v) ? form.policies : null
      };

      if (editing) {
        await axios.put(`${API}/activities/${editing}`, data, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Cập nhật thành công!');
      } else {
        await axios.post(`${API}/activities`, data, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Tạo thành công!');
      }

      setShowForm(false);
      setEditing(null);
      setForm(emptyForm);
      loadActivities();
    } catch (error) {
      console.error('Error saving activity:', error);
      alert(error.response?.data?.error || 'Lỗi khi lưu hoạt động');
    }
  };

  const handleEdit = (activity) => {
    setEditing(activity.id);
    setForm({
      name: activity.name || '',
      location: activity.location || '',
      price: activity.price || '',
      duration: activity.duration || '',
      category: activity.category || '',
      description: activity.description || '',
      image_url: activity.image_url || '',
      highlights: Array.isArray(activity.highlights) ? activity.highlights : [],
      includes: Array.isArray(activity.includes) ? activity.includes : [],
      meeting_point: activity.meeting_point || '',
      policies: activity.policies || {
        cancel: '',
        change: '',
        weather: '',
        children: ''
      }
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Bạn có chắc chắn muốn xóa hoạt động này?')) return;
    try {
      const token = await getToken();
      await axios.delete(`${API}/activities/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      loadActivities();
    } catch (error) {
      console.error('Error deleting activity:', error);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price || 0);
  };

  if (loading) return <div className="text-center py-8">Đang tải...</div>;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-sky-600 text-white p-6 rounded-2xl shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Quản lý Hoạt động & Tour</h2>
            <p className="text-white/80 mt-1">Tổng số: {activities.length} hoạt động</p>
          </div>
          <button
            onClick={() => {
              setShowForm(true);
              setEditing(null);
              setForm(emptyForm);
            }}
            className="bg-white text-blue-600 px-5 py-2 rounded-full font-semibold hover:bg-blue-50 transition"
          >
            + Thêm hoạt động
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow border border-gray-100">
        {showForm && (
          <div className="p-6 bg-white rounded-2xl shadow border border-gray-100 mb-6 max-h-[85vh] overflow-y-auto">
            <h3 className="font-semibold text-xl mb-6">{editing ? 'Cập nhật hoạt động' : 'Thêm hoạt động mới'}</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="border-b pb-6">
                <h4 className="font-bold text-lg mb-4">📋 Thông tin cơ bản</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tên hoạt động *</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2"
                      placeholder="Tour Chùa Hương - Bái Đính"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Địa điểm *</label>
                    <input
                      type="text"
                      value={form.location}
                      onChange={(e) => setForm({ ...form, location: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2"
                      placeholder="Ninh Bình"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Giá (VNĐ/người) *</label>
                    <input
                      type="number"
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2"
                      required
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Thời gian</label>
                    <input
                      type="text"
                      value={form.duration}
                      onChange={(e) => setForm({ ...form, duration: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2"
                      placeholder="Cả ngày, 3 giờ, 2N1Đ..."
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2"
                    >
                      <option value="">- Chọn danh mục -</option>
                      {CATEGORIES.map(cat => (
                        <option key={cat.value} value={cat.value}>
                          {cat.icon} {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Image */}
              <div className="border-b pb-6">
                <h4 className="font-bold text-lg mb-4">🖼️ Hình ảnh</h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Upload file</label>
                    <input
                      type="file"
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="w-full border rounded-lg px-3 py-2"
                      disabled={uploading}
                    />
                    {uploading && <p className="text-xs text-blue-600 mt-1">Đang upload...</p>}
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Hoặc nhập URL</label>
                    <input
                      type="url"
                      value={form.image_url}
                      onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  {form.image_url && (
                    <img src={form.image_url} alt="Preview" className="mt-2 h-32 w-auto object-contain rounded border" />
                  )}
                </div>
              </div>

              {/* Highlights */}
              <div className="border-b pb-6">
                <h4 className="font-bold text-lg mb-4">✨ Điểm nổi bật</h4>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newHighlight}
                    onChange={(e) => setNewHighlight(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addHighlight())}
                    className="flex-1 border rounded-lg px-3 py-2"
                    placeholder="VD: Tham quan chùa Bái Đính"
                  />
                  <button
                    type="button"
                    onClick={addHighlight}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                  >
                    Thêm
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {form.highlights.map((highlight, idx) => (
                    <span key={idx} className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                      ✨ {highlight}
                      <button type="button" onClick={() => removeHighlight(idx)} className="text-orange-600 hover:text-orange-800 font-bold">×</button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Inclusions */}
              <div className="border-b pb-6">
                <h4 className="font-bold text-lg mb-4">✅ Bao gồm</h4>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newInclude}
                    onChange={(e) => setNewInclude(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInclude())}
                    className="flex-1 border rounded-lg px-3 py-2"
                    placeholder="VD: Xe du lịch đưa đón"
                  />
                  <button
                    type="button"
                    onClick={addInclude}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                  >
                    Thêm
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {form.includes.map((include, idx) => (
                    <span key={idx} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                      ✓ {include}
                      <button type="button" onClick={() => removeInclude(idx)} className="text-green-600 hover:text-green-800 font-bold">×</button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Meeting Point */}
              <div className="border-b pb-6">
                <h4 className="font-bold text-lg mb-4">📍 Điểm hẹn</h4>
                <input
                  type="text"
                  value={form.meeting_point}
                  onChange={(e) => setForm({ ...form, meeting_point: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="123 Đường ABC, Quận 1, TP.HCM"
                />
              </div>

              {/* Policies */}
              <div className="border-b pb-6">
                <h4 className="font-bold text-lg mb-4">📜 Chính sách</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hủy tour</label>
                    <textarea
                      value={form.policies.cancel}
                      onChange={(e) => updatePolicy('cancel', e.target.value)}
                      className="w-full border rounded-lg px-3 py-2"
                      rows={2}
                      placeholder="Miễn phí hủy trước 72h..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Đổi ngày</label>
                    <textarea
                      value={form.policies.change}
                      onChange={(e) => updatePolicy('change', e.target.value)}
                      className="w-full border rounded-lg px-3 py-2"
                      rows={2}
                      placeholder="Có thể đổi trước 48h..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Thời tiết</label>
                    <textarea
                      value={form.policies.weather}
                      onChange={(e) => updatePolicy('weather', e.target.value)}
                      className="w-full border rounded-lg px-3 py-2"
                      rows={2}
                      placeholder="Hoàn tiền nếu hủy do thời tiết..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Trẻ em</label>
                    <textarea
                      value={form.policies.children}
                      onChange={(e) => updatePolicy('children', e.target.value)}
                      className="w-full border rounded-lg px-3 py-2"
                      rows={2}
                      placeholder="Dưới 5 tuổi miễn phí..."
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="font-bold text-lg mb-4">📝 Mô tả chi tiết</h4>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                  rows={4}
                  placeholder="Mô tả chi tiết về hoạt động..."
                />
              </div>

              <div className="flex gap-2 pt-4 border-t">
                <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
                  {editing ? 'Lưu thay đổi' : 'Tạo mới'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditing(null);
                    setForm(emptyForm);
                  }}
                  className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Activities Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left">Hoạt động</th>
                <th className="px-6 py-3 text-left">Địa điểm</th>
                <th className="px-6 py-3 text-left">Thời gian</th>
                <th className="px-6 py-3 text-left">Danh mục</th>
                <th className="px-6 py-3 text-left">Giá</th>
                <th className="px-6 py-3 text-left">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {activities.map((activity) => (
                <tr key={activity.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {activity.image_url && (
                        <img src={activity.image_url} alt={activity.name} className="w-16 h-16 object-cover rounded" />
                      )}
                      <div>
                        <div className="font-semibold">{activity.name}</div>
                        {activity.highlights && activity.highlights.length > 0 && (
                          <div className="text-xs text-gray-500">✨ {activity.highlights.length} điểm nổi bật</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{activity.location}</td>
                  <td className="px-6 py-4">
                    {activity.duration && (
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">{activity.duration}</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {activity.category && (
                      <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">{activity.category}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-orange-600 font-bold">
                    {formatPrice(activity.price)} đ
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => handleEdit(activity)} className="text-blue-600 mr-3 hover:text-blue-800">Sửa</button>
                    <button onClick={() => handleDelete(activity.id)} className="text-red-500 hover:text-red-700">Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
