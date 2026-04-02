import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const UPLOAD_API = `${API}/upload`;

const emptyForm = {
  company: '',
  type: '',
  seats: 5,
  price_per_day: '',
  available: true,
  image_url: '',
  description: '',
  specifications: {
    engine: '',
    fuel: 'Xăng',
    transmission: 'Số tự động',
    luggageSpace: ''
  },
  amenities: []
};

export default function AdminCars() {
  const { getToken } = useAuth();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [newAmenity, setNewAmenity] = useState('');

  useEffect(() => {
    loadCars();
  }, []);

  const loadCars = async () => {
    try {
      const res = await axios.get(`${API}/cars`);
      setCars(res.data || []);
    } catch (error) {
      console.error('Error loading cars:', error);
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

  const addAmenity = () => {
    if (newAmenity.trim()) {
      setForm(prev => ({
        ...prev,
        amenities: [...prev.amenities, newAmenity.trim()]
      }));
      setNewAmenity('');
    }
  };

  const removeAmenity = (index) => {
    setForm(prev => ({
      ...prev,
      amenities: prev.amenities.filter((_, i) => i !== index)
    }));
  };

  const updateSpecification = (key, value) => {
    setForm(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [key]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = await getToken();

      if (!form.company || !form.type) {
        alert('Vui lòng nhập đủ thông tin bắt buộc!');
        return;
      }

      const data = {
        ...form,
        seats: Number(form.seats),
        price_per_day: Number(form.price_per_day),
        available: form.available === true || form.available === 'true',
        specifications: Object.keys(form.specifications).length > 0 ? form.specifications : null,
        amenities: form.amenities.length > 0 ? form.amenities : null
      };

      if (editing) {
        await axios.put(`${API}/cars/${editing}`, data, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Cập nhật thành công!');
      } else {
        await axios.post(`${API}/cars`, data, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Tạo thành công!');
      }
      setShowForm(false);
      setEditing(null);
      setForm(emptyForm);
      loadCars();
    } catch (error) {
      console.error('Error saving car:', error);
      alert(error.response?.data?.error || 'Lỗi khi lưu xe');
    }
  };

  const handleEdit = (car) => {
    setEditing(car.id);
    setForm({
      company: car.company || '',
      type: car.type || '',
      seats: car.seats || 5,
      price_per_day: car.price_per_day || '',
      available: car.available !== undefined ? car.available : true,
      image_url: car.image_url || '',
      description: car.description || '',
      specifications: car.specifications || {
        engine: '',
        fuel: 'Xăng',
        transmission: 'Số tự động',
        luggageSpace: ''
      },
      amenities: Array.isArray(car.amenities) ? car.amenities : []
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Bạn có chắc chắn muốn xóa xe này?')) return;
    try {
      const token = await getToken();
      await axios.delete(`${API}/cars/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      loadCars();
    } catch (error) {
      console.error('Error deleting car:', error);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price || 0);
  };

  if (loading) return <div className="text-center py-8">Đang tải...</div>;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-sky-600 to-blue-600 text-white p-6 rounded-2xl shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Quản lý Xe cho thuê</h2>
            <p className="text-white/80 mt-1">Tổng số: {cars.length} xe</p>
          </div>
          <button
            onClick={() => {
              setShowForm(true);
              setEditing(null);
              setForm(emptyForm);
            }}
            className="bg-white text-sky-600 px-5 py-2 rounded-full font-semibold hover:bg-blue-50 transition"
          >
            + Thêm xe
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow border border-gray-100">
        {showForm && (
          <div className="p-6 bg-white rounded-2xl shadow border border-gray-100 mb-6 max-h-[85vh] overflow-y-auto">
            <h3 className="font-semibold text-xl mb-6">{editing ? 'Cập nhật xe' : 'Thêm xe mới'}</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hãng xe *</label>
                  <input
                    type="text"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="Toyota, Honda, ..."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Loại xe *</label>
                  <input
                    type="text"
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="Vios, Innova, ..."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số ghế *</label>
                  <select
                    value={form.seats}
                    onChange={(e) => setForm({ ...form, seats: Number(e.target.value) })}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  >
                    <option value={5}>5 chỗ</option>
                    <option value={7}>7 chỗ</option>
                    <option value={16}>16 chỗ</option>
                    <option value={50}>50 chỗ</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Giá/ngày (VNĐ) *</label>
                  <input
                    type="number"
                    value={form.price_per_day}
                    onChange={(e) => setForm({ ...form, price_per_day: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                  <select
                    value={form.available}
                    onChange={(e) => setForm({ ...form, available: e.target.value === 'true' })}
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option value={true}>Có sẵn</option>
                    <option value={false}>Không có sẵn</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hình ảnh</label>
                  <div className="space-y-2">
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
                      <img src={form.image_url} alt="Preview" className="mt-2 h-24 w-auto object-contain rounded border" />
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                  rows={3}
                  placeholder="Mô tả chi tiết về xe..."
                />
              </div>

              {/* Specifications */}
              <div className="border-t pt-6">
                <h4 className="font-bold text-lg mb-4">Thông số kỹ thuật</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Động cơ</label>
                    <input
                      type="text"
                      value={form.specifications.engine}
                      onChange={(e) => updateSpecification('engine', e.target.value)}
                      className="w-full border rounded-lg px-3 py-2"
                      placeholder="1.5L, 2.0L Turbo, ..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nhiên liệu</label>
                    <select
                      value={form.specifications.fuel}
                      onChange={(e) => updateSpecification('fuel', e.target.value)}
                      className="w-full border rounded-lg px-3 py-2"
                    >
                      <option value="Xăng">Xăng</option>
                      <option value="Diesel">Diesel</option>
                      <option value="Điện">Điện</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hộp số</label>
                    <select
                      value={form.specifications.transmission}
                      onChange={(e) => updateSpecification('transmission', e.target.value)}
                      className="w-full border rounded-lg px-3 py-2"
                    >
                      <option value="Số tự động">Số tự động</option>
                      <option value="Số sàn">Số sàn</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Khoang hành lý</label>
                    <input
                      type="text"
                      value={form.specifications.luggageSpace}
                      onChange={(e) => updateSpecification('luggageSpace', e.target.value)}
                      className="w-full border rounded-lg px-3 py-2"
                      placeholder="470L, Lớn, ..."
                    />
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div className="border-t pt-6">
                <h4 className="font-bold text-lg mb-4">Tiện nghi</h4>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newAmenity}
                    onChange={(e) => setNewAmenity(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity())}
                    className="flex-1 border rounded-lg px-3 py-2"
                    placeholder="Nhập tiện nghi (VD: Điều hòa, Camera lùi, ...)"
                  />
                  <button
                    type="button"
                    onClick={addAmenity}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                  >
                    Thêm
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {form.amenities.map((amenity, idx) => (
                    <span key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                      {amenity}
                      <button type="button" onClick={() => removeAmenity(idx)} className="text-blue-600 hover:text-blue-800 font-bold">×</button>
                    </span>
                  ))}
                </div>
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

        {/* Car List Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left">Xe</th>
                <th className="px-6 py-3 text-left">Số ghế</th>
                <th className="px-6 py-3 text-left">Giá/ngày</th>
                <th className="px-6 py-3 text-left">Trạng thái</th>
                <th className="px-6 py-3 text-left">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {cars.map((car) => (
                <tr key={car.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {car.image_url && (
                        <img src={car.image_url} alt={car.type} className="w-16 h-16 object-cover rounded" />
                      )}
                      <div>
                        <div className="font-semibold">{car.company} {car.type}</div>
                        <div className="text-xs text-gray-500">{car.description?.slice(0, 50)}...</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{car.seats} chỗ</td>
                  <td className="px-6 py-4 text-orange-600 font-bold">
                    {formatPrice(car.price_per_day)} đ
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${car.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                      {car.available ? 'Có sẵn' : 'Đã thuê'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => handleEdit(car)} className="text-blue-600 mr-3 hover:text-blue-800">Sửa</button>
                    <button onClick={() => handleDelete(car.id)} className="text-red-500 hover:text-red-700">Xóa</button>
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
