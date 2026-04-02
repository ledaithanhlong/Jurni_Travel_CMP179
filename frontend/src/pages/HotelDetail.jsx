import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Icon Components
const IconStar = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
  </svg>
);

const IconLocation = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
  </svg>
);

const IconCheck = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);

const IconWifi = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" />
  </svg>
);

const IconCar = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.125-.504 1.125-1.125V14.25m-17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.125-.504 1.125-1.125V14.25" />
  </svg>
);

const IconSwimming = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
  </svg>
);

export default function HotelDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedRoomType, setSelectedRoomType] = useState(null);
  const [booking, setBooking] = useState({
    checkIn: '',
    checkOut: '',
    guests: 2,
    rooms: 1
  });
  const { getToken, isSignedIn } = useAuth();

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

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price || 0);
  };

  const calculateTotal = () => {
    if (!hotel || !booking.checkIn || !booking.checkOut) return 0;
    const checkIn = new Date(booking.checkIn);
    const checkOut = new Date(booking.checkOut);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    // Sử dụng giá của loại phòng được chọn nếu có, nếu không sử dụng giá khách sạn
    const pricePerNight = selectedRoomType ? selectedRoomType.price : (hotel.price || 0);
    return pricePerNight * nights * booking.rooms;
  };

  const handleBook = () => {
    if (!isSignedIn) {
      alert('Vui lòng đăng nhập để đặt phòng');
      navigate('/sign-in');
      return;
    }

    if (!booking.checkIn || !booking.checkOut) {
      alert('Vui lòng chọn ngày check-in và check-out');
      return;
    }

    if (new Date(booking.checkOut) <= new Date(booking.checkIn)) {
      alert('Ngày check-out phải sau ngày check-in');
      return;
    }

    if (Array.isArray(hotel.room_types) && hotel.room_types.length > 1 && !selectedRoomType) {
      alert('Vui lòng chọn loại phòng');
      return;
    }

    const totalPrice = calculateTotal();
    const nights = Math.ceil((new Date(booking.checkOut) - new Date(booking.checkIn)) / (1000 * 60 * 60 * 24));

    const orderItem = {
      id: `hotel-${hotel.id}-${Date.now()}`,
      name: `Đặt phòng ${hotel.name}`,
      type: 'Khách sạn',
      price: totalPrice,
      quantity: 1,
      image: hotel.image_url || ((hotel.images && hotel.images[0]) ? hotel.images[0] : ''),
      details: {
        address: hotel.address || hotel.location,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        nights: nights,
        guests: booking.guests,
        rooms: booking.rooms,
        roomType: selectedRoomType ? selectedRoomType.type : 'Standard',
        roomPrice: selectedRoomType ? selectedRoomType.price : hotel.price
      }
    };

    // Save to persistence (Cart style)
    try {
      const existingCart = JSON.parse(localStorage.getItem('pendingCart') || '[]');
      // Avoid duplicates if needed, or allow multiple same items? - User wants "Cart", so allow multiple.
      // But maybe check unique ID to prevent double-click duplicates.
      if (!existingCart.some(i => i.id === orderItem.id)) {
        existingCart.push(orderItem);
        localStorage.setItem('pendingCart', JSON.stringify(existingCart));
      }
    } catch (e) {
      console.error('Failed to save order to storage', e);
    }

    navigate('/checkout'); // No state needed, load from storage
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
          <button
            onClick={() => navigate('/hotels')}
            className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition"
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  const totalPrice = calculateTotal();
  const nights = booking.checkIn && booking.checkOut
    ? Math.ceil((new Date(booking.checkOut) - new Date(booking.checkIn)) / (1000 * 60 * 60 * 24))
    : 0;

  // Get all images
  const allImages = [];
  if (hotel.image_url) allImages.push(hotel.image_url);
  if (Array.isArray(hotel.images)) {
    hotel.images.forEach(img => {
      if (img && !allImages.includes(img)) allImages.push(img);
    });
  }
  const displayImage = allImages[selectedImageIndex] || hotel.image_url || 'https://via.placeholder.com/800x400';

  // Get amenities list
  const amenitiesList = [];
  if (hotel.has_wifi) amenitiesList.push({ name: 'WiFi miễn phí', icon: <IconWifi /> });
  if (hotel.has_parking) amenitiesList.push({ name: 'Chỗ đậu xe', icon: <IconCar /> });
  if (hotel.has_pool) amenitiesList.push({ name: 'Bể bơi', icon: <IconSwimming /> });
  if (hotel.has_restaurant) amenitiesList.push({ name: 'Nhà hàng', icon: null });
  if (hotel.has_gym) amenitiesList.push({ name: 'Phòng gym', icon: null });
  if (hotel.has_spa) amenitiesList.push({ name: 'Spa', icon: null });
  if (hotel.has_breakfast) amenitiesList.push({ name: 'Bữa sáng', icon: null });
  if (Array.isArray(hotel.amenities)) {
    hotel.amenities.forEach(amenity => {
      if (amenity && !amenitiesList.find(a => a.name === amenity)) {
        amenitiesList.push({ name: amenity, icon: null });
      }
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate('/hotels')}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-orange-600 transition"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Quay lại danh sách
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="rounded-3xl overflow-hidden shadow-2xl">
              <div className="relative">
                <img
                  src={displayImage}
                  alt={hotel.name}
                  className="w-full h-96 object-cover"
                />
                {allImages.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : allImages.length - 1))}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg"
                    >
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setSelectedImageIndex((prev) => (prev < allImages.length - 1 ? prev + 1 : 0))}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg"
                    >
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    </button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {allImages.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedImageIndex(idx)}
                          className={`w-2 h-2 rounded-full ${selectedImageIndex === idx ? 'bg-white' : 'bg-white/50'}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
              {allImages.length > 1 && (
                <div className="grid grid-cols-4 gap-2 p-2 bg-gray-100">
                  {allImages.slice(0, 4).map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative overflow-hidden rounded-lg ${selectedImageIndex === idx ? 'ring-2 ring-blue-500' : ''}`}
                    >
                      <img src={img} alt={`${hotel.name} ${idx + 1}`} className="w-full h-20 object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Hotel Info */}
            <div className="bg-white rounded-3xl shadow-lg border-2 border-gray-100 p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h1 className="text-4xl font-extrabold text-gray-900 mb-3">{hotel.name}</h1>
                  <div className="flex items-center gap-2 text-gray-600 mb-3">
                    <IconLocation />
                    <span className="text-lg">{hotel.address || hotel.location}</span>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    {hotel.star_rating && (
                      <div className="flex items-center gap-1 bg-yellow-50 px-4 py-2 rounded-full">
                        <IconStar className="w-5 h-5 text-yellow-500 fill-current" />
                        <span className="font-bold text-gray-900">{hotel.star_rating} sao</span>
                      </div>
                    )}
                    {hotel.total_rooms && (
                      <div className="text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-full">
                        {hotel.total_rooms} phòng
                      </div>
                    )}
                    {hotel.total_floors && (
                      <div className="text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-full">
                        {hotel.total_floors} tầng
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {hotel.description && (
                <div className="mb-6">
                  <p className="text-gray-700 leading-relaxed text-lg">{hotel.description}</p>
                </div>
              )}

              {/* Tiện nghi chính */}
              {amenitiesList.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Tiện ích chính</h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {amenitiesList.map((amenity, idx) => (
                      <div key={idx} className="flex items-center gap-3 bg-blue-50 rounded-xl p-4">
                        {amenity.icon || <IconCheck className="w-5 h-5 text-blue-600 flex-shrink-0" />}
                        <span className="text-gray-700 font-medium">{amenity.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Chính sách */}
              {hotel.policies && Object.values(hotel.policies).some(v => v) && (
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Chính sách và thông tin liên quan</h3>
                  <div className="space-y-3">
                    {hotel.check_in_time && hotel.check_out_time && (
                      <div className="bg-gray-50 rounded-xl p-4">
                        <div className="font-semibold text-gray-900 mb-2">Thời gian nhận phòng/trả phòng</div>
                        <div className="text-gray-600 text-sm">
                          <div>Giờ nhận phòng: Từ {hotel.check_in_time}</div>
                          <div>Giờ trả phòng: Trước {hotel.check_out_time}</div>
                        </div>
                      </div>
                    )}
                    {hotel.policies.cancel && (
                      <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-4">
                        <IconCheck className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-semibold text-gray-900 mb-1">Hủy đặt phòng</div>
                          <div className="text-gray-600 text-sm">{hotel.policies.cancel}</div>
                        </div>
                      </div>
                    )}
                    {hotel.policies.children && (
                      <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-4">
                        <IconCheck className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-semibold text-gray-900 mb-1">Trẻ em</div>
                          <div className="text-gray-600 text-sm">{hotel.policies.children}</div>
                        </div>
                      </div>
                    )}
                    {hotel.policies.pets && (
                      <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-4">
                        <IconCheck className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-semibold text-gray-900 mb-1">Thú cưng</div>
                          <div className="text-gray-600 text-sm">{hotel.policies.pets}</div>
                        </div>
                      </div>
                    )}
                    {hotel.policies.smoking && (
                      <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-4">
                        <IconCheck className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-semibold text-gray-900 mb-1">Hút thuốc</div>
                          <div className="text-gray-600 text-sm">{hotel.policies.smoking}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Điểm tham quan gần đó */}
              {Array.isArray(hotel.nearby_attractions) && hotel.nearby_attractions.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Xung quanh {hotel.name} có gì</h3>
                  <div className="space-y-2">
                    {hotel.nearby_attractions.map((attraction, idx) => (
                      <div key={idx} className="flex items-center gap-3 bg-green-50 rounded-xl p-4">
                        <IconLocation className="w-5 h-5 text-green-600 flex-shrink-0" />
                        <span className="text-gray-700">{attraction}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Phương tiện công cộng */}
              {Array.isArray(hotel.public_transport) && hotel.public_transport.length > 0 && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Phương tiện công cộng gần khách sạn</h3>
                  <div className="space-y-2">
                    {hotel.public_transport.map((transport, idx) => (
                      <div key={idx} className="flex items-center gap-3 bg-purple-50 rounded-xl p-4">
                        <IconLocation className="w-5 h-5 text-purple-600 flex-shrink-0" />
                        <span className="text-gray-700">{transport}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-2xl border-2 border-blue-100 p-6 sticky top-8">
              <div className="text-right mb-4">
                <div className="text-3xl font-extrabold text-blue-600">
                  {selectedRoomType ? formatPrice(selectedRoomType.price) : formatPrice(hotel.price)} VND
                </div>
                <div className="text-sm text-gray-500">/ đêm</div>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-6">Đặt phòng</h2>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Ngày check-in
                  </label>
                  <input
                    type="date"
                    value={booking.checkIn}
                    onChange={(e) => setBooking({ ...booking, checkIn: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                  />
                  {hotel.check_in_time && (
                    <p className="text-xs text-gray-500 mt-1">Check-in sau {hotel.check_in_time}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Ngày check-out
                  </label>
                  <input
                    type="date"
                    value={booking.checkOut}
                    onChange={(e) => setBooking({ ...booking, checkOut: e.target.value })}
                    min={booking.checkIn || new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                  />
                  {hotel.check_out_time && (
                    <p className="text-xs text-gray-500 mt-1">Check-out trước {hotel.check_out_time}</p>
                  )}
                </div>

                {/* Room Type Selection */}
                {Array.isArray(hotel.room_types) && hotel.room_types.length > 0 && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Chọn loại phòng
                    </label>
                    <div className="space-y-2">
                      {hotel.room_types.map((roomType, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedRoomType(roomType)}
                          className={`w-full p-3 rounded-lg border-2 transition text-left ${selectedRoomType === roomType
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 bg-white hover:border-blue-300'
                            }`}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="font-semibold text-gray-900">{roomType.type}</div>
                              <div className="text-sm text-gray-600">Sức chứa: {roomType.capacity} người</div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-blue-600">{formatPrice(roomType.price)} VND</div>
                              <div className="text-xs text-gray-500">/ đêm</div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Số khách
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setBooking({ ...booking, guests: Math.max(1, booking.guests - 1) })}
                      className="w-10 h-10 rounded-lg border-2 border-gray-200 hover:border-orange-500 flex items-center justify-center font-bold text-gray-600"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={booking.guests}
                      onChange={(e) => setBooking({ ...booking, guests: Math.max(1, parseInt(e.target.value) || 1) })}
                      min="1"
                      className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-center font-semibold"
                    />
                    <button
                      type="button"
                      onClick={() => setBooking({ ...booking, guests: booking.guests + 1 })}
                      className="w-10 h-10 rounded-lg border-2 border-gray-200 hover:border-orange-500 flex items-center justify-center font-bold text-gray-600"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Số phòng
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setBooking({ ...booking, rooms: Math.max(1, booking.rooms - 1) })}
                      className="w-10 h-10 rounded-lg border-2 border-gray-200 hover:border-orange-500 flex items-center justify-center font-bold text-gray-600"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={booking.rooms}
                      onChange={(e) => setBooking({ ...booking, rooms: Math.max(1, parseInt(e.target.value) || 1) })}
                      min="1"
                      className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-center font-semibold"
                    />
                    <button
                      type="button"
                      onClick={() => setBooking({ ...booking, rooms: booking.rooms + 1 })}
                      className="w-10 h-10 rounded-lg border-2 border-gray-200 hover:border-orange-500 flex items-center justify-center font-bold text-gray-600"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Price Summary */}
              {nights > 0 && (
                <div className="bg-blue-50 rounded-xl p-4 mb-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-gray-700 text-sm">
                      <span>{selectedRoomType ? formatPrice(selectedRoomType.price) : formatPrice(hotel.price)} VND × {nights} đêm × {booking.rooms} phòng</span>
                    </div>
                    <div className="border-t border-blue-200 pt-2 mt-2">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-gray-900">Tổng tiền</span>
                        <span className="text-2xl font-extrabold text-blue-600">
                          {formatPrice(totalPrice)} VND
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={handleBook}
                className="w-full bg-gradient-to-r from-blue-600 to-sky-600 text-white py-4 rounded-full font-bold text-lg hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-blue-500/50"
              >
                Đặt phòng ngay
              </button>

              {!isSignedIn && (
                <p className="text-xs text-gray-500 text-center mt-4">
                  Bạn cần đăng nhập để đặt phòng
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
