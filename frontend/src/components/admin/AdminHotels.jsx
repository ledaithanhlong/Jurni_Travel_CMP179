import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const UPLOAD_API = `${API}/upload`;
const STATUS_TABS = [
  { label: 'Tất cả', value: 'all' },
  { label: 'Chờ duyệt', value: 'pending' },
  { label: 'Đã duyệt', value: 'approved' },
  { label: 'Từ chối', value: 'rejected' }
];

const defaultPolicies = {
  cancel: '',
  children: '',
  pets: '',
  smoking: ''
};

const ROOM_TYPES = {
  standard: { label: 'Phòng tiêu chuẩn', icon: '🛏️' },
  deluxe: { label: 'Phòng deluxe', icon: '✨' },
  suite: { label: 'Suite', icon: '🏨' },
  family: { label: 'Phòng gia đình', icon: '👨‍👩‍👧‍👦' }
};

const VIETNAM_PROVINCES = [
  'Thành phố Hà Nội',
  'Thành phố Huế',
  'Tỉnh Lai Châu',
  'Tỉnh Điện Biên',
  'Tỉnh Sơn La',
  'Tỉnh Lạng Sơn',
  'Tỉnh Quảng Ninh',
  'Tỉnh Thanh Hoá',
  'Tỉnh Nghệ An',
  'Tỉnh Hà Tĩnh',
  'Tỉnh Cao Bằng',
  'Tỉnh Tuyên Quang',
  'Tỉnh Lào Cai',
  'Tỉnh Thái Nguyên',
  'Tỉnh Phú Thọ',
  'Tỉnh Bắc Ninh',
  'Tỉnh Hưng Yên',
  'Thành phố Hải Phòng',
  'Tỉnh Ninh Bình',
  'Tỉnh Quảng Trị',
  'Thành phố Đà Nẵng',
  'Tỉnh Quảng Ngãi',
  'Tỉnh Gia Lai',
  'Tỉnh Khánh Hoà',
  'Tỉnh Lâm Đồng',
  'Tỉnh Đắk Lắk',
  'Thành phố Hồ Chí Minh',
  'Tỉnh Đồng Nai',
  'Tỉnh Tây Ninh',
  'Thành phố Cần Thơ',
  'Tỉnh Vĩnh Long',
  'Tỉnh Đồng Tháp',
  'Tỉnh Cà Mau',
  'Tỉnh An Giang'
];

const emptyForm = {
  name: '',
  location: '',
  address: '',
  price: '',
  star_rating: '',
  description: '',
  image_url: '',
  images: [],
  check_in_time: '14:00',
  check_out_time: '12:00',
  total_rooms: '',
  total_floors: '',
  room_types: [], // [{ type: 'standard', quantity: 10, price: 1000000, capacity: 2 }]
  amenities: [],
  policies: defaultPolicies,
  nearby_attractions: [],
  public_transport: [],
  has_breakfast: false,
  has_parking: false,
  has_wifi: true,
  has_pool: false,
  has_restaurant: false,
  has_gym: false,
  has_spa: false,
  allows_pets: false,
  is_smoking_allowed: false,
  approval_note: '',
  status: 'pending'
};

const statusBadgeClass = {
  pending: 'bg-amber-100 text-amber-800',
  approved: 'bg-emerald-100 text-emerald-800',
  rejected: 'bg-rose-100 text-rose-800'
};

export default function AdminHotels() {
  const { getToken } = useAuth();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [filterStatus, setFilterStatus] = useState('pending');
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [newAmenity, setNewAmenity] = useState('');
  const [newAttraction, setNewAttraction] = useState('');
  const [newTransport, setNewTransport] = useState('');
  const [newRoomType, setNewRoomType] = useState({ type: 'standard', quantity: 1, price: '', capacity: 2, images: [] });

  useEffect(() => {
    loadHotels();
  }, []);

  const loadHotels = async () => {
    try {
      const token = await getToken();
      const res = await axios.get(`${API}/hotels/admin/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHotels(res.data);
      if (!selectedHotel && res.data.length > 0) {
        setSelectedHotel(res.data[0]);
      }
    } catch (error) {
      console.error('Error loading hotels:', error);
      alert('Lỗi khi tải danh sách khách sạn');
    } finally {
      setLoading(false);
    }
  };

  const filteredHotels = useMemo(() => {
    if (filterStatus === 'all') return hotels;
    return hotels.filter((hotel) => hotel.status === filterStatus);
  }, [hotels, filterStatus]);

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
        setForm((prev) => ({
          ...prev,
          image_url: prev.image_url || res.data.url,
          images: [...prev.images, res.data.url]
        }));
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Lỗi khi upload hình ảnh');
    } finally {
      setUploading(false);
    }
  };

  const handleRoomImageUpload = async (e, roomIndex = null) => {
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
        if (roomIndex !== null) {
          // Update existing room type
          setForm((prev) => {
            const updated = { ...prev };
            updated.room_types[roomIndex] = {
              ...updated.room_types[roomIndex],
              images: [...(updated.room_types[roomIndex].images || []), res.data.url]
            };
            return updated;
          });
        } else {
          // Add to new room type being created
          setNewRoomType((prev) => ({
            ...prev,
            images: [...prev.images, res.data.url]
          }));
        }
      }
    } catch (error) {
      console.error('Error uploading room image:', error);
      alert('Lỗi khi upload hình ảnh phòng');
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => setForm(emptyForm);

  const normalizeHotelToForm = (hotel) => ({
    name: hotel.name || '',
    location: hotel.location || '',
    address: hotel.address || '',
    price: hotel.price || '',
    star_rating: hotel.star_rating || '',
    description: hotel.description || '',
    image_url: hotel.image_url || '',
    images: Array.isArray(hotel.images) ? hotel.images : (hotel.image_url ? [hotel.image_url] : []),
    check_in_time: hotel.check_in_time || '14:00',
    check_out_time: hotel.check_out_time || '12:00',
    total_rooms: hotel.total_rooms || '',
    total_floors: hotel.total_floors || '',
    room_types: Array.isArray(hotel.room_types) ? hotel.room_types : [],
    amenities: Array.isArray(hotel.amenities) ? hotel.amenities : [],
    policies: hotel.policies || defaultPolicies,
    nearby_attractions: Array.isArray(hotel.nearby_attractions) ? hotel.nearby_attractions : [],
    public_transport: Array.isArray(hotel.public_transport) ? hotel.public_transport : [],
    has_breakfast: Boolean(hotel.has_breakfast),
    has_parking: Boolean(hotel.has_parking),
    has_wifi: hotel.has_wifi !== undefined ? hotel.has_wifi : true,
    has_pool: Boolean(hotel.has_pool),
    has_restaurant: Boolean(hotel.has_restaurant),
    has_gym: Boolean(hotel.has_gym),
    has_spa: Boolean(hotel.has_spa),
    allows_pets: Boolean(hotel.allows_pets),
    is_smoking_allowed: Boolean(hotel.is_smoking_allowed),
    approval_note: hotel.approval_note || '',
    status: hotel.status || 'pending'
  });

  const addAmenity = () => {
    if (newAmenity.trim()) {
      setForm((prev) => ({ ...prev, amenities: [...prev.amenities, newAmenity.trim()] }));
      setNewAmenity('');
    }
  };

  const removeAmenity = (index) => {
    setForm((prev) => ({ ...prev, amenities: prev.amenities.filter((_, i) => i !== index) }));
  };

  const addAttraction = () => {
    if (newAttraction.trim()) {
      setForm((prev) => ({ ...prev, nearby_attractions: [...prev.nearby_attractions, newAttraction.trim()] }));
      setNewAttraction('');
    }
  };

  const removeAttraction = (index) => {
    setForm((prev) => ({ ...prev, nearby_attractions: prev.nearby_attractions.filter((_, i) => i !== index) }));
  };

  const addTransport = () => {
    if (newTransport.trim()) {
      setForm((prev) => ({ ...prev, public_transport: [...prev.public_transport, newTransport.trim()] }));
      setNewTransport('');
    }
  };

  const removeTransport = (index) => {
    setForm((prev) => ({ ...prev, public_transport: prev.public_transport.filter((_, i) => i !== index) }));
  };

  const addRoomType = () => {
    if (newRoomType.type && newRoomType.quantity > 0 && newRoomType.price > 0) {
      const roomType = {
        type: newRoomType.type,
        quantity: Number(newRoomType.quantity),
        price: Number(newRoomType.price),
        capacity: Number(newRoomType.capacity) || 2,
        images: newRoomType.images || []
      };
      setForm((prev) => {
        const updated = { ...prev, room_types: [...prev.room_types, roomType] };
        // Tự động tính total_rooms
        updated.total_rooms = updated.room_types.reduce((sum, rt) => sum + rt.quantity, 0);
        return updated;
      });
      setNewRoomType({ type: 'standard', quantity: 1, price: '', capacity: 2, images: [] });
    } else {
      alert('Vui lòng điền đầy đủ thông tin loại phòng!');
    }
  };

  const removeRoomType = (index) => {
    setForm((prev) => {
      const updated = { ...prev, room_types: prev.room_types.filter((_, i) => i !== index) };
      // Tự động tính lại total_rooms
      updated.total_rooms = updated.room_types.reduce((sum, rt) => sum + rt.quantity, 0);
      return updated;
    });
  };

  const updateRoomType = (index, field, value) => {
    setForm((prev) => {
      const updated = { ...prev };
      updated.room_types[index] = { ...updated.room_types[index], [field]: value };
      // Tự động tính lại total_rooms
      updated.total_rooms = updated.room_types.reduce((sum, rt) => sum + rt.quantity, 0);
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = await getToken();
      // Tự động tính total_rooms từ room_types
      const calculatedTotalRooms = form.room_types.length > 0
        ? form.room_types.reduce((sum, rt) => sum + rt.quantity, 0)
        : (form.total_rooms ? Number(form.total_rooms) : null);

      const data = {
        ...form,
        price: form.price ? Number(form.price) : (form.room_types.length > 0 ? '' : 0), // Để trống nếu có room_types để backend tính tự động
        star_rating: form.star_rating ? Number(form.star_rating) : null,
        total_rooms: calculatedTotalRooms,
        total_floors: form.total_floors ? Number(form.total_floors) : null,
        room_types: form.room_types.length > 0 ? form.room_types : null,
        amenities: form.amenities.length > 0 ? form.amenities : null,
        policies: Object.values(form.policies).some((v) => v) ? form.policies : null,
        nearby_attractions: form.nearby_attractions.length > 0 ? form.nearby_attractions : null,
        public_transport: form.public_transport.length > 0 ? form.public_transport : null,
        images: form.images.length > 0 ? form.images : null
      };

      if (editing) {
        await axios.put(`${API}/hotels/${editing}`, data, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Cập nhật thành công!');
      } else {
        await axios.post(`${API}/hotels`, data, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Tạo thành công! Khách sạn sẽ chờ duyệt.');
      }
      setShowForm(false);
      setEditing(null);
      resetForm();
      await loadHotels();
    } catch (error) {
      console.error('Error saving hotel:', error);
      alert('Lỗi khi lưu khách sạn: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleEdit = (hotel) => {
    setEditing(hotel.id);
    setForm(normalizeHotelToForm(hotel));
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Bạn có chắc chắn muốn xóa khách sạn này?')) return;
    try {
      const token = await getToken();
      await axios.delete(`${API}/hotels/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Xóa thành công!');
      await loadHotels();
    } catch (error) {
      console.error('Error deleting hotel:', error);
      alert('Lỗi khi xóa khách sạn');
    }
  };

  const updateStatus = async (hotel, status, note = '') => {
    try {
      const token = await getToken();
      await axios.put(
        `${API}/hotels/${hotel.id}`,
        { status, approval_note: note || hotel.approval_note },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(status === 'approved' ? 'Đã duyệt khách sạn!' : 'Đã cập nhật trạng thái.');
      await loadHotels();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Không thể cập nhật trạng thái. Vui lòng thử lại.');
    }
  };

  const handleSelectHotel = (hotel) => {
    setSelectedHotel(hotel);
  };

  if (loading) return <div className="text-center py-8">Đang tải...</div>;

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-sky-600 text-white p-6 rounded-2xl shadow-lg flex flex-wrap gap-4 justify-between items-center z-10">
          <div>
            <p className="text-sm uppercase tracking-widest text-white/80">Chi tiết khách sạn</p>
            <h2 className="text-2xl font-bold">Quản lý & Duyệt khách sạn</h2>
            <p className="text-white/80 mt-1 text-sm">
              Chỉ những khách sạn được duyệt mới hiển thị trên trang đặt phòng.
            </p>
          </div>
          <button
            onClick={() => {
              setShowForm(true);
              setEditing(null);
              resetForm();
            }}
            className="bg-white text-blue-600 px-5 py-2 rounded-full font-semibold hover:bg-blue-50 transition"
          >
            + Thêm khách sạn
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <div className="flex flex-wrap gap-3 mb-6">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setFilterStatus(tab.value)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition ${filterStatus === tab.value
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="overflow-hidden border border-gray-100 rounded-2xl">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Tên</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Khu vực</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Giá</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Trạng thái</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredHotels.map((hotel) => (
                  <tr
                    key={hotel.id}
                    className="hover:bg-blue-50/60 cursor-pointer"
                    onClick={() => handleSelectHotel(hotel)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={hotel.image_url || hotel.images?.[0] || 'https://via.placeholder.com/80'}
                          alt={hotel.name}
                          className="w-14 h-14 rounded-xl object-cover border border-gray-100"
                        />
                        <div>
                          <p className="font-semibold text-gray-900">{hotel.name}</p>
                          <p className="text-xs text-gray-500">#{hotel.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{hotel.location}</td>
                    <td className="px-6 py-4 text-gray-700">
                      {Number(hotel.price).toLocaleString('vi-VN')} <span className="text-xs text-gray-500">/đêm</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadgeClass[hotel.status] || 'bg-gray-100 text-gray-600'}`}>
                        {hotel.status === 'pending' && 'Chờ duyệt'}
                        {hotel.status === 'approved' && 'Đã duyệt'}
                        {hotel.status === 'rejected' && 'Từ chối'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-right space-x-3">
                      <button onClick={(e) => { e.stopPropagation(); handleEdit(hotel); }} className="text-blue-600 hover:text-blue-800">
                        Sửa
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); handleDelete(hotel.id); }} className="text-red-500 hover:text-red-700">
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredHotels.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      Không có khách sạn nào với trạng thái này.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {showForm && (
          <div className="p-6 bg-white rounded-2xl shadow border border-gray-100 max-h-[85vh] overflow-y-auto">
            <h3 className="font-semibold text-xl mb-4">
              {editing ? 'Cập nhật thông tin khách sạn' : 'Thêm khách sạn mới'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Thông tin cơ bản */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tên khách sạn *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Khu vực *</label>
                  <select
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                    required
                  >
                    <option value="">Chọn tỉnh/thành phố</option>
                    {VIETNAM_PROVINCES.map((province) => (
                      <option key={province} value={province}>
                        {province}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ đầy đủ</label>
                  <input
                    type="text"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                    placeholder="Ví dụ: 57-59 Do Bi, Mỹ An, Ngũ Hành Sơn, Đà Nẵng"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hạng sao (1-5)</label>
                  <input
                    type="number"
                    value={form.star_rating}
                    onChange={(e) => setForm({ ...form, star_rating: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                    min="1"
                    max="5"
                    step="0.5"
                    placeholder="Ví dụ: 3.5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số tầng</label>
                  <input
                    type="number"
                    value={form.total_floors}
                    onChange={(e) => setForm({ ...form, total_floors: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Giờ check-in</label>
                  <input
                    type="time"
                    value={form.check_in_time}
                    onChange={(e) => setForm({ ...form, check_in_time: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Giờ check-out</label>
                  <input
                    type="time"
                    value={form.check_out_time}
                    onChange={(e) => setForm({ ...form, check_out_time: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                    rows="4"
                    placeholder="Mô tả về khách sạn..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái hiển thị</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="pending">Chờ duyệt</option>
                    <option value="approved">Duyệt ngay</option>
                    <option value="rejected">Từ chối</option>
                  </select>
                </div>
              </div>

              {/* Hình ảnh */}
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Hình ảnh</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hình ảnh chính (URL hoặc upload)</label>
                    <input
                      type="url"
                      value={form.image_url}
                      onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                      className="w-full border rounded px-3 py-2 mb-2"
                      placeholder="https://..."
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="w-full border rounded px-3 py-2"
                      disabled={uploading}
                    />
                    {uploading && <p className="text-sm text-gray-500 mt-1">Đang upload...</p>}
                  </div>
                  {form.images.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Thư viện hình ảnh</label>
                      <div className="grid grid-cols-4 gap-2">
                        {form.images.map((img, idx) => (
                          <div key={idx} className="relative">
                            <img src={img} alt={`Image ${idx + 1}`} className="w-full h-24 object-cover rounded" />
                            <button
                              type="button"
                              onClick={() => setForm({ ...form, images: form.images.filter((_, i) => i !== idx) })}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 text-xs"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Loại phòng */}
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Loại phòng</h4>
                <div className="space-y-3 mb-4">
                  {form.room_types.map((roomType, idx) => (
                    <div key={idx} className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{ROOM_TYPES[roomType.type]?.icon || '🛏️'}</span>
                          <span className="font-semibold text-gray-800">
                            {ROOM_TYPES[roomType.type]?.label || roomType.type}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeRoomType(idx)}
                          className="text-red-500 hover:text-red-700 text-sm font-medium"
                        >
                          Xóa
                        </button>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Số lượng</label>
                          <input
                            type="number"
                            value={roomType.quantity}
                            onChange={(e) => updateRoomType(idx, 'quantity', Number(e.target.value))}
                            className="w-full border rounded px-2 py-1 text-sm"
                            min="1"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Giá/đêm (VNĐ)</label>
                          <input
                            type="number"
                            value={roomType.price}
                            onChange={(e) => updateRoomType(idx, 'price', Number(e.target.value))}
                            className="w-full border rounded px-2 py-1 text-sm"
                            min="0"
                            step="1000"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Sức chứa (người)</label>
                          <input
                            type="number"
                            value={roomType.capacity}
                            onChange={(e) => updateRoomType(idx, 'capacity', Number(e.target.value))}
                            className="w-full border rounded px-2 py-1 text-sm"
                            min="1"
                          />
                        </div>
                      </div>
                      {/* Room Images */}
                      <div className="mt-3">
                        <label className="block text-xs font-medium text-gray-600 mb-1">Hình ảnh phòng</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleRoomImageUpload(e, idx)}
                          className="w-full border rounded px-2 py-1 text-sm"
                          disabled={uploading}
                        />
                        {roomType.images && roomType.images.length > 0 && (
                          <div className="grid grid-cols-4 gap-2 mt-2">
                            {roomType.images.map((img, imgIdx) => (
                              <div key={imgIdx} className="relative">
                                <img src={img} alt={`Room ${imgIdx + 1}`} className="w-full h-16 object-cover rounded" />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = [...form.room_types];
                                    updated[idx] = {
                                      ...updated[idx],
                                      images: updated[idx].images.filter((_, i) => i !== imgIdx)
                                    };
                                    setForm({ ...form, room_types: updated });
                                  }}
                                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 text-xs"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h5 className="font-medium text-sm mb-3">Thêm loại phòng mới</h5>
                  <div className="grid grid-cols-4 gap-3 mb-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Loại phòng</label>
                      <select
                        value={newRoomType.type}
                        onChange={(e) => setNewRoomType({ ...newRoomType, type: e.target.value })}
                        className="w-full border rounded px-2 py-1 text-sm"
                      >
                        {Object.entries(ROOM_TYPES).map(([key, config]) => (
                          <option key={key} value={key}>
                            {config.icon} {config.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Số lượng</label>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setNewRoomType({ ...newRoomType, quantity: Math.max(1, newRoomType.quantity - 1) })}
                          className="flex-1 border rounded px-1 py-1 text-sm hover:bg-gray-200 font-bold"
                        >
                          −
                        </button>
                        <input
                          type="number"
                          value={newRoomType.quantity}
                          onChange={(e) => setNewRoomType({ ...newRoomType, quantity: Math.max(1, Number(e.target.value) || 1) })}
                          className="flex-1 border rounded px-2 py-1 text-sm text-center"
                          min="1"
                        />
                        <button
                          type="button"
                          onClick={() => setNewRoomType({ ...newRoomType, quantity: newRoomType.quantity + 1 })}
                          className="flex-1 border rounded px-1 py-1 text-sm hover:bg-gray-200 font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Giá/đêm (VNĐ)</label>
                      <input
                        type="number"
                        value={newRoomType.price}
                        onChange={(e) => setNewRoomType({ ...newRoomType, price: e.target.value })}
                        className="w-full border rounded px-2 py-1 text-sm"
                        min="0"
                        step="1000"
                        placeholder="Ví dụ: 1000000"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Sức chứa</label>
                      <input
                        type="number"
                        value={newRoomType.capacity}
                        onChange={(e) => setNewRoomType({ ...newRoomType, capacity: Math.max(1, Number(e.target.value) || 2) })}
                        className="w-full border rounded px-2 py-1 text-sm"
                        min="1"
                      />
                    </div>
                  </div>
                  {/* Room Images */}
                  <div className="mt-3">
                    <label className="block text-xs font-medium text-gray-600 mb-1">Hình ảnh phòng</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleRoomImageUpload(e)}
                      className="w-full border rounded px-2 py-1 text-sm"
                      disabled={uploading}
                    />
                    {uploading && <p className="text-xs text-gray-500 mt-1">Đang upload...</p>}
                    {newRoomType.images && newRoomType.images.length > 0 && (
                      <div className="grid grid-cols-4 gap-2 mt-2">
                        {newRoomType.images.map((img, idx) => (
                          <div key={idx} className="relative">
                            <img src={img} alt={`Room ${idx + 1}`} className="w-full h-16 object-cover rounded" />
                            <button
                              type="button"
                              onClick={() => setNewRoomType({ ...newRoomType, images: newRoomType.images.filter((_, i) => i !== idx) })}
                              className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 text-xs"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={addRoomType}
                    className="bg-blue-500 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-600"
                  >
                    + Thêm loại phòng
                  </button>
                </div>
              </div>

              {/* Tiện nghi */}
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Tiện nghi</h4>
                <div className="grid grid-cols-3 gap-3 mb-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={form.has_wifi}
                      onChange={(e) => setForm({ ...form, has_wifi: e.target.checked })}
                      className="mr-2"
                    />
                    WiFi miễn phí
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={form.has_parking}
                      onChange={(e) => setForm({ ...form, has_parking: e.target.checked })}
                      className="mr-2"
                    />
                    Chỗ đậu xe
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={form.has_pool}
                      onChange={(e) => setForm({ ...form, has_pool: e.target.checked })}
                      className="mr-2"
                    />
                    Bể bơi
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={form.has_restaurant}
                      onChange={(e) => setForm({ ...form, has_restaurant: e.target.checked })}
                      className="mr-2"
                    />
                    Nhà hàng
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={form.has_gym}
                      onChange={(e) => setForm({ ...form, has_gym: e.target.checked })}
                      className="mr-2"
                    />
                    Phòng gym
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={form.has_spa}
                      onChange={(e) => setForm({ ...form, has_spa: e.target.checked })}
                      className="mr-2"
                    />
                    Spa
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={form.has_breakfast}
                      onChange={(e) => setForm({ ...form, has_breakfast: e.target.checked })}
                      className="mr-2"
                    />
                    Bữa sáng
                  </label>
                </div>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newAmenity}
                    onChange={(e) => setNewAmenity(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity())}
                    className="flex-1 border rounded px-3 py-2"
                    placeholder="Thêm tiện nghi khác..."
                  />
                  <button type="button" onClick={addAmenity} className="bg-blue-500 text-white px-4 py-2 rounded">
                    Thêm
                  </button>
                </div>
                {form.amenities.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {form.amenities.map((amenity, idx) => (
                      <span key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                        {amenity}
                        <button
                          type="button"
                          onClick={() => removeAmenity(idx)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Chính sách */}
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Chính sách</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Chính sách hủy</label>
                    <input
                      type="text"
                      value={form.policies.cancel}
                      onChange={(e) => setForm({ ...form, policies: { ...form.policies, cancel: e.target.value } })}
                      className="w-full border rounded px-3 py-2"
                      placeholder="Ví dụ: Miễn phí hủy trước 48 giờ"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Chính sách trẻ em</label>
                    <input
                      type="text"
                      value={form.policies.children}
                      onChange={(e) => setForm({ ...form, policies: { ...form.policies, children: e.target.value } })}
                      className="w-full border rounded px-3 py-2"
                      placeholder="Ví dụ: Trẻ em dưới 12 tuổi ở miễn phí"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Chính sách thú cưng</label>
                    <input
                      type="text"
                      value={form.policies.pets}
                      onChange={(e) => setForm({ ...form, policies: { ...form.policies, pets: e.target.value } })}
                      className="w-full border rounded px-3 py-2"
                      placeholder="Ví dụ: Không cho phép thú cưng"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Chính sách hút thuốc</label>
                    <input
                      type="text"
                      value={form.policies.smoking}
                      onChange={(e) => setForm({ ...form, policies: { ...form.policies, smoking: e.target.value } })}
                      className="w-full border rounded px-3 py-2"
                      placeholder="Ví dụ: Không hút thuốc"
                    />
                  </div>
                </div>
                <div className="mt-3 flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={form.allows_pets}
                      onChange={(e) => setForm({ ...form, allows_pets: e.target.checked })}
                      className="mr-2"
                    />
                    Cho phép thú cưng
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={form.is_smoking_allowed}
                      onChange={(e) => setForm({ ...form, is_smoking_allowed: e.target.checked })}
                      className="mr-2"
                    />
                    Cho phép hút thuốc
                  </label>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú duyệt</label>
                  <textarea
                    rows={3}
                    value={form.approval_note}
                    onChange={(e) => setForm({ ...form, approval_note: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                    placeholder="Ghi chú dành cho đội vận hành khi duyệt"
                  />
                </div>
              </div>

              {/* Điểm tham quan gần đó */}
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Điểm tham quan gần đó</h4>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newAttraction}
                    onChange={(e) => setNewAttraction(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAttraction())}
                    className="flex-1 border rounded px-3 py-2"
                    placeholder="Ví dụ: Biển Mỹ Khê - 5 phút đi bộ"
                  />
                  <button type="button" onClick={addAttraction} className="bg-blue-500 text-white px-4 py-2 rounded">
                    Thêm
                  </button>
                </div>
                {form.nearby_attractions.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {form.nearby_attractions.map((attraction, idx) => (
                      <span key={idx} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                        {attraction}
                        <button
                          type="button"
                          onClick={() => removeAttraction(idx)}
                          className="text-green-600 hover:text-green-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Phương tiện công cộng */}
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Phương tiện công cộng</h4>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newTransport}
                    onChange={(e) => setNewTransport(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTransport())}
                    className="flex-1 border rounded px-3 py-2"
                    placeholder="Ví dụ: Trạm xe buýt - 500m"
                  />
                  <button type="button" onClick={addTransport} className="bg-blue-500 text-white px-4 py-2 rounded">
                    Thêm
                  </button>
                </div>
                {form.public_transport.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {form.public_transport.map((transport, idx) => (
                      <span key={idx} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                        {transport}
                        <button
                          type="button"
                          onClick={() => removeTransport(idx)}
                          className="text-purple-600 hover:text-purple-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-4 border-t">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
                >
                  {editing ? 'Cập nhật' : 'Tạo mới'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditing(null);
                    resetForm();
                  }}
                  className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
      <div className="space-y-6">
        <div className="sticky top-0 space-y-4">
          <div className="bg-white rounded-2xl shadow p-6 border border-gray-100 min-h-[320px]">
            {selectedHotel ? (
              <>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Chi tiết khách sạn</p>
                    <h3 className="text-2xl font-bold text-gray-900">{selectedHotel.name}</h3>
                    <p className="text-sm text-gray-500">{selectedHotel.location}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadgeClass[selectedHotel.status] || 'bg-gray-100 text-gray-600'}`}>
                    {selectedHotel.status === 'pending' && 'Chờ duyệt'}
                    {selectedHotel.status === 'approved' && 'Đã duyệt'}
                    {selectedHotel.status === 'rejected' && 'Từ chối'}
                  </span>
                </div>

                <div className="rounded-2xl overflow-hidden mb-4">
                  <img
                    src={selectedHotel.image_url || selectedHotel.images?.[0] || 'https://via.placeholder.com/600x300'}
                    alt={selectedHotel.name}
                    className="w-full h-52 object-cover"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Giá mỗi đêm</span>
                    <span className="font-semibold text-gray-900">
                      {Number(selectedHotel.price).toLocaleString('vi-VN')} VND
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Hạng sao</span>
                    <span className="font-semibold text-gray-900">
                      {selectedHotel.star_rating ? `${selectedHotel.star_rating} sao` : 'Chưa xác định'}
                    </span>
                  </div>
                </div>

                {selectedHotel.status === 'pending' && (
                  <div className="mt-4 flex flex-col gap-3">
                    <button
                      onClick={() => updateStatus(selectedHotel, 'approved')}
                      className="w-full bg-emerald-600 text-white py-2.5 rounded-full font-semibold hover:bg-emerald-700 transition"
                    >
                      Duyệt khách sạn
                    </button>
                    <button
                      onClick={() => {
                        const note = prompt('Nhập lý do từ chối (tùy chọn):', selectedHotel.approval_note || '');
                        if (note !== null) updateStatus(selectedHotel, 'rejected', note);
                      }}
                      className="w-full bg-rose-100 text-rose-600 py-2.5 rounded-full font-semibold hover:bg-rose-200 transition"
                    >
                      Từ chối
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center text-gray-500 py-20">
                Chọn một khách sạn để xem chi tiết
              </div>
            )}
          </div>

          {selectedHotel && (
            <div className="bg-white rounded-2xl shadow p-6 border border-gray-100 space-y-4">
              <h4 className="text-lg font-semibold text-gray-900">Tiện nghi nổi bật</h4>
              <div className="flex flex-wrap gap-2">
                {(selectedHotel.amenities || []).slice(0, 6).map((amenity, idx) => (
                  <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs">
                    {amenity}
                  </span>
                ))}
                {(!selectedHotel.amenities || selectedHotel.amenities.length === 0) && (
                  <p className="text-sm text-gray-500">Chưa cập nhật tiện nghi.</p>
                )}
              </div>
              {selectedHotel.approval_note && (
                <div className="pt-3 border-t border-gray-100">
                  <p className="text-sm text-gray-500 mb-1">Ghi chú duyệt</p>
                  <p className="text-sm text-gray-800">{selectedHotel.approval_note}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
