import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper to safely parse JSON field
function safeArr(val) {
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') {
    try {
      const parsed = JSON.parse(val);
      return Array.isArray(parsed) ? parsed : [];
    } catch { return []; }
  }
  return [];
}

// Helper to safely parse JSON object
function safeObj(val) {
  if (val && typeof val === 'object' && !Array.isArray(val)) return val;
  if (typeof val === 'string') {
    try {
      const parsed = JSON.parse(val);
      return (parsed && typeof parsed === 'object') ? parsed : {};
    } catch { return {}; }
  }
  return {};
}

export default function HotelDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedRoomType, setSelectedRoomType] = useState(null);
  const [activeTab, setActiveTab] = useState('info');
  const [booking, setBooking] = useState({ checkIn: '', checkOut: '', guests: 2, rooms: 1 });
  const { isSignedIn } = useAuth();

  useEffect(() => {
    const loadHotel = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API}/hotels/${id}`);
        setHotel(res.data);
      } catch (error) {
        console.error('Error loading hotel:', error);
        alert('Không tìm thấy khách sạn');
        navigate('/hotels');
      } finally {
        setLoading(false);
      }
    };
    loadHotel();
  }, [id, navigate]);

  // Tự động cập nhật số phòng khi số khách thay đổi
  useEffect(() => {
    const capacity = selectedRoomType?.capacity || 2;
    const roomsNeeded = Math.ceil(booking.guests / capacity);
    if (booking.rooms !== roomsNeeded) {
      setBooking(prev => ({ ...prev, rooms: roomsNeeded }));
    }
  }, [booking.guests, selectedRoomType]);

  const formatPrice = (price) => new Intl.NumberFormat('vi-VN').format(price || 0);

  const calculateTotal = () => {
    if (!hotel || !booking.checkIn || !booking.checkOut) return 0;
    const nights = Math.ceil((new Date(booking.checkOut) - new Date(booking.checkIn)) / (1000 * 60 * 60 * 24));
    const pricePerNight = selectedRoomType ? selectedRoomType.price : (hotel.price || 0);

    // Lấy sức chứa (mặc định là 2 nếu không có dữ liệu)
    const capacity = selectedRoomType?.capacity || 2;
    // Tính số phòng cần thiết: Ví dụ 3 khách / 2 chỗ = 1.5 -> làm tròn lên thành 2 phòng
    const roomsNeeded = Math.ceil(booking.guests / capacity);

    return pricePerNight * nights * roomsNeeded;
  };

  const handleBook = () => {
    if (!isSignedIn) { alert('Vui lòng đăng nhập để đặt phòng'); navigate('/sign-in'); return; }
    if (!booking.checkIn || !booking.checkOut) { alert('Vui lòng chọn ngày check-in và check-out'); return; }
    if (new Date(booking.checkOut) <= new Date(booking.checkIn)) { alert('Ngày check-out phải sau ngày check-in'); return; }
    if (Array.isArray(hotel.room_types) && hotel.room_types.length > 1 && !selectedRoomType) { alert('Vui lòng chọn loại phòng'); return; }

    const totalPrice = calculateTotal();
    const nights = Math.ceil((new Date(booking.checkOut) - new Date(booking.checkIn)) / (1000 * 60 * 60 * 24));

    const orderItem = {
      id: `hotel-${hotel.id}-${Date.now()}`,
      name: `Đặt phòng ${hotel.name}`,
      type: 'Khách sạn',
      price: totalPrice,
      quantity: 1,
      image: hotel.image_url || (Array.isArray(hotel.images) && hotel.images[0]) || '',
      details: {
        address: hotel.address || hotel.location,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        nights,
        guests: booking.guests,
        rooms: booking.rooms,
        roomType: selectedRoomType ? selectedRoomType.type : 'Standard',
        roomPrice: selectedRoomType ? selectedRoomType.price : hotel.price
      }
    };

    try {
      const existingCart = JSON.parse(localStorage.getItem('pendingCart') || '[]');
      if (!existingCart.some(i => i.id === orderItem.id)) {
        existingCart.push(orderItem);
        localStorage.setItem('pendingCart', JSON.stringify(existingCart));
      }
    } catch (e) { console.error('Failed to save order to storage', e); }

    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Đang tải thông tin khách sạn...</p>
        </div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy khách sạn</h2>
          <p className="text-gray-600 mb-6">Khách sạn bạn tìm kiếm không tồn tại.</p>
          <button onClick={() => navigate('/hotels')} className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition">Quay lại danh sách</button>
        </div>
      </div>
    );
  }

  const totalPrice = calculateTotal();
  const nights = booking.checkIn && booking.checkOut
    ? Math.ceil((new Date(booking.checkOut) - new Date(booking.checkIn)) / (1000 * 60 * 60 * 24))
    : 0;

  // Data processing with safety
  const albumImages = safeArr(hotel.images);
  const amenitiesData = safeArr(hotel.amenities);
  const roomTypes = safeArr(hotel.room_types);
  const nearbyAttractions = safeArr(hotel.nearby_attractions);
  const publicTransport = safeArr(hotel.public_transport);
  const policies = safeObj(hotel.policies);

  // Images
  const allImages = [];
  if (hotel.image_url) allImages.push(hotel.image_url);
  albumImages.forEach(img => { if (img && !allImages.includes(img)) allImages.push(img); });
  const displayImage = allImages[selectedImageIndex] || hotel.image_url || 'https://via.placeholder.com/800x400';

  // Amenities
  const amenitiesList = [];
  if (hotel.has_wifi) amenitiesList.push('WiFi miễn phí');
  if (hotel.has_parking) amenitiesList.push('Bãi đỗ xe');
  if (hotel.has_pool) amenitiesList.push('Bể bơi');
  if (hotel.has_restaurant) amenitiesList.push('Nhà hàng');
  if (hotel.has_gym) amenitiesList.push('Phòng gym');
  if (hotel.has_spa) amenitiesList.push('Spa');
  if (hotel.has_breakfast) amenitiesList.push('Bữa sáng');
  amenitiesData.forEach(a => { if (a && !amenitiesList.includes(a)) amenitiesList.push(a); });

  const tabs = [
    { id: 'info', label: 'Thông tin' },
    ...(amenitiesList.length > 0 ? [{ id: 'amenities', label: 'Tiện ích' }] : []),
    ...(roomTypes.length > 0 ? [{ id: 'rooms', label: 'Loại phòng' }] : []),
    { id: 'gallery', label: 'Hình ảnh & Video' },
    ...((policies && Object.values(policies).some(Boolean)) || hotel.check_in_time ? [{ id: 'policy', label: 'Chính sách' }] : []),
    ...(nearbyAttractions.length > 0 || publicTransport.length > 0 ? [{ id: 'nearby', label: 'Xung quanh' }] : []),
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Back Button */}
        <button onClick={() => navigate('/hotels')} className="mb-6 flex items-center gap-2 text-gray-600 hover:text-orange-600 transition font-medium">
          ← Quay lại danh sách
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="rounded-3xl overflow-hidden shadow-2xl">
              <div className="relative">
                <img src={displayImage} alt={hotel.name} className="w-full h-96 object-cover" />
                {allImages.length > 1 && (
                  <>
                    <button onClick={() => setSelectedImageIndex(p => p > 0 ? p - 1 : allImages.length - 1)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg text-gray-700 font-bold text-lg">
                      ‹
                    </button>
                    <button onClick={() => setSelectedImageIndex(p => p < allImages.length - 1 ? p + 1 : 0)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg text-gray-700 font-bold text-lg">
                      ›
                    </button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {allImages.map((_, idx) => (
                        <button key={idx} onClick={() => setSelectedImageIndex(idx)}
                          className={`w-2 h-2 rounded-full ${selectedImageIndex === idx ? 'bg-white' : 'bg-white/50'}`} />
                      ))}
                    </div>
                  </>
                )}
              </div>
              {allImages.length > 1 && (
                <div className="grid grid-cols-4 gap-2 p-2 bg-gray-100">
                  {allImages.slice(0, 4).map((img, idx) => (
                    <button key={idx} onClick={() => setSelectedImageIndex(idx)}
                      className={`relative overflow-hidden rounded-lg ${selectedImageIndex === idx ? 'ring-2 ring-blue-500' : ''}`}>
                      <img src={img} alt={`${hotel.name} ${idx + 1}`} className="w-full h-20 object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Hotel Header */}
            <div className="bg-white rounded-3xl shadow-lg border-2 border-gray-100 p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{hotel.name}</h1>
                  <div className="text-gray-600 mb-3">{hotel.address || hotel.location}</div>
                  <div className="flex flex-wrap items-center gap-2">
                    {hotel.star_rating && (
                      <span className="bg-yellow-50 border border-yellow-200 text-yellow-800 font-bold px-3 py-1 rounded-full text-sm">
                        {'★'.repeat(hotel.star_rating)} {hotel.star_rating} sao
                      </span>
                    )}
                    {hotel.total_rooms && (
                      <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">{hotel.total_rooms} phòng</span>
                    )}
                    {hotel.total_floors && (
                      <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">{hotel.total_floors} tầng</span>
                    )}
                  </div>
                </div>
                <div className="text-right ml-4">
                  <div className="text-2xl font-extrabold text-blue-600">
                    {selectedRoomType ? formatPrice(selectedRoomType.price) : formatPrice(hotel.price)} VND
                  </div>
                  <div className="text-xs text-gray-500">/ đêm</div>
                </div>
              </div>

              {hotel.description && (
                <p className="text-gray-700 leading-relaxed">{hotel.description}</p>
              )}
            </div>

            {/* Tab Navigation */}
            <div className="bg-white rounded-3xl shadow-lg border-2 border-gray-100 overflow-hidden">
              {/* Tab Bar */}
              <div className="flex border-b border-gray-100 overflow-x-auto">
                {tabs.map(tab => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    className={`flex-shrink-0 px-6 py-4 text-sm font-semibold transition-all border-b-2 ${activeTab === tab.id
                      ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                      }`}>
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="p-6 space-y-5">

                {/* ── Tab: Thông tin ── */}
                {activeTab === 'info' && (
                  <div className="space-y-5">
                    {/* Check-in / Check-out */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-blue-50 rounded-2xl p-5">
                        <div className="font-bold text-gray-900 mb-3">Nhận phòng / Trả phòng</div>
                        <div className="space-y-2 text-sm text-gray-700">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Nhận phòng</span>
                            <span className="font-semibold">{hotel.check_in_time || '14:00'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Trả phòng</span>
                            <span className="font-semibold">{hotel.check_out_time || '12:00'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-2xl p-5">
                        <div className="font-bold text-gray-900 mb-3">Thông tin phòng</div>
                        <div className="space-y-2 text-sm text-gray-700">
                          {hotel.total_rooms && (
                            <div className="flex justify-between">
                              <span className="text-gray-500">Tổng số phòng</span>
                              <span className="font-semibold">{hotel.total_rooms}</span>
                            </div>
                          )}
                          {hotel.total_floors && (
                            <div className="flex justify-between">
                              <span className="text-gray-500">Số tầng</span>
                              <span className="font-semibold">{hotel.total_floors}</span>
                            </div>
                          )}
                          {hotel.star_rating && (
                            <div className="flex justify-between">
                              <span className="text-gray-500">Xếp hạng</span>
                              <span className="font-semibold">{hotel.star_rating} sao</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Quick amenity preview */}
                    {amenitiesList.length > 0 && (
                      <div>
                        <div className="font-bold text-gray-900 mb-3">Tiện ích nổi bật</div>
                        <div className="flex flex-wrap gap-2">
                          {amenitiesList.slice(0, 6).map((a, i) => (
                            <span key={i} className="bg-blue-50 border border-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium">✓ {a}</span>
                          ))}
                          {amenitiesList.length > 6 && (
                            <button onClick={() => setActiveTab('amenities')} className="text-blue-600 text-sm underline px-2">+{amenitiesList.length - 6} tiện ích khác</button>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Room type quick view */}
                    {roomTypes.length > 0 && (
                      <div>
                        <div className="font-bold text-gray-900 mb-3">Loại phòng ({roomTypes.length} loại)</div>
                        <div className="grid md:grid-cols-2 gap-3">
                          {roomTypes.slice(0, 2).map((rt, i) => (
                            <div key={i} className="border border-gray-200 rounded-xl p-4">
                              <div className="font-semibold text-gray-900">{rt.type}</div>
                              <div className="text-sm text-gray-500">Sức chứa: {rt.capacity} người</div>
                              <div className="text-blue-600 font-bold mt-1">{formatPrice(rt.price)} VND / đêm</div>
                            </div>
                          ))}
                        </div>
                        {roomTypes.length > 2 && (
                          <button onClick={() => setActiveTab('rooms')} className="mt-2 text-blue-600 text-sm underline">Xem tất cả {roomTypes.length} loại phòng</button>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* ── Tab: Tiện ích ── */}
                {activeTab === 'amenities' && (
                  <div>
                    <p className="text-sm text-gray-500 mb-4">Tất cả tiện ích và dịch vụ có tại khách sạn</p>
                    <div className="grid md:grid-cols-2 gap-3">
                      {amenitiesList.map((amenity, idx) => (
                        <div key={idx} className="flex items-center gap-3 bg-blue-50 rounded-xl p-4">
                          <span className="text-blue-600 font-bold">✓</span>
                          <span className="text-gray-700 font-medium">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── Tab: Loại phòng ── */}
                {activeTab === 'rooms' && (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-500">Chọn loại phòng phù hợp với nhu cầu của bạn</p>
                    {roomTypes.map((rt, idx) => (
                      <div key={idx}
                        onClick={() => setSelectedRoomType(rt)}
                        className={`border-2 rounded-2xl p-5 cursor-pointer transition-all ${selectedRoomType === rt
                          ? 'border-blue-500 bg-blue-50 shadow-md'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/30'
                          }`}>
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="font-bold text-gray-900 text-lg">{rt.type}</div>
                            <div className="text-sm text-gray-500 mt-0.5">Sức chứa: {rt.capacity} người</div>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-extrabold text-blue-600">{formatPrice(rt.price)} VND</div>
                            <div className="text-xs text-gray-500">/ đêm</div>
                            {selectedRoomType === rt && (
                              <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full mt-1 inline-block">Đã chọn</span>
                            )}
                          </div>
                        </div>
                        {rt.amenities && Array.isArray(rt.amenities) && rt.amenities.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {rt.amenities.map((a, i) => (
                              <span key={i} className="bg-white border border-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">✓ {a}</span>
                            ))}
                          </div>
                        )}
                        {rt.description && (
                          <p className="text-sm text-gray-600 mt-2">{rt.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* ── Tab: Gallery ── */}
                {activeTab === 'gallery' && (
                  <div className="space-y-8 animate-fadeIn">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-6">Thư viện hình ảnh</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {/* Kiểm tra mảng ảnh có dữ liệu không, nếu không thì dùng ảnh mặc định */}
                        {(allImages.length > 0
                          ? allImages
                          : [hotel.image_url].filter(Boolean)
                        ).map((img, idx) => (
                          <div key={idx} 
                            onClick={() => setSelectedImageIndex(allImages.indexOf(img) !== -1 ? allImages.indexOf(img) : 0)}
                            className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-gray-100 border border-gray-100 shadow-sm transition-all hover:shadow-md cursor-pointer">
                            <img
                              src={img}
                              alt={`Gallery ${idx}`}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/800x600?text=Jurni+Travel';
                              }}
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Phần Video giới thiệu */}
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-6">Video giới thiệu</h3>
                      <div className="aspect-video w-full overflow-hidden rounded-3xl bg-gray-900 shadow-xl border-4 border-white overflow-hidden">
                        {(hotel.video_url && typeof hotel.video_url === 'string' && hotel.video_url.trim() !== "") ? (
                          <iframe
                            className="w-full h-full"
                            src={hotel.video_url.includes('youtube.com') || hotel.video_url.includes('youtu.be')
                              ? hotel.video_url.replace("watch?v=", "embed/").replace("youtu.be/", "youtube.com/embed/").split('&')[0]
                              : hotel.video_url
                            }
                            title="Hotel Video"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe>
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-white/50 bg-gradient-to-br from-gray-800 to-gray-900 space-y-4">
                            <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center border-2 border-white/20">
                              <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" /></svg>
                            </div>
                            <div className="text-center px-6">
                              <p className="font-bold text-white text-lg">Video giới thiệu đang được cập nhật</p>
                              <p className="text-sm">Vui lòng quay lại sau để xem thêm chi tiết trải nghiệm</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── Tab: Chính sách ── */}
                {activeTab === 'policy' && (
                  <div className="space-y-4">
                    {/* Check-in/out */}
                    {(hotel.check_in_time || hotel.check_out_time) && (
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                          <div className="font-semibold text-gray-900 mb-1">Giờ nhận phòng</div>
                          <div className="text-2xl font-bold text-blue-600">{hotel.check_in_time || '14:00'}</div>
                          <div className="text-xs text-gray-500 mt-1">Từ giờ này trở đi</div>
                        </div>
                        <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
                          <div className="font-semibold text-gray-900 mb-1">Giờ trả phòng</div>
                          <div className="text-2xl font-bold text-orange-600">{hotel.check_out_time || '12:00'}</div>
                          <div className="text-xs text-gray-500 mt-1">Trước giờ này</div>
                        </div>
                      </div>
                    )}

                    {policies && [
                      { key: 'cancel', label: 'Hủy đặt phòng', color: 'border-blue-400' },
                      { key: 'children', label: 'Trẻ em', color: 'border-green-400' },
                      { key: 'pets', label: 'Thú cưng', color: 'border-yellow-400' },
                      { key: 'smoking', label: 'Hút thuốc', color: 'border-red-400' },
                      { key: 'extra_bed', label: 'Giường phụ', color: 'border-purple-400' },
                      { key: 'payment', label: 'Thanh toán', color: 'border-indigo-400' },
                    ].map(({ key, label, color }) => policies[key] ? (
                      <div key={key} className={`border-l-4 ${color} pl-4 py-3 bg-gray-50 rounded-r-xl`}>
                        <div className="font-semibold text-gray-900 mb-1">{label}</div>
                        <div className="text-sm text-gray-600 whitespace-pre-line">{policies[key]}</div>
                      </div>
                    ) : null)}
                  </div>
                )}

                {/* ── Tab: Xung quanh ── */}
                {activeTab === 'nearby' && (
                  <div className="space-y-6">
                    {nearbyAttractions.length > 0 && (
                      <div>
                        <div className="font-bold text-gray-900 mb-3">Điểm tham quan gần đó</div>
                        <div className="space-y-2">
                          {nearbyAttractions.map((attraction, idx) => (
                            <div key={idx} className="flex items-center gap-3 bg-green-50 border border-green-100 rounded-xl p-4">
                              <span className="text-green-600 font-bold text-lg">•</span>
                              <span className="text-gray-700">{attraction}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {publicTransport.length > 0 && (
                      <div>
                        <div className="font-bold text-gray-900 mb-3">Phương tiện công cộng gần khách sạn</div>
                        <div className="space-y-2">
                          {publicTransport.map((transport, idx) => (
                            <div key={idx} className="flex items-center gap-3 bg-purple-50 border border-purple-100 rounded-xl p-4">
                              <span className="text-purple-600 font-bold text-lg">•</span>
                              <span className="text-gray-700">{transport}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {nearbyAttractions.length === 0 && publicTransport.length === 0 && (
                      <p className="text-gray-500 text-center py-8">Chưa có thông tin xung quanh khách sạn.</p>
                    )}
                  </div>
                )}

              </div>
            </div>
          </div>

          {/* Booking Form - Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-2xl border-2 border-blue-100 p-6 sticky top-8">
              <div className="text-center mb-5 pb-5 border-b border-gray-100">
                <div className="text-3xl font-extrabold text-blue-600">
                  {selectedRoomType ? formatPrice(selectedRoomType.price) : formatPrice(hotel.price)} VND
                </div>
                <div className="text-sm text-gray-500">/ đêm{selectedRoomType ? ` · ${selectedRoomType.type}` : ''}</div>
              </div>

              <h2 className="text-xl font-bold text-gray-900 mb-5">Đặt phòng</h2>

              <div className="space-y-4 mb-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Ngày check-in</label>
                  <input type="date" value={booking.checkIn}
                    onChange={e => setBooking({ ...booking, checkIn: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none" />
                  {hotel.check_in_time && <p className="text-xs text-gray-500 mt-1">từ {hotel.check_in_time}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Ngày check-out</label>
                  <input type="date" value={booking.checkOut}
                    onChange={e => setBooking({ ...booking, checkOut: e.target.value })}
                    min={booking.checkIn || new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none" />
                  {hotel.check_out_time && <p className="text-xs text-gray-500 mt-1">trước {hotel.check_out_time}</p>}
                </div>

                {/* Room Type compact selection */}
                {roomTypes.length > 0 && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Loại phòng</label>
                    <div className="space-y-2">
                      {roomTypes.map((rt, idx) => (
                        <button key={idx} onClick={() => setSelectedRoomType(rt)}
                          className={`w-full p-3 rounded-xl border-2 transition text-left ${selectedRoomType === rt ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                            }`}>
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="font-semibold text-gray-900 text-sm">{rt.type}</div>
                              <div className="text-xs text-gray-500">{rt.capacity} người</div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-blue-600 text-sm">{formatPrice(rt.price)} VND</div>
                              <div className="text-xs text-gray-400">/ đêm</div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Guests */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Số khách</label>
                  <div className="flex items-center gap-3">
                    <button type="button" onClick={() => setBooking({ ...booking, guests: Math.max(1, booking.guests - 1) })}
                      className="w-10 h-10 rounded-lg border-2 border-gray-200 hover:border-orange-500 flex items-center justify-center font-bold text-gray-600">−</button>
                    <input type="number" value={booking.guests}
                      onChange={e => setBooking({ ...booking, guests: Math.max(1, parseInt(e.target.value) || 1) })}
                      min="1" className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-center font-semibold" />
                    <button type="button" onClick={() => setBooking({ ...booking, guests: booking.guests + 1 })}
                      className="w-10 h-10 rounded-lg border-2 border-gray-200 hover:border-orange-500 flex items-center justify-center font-bold text-gray-600">+</button>
                  </div>
                </div>

                {/* Rooms */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Số phòng</label>
                  <div className="flex items-center gap-3">
                    <button type="button" onClick={() => setBooking({ ...booking, rooms: Math.max(1, booking.rooms - 1) })}
                      className="w-10 h-10 rounded-lg border-2 border-gray-200 hover:border-orange-500 flex items-center justify-center font-bold text-gray-600">−</button>
                    <input type="number" value={booking.rooms}
                      onChange={e => setBooking({ ...booking, rooms: Math.max(1, parseInt(e.target.value) || 1) })}
                      min="1" className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-center font-semibold" />
                    <button type="button" onClick={() => setBooking({ ...booking, rooms: booking.rooms + 1 })}
                      className="w-10 h-10 rounded-lg border-2 border-gray-200 hover:border-orange-500 flex items-center justify-center font-bold text-gray-600">+</button>
                  </div>
                </div>
              </div>

              {/* Price Summary */}
              {nights > 0 && (
                <div className="bg-blue-50 rounded-xl p-4 mb-5 space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>{selectedRoomType ? formatPrice(selectedRoomType.price) : formatPrice(hotel.price)} VND × {nights} đêm</span>
                    <span>{formatPrice((selectedRoomType ? selectedRoomType.price : hotel.price) * nights)} VND</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>× {booking.rooms} phòng ({booking.guests} khách)</span>
                    <span></span>
                  </div>
                  <div className="border-t border-blue-200 pt-2 flex justify-between items-center font-bold">
                    <span className="text-gray-900">Tổng tiền</span>
                    <div className="text-right">
                      <span className="text-xl text-blue-600 block">{formatPrice(totalPrice)} VND</span>
                      <span className="text-[10px] text-gray-400 font-normal">(Sức chứa: {selectedRoomType?.capacity || 2} người/phòng)</span>
                    </div>
                  </div>
                </div>
              )}

              <button onClick={handleBook}
                className="w-full bg-gradient-to-r from-blue-600 to-sky-600 text-white py-4 rounded-full font-bold text-lg hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-blue-500/50">
                Đặt phòng ngay
              </button>

              {!isSignedIn && (
                <p className="text-xs text-gray-500 text-center mt-3">Bạn cần đăng nhập để đặt phòng</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
