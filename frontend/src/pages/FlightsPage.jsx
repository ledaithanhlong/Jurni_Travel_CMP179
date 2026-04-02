import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { sampleFlights } from '../data/mockData';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Professional SVG Icons
const AirplaneIcon = ({ className = "w-8 h-8" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
  </svg>
);

const MoneyIcon = ({ className = "w-8 h-8" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ClockIcon = ({ className = "w-8 h-8" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const BellIcon = ({ className = "w-8 h-8" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

const LuggageIcon = ({ className = "w-8 h-8" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

const AirlineIcon = ({ className = "w-12 h-12" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
  </svg>
);

const FLIGHT_TYPE_LABELS = {
  economy: { label: 'Phổ thông', color: 'text-green-600' },
  premium_economy: { label: 'Phổ thông đặc biệt', color: 'text-teal-600' },
  business: { label: 'Thương gia', color: 'text-purple-600' },
  first_class: { label: 'Hạng nhất', color: 'text-yellow-600' }
};

// Component để hiển thị logo với fallback
const AirlineLogo = ({ logo, name, bgColor }) => {
  const [logoError, setLogoError] = useState(false);

  return (
    <div className={`mb-3 ${bgColor} rounded-lg p-3 flex items-center justify-center h-20`}>
      {!logoError ? (
        <img
          src={logo}
          alt={`${name} logo`}
          className="max-h-14 max-w-full object-contain"
          onError={() => setLogoError(true)}
        />
      ) : (
        <AirlineIcon className="w-12 h-12 text-gray-400" />
      )}
    </div>
  );
};

export default function FlightsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Booking Modal State
  const [bookingModal, setBookingModal] = useState(null); // { flight, option }
  const [quantity, setQuantity] = useState(1);

  const searchFromState = location.state?.from || '';
  const searchToState = location.state?.to || '';

  useEffect(() => {
    if (searchFromState || searchToState) {
      loadFlights(searchFromState, searchToState);
    } else {
      loadFlights('', '');
    }
  }, [searchFromState, searchToState]);

  const loadFlights = async (from = '', to = '') => {
    setLoading(true);
    try {
      const params = {};
      if (from) params.from = from;
      if (to) params.to = to;

      const res = await axios.get(`${API}/flights`, { params });
      setFlights(res.data || []);
      setHasSearched(true);
    } catch (error) {
      console.error('Error loading flights:', error);
      setFlights([]);
      setHasSearched(true);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price || 0);
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const calculateDuration = (departure, arrival) => {
    const dep = new Date(departure);
    const arr = new Date(arrival);
    const diffMs = arr - dep;
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const handleBook = (flight, selectedOption = null) => {
    setBookingModal({ flight, option: selectedOption });
    setQuantity(1);
  };

  const confirmBooking = () => {
    if (!bookingModal) return;
    const { flight, option } = bookingModal;

    // Construct unique item for checkout
    const ticketType = option ? (FLIGHT_TYPE_LABELS[option.type]?.label || option.name) : flight.flight_type;
    const price = option ? parseFloat(option.price) : parseFloat(flight.price);

    const orderItem = {
      id: `${flight.id}-${option ? option.type : 'std'}-${Date.now()}`,
      name: `Vé máy bay ${flight.airline} (${flight.departure_city} - ${flight.arrival_city})`,
      type: ticketType,
      price: price,
      quantity: quantity,
      image: flight.image_url,
      // Pass detailed info for display/reference
      details: {
        flight_number: flight.flight_number,
        departure_time: flight.departure_time,
        arrival_time: flight.arrival_time,
        aircraft: flight.aircraft,
        ticket_class: ticketType,
        ...option?.details
      }
    };

    // Save to localStorage so PaymentPage can read it
    try {
      const existingCart = JSON.parse(localStorage.getItem('pendingCart') || '[]');
      const updatedCart = [...existingCart, orderItem];
      localStorage.setItem('pendingCart', JSON.stringify(updatedCart));
    } catch (e) {
      console.error('Failed to save to cart', e);
    }

    navigate('/checkout');
    setBookingModal(null);
  };

  // Airline Info Constants
  const airlines = [
    { name: 'Vietnam Airlines', logo: '/AirlineLogo/vietnam-airlines.png', description: 'Hãng hàng không quốc gia, dịch vụ 5 sao' },
    { name: 'VietJet Air', logo: '/AirlineLogo/vietjet.png', description: 'Hãng hàng không giá rẻ, nhiều chuyến bay' },
    { name: 'Bamboo Airways', logo: '/AirlineLogo/bamboo.png', description: 'Hãng hàng không mới, hiện đại' },
    { name: 'Jetstar Pacific', logo: '/AirlineLogo/jetstar.png', description: 'Giá rẻ, phù hợp du lịch' },
  ];

  const bookingTips = [
    { title: 'Đặt vé sớm để tiết kiệm', description: 'Đặt trước 2-3 tháng có giá tốt hơn 20-30%', icon: MoneyIcon, color: 'text-green-600' },
    { title: 'Chọn giờ bay linh hoạt', description: 'Bay sáng sớm hoặc tối muộn thường rẻ hơn', icon: ClockIcon, color: 'text-blue-600' },
    { title: 'Theo dõi giá', description: 'Cài đặt cảnh báo giá để nhận thông báo', icon: BellIcon, color: 'text-orange-600' },
    { title: 'Hành lý ký gửi', description: 'Kiểm tra kỹ quy định hành lý của từng hãng', icon: LuggageIcon, color: 'text-purple-600' },
  ];

  const faqs = [
    { question: 'Có thể đổi/hủy vé không?', answer: 'Tùy theo loại vé. Vé rẻ thường không hoàn hủy.' },
    { question: 'Giấy tờ cần thiết?', answer: 'CCCD/Hộ chiếu còn hạn.' },
    { question: 'Hành lý xách tay?', answer: 'Thường là 7kg - 10kg tùy hãng.' },
    { question: 'Làm sao để săn vé rẻ?', answer: 'Đặt sớm và theo dõi khuyến mãi.' },
  ];

  return (
    <div className="max-w-7xl mx-auto py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-blue-900 mb-3">Vé máy bay</h1>
        <p className="text-gray-600">Tìm kiếm và đặt vé máy bay giá tốt nhất.</p>
        <button onClick={() => navigate('/')} className="mt-2 text-orange-600 font-medium hover:underline">
          ← Quay lại trang chủ
        </button>
      </div>

      {/* Flight List */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">
          {flights.length > 0 ? `Tìm thấy ${flights.length} chuyến bay` : 'Đang tìm kiếm...'}
        </h2>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Đang tải dữ liệu...</div>
        ) : flights.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow">
            <p>Không tìm thấy chuyến bay nào phù hợp.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {flights.map(flight => (
              <FlightCard
                key={flight.id}
                flight={flight}
                formatTime={formatTime}
                formatDate={formatDate}
                formatPrice={formatPrice}
                calculateDuration={calculateDuration}
                handleBook={handleBook}
              />
            ))}
          </div>
        )}
      </div>

      {/* Info Sections */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-bold text-lg mb-4">Mẹo đặt vé</h3>
          <div className="space-y-4">
            {bookingTips.map((tip, i) => (
              <div key={i} className="flex gap-3">
                <div className={`${tip.color} shrink-0`}><tip.icon className="w-6 h-6" /></div>
                <div>
                  <div className="font-semibold">{tip.title}</div>
                  <div className="text-sm text-gray-600">{tip.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-bold text-lg mb-4">Câu hỏi thường gặp</h3>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i}>
                <div className="font-semibold">{faq.question}</div>
                <div className="text-sm text-gray-600">{faq.answer}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Booking Quantity Modal */}
      {bookingModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-fade-in-up">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Chọn số lượng hành khách</h3>
              <button onClick={() => setBookingModal(null)} className="text-gray-400 hover:text-gray-600 font-bold text-2xl">×</button>
            </div>

            <div className="bg-blue-50 p-4 rounded-xl mb-6">
              <div className="font-semibold text-blue-900 mb-1">{bookingModal.flight.airline} • {bookingModal.flight.flight_number}</div>
              <div className="text-sm text-blue-700 mb-2">
                {bookingModal.flight.departure_city} → {bookingModal.flight.arrival_city}
              </div>
              <div className="text-sm font-medium text-blue-800 border-t border-blue-200 pt-2 mt-2">
                Loại vé: {bookingModal.option ? (FLIGHT_TYPE_LABELS[bookingModal.option.type]?.label || bookingModal.option.name) : 'Phổ thông'}
              </div>
            </div>

            <div className="flex items-center justify-between mb-8 px-4">
              <span className="font-medium text-gray-700">Số lượng vé:</span>
              <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-8 h-8 flex items-center justify-center bg-white rounded-md shadow-sm font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="w-8 text-center font-bold text-lg">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="w-8 h-8 flex items-center justify-center bg-white rounded-md shadow-sm font-bold text-blue-600 hover:bg-blue-50"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t">
              <div>
                <div className="text-xs text-gray-500">Tổng tạm tính</div>
                <div className="text-xl font-bold text-orange-600">
                  {formatPrice((bookingModal.option ? bookingModal.option.price : bookingModal.flight.price) * quantity)} đ
                </div>
              </div>
              <button
                onClick={confirmBooking}
                className="bg-orange-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-orange-700 transition transform hover:scale-105"
              >
                Tiếp tục
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FlightCard({ flight, formatTime, formatDate, formatPrice, calculateDuration, handleBook }) {
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('tickets'); // tickets, details, policies
  const [selectedGroup, setSelectedGroup] = useState('economy');

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition">
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex-shrink-0 w-24 text-center">
            {flight.image_url ? (
              <img src={flight.image_url} alt={flight.airline} className="w-16 h-16 object-contain mx-auto" />
            ) : (
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto"><AirlineIcon className="w-8 h-8 text-gray-400" /></div>
            )}
            <div className="text-xs font-semibold mt-2 text-gray-600">{flight.airline}</div>
            <div className="text-[10px] text-gray-500">{flight.aircraft}</div>
          </div>

          <div className="flex-1 grid md:grid-cols-3 gap-4 items-center">
            <div>
              <div className="text-xl font-bold">{formatTime(flight.departure_time)}</div>
              <div className="text-sm text-gray-500">{flight.departure_city}</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-xs text-gray-500 mb-1">{calculateDuration(flight.departure_time, flight.arrival_time)}</div>
              <div className="w-full h-px bg-gray-300 relative my-3">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-1">✈</div>
              </div>
              <div className="text-xs text-gray-500 mt-1">Bay thẳng</div>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold">{formatTime(flight.arrival_time)}</div>
              <div className="text-sm text-gray-500">{flight.arrival_city}</div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2 min-w-[150px]">
            <div className="text-right">
              <div className="text-sm text-gray-500">Giá từ</div>
              <div className="text-2xl font-bold text-orange-600">{formatPrice(flight.price)} đ</div>
            </div>
            <button
              onClick={() => setExpanded(!expanded)}
              className="bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-600 transition w-full"
            >
              {expanded ? 'Đóng' : 'Chọn vé'}
            </button>
          </div>
        </div>
      </div>

      {expanded && (
        <div className="border-t bg-gray-50 p-6 animate-fadeIn">
          <div className="flex gap-6 border-b mb-4">
            <button onClick={() => setActiveTab('tickets')} className={`pb-2 ${activeTab === 'tickets' ? 'text-blue-600 border-b-2 border-blue-600 font-medium' : 'text-gray-500'}`}>Chọn hạng vé</button>
            <button onClick={() => setActiveTab('details')} className={`pb-2 ${activeTab === 'details' ? 'text-blue-600 border-b-2 border-blue-600 font-medium' : 'text-gray-500'}`}>Chi tiết chuyến bay</button>
            {/* Policies tab removed */}
          </div>

          {activeTab === 'tickets' && (
            <div>
              {(() => {
                let options = flight.ticket_options;
                if (typeof options === 'string') {
                  try { options = JSON.parse(options); } catch (e) { options = []; }
                }
                options = Array.isArray(options) ? options : [];
                // Fallback for legacy data
                if (options.length === 0) return (
                  <div className="bg-white p-4 rounded-lg border flex justify-between items-center">
                    <div>
                      <div className="font-bold text-green-600">Phổ thông (Mặc định)</div>
                      <div className="text-xs text-gray-500">{flight.available_seats} ghế còn lại</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg text-orange-600">{formatPrice(flight.price)} đ</div>
                      <button onClick={() => handleBook(flight)} className="bg-blue-600 text-white px-4 py-1 rounded">Chọn</button>
                    </div>
                  </div>
                );

                // Group by type
                const groups = { economy: [], business: [], premium_economy: [], first_class: [] };
                options.forEach(opt => {
                  if (!groups[opt.type]) groups[opt.type] = [];
                  groups[opt.type].push(opt);
                });

                const activeGroups = Object.entries(groups).filter(([_, items]) => items.length > 0);

                // Determine effective selected group (fallback to first available if current selection is empty)
                const effectiveGroup = groups[selectedGroup]?.length > 0 ? selectedGroup : (activeGroups[0]?.[0] || 'economy');

                return (
                  <div>
                    {/* Sub-tabs for Ticket Class */}
                    <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                      {activeGroups.map(([type, items]) => (
                        <button
                          key={type}
                          onClick={() => setSelectedGroup(type)}
                          className={`px-4 py-2 rounded-full text-sm font-semibold transition whitespace-nowrap ${effectiveGroup === type ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-500' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                          {FLIGHT_TYPE_LABELS[type]?.label || type}
                          <span className="ml-2 text-xs font-normal text-gray-500">({items.length})</span>
                        </button>
                      ))}
                    </div>

                    {/* Grid of Cards for Selected Group */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {groups[effectiveGroup]?.map((opt, idx) => (
                        <div key={idx} className="bg-white border hover:border-blue-500 rounded-xl p-4 shadow-sm transition flex flex-col justify-between h-full group/card">
                          <div>
                            <div className="flex justify-between items-start mb-2">
                              <div className="font-bold text-lg text-gray-800">{opt.name || FLIGHT_TYPE_LABELS[opt.type]?.label}</div>
                              {opt.available_seats <= 5 && (
                                <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">Còn {opt.available_seats} ghế</span>
                              )}
                            </div>
                            <div className="text-2xl font-bold text-orange-600 mb-4">{formatPrice(opt.price)} đ</div>

                            {/* Details List */}
                            {opt.details && (
                              <div className="space-y-3 text-sm text-gray-600 mb-4 border-t pt-3">
                                <div className="flex items-center gap-2">
                                  <LuggageIcon className="w-5 h-5 text-gray-400" />
                                  <div>
                                    <span className="font-semibold text-gray-700 block text-xs">Hành lý xách tay</span>
                                    <span>{opt.details.cabin_baggage || '7kg'}</span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <LuggageIcon className="w-5 h-5 text-gray-400" />
                                  <div>
                                    <span className="font-semibold text-gray-700 block text-xs">Hành lý ký gửi</span>
                                    <span>{opt.details.checked_baggage || '0kg'}</span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <MoneyIcon className="w-5 h-5 text-gray-400" />
                                  <div>
                                    <span className="font-semibold text-gray-700 block text-xs">Chính sách hoàn vé</span>
                                    <span>{opt.details.refund_policy === 'refundable_free' ? 'Miễn phí' : opt.details.refund_policy === 'refundable_fee' ? 'Có tính phí' : 'Không hoàn tiền'}</span>
                                  </div>
                                </div>
                                {opt.details.meal && (
                                  <div className="flex items-center gap-2">
                                    <span className="text-green-600 text-xl">🍴</span>
                                    <span className="font-medium text-gray-700">Bao gồm suất ăn</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          <button
                            onClick={() => handleBook(flight, opt)}
                            className="w-full bg-blue-50 text-blue-600 border border-blue-200 py-2 rounded-lg font-bold hover:bg-blue-600 hover:text-white transition mt-2"
                          >
                            Chọn
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {activeTab === 'details' && (
            <div className="flex gap-8 items-start">
              <div className="flex flex-col items-center pt-1">
                <div className="text-xs font-medium">{formatTime(flight.departure_time)}</div>
                <div className="w-3 h-3 rounded-full border-2 border-blue-500 bg-white my-1"></div>
                <div className="w-0.5 h-12 bg-gray-300"></div>
                <div className="w-3 h-3 rounded-full border-2 border-blue-500 bg-blue-500 my-1"></div>
                <div className="text-xs font-medium">{formatTime(flight.arrival_time)}</div>
              </div>
              <div className="space-y-6 flex-1">
                <div>
                  <div className="font-bold text-lg">{flight.departure_city}</div>
                  <div className="text-sm text-gray-500">{formatDate(flight.departure_time)}</div>
                </div>
                <div className="bg-white p-3 border rounded flex gap-3 items-center">
                  <AirlineIcon className="w-8 h-8 text-gray-400" />
                  <div>
                    <div className="font-semibold">{flight.airline}</div>
                    <div className="text-xs text-gray-500">{flight.flight_number} • {flight.aircraft}</div>
                  </div>
                </div>
                <div>
                  <div className="font-bold text-lg">{flight.arrival_city}</div>
                  <div className="text-sm text-gray-500">{formatDate(flight.arrival_time)}</div>
                </div>
              </div>
            </div>
          )}

          {/* Policies content removed */}
        </div>
      )}
    </div>
  );
}
