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

const TABS = [
  { id: 'basic', label: '📋 Cơ bản' },
  { id: 'itinerary', label: '🗓️ Lịch trình' },
  { id: 'pricing', label: '💰 Giá gói' },
  { id: 'gallery', label: '🖼️ Hình ảnh & Video' },
  { id: 'policy', label: '📜 Chính sách' },
  { id: 'terms', label: '📝 Điều khoản' },
];

const emptyForm = {
  name: '',
  location: '',
  price: '',
  duration: '',
  category: '',
  description: '',
  image_url: '',
  images: [],          // Album ảnh
  video_url: '',       // Link video
  highlights: [],
  includes: [],
  meeting_point: '',
  policies: { cancel: '', change: '', weather: '', children: '' },
  itinerary: [],       // [{day, title, description, activities:[]}]
  price_packages: [],  // [{name, price, min_people, max_people, includes:[]}]
  terms: '',
  notes: ''
};

// ─── helpers ────────────────────────────────────────────────────────────────
const safeJson = (val) => {
  if (!val) return null;
  if (Array.isArray(val)) return val;
  if (typeof val === 'object') return val;
  try { 
    const parsed = JSON.parse(val);
    return Array.isArray(parsed) ? parsed : null;
  } catch { return null; }
};

export default function AdminActivities() {
  const { getToken } = useAuth();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [activeTab, setActiveTab] = useState('basic');

  // Dynamic list inputs
  const [newHighlight, setNewHighlight] = useState('');
  const [newInclude, setNewInclude] = useState('');

  // Itinerary temp input
  const [newDayTitle, setNewDayTitle] = useState('');
  const [newDayDesc, setNewDayDesc] = useState('');
  const [newDayActivity, setNewDayActivity] = useState('');
  const [expandedDay, setExpandedDay] = useState(null);

  // Pricing package temp input
  const emptyPkg = { name: '', price: '', min_people: 1, max_people: 10, includes: [] };
  const [newPkg, setNewPkg] = useState(emptyPkg);
  const [newPkgInclude, setNewPkgInclude] = useState('');

  useEffect(() => { loadActivities(); }, []);

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

  const handleImagesUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    try {
      const token = await getToken();
      const uploadedUrls = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        const res = await axios.post(UPLOAD_API, formData, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
        });
        if (res.data.url) uploadedUrls.push(res.data.url);
      }
      setForm(prev => ({ ...prev, images: [...prev.images, ...uploadedUrls] }));
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Lỗi khi upload album ảnh');
    } finally {
      setUploading(false);
    }
  };

  // ── Highlight / Include helpers ────────────────────────────────────────────
  const addHighlight = () => {
    if (!newHighlight.trim()) return;
    setForm(prev => ({ ...prev, highlights: [...prev.highlights, newHighlight.trim()] }));
    setNewHighlight('');
  };
  const removeHighlight = (idx) => setForm(prev => ({ ...prev, highlights: prev.highlights.filter((_, i) => i !== idx) }));

  const addInclude = () => {
    if (!newInclude.trim()) return;
    setForm(prev => ({ ...prev, includes: [...prev.includes, newInclude.trim()] }));
    setNewInclude('');
  };
  const removeInclude = (idx) => setForm(prev => ({ ...prev, includes: prev.includes.filter((_, i) => i !== idx) }));

  const updatePolicy = (field, value) => setForm(prev => ({ ...prev, policies: { ...prev.policies, [field]: value } }));

  // ── Itinerary helpers ──────────────────────────────────────────────────────
  const addDay = () => {
    if (!newDayTitle.trim()) return;
    const newEntry = {
      day: form.itinerary.length + 1,
      title: newDayTitle.trim(),
      description: newDayDesc.trim(),
      activities: []
    };
    setForm(prev => ({ ...prev, itinerary: [...prev.itinerary, newEntry] }));
    setNewDayTitle(''); setNewDayDesc('');
    setExpandedDay(form.itinerary.length);
  };
  const removeDay = (idx) => setForm(prev => ({
    ...prev,
    itinerary: prev.itinerary.filter((_, i) => i !== idx).map((d, i) => ({ ...d, day: i + 1 }))
  }));
  const addDayActivity = (dayIdx) => {
    if (!newDayActivity.trim()) return;
    setForm(prev => {
      const updated = [...prev.itinerary];
      updated[dayIdx] = { ...updated[dayIdx], activities: [...(updated[dayIdx].activities || []), newDayActivity.trim()] };
      return { ...prev, itinerary: updated };
    });
    setNewDayActivity('');
  };
  const removeDayActivity = (dayIdx, actIdx) => setForm(prev => {
    const updated = [...prev.itinerary];
    updated[dayIdx] = { ...updated[dayIdx], activities: updated[dayIdx].activities.filter((_, i) => i !== actIdx) };
    return { ...prev, itinerary: updated };
  });

  // ── Pricing package helpers ────────────────────────────────────────────────
  const addPkgInclude = () => {
    if (!newPkgInclude.trim()) return;
    setNewPkg(prev => ({ ...prev, includes: [...prev.includes, newPkgInclude.trim()] }));
    setNewPkgInclude('');
  };
  const removePkgInclude = (idx) => setNewPkg(prev => ({ ...prev, includes: prev.includes.filter((_, i) => i !== idx) }));

  const addPackage = () => {
    if (!newPkg.name.trim() || !newPkg.price) return;
    setForm(prev => ({ ...prev, price_packages: [...prev.price_packages, { ...newPkg, price: Number(newPkg.price) }] }));
    setNewPkg(emptyPkg);
    setNewPkgInclude('');
  };
  const removePackage = (idx) => setForm(prev => ({ ...prev, price_packages: prev.price_packages.filter((_, i) => i !== idx) }));

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.location || !form.price) {
      alert('Vui lòng nhập đủ thông tin bắt buộc!');
      return;
    }
    try {
      const token = await getToken();
      const data = {
        name: form.name,
        location: form.location,
        price: Number(form.price),
        duration: form.duration || null,
        category: form.category || null,
        description: form.description || null,
        image_url: form.image_url || null,
        images: form.images.length > 0 ? form.images : null,
        video_url: form.video_url || null,
        includes: form.includes.length > 0 ? form.includes : null,
        meeting_point: form.meeting_point || null,
        policies: Object.values(form.policies).some(v => v) ? form.policies : null,
        itinerary: form.itinerary.length > 0 ? form.itinerary : null,
        price_packages: form.price_packages.length > 0 ? form.price_packages : null,
        terms: form.terms || null,
        notes: form.notes || null
      };

      if (editing) {
        await axios.put(`${API}/activities/${editing}`, data, { headers: { Authorization: `Bearer ${token}` } });
        alert('Cập nhật thành công!');
      } else {
        await axios.post(`${API}/activities`, data, { headers: { Authorization: `Bearer ${token}` } });
        alert('Tạo thành công!');
      }

      setShowForm(false); setEditing(null); setForm(emptyForm); setActiveTab('basic');
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
      images: Array.isArray(activity.images) ? activity.images : [],
      video_url: activity.video_url || '',
      highlights: Array.isArray(activity.highlights) ? activity.highlights : [],
      includes: Array.isArray(activity.includes) ? activity.includes : [],
      meeting_point: activity.meeting_point || '',
      policies: activity.policies || { cancel: '', change: '', weather: '', children: '' },
      itinerary: Array.isArray(activity.itinerary) ? activity.itinerary : [],
      price_packages: Array.isArray(activity.price_packages) ? activity.price_packages : [],
      terms: activity.terms || '',
      notes: activity.notes || ''
    });
    setActiveTab('basic');
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Bạn có chắc chắn muốn xóa hoạt động này?')) return;
    try {
      const token = await getToken();
      await axios.delete(`${API}/activities/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      loadActivities();
    } catch (error) { console.error('Error deleting activity:', error); }
  };

  const formatPrice = (price) => new Intl.NumberFormat('vi-VN').format(price || 0);

  if (loading) return <div className="text-center py-8">Đang tải...</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-sky-600 text-white p-6 rounded-2xl shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Quản lý Hoạt động & Tour</h2>
            <p className="text-white/80 mt-1">Tổng số: {activities.length} hoạt động</p>
          </div>
          <button
            onClick={() => { setShowForm(true); setEditing(null); setForm(emptyForm); setActiveTab('basic'); }}
            className="bg-white text-blue-600 px-5 py-2 rounded-full font-semibold hover:bg-blue-50 transition"
          >
            + Thêm hoạt động
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow border border-gray-100">
        {/* ── FORM ── */}
        {showForm && (
          <div className="p-6 bg-white rounded-2xl shadow border border-gray-100 mb-6 max-h-[85vh] overflow-y-auto">
            <h3 className="font-semibold text-xl mb-4">{editing ? 'Cập nhật hoạt động' : 'Thêm hoạt động mới'}</h3>

            {/* Tab Bar */}
            <div className="flex gap-1 mb-6 bg-gray-100 rounded-xl p-1 overflow-x-auto">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    activeTab === tab.id
                      ? 'bg-white text-blue-600 shadow'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* ════════ TAB: CƠ BẢN ════════ */}
              {activeTab === 'basic' && (
                <>
                  <div className="border-b pb-6">
                    <h4 className="font-bold text-lg mb-4">📋 Thông tin cơ bản</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tên hoạt động *</label>
                        <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                          className="w-full border rounded-lg px-3 py-2" placeholder="Tour Chùa Hương – Bái Đính" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Địa điểm *</label>
                        <input type="text" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })}
                          className="w-full border rounded-lg px-3 py-2" placeholder="Ninh Bình" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Giá cơ bản (VNĐ/người) *</label>
                        <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })}
                          className="w-full border rounded-lg px-3 py-2" required min="0" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Thời gian</label>
                        <input type="text" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })}
                          className="w-full border rounded-lg px-3 py-2" placeholder="Cả ngày, 3 giờ, 2N1Đ..." />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
                        <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full border rounded-lg px-3 py-2">
                          <option value="">- Chọn danh mục -</option>
                          {CATEGORIES.map(cat => <option key={cat.value} value={cat.value}>{cat.icon} {cat.label}</option>)}
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
                        <input type="file" onChange={handleImageUpload} accept="image/*" className="w-full border rounded-lg px-3 py-2" disabled={uploading} />
                        {uploading && <p className="text-xs text-blue-600 mt-1">Đang upload...</p>}
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">Hoặc nhập URL</label>
                        <input type="url" value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })}
                          className="w-full border rounded-lg px-3 py-2" placeholder="https://example.com/image.jpg" />
                      </div>
                      {form.image_url && <img src={form.image_url} alt="Preview" className="mt-2 h-32 w-auto object-contain rounded border" />}
                    </div>
                  </div>

                  {/* Highlights */}
                  <div className="border-b pb-6">
                    <h4 className="font-bold text-lg mb-4">✨ Điểm nổi bật</h4>
                    <div className="flex gap-2 mb-3">
                      <input type="text" value={newHighlight} onChange={e => setNewHighlight(e.target.value)}
                        onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addHighlight())}
                        className="flex-1 border rounded-lg px-3 py-2" placeholder="VD: Tham quan chùa Bái Đính" />
                      <button type="button" onClick={addHighlight} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">Thêm</button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {form.highlights.map((h, idx) => (
                        <span key={idx} className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                          ✨ {h}
                          <button type="button" onClick={() => removeHighlight(idx)} className="text-orange-600 hover:text-orange-800 font-bold">×</button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Inclusions */}
                  <div className="border-b pb-6">
                    <h4 className="font-bold text-lg mb-4">✅ Bao gồm</h4>
                    <div className="flex gap-2 mb-3">
                      <input type="text" value={newInclude} onChange={e => setNewInclude(e.target.value)}
                        onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addInclude())}
                        className="flex-1 border rounded-lg px-3 py-2" placeholder="VD: Xe du lịch đưa đón" />
                      <button type="button" onClick={addInclude} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">Thêm</button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {form.includes.map((item, idx) => (
                        <span key={idx} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                          ✓ {item}
                          <button type="button" onClick={() => removeInclude(idx)} className="text-green-600 hover:text-green-800 font-bold">×</button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Meeting Point */}
                  <div>
                    <h4 className="font-bold text-lg mb-4">📍 Điểm hẹn</h4>
                    <input type="text" value={form.meeting_point} onChange={e => setForm({ ...form, meeting_point: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2" placeholder="123 Đường ABC, Quận 1, TP.HCM" />
                  </div>

                  {/* Description */}
                  <div>
                    <h4 className="font-bold text-lg mb-4">📝 Mô tả chi tiết</h4>
                    <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2" rows={4} placeholder="Mô tả chi tiết về hoạt động..." />
                  </div>
                </>
              )}

              {/* ════════ TAB: LỊCH TRÌNH ════════ */}
              {activeTab === 'itinerary' && (
                <div>
                  <h4 className="font-bold text-lg mb-4">🗓️ Lịch trình theo ngày</h4>

                  {/* Add Day */}
                  <div className="bg-blue-50 rounded-xl p-4 mb-4 space-y-3">
                    <p className="text-sm font-semibold text-blue-700">Thêm ngày mới</p>
                    <div className="grid grid-cols-2 gap-3">
                      <input type="text" value={newDayTitle} onChange={e => setNewDayTitle(e.target.value)}
                        className="border rounded-lg px-3 py-2" placeholder="Tiêu đề (VD: Ngày 1 – Hà Nội – Chùa Hương)" />
                      <input type="text" value={newDayDesc} onChange={e => setNewDayDesc(e.target.value)}
                        className="border rounded-lg px-3 py-2" placeholder="Mô tả tóm tắt (tuỳ chọn)" />
                    </div>
                    <button type="button" onClick={addDay}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-semibold">
                      + Thêm ngày
                    </button>
                  </div>

                  {/* Days list */}
                  {form.itinerary.length === 0 && (
                    <p className="text-gray-400 text-sm italic text-center py-6">Chưa có ngày nào. Thêm ngày ở trên.</p>
                  )}
                  {form.itinerary.map((day, dayIdx) => (
                    <div key={dayIdx} className="border rounded-xl mb-3 overflow-hidden">
                      <div
                        className="flex items-center justify-between bg-gray-50 px-4 py-3 cursor-pointer"
                        onClick={() => setExpandedDay(expandedDay === dayIdx ? null : dayIdx)}
                      >
                        <span className="font-semibold text-gray-800">
                          <span className="inline-flex w-7 h-7 bg-blue-600 text-white text-xs rounded-full items-center justify-center mr-2">{day.day}</span>
                          {day.title}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400">{(day.activities || []).length} hoạt động</span>
                          <button type="button" onClick={e => { e.stopPropagation(); removeDay(dayIdx); }}
                            className="text-red-400 hover:text-red-600 text-lg font-bold">×</button>
                          <span className="text-gray-400">{expandedDay === dayIdx ? '▲' : '▼'}</span>
                        </div>
                      </div>
                      {expandedDay === dayIdx && (
                        <div className="p-4 space-y-3">
                          {day.description && <p className="text-sm text-gray-600 italic">{day.description}</p>}
                          <div className="space-y-1">
                            {(day.activities || []).map((act, actIdx) => (
                              <div key={actIdx} className="flex items-center gap-2 text-sm">
                                <span className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0"></span>
                                <span className="flex-1">{act}</span>
                                <button type="button" onClick={() => removeDayActivity(dayIdx, actIdx)}
                                  className="text-red-400 hover:text-red-600 font-bold">×</button>
                              </div>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <input type="text" value={newDayActivity} onChange={e => setNewDayActivity(e.target.value)}
                              onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addDayActivity(dayIdx))}
                              className="flex-1 border rounded-lg px-3 py-1.5 text-sm" placeholder="Thêm hoạt động trong ngày..." />
                            <button type="button" onClick={() => addDayActivity(dayIdx)}
                              className="bg-blue-500 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-blue-600">+ Thêm</button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* ════════ TAB: GIÁ GÓI ════════ */}
              {activeTab === 'pricing' && (
                <div>
                  <h4 className="font-bold text-lg mb-4">💰 Giá theo gói</h4>

                  {/* Add Package */}
                  <div className="bg-green-50 rounded-xl p-4 mb-4 space-y-3">
                    <p className="text-sm font-semibold text-green-700">Thêm gói giá mới</p>
                    <div className="grid grid-cols-2 gap-3">
                      <input type="text" value={newPkg.name} onChange={e => setNewPkg(p => ({ ...p, name: e.target.value }))}
                        className="border rounded-lg px-3 py-2" placeholder="Tên gói (VD: Gói Tiêu chuẩn)" />
                      <input type="number" value={newPkg.price} onChange={e => setNewPkg(p => ({ ...p, price: e.target.value }))}
                        className="border rounded-lg px-3 py-2" placeholder="Giá (VNĐ/người)" min="0" />
                      <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-600 whitespace-nowrap">Số người tối thiểu:</label>
                        <input type="number" value={newPkg.min_people} onChange={e => setNewPkg(p => ({ ...p, min_people: parseInt(e.target.value) || 1 }))}
                          className="border rounded-lg px-3 py-2 w-20" min="1" />
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-600 whitespace-nowrap">Số người tối đa:</label>
                        <input type="number" value={newPkg.max_people} onChange={e => setNewPkg(p => ({ ...p, max_people: parseInt(e.target.value) || 1 }))}
                          className="border rounded-lg px-3 py-2 w-20" min="1" />
                      </div>
                    </div>

                    {/* Package includes */}
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Bao gồm trong gói:</p>
                      <div className="flex gap-2 mb-2">
                        <input type="text" value={newPkgInclude} onChange={e => setNewPkgInclude(e.target.value)}
                          onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addPkgInclude())}
                          className="flex-1 border rounded-lg px-3 py-1.5 text-sm" placeholder="VD: Bữa sáng, Hướng dẫn viên..." />
                        <button type="button" onClick={addPkgInclude} className="bg-green-500 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-green-600">+</button>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {newPkg.includes.map((inc, i) => (
                          <span key={i} className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs flex items-center gap-1">
                            {inc}
                            <button type="button" onClick={() => removePkgInclude(i)} className="font-bold hover:text-green-900">×</button>
                          </span>
                        ))}
                      </div>
                    </div>

                    <button type="button" onClick={addPackage}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm font-semibold">
                      + Thêm gói
                    </button>
                  </div>

                  {/* Packages list */}
                  {form.price_packages.length === 0 && (
                    <p className="text-gray-400 text-sm italic text-center py-6">Chưa có gói nào. Thêm gói ở trên.</p>
                  )}
                  <div className="grid md:grid-cols-2 gap-4">
                    {form.price_packages.map((pkg, idx) => (
                      <div key={idx} className="border-2 border-green-200 rounded-xl p-4 relative">
                        <button type="button" onClick={() => removePackage(idx)}
                          className="absolute top-3 right-3 text-red-400 hover:text-red-600 font-bold text-lg">×</button>
                        <div className="font-bold text-gray-900 mb-1">{pkg.name}</div>
                        <div className="text-2xl font-extrabold text-green-600 mb-2">{new Intl.NumberFormat('vi-VN').format(pkg.price)} đ</div>
                        <div className="text-xs text-gray-500 mb-2">{pkg.min_people}–{pkg.max_people} người</div>
                        {pkg.includes && pkg.includes.length > 0 && (
                          <ul className="space-y-1">
                            {pkg.includes.map((inc, i) => (
                              <li key={i} className="flex items-center gap-1.5 text-sm text-gray-700">
                                <span className="text-green-500">✓</span> {inc}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ════════ TAB: HÌNH ẢNH & VIDEO ════════ */}
              {activeTab === 'gallery' && (
                <div className="space-y-6">
                  <div className="border-b pb-6">
                    <h4 className="font-bold text-lg mb-4">🖼️ Album hình ảnh</h4>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="text-xs text-gray-400 mb-1 block uppercase font-bold">Thêm ảnh vào album</label>
                        <input type="file" multiple onChange={handleImagesUpload} accept="image/*" className="w-full border rounded-xl px-3 py-2 text-sm" disabled={uploading} />
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 mb-1 block uppercase font-bold">Thêm URL ảnh</label>
                        <div className="flex gap-2">
                           <input type="text" id="new_img_url" className="flex-1 border rounded-xl px-3 py-2 text-sm" placeholder="https://..." />
                           <button type="button" onClick={() => {
                             const val = document.getElementById('new_img_url').value;
                             if(val) { setForm(p => ({...p, images: [...p.images, val]})); document.getElementById('new_img_url').value = ''; }
                           }} className="bg-blue-600 text-white px-4 rounded-xl font-bold">+</button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                      {form.images && form.images.map((img, idx) => (
                        <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group border-2 border-gray-100">
                           <img src={img} className="w-full h-full object-cover" />
                           <button type="button" onClick={() => setForm(p => ({...p, images: p.images.filter((_, i) => i !== idx)}))} 
                             className="absolute top-1 right-1 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-lg">×</button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-lg mb-4">🎥 Video giới thiệu</h4>
                    <div className="bg-gray-50 p-4 rounded-2xl border-2 border-dashed border-gray-200">
                      <label className="block text-sm font-bold text-gray-700 mb-2">Đường dẫn Video (YouTube)</label>
                      <input type="text" value={form.video_url} onChange={e => setForm({ ...form, video_url: e.target.value })}
                        className="w-full border rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none" placeholder="VD: https://www.youtube.com/watch?v=... hoặc https://youtu.be/..." />
                      <p className="text-[10px] text-gray-400 mt-2 italic font-medium">* Hệ thống hỗ trợ hiển thị video trực tiếp từ YouTube.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* ════════ TAB: CHÍNH SÁCH ════════ */}
              {activeTab === 'policy' && (
                <div>
                  <h4 className="font-bold text-lg mb-4">📜 Chính sách hoàn hủy</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { key: 'cancel', label: 'Hủy tour', placeholder: 'Miễn phí hủy trước 72h...' },
                      { key: 'change', label: 'Đổi ngày', placeholder: 'Có thể đổi trước 48h...' },
                      { key: 'weather', label: 'Thời tiết', placeholder: 'Hoàn tiền nếu hủy do thời tiết...' },
                      { key: 'children', label: 'Trẻ em', placeholder: 'Dưới 5 tuổi miễn phí...' },
                    ].map(({ key, label, placeholder }) => (
                      <div key={key}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                        <textarea value={form.policies[key]} onChange={e => updatePolicy(key, e.target.value)}
                          className="w-full border rounded-lg px-3 py-2" rows={3} placeholder={placeholder} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ════════ TAB: ĐIỀU KHOẢN & LƯU Ý ════════ */}
              {activeTab === 'terms' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-bold text-lg mb-2">📄 Điều khoản & Lưu ý khách hàng</h4>
                    <p className="text-sm text-gray-500 mb-3">Nội dung điều khoản sẽ hiển thị cho khách trước khi đặt tour.</p>
                    <textarea value={form.terms} onChange={e => setForm({ ...form, terms: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2 font-mono text-sm" rows={8}
                      placeholder="1. Khách vui lòng có mặt đúng giờ...\n2. Mang theo CCCD/hộ chiếu...\n3. Không mang thức ăn có mùi mạnh..." />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-2">🗒️ Ghi chú bổ sung</h4>
                    <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2" rows={4}
                      placeholder="Lưu ý thêm dành cho khách hàng..." />
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t">
                <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
                  {editing ? 'Lưu thay đổi' : 'Tạo mới'}
                </button>
                <button type="button" onClick={() => { setShowForm(false); setEditing(null); setForm(emptyForm); setActiveTab('basic'); }}
                  className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500">
                  Hủy
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ── Activities Table ── */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left">Hoạt động</th>
                <th className="px-6 py-3 text-left">Địa điểm</th>
                <th className="px-6 py-3 text-left">Thời gian</th>
                <th className="px-6 py-3 text-left">Danh mục</th>
                <th className="px-6 py-3 text-left">Chi tiết</th>
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
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      {activity.itinerary && Array.isArray(activity.itinerary) && activity.itinerary.length > 0 && (
                        <span className="text-xs bg-sky-100 text-sky-700 px-2 py-0.5 rounded-full">🗓️ {activity.itinerary.length} ngày</span>
                      )}
                      {activity.price_packages && Array.isArray(activity.price_packages) && activity.price_packages.length > 0 && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">💰 {activity.price_packages.length} gói</span>
                      )}
                      {activity.terms && (
                        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">📄 Điều khoản</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-orange-600 font-bold">{formatPrice(activity.price)} đ</td>
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
