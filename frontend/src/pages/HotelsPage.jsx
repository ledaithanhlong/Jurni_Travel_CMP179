import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { sampleHotels } from '../data/mockData';
import { HotelCard } from '../components/ServiceCards';
import FavoriteButton from '../components/FavoriteButton';
import {
  IconSearch, IconFilter, IconMap, IconStar, IconCheck, IconUsers,
  IconHotel, IconHotelLarge, IconShield, IconPhone, IconLocation,
  IconWifi, IconBed
} from '../components/Icons';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function HotelsPage() {
  const [rows, setRows] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [q, setQ] = useState('');

  const load = async () => {
    try {
      const res = await axios.get(`${API}/hotels`, { params: { q } });
      const sanitized = (res.data || []).filter((hotel) => !hotel.status || hotel.status === 'approved');
      setRows(sanitized);
    } catch (error) {
      console.error('Error loading hotels:', error);
      setRows([]); // We will use fallback in render or derivation logic, or just set sampleHotels here if preferred. 
      // Actually the logic `const hotels = rows.length > 0 ? rows : sampleHotels;` handles empty rows.
      // So setting rows to [] is fine.
    }
  };

  useEffect(() => { load(); }, [q]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price || 0);
  };



  const hotels = rows.length > 0 ? rows : sampleHotels;

  const statistics = [
    { number: '100,000+', label: 'Khách hàng hài lòng', icon: <IconUsers /> },
    { number: '500+', label: 'Khách sạn đa dạng', icon: <IconHotel /> },
    { number: '99%', label: 'Tỷ lệ hài lòng', icon: <IconStar /> },
    { number: '24/7', label: 'Hỗ trợ đặt phòng', icon: <IconShield /> }
  ];

  const values = [
    {
      title: 'Vị trí đắc địa',
      description: 'Tất cả khách sạn đều được chọn lọc kỹ lưỡng về vị trí, thuận tiện cho du lịch và công tác',
      icon: <IconLocation />
    },
    {
      title: 'Giá cả hợp lý',
      description: 'Giá phòng minh bạch, không phát sinh chi phí ẩn, nhiều chương trình khuyến mãi hấp dẫn',
      icon: <IconCheck />
    },
    {
      title: 'Dịch vụ chuyên nghiệp',
      description: 'Đội ngũ nhân viên tận tâm, hỗ trợ 24/7 và đảm bảo trải nghiệm tốt nhất cho khách hàng',
      icon: <IconUsers />
    },
    {
      title: 'Tiện nghi đầy đủ',
      description: 'Tất cả khách sạn đều có đầy đủ tiện nghi hiện đại, wifi miễn phí và dịch vụ chất lượng',
      icon: <IconWifi />
    }
  ];

  const hotelTypes = [
    { name: 'Khách sạn 5 sao', icon: '🏨', count: hotels.filter(h => h.star_rating === 5).length },
    { name: 'Resort bãi biển', icon: '🏖️', count: hotels.filter(h => h.name?.toLowerCase().includes('resort') || h.name?.toLowerCase().includes('beach')).length },
    { name: 'Boutique Hotel', icon: '🏛️', count: hotels.filter(h => h.name?.toLowerCase().includes('boutique')).length },
    { name: 'Eco Lodge', icon: '🌲', count: hotels.filter(h => h.name?.toLowerCase().includes('eco') || h.name?.toLowerCase().includes('lodge')).length }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-sky-700 text-white py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='100' height='100' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 100 0 L 0 0 0 100' fill='none' stroke='%23ffffff' stroke-width='1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100' height='100' fill='url(%23grid)'/%3E%3C/svg%3E")`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        <div className="absolute top-20 right-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-sky-500/20 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full mb-8 shadow-lg">
              <IconShield className="w-4 h-4" />
              <span className="text-sm font-medium">Đặt phòng khách sạn chuyên nghiệp</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
              Khách Sạn & <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-cyan-200">Nghỉ Dưỡng</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100/90 mb-10 leading-relaxed max-w-3xl mx-auto">
              Khám phá hàng trăm khách sạn và resort từ bình dân đến cao cấp tại mọi điểm đến.
              Jurni mang đến cho bạn những trải nghiệm nghỉ dưỡng đáng nhớ với giá cả hợp lý.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="#khach-san" className="group relative bg-white text-blue-700 px-8 py-4 rounded-full font-bold hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-blue-500/50 overflow-hidden">
                <span className="relative z-10 flex items-center gap-2">
                  Xem khách sạn
                  <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-sky-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full"></div>
              </a>
              <a href="#lien-he" className="group bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-full font-bold hover:bg-white/20 transition-all duration-300 border-2 border-white/30 hover:border-white/50 shadow-xl">
                <span className="flex items-center gap-2">
                  <IconPhone className="w-5 h-5" />
                  Liên hệ ngay
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
              Thành Công Được <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-600">Chứng Minh</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Những con số nói lên chất lượng dịch vụ của chúng tôi</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {statistics.map((stat, idx) => (
              <div key={idx} className="group relative text-center p-8 bg-white rounded-3xl border-2 border-gray-100 hover:border-orange-500 hover:shadow-2xl transition-all duration-300 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-sky-50/0 group-hover:from-blue-50 group-hover:to-sky-50 transition-all duration-300"></div>

                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-sky-600 text-white rounded-2xl mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                    {stat.icon}
                  </div>
                  <div className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors">
                    {stat.number}
                  </div>
                  <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values & Services Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
              Giá Trị & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-600">Dịch Vụ</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Những lý do khiến khách hàng tin tưởng và lựa chọn Jurni cho chuyến đi của mình
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, idx) => (
              <div key={idx} className="group relative bg-white rounded-3xl p-8 shadow-lg border-2 border-gray-100 hover:border-orange-500 hover:shadow-2xl transition-all duration-300 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-sky-50/0 group-hover:from-blue-50 group-hover:to-sky-50 transition-all duration-300"></div>

                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-sky-600 text-white rounded-2xl mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quality Focus Section */}
      <section className="py-20 bg-gradient-to-b from-white via-blue-50/30 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-100 text-blue-700 rounded-full mb-6 font-semibold">
                <IconShield className="w-5 h-5" />
                <span>Chất lượng đảm bảo</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
                Cam Kết <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-600">Chất Lượng</span>
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Tất cả khách sạn trên Jurni đều được kiểm tra và đánh giá kỹ lưỡng.
                Chúng tôi cam kết mang đến cho bạn trải nghiệm nghỉ dưỡng tốt nhất với giá cả hợp lý.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <IconCheck className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Kiểm tra chất lượng</h4>
                    <p className="text-gray-600">Tất cả khách sạn đều được kiểm tra định kỳ về tiện nghi và dịch vụ</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <IconCheck className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Đánh giá thực tế</h4>
                    <p className="text-gray-600">Đánh giá từ khách hàng thực tế, minh bạch và đáng tin cậy</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <IconCheck className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Hỗ trợ 24/7</h4>
                    <p className="text-gray-600">Đội ngũ hỗ trợ luôn sẵn sàng giúp đỡ bạn mọi lúc, mọi nơi</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-sky-600 rounded-3xl transform rotate-3"></div>
              <div className="relative bg-white rounded-3xl p-8 shadow-2xl border-2 border-blue-100">
                <div className="text-center">
                  <IconHotelLarge />
                  <div className="mt-6 text-4xl font-extrabold text-gray-900 mb-2">
                    {hotels.length}+
                  </div>
                  <div className="text-lg font-semibold text-gray-600 mb-6">Khách sạn đa dạng</div>
                  <div className="grid grid-cols-2 gap-4">
                    {hotelTypes.slice(0, 4).map((type, idx) => (
                      <div key={idx} className="bg-blue-50 rounded-xl p-4 text-center">
                        <div className="text-3xl mb-2">{type.icon}</div>
                        <div className="text-sm font-semibold text-gray-700">{type.name}</div>
                        <div className="text-xs text-gray-500 mt-1">{type.count} khách sạn</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Diverse Hotel Types Section */}
      <section className="py-20 bg-gradient-to-b from-white via-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
              Đa Dạng <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-600">Loại Khách Sạn</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Từ khách sạn bình dân đến resort 5 sao, chúng tôi có đủ loại khách sạn phù hợp với mọi nhu cầu và ngân sách
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {hotelTypes.map((type, idx) => (
              <div key={idx} className="group relative bg-white rounded-3xl p-8 shadow-lg border-2 border-gray-100 hover:border-orange-500 hover:shadow-2xl transition-all duration-300 overflow-hidden text-center">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-sky-50/0 group-hover:from-blue-50 group-hover:to-sky-50 transition-all duration-300"></div>
                <div className="relative z-10">
                  <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300">{type.icon}</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors">{type.name}</h3>
                  <div className="text-blue-600 font-bold text-lg">{type.count} khách sạn</div>
                </div>
                <div className="absolute top-0 right-0 w-0 h-0 border-t-[50px] border-r-[50px] border-t-blue-500/10 border-r-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hotels Listing Section */}
      <section id="khach-san" className="py-20 bg-gradient-to-b from-white via-blue-50/30 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 mb-12">
            <div className="flex-1 relative">
              <input
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Tìm kiếm khách sạn..."
                className="w-full px-6 py-4 pr-12 rounded-full border-2 border-gray-200 focus:border-blue-500 focus:outline-none text-lg shadow-lg"
              />
              <IconLocation className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
            </div>
            <button
              onClick={load}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-sky-600 text-white rounded-full font-bold hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-blue-500/50"
            >
              Tìm kiếm
            </button>
          </div>

          {hotels.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
                <IconHotelLarge />
                <h3 className="text-2xl font-bold text-gray-900 mt-6 mb-2">Không tìm thấy khách sạn</h3>
                <p className="text-gray-600 mb-6">
                  Vui lòng thử lại với từ khóa khác hoặc liên hệ với chúng tôi để được hỗ trợ.
                </p>
                <button
                  onClick={() => setQ('')}
                  className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition"
                >
                  Xem tất cả
                </button>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {hotels.map((hotel) => (
                <div
                  key={hotel.id}
                  className="group bg-white rounded-3xl shadow-lg border-2 border-gray-100 hover:border-orange-500 hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer flex flex-col h-full"
                  onClick={() => setSelectedHotel(hotel)}
                >
                  {hotel.image_url && (
                    <div className="relative h-64 overflow-hidden flex-shrink-0">
                      <img
                        src={hotel.image_url}
                        alt={hotel.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1">
                        <IconStar className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="font-bold text-gray-900">{hotel.star_rating || 4}</span>
                      </div>
                      <div className="absolute top-4 left-4">
                        <FavoriteButton
                          serviceType="hotel"
                          serviceId={hotel.id}
                          serviceName={hotel.name}
                          meta={hotel.location}
                          price={hotel.price}
                        />
                      </div>
                    </div>
                  )}
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                        {hotel.name}
                      </h3>
                      <div className="flex items-center gap-2 text-gray-600 mb-4">
                        <IconLocation className="w-4 h-4" />
                        <span className="text-sm">{hotel.location}</span>
                      </div>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <div className="text-2xl font-extrabold" style={{ color: '#FF6B35' }}>
                            {formatPrice(hotel.price)} VND
                          </div>
                          <div className="text-xs text-gray-500">/ đêm</div>
                        </div>
                        <div className="text-sm text-gray-600">
                          <IconBed className="w-5 h-5 inline mr-1" />
                          {hotel.rooms || 'N/A'} phòng
                        </div>
                      </div>
                      {hotel.amenities && hotel.amenities.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {hotel.amenities.slice(0, 3).map((amenity, idx) => (
                            <span
                              key={idx}
                              className="text-xs px-3 py-1 rounded-full font-medium"
                              style={{ backgroundColor: '#FFE8E0', color: '#FF6B35' }}
                            >
                              {amenity}
                            </span>
                          ))}
                          {hotel.amenities.length > 3 && (
                            <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-medium">
                              +{hotel.amenities.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <button className="w-full text-white py-3 rounded-full font-semibold hover:scale-105 transition-all duration-300 shadow-lg mt-auto" style={{ background: 'linear-gradient(to right, #FF6B35, #FF8C42)' }}>
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Detail Modal */}
      {selectedHotel && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setSelectedHotel(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-sky-600 text-white p-6 flex justify-between items-center z-10">
              <h2 className="text-2xl font-bold">Chi tiết khách sạn</h2>
              <button
                onClick={() => setSelectedHotel(null)}
                className="text-white hover:text-orange-100 text-3xl font-bold w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/20 transition"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              {selectedHotel.image_url && (
                <img
                  src={selectedHotel.image_url}
                  alt={selectedHotel.name}
                  className="w-full h-80 object-cover rounded-2xl mb-6"
                />
              )}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-3xl font-bold text-gray-900">{selectedHotel.name}</h3>
                  <div className="flex items-center gap-1 bg-yellow-50 px-4 py-2 rounded-full">
                    <IconStar className="w-5 h-5 text-yellow-500 fill-current" />
                    <span className="font-bold text-gray-900">{selectedHotel.star_rating || 4} sao</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <IconLocation className="w-5 h-5" />
                  <span>{selectedHotel.location}</span>
                </div>
                <div className="text-3xl font-extrabold text-blue-600 mb-6">
                  {formatPrice(selectedHotel.price)} VND <span className="text-lg text-gray-500 font-normal">/ đêm</span>
                </div>
                {selectedHotel.description && (
                  <p className="text-gray-700 leading-relaxed mb-6">{selectedHotel.description}</p>
                )}
              </div>

              {selectedHotel.amenities && selectedHotel.amenities.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-xl font-bold text-gray-900 mb-4">Tiện nghi</h4>
                  <div className="grid md:grid-cols-2 gap-3">
                    {selectedHotel.amenities.map((amenity, idx) => (
                      <div key={idx} className="flex items-center gap-3 bg-blue-50 rounded-xl p-4">
                        <IconCheck className="w-5 h-5 text-blue-600 flex-shrink-0" />
                        <span className="text-gray-700 font-medium">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-blue-50 rounded-xl p-6">
                  <h4 className="font-bold text-gray-900 mb-2">Check-in / Check-out</h4>
                  <div className="text-gray-700">
                    <div>Check-in: {selectedHotel.checkIn || '14:00'}</div>
                    <div>Check-out: {selectedHotel.checkOut || '12:00'}</div>
                  </div>
                </div>
                <div className="bg-blue-50 rounded-xl p-6">
                  <h4 className="font-bold text-gray-900 mb-2">Thông tin phòng</h4>
                  <div className="text-gray-700">
                    <div>Tổng số phòng: {selectedHotel.rooms || 'N/A'}</div>
                  </div>
                </div>
              </div>

              {selectedHotel.policies && (
                <div className="mb-6">
                  <h4 className="text-xl font-bold text-gray-900 mb-4">Chính sách</h4>
                  <div className="space-y-3">
                    {selectedHotel.policies.cancel && (
                      <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-4">
                        <IconCheck className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-semibold text-gray-900 mb-1">Hủy đặt phòng</div>
                          <div className="text-gray-600 text-sm">{selectedHotel.policies.cancel}</div>
                        </div>
                      </div>
                    )}
                    {selectedHotel.policies.children && (
                      <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-4">
                        <IconCheck className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-semibold text-gray-900 mb-1">Trẻ em</div>
                          <div className="text-gray-600 text-sm">{selectedHotel.policies.children}</div>
                        </div>
                      </div>
                    )}
                    {selectedHotel.policies.pets && (
                      <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-4">
                        <IconCheck className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-semibold text-gray-900 mb-1">Thú cưng</div>
                          <div className="text-gray-600 text-sm">{selectedHotel.policies.pets}</div>
                        </div>
                      </div>
                    )}
                    {selectedHotel.policies.smoking && (
                      <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-4">
                        <IconCheck className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-semibold text-gray-900 mb-1">Hút thuốc</div>
                          <div className="text-gray-600 text-sm">{selectedHotel.policies.smoking}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setSelectedHotel(null)}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-full font-semibold hover:bg-gray-200 transition"
                >
                  Đóng
                </button>
                <a
                  href={`/hotels/${selectedHotel.id}`}
                  className="flex-1 text-white py-3 rounded-full font-semibold hover:scale-105 transition-all duration-300 shadow-lg text-center"
                  style={{ background: 'linear-gradient(to right, #FF6B35, #FF8C42)' }}
                >
                  Đặt phòng ngay
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
