import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const UPLOAD_API = `${API}/upload`;

const emptyForm = {
  name: '',
  location: '',
  price: '',
  duration: '',
  categoryIds: [],
  description: '',
  image_url: '',
  media: [],
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

const normalizeMedia = (items = []) => (
  (Array.isArray(items) ? items : []).map((item, index) => ({
    id: item.id,
    tempId: item.tempId || `media-${item.id || index}-${Date.now()}`,
    type: item.type || 'image',
    url: item.url || '',
    public_id: item.public_id || null,
    caption: item.caption || '',
    is_thumbnail: Boolean(item.is_thumbnail),
    sort_order: Number.isInteger(item.sort_order) ? item.sort_order : index
  }))
);

const getPrimaryMedia = (activity) => {
  const media = Array.isArray(activity?.media) ? [...activity.media] : [];
  media.sort((a, b) => {
    if (Boolean(b.is_thumbnail) !== Boolean(a.is_thumbnail)) {
      return Number(Boolean(b.is_thumbnail)) - Number(Boolean(a.is_thumbnail));
    }
    return (a.sort_order ?? 0) - (b.sort_order ?? 0);
  });

  return media[0] || null;
};

const getPrimaryImageUrl = (activity) => {
  const primaryMedia = getPrimaryMedia(activity);
  if (primaryMedia?.type === 'image' && primaryMedia.url) return primaryMedia.url;
  return activity?.image_url || '';
};

export default function AdminActivities() {
  const { getToken } = useAuth();
  const [activities, setActivities] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [initialMedia, setInitialMedia] = useState([]);

  // Dynamic lists inputs
  const [newHighlight, setNewHighlight] = useState('');
  const [newInclude, setNewInclude] = useState('');

  useEffect(() => {
    loadActivities();
    loadCategories();
  }, []);

  const loadActivities = async () => {
    try {
      const res = await axios.get(`${API}/activities`);
      setActivities((res.data || []).map((activity) => ({
        ...activity,
        media: normalizeMedia(activity.media)
      })));
    } catch (error) {
      console.error('Error loading activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const res = await axios.get(`${API}/categories`);
      setAvailableCategories(res.data || []);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handleMediaUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const token = await getToken();
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', 'activity');
      formData.append('entity_type', 'activity');
      if (editing) formData.append('entity_id', String(editing));

      const res = await axios.post(UPLOAD_API, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (res.data.url) {
        const type = file.type.startsWith('video/') ? 'video' : 'image';
        setForm(prev => {
          const currentMedia = normalizeMedia(prev.media);
          const mediaItem = {
            tempId: `media-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            type,
            url: res.data.url,
            public_id: res.data.public_id || null,
            caption: '',
            is_thumbnail: currentMedia.length === 0,
            sort_order: currentMedia.length
          };

          return {
            ...prev,
            image_url: type === 'image' && !prev.image_url ? res.data.url : prev.image_url,
            media: [...currentMedia, mediaItem]
          };
        });
      }
    } catch (error) {
      console.error('Error uploading media:', error);
      alert('Lỗi khi upload media');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const updateMediaItem = (tempId, field, value) => {
    setForm(prev => ({
      ...prev,
      media: normalizeMedia(prev.media).map((item) => (
        item.tempId === tempId ? { ...item, [field]: value } : item
      ))
    }));
  };

  const setMediaAsThumbnail = (tempId) => {
    setForm(prev => ({
      ...prev,
      image_url: '',
      media: normalizeMedia(prev.media).map((item) => ({
        ...item,
        is_thumbnail: item.tempId === tempId
      }))
    }));
  };

  const removeMediaItem = (tempId) => {
    setForm(prev => {
      const nextMedia = normalizeMedia(prev.media)
        .filter((item) => item.tempId !== tempId)
        .map((item, index) => ({ ...item, sort_order: index }));

      if (nextMedia.length > 0 && !nextMedia.some((item) => item.is_thumbnail)) {
        nextMedia[0].is_thumbnail = true;
      }

      return {
        ...prev,
        image_url: nextMedia[0]?.type === 'image' ? nextMedia[0].url : '',
        media: nextMedia
      };
    });
  };

  const moveMediaItem = (tempId, direction) => {
    setForm(prev => {
      const items = [...normalizeMedia(prev.media)];
      const index = items.findIndex((item) => item.tempId === tempId);
      if (index === -1) return prev;

      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= items.length) return prev;

      [items[index], items[targetIndex]] = [items[targetIndex], items[index]];

      return {
        ...prev,
        media: items.map((item, orderIndex) => ({ ...item, sort_order: orderIndex }))
      };
    });
  };

  const syncActivityMedia = async (activityId, token) => {
    const currentMedia = normalizeMedia(form.media);
    const removedMedia = initialMedia.filter(
      (item) => item.id && !currentMedia.some((current) => current.id === item.id)
    );

    await Promise.all(
      removedMedia.map((item) => axios.delete(`${API}/activities/${activityId}/media/${item.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      }))
    );

    const savedMedia = [];
    for (let index = 0; index < currentMedia.length; index += 1) {
      const item = currentMedia[index];
      const payload = {
        type: item.type,
        url: item.url,
        public_id: item.public_id,
        caption: item.caption || null,
        is_thumbnail: Boolean(item.is_thumbnail),
        sort_order: index
      };

      if (item.id) {
        const res = await axios.put(`${API}/activities/${activityId}/media/${item.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        savedMedia.push(res.data);
      } else {
        const res = await axios.post(`${API}/activities/${activityId}/media`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        savedMedia.push(res.data);
      }
    }

    const thumbnail = savedMedia.find((item) => item.is_thumbnail);
    if (thumbnail?.id) {
      await axios.put(`${API}/activities/${activityId}/media/${thumbnail.id}/thumbnail`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    }

    if (savedMedia.length > 0) {
      await axios.put(`${API}/activities/${activityId}/media/reorder`, {
        media: savedMedia.map((item, index) => ({ id: item.id, sort_order: index }))
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
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

  const handleCategoryToggle = (categoryId) => {
    setForm(prev => {
      const ids = [...prev.categoryIds];
      const index = ids.indexOf(categoryId);
      if (index === -1) ids.push(categoryId);
      else ids.splice(index, 1);
      return { ...prev, categoryIds: ids };
    });
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
        description: form.description || null,
        image_url: getPrimaryImageUrl(form) || form.image_url || null,
        includes: form.includes.length > 0 ? form.includes : null,
        meeting_point: form.meeting_point || null,
        policies: Object.values(form.policies).some(v => v) ? form.policies : null,
        categoryIds: form.categoryIds
      };

      let savedActivity;
      if (editing) {
        const res = await axios.put(`${API}/activities/${editing}`, data, {
          headers: { Authorization: `Bearer ${token}` }
        });
        savedActivity = res.data;
        alert('Cập nhật thành công!');
      } else {
        const res = await axios.post(`${API}/activities`, data, {
          headers: { Authorization: `Bearer ${token}` }
        });
        savedActivity = res.data;
        alert('Tạo thành công!');
      }

      if (savedActivity?.id) {
        await syncActivityMedia(savedActivity.id, token);
      }

      setShowForm(false);
      setEditing(null);
      setForm(emptyForm);
      setInitialMedia([]);
      loadActivities();
    } catch (error) {
      console.error('Error saving activity:', error);
      alert(error.response?.data?.error || 'Lỗi khi lưu hoạt động');
    }
  };

  const handleEdit = (activity) => {
    const normalizedMedia = normalizeMedia(activity.media);
    const categoryIds = (activity.categories || []).map(c => c.id);
    setEditing(activity.id);
    setForm({
      name: activity.name || '',
      location: activity.location || '',
      price: activity.price || '',
      duration: activity.duration || '',
      categoryIds: categoryIds,
      description: activity.description || '',
      image_url: getPrimaryImageUrl(activity) || '',
      media: normalizedMedia,
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
    setInitialMedia(normalizedMedia);
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
              setInitialMedia([]);
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Danh mục (Chọn nhiều)</label>
                    <div className="flex flex-wrap gap-2">
                      {availableCategories.length > 0 ? (
                        availableCategories.map(cat => (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => handleCategoryToggle(cat.id)}
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                              form.categoryIds.includes(cat.id)
                                ? 'bg-blue-600 text-white shadow-md scale-105'
                                : 'bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                            }`}
                          >
                            {cat.icon && <span className="mr-1">{cat.icon}</span>}
                            {cat.name}
                          </button>
                        ))
                      ) : (
                        <div className="p-4 bg-orange-50 border border-orange-200 text-orange-700 rounded-xl w-full flex items-center gap-3">
                          <span className="text-2xl">🏷️</span>
                          <div>
                            <p className="text-sm font-bold">Chưa có danh mục nào</p>
                            <p className="text-xs mt-0.5 opacity-90">Bạn cần tạo danh mục ở tab "Danh mục" trước khi gán cho tour.</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Premium Media Library UI */}
              <div className="border-b pb-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h4 className="font-bold text-xl text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                      Thư viện Media
                    </h4>
                    <p className="text-sm text-gray-500 mt-1">Quản lý hình ảnh và video cho tour của bạn</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Upload Area */}
                  <div className="relative group cursor-pointer">
                    <input
                      type="file"
                      onChange={handleMediaUpload}
                      accept="image/*,video/*"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      disabled={uploading}
                    />
                    <div className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all duration-300 ${uploading ? 'bg-blue-50 border-blue-300' : 'bg-gray-50 border-gray-300 group-hover:bg-blue-50 group-hover:border-blue-400 group-hover:shadow-inner'}`}>
                      {uploading ? (
                        <div className="flex flex-col items-center">
                          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-3"></div>
                          <p className="text-sm font-semibold text-blue-600">Đang tải lên media...</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center text-center">
                          <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                            <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                          </div>
                          <p className="text-base font-bold text-gray-700">Kéo thả file hoặc click để tải lên</p>
                          <p className="text-xs text-gray-500 mt-2">Hỗ trợ định dạng Ảnh (JPG, PNG, WebP) và Video (MP4)</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Media Grid */}
                  {form.media.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center flex flex-col items-center">
                      <span className="text-4xl mb-3">📭</span>
                      <p className="text-gray-500 font-medium text-sm">Chưa có media nào trong thư viện.</p>
                      <p className="text-gray-400 text-xs mt-1">Upload ảnh/video để khách hàng thấy tour của bạn hấp dẫn hơn!</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                      {form.media
                        .slice()
                        .sort((a, b) => a.sort_order - b.sort_order)
                        .map((item, index) => (
                          <div key={item.tempId} className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col">
                            {/* Actions Overlay */}
                            <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                               <button type="button" onClick={() => moveMediaItem(item.tempId, 'up')} disabled={index === 0} className="w-8 h-8 flex items-center justify-center bg-white/90 backdrop-blur text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 disabled:opacity-30 shadow-sm transition"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path></svg></button>
                               <button type="button" onClick={() => moveMediaItem(item.tempId, 'down')} disabled={index === form.media.length - 1} className="w-8 h-8 flex items-center justify-center bg-white/90 backdrop-blur text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 disabled:opacity-30 shadow-sm transition"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg></button>
                               <button type="button" onClick={() => removeMediaItem(item.tempId)} className="w-8 h-8 flex items-center justify-center bg-white/90 backdrop-blur text-rose-600 rounded-lg hover:bg-rose-50 shadow-sm transition"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>
                            </div>

                            {/* Badges */}
                            <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-20">
                              <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase shadow-sm backdrop-blur-md ${item.type === 'video' ? 'bg-purple-500/90 text-white' : 'bg-blue-500/90 text-white'}`}>
                                {item.type === 'video' ? '🎬 Video' : '📸 Ảnh'}
                              </span>
                              {item.is_thumbnail && (
                                <span className="px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase shadow-sm backdrop-blur-md bg-orange-500/90 text-white flex items-center gap-1">
                                  👑 Ảnh bìa
                                </span>
                              )}
                            </div>

                            {/* Media Display */}
                            <div className="aspect-[4/3] w-full bg-gray-100 relative group-hover:scale-105 transition-transform duration-500 cursor-pointer overflow-hidden" onClick={() => !item.is_thumbnail && setMediaAsThumbnail(item.tempId)}>
                              {item.type === 'video' ? (
                                <video src={item.url} className="w-full h-full object-cover" />
                              ) : (
                                <img src={item.url} alt={item.caption || 'Media item'} className="w-full h-full object-cover" />
                              )}
                              
                              {/* Overlay for making thumbnail */}
                              {!item.is_thumbnail && (
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                  <span className="text-white font-medium text-xs border border-white/50 rounded-full px-3 py-1.5 backdrop-blur-sm bg-black/20">Chọn làm ảnh bìa</span>
                                </div>
                              )}
                            </div>

                            {/* Caption Input */}
                            <div className="p-3 bg-white border-t border-gray-50 mt-auto relative z-10">
                              <input
                                type="text"
                                value={item.caption}
                                onChange={(e) => updateMediaItem(item.tempId, 'caption', e.target.value)}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                                placeholder="Viết chú thích..."
                              />
                            </div>
                          </div>
                        ))}
                    </div>
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
                    setInitialMedia([]);
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
                      {getPrimaryImageUrl(activity) && (
                        <img src={getPrimaryImageUrl(activity)} alt={activity.name} className="w-16 h-16 object-cover rounded" />
                      )}
                      <div>
                        <div className="font-semibold text-gray-800">{activity.name}</div>
                        <div className="flex flex-wrap gap-1 mt-1">
                           {Array.isArray(activity.media) && activity.media.length > 0 && (
                            <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-500">{activity.media.length} media</span>
                          )}
                          {activity.highlights && activity.highlights.length > 0 && (
                            <span className="text-[10px] bg-orange-50 px-1.5 py-0.5 rounded text-orange-600">✨ {activity.highlights.length} highlights</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{activity.location}</td>
                  <td className="px-6 py-4">
                    {activity.duration && (
                      <span className="bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded text-[10px] font-bold uppercase">{activity.duration}</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1 max-w-[150px]">
                      {(activity.categories || []).length > 0 ? (
                        activity.categories.map(cat => (
                          <span key={cat.id} className="bg-purple-50 text-purple-700 border border-purple-100 px-2 py-0.5 rounded text-[10px] font-semibold">
                            {cat.name}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400 text-xs italic">Chưa gán</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-orange-600 font-bold whitespace-nowrap">
                    {formatPrice(activity.price)} đ
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <button onClick={() => handleEdit(activity)} className="p-2 hover:bg-blue-50 rounded-lg text-blue-600 transition">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-5M16.5 3.5a2.121 2.121 0 113 3L7 19l-4 1 1-4L16.5 3.5z" />
                         </svg>
                      </button>
                      <button onClick={() => handleDelete(activity.id)} className="p-2 hover:bg-red-50 rounded-lg text-red-500 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {activities.length === 0 && (
            <div className="p-12 text-center text-gray-500 italic">
              Chưa có dữ liệu hoạt động. Hãy thêm mới!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
