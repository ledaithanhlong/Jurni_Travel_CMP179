import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { sampleActivities } from '../data/mockData';
import {
  IconUsers, IconActivity, IconShield,
  IconStar, IconCheck, IconPhone, IconLocation, IconClock
} from '../components/Icons';
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

export default function TourDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();
  
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('info');
  const [expandedDay, setExpandedDay] = useState(0);
  const [selectedPkg, setSelectedPkg] = useState(null);
  
  // Booking state
  const [tourDate, setTourDate] = useState('');
  const [participants, setParticipants] = useState(1);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API}/activities/${id}`);
        setActivity(res.data);
      } catch (error) {
        console.error('Error loading tour:', error);
        // Fallback to mock data if API fails or not found
        const mock = sampleActivities.find(a => a.id === parseInt(id));
        if (mock) setActivity(mock);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  const formatPrice = (price) => new Intl.NumberFormat('vi-VN').format(price || 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Không tìm thấy tour này</h2>
        <button onClick={() => navigate('/activities')} className="bg-blue-600 text-white px-6 py-2 rounded-full">Quay lại</button>
      </div>
    );
  }

  const itinerary = safeArr(activity.itinerary);
  const pricePackages = safeArr(activity.price_packages);
  const includes = safeArr(activity.includes);
  let policies = activity.policies;
  if (typeof policies === 'string') { try { policies = JSON.parse(policies); } catch { policies = null; } }

  const effectivePrice = selectedPkg ? selectedPkg.price : activity.price;

  const tabs = [
    { id: 'info', label: 'Thông tin' },
    ...(itinerary.length > 0 ? [{ id: 'itinerary', label: 'Lịch trình' }] : []),
    ...(pricePackages.length > 0 ? [{ id: 'pricing', label: 'Giá gói' }] : []),
    ...((policies && Object.values(policies).some(Boolean)) ? [{ id: 'policy', label: 'Chính sách' }] : []),
    ...((activity.terms || activity.notes) ? [{ id: 'terms', label: 'Điều khoản' }] : []),
  ];

  const handleBook = () => {
    if (!isSignedIn) { alert('Vui lòng đăng nhập để đặt tour'); navigate('/sign-in'); return; }
    if (!tourDate) { alert('Vui lòng chọn ngày khởi hành!'); return; }

    const cartItem = {
      id: `tour-${activity.id}-${Date.now()}`,
      name: activity.name,
      type: activity.category || 'Tour',
      price: effectivePrice * participants,
      quantity: 1,
      image: activity.image_url,
      details: {
        activity_id: activity.id,
        location: activity.location,
        tour_date: tourDate,
        participants: participants,
        packageName: selectedPkg?.name || 'Cơ bản',
        unitPrice: effectivePrice
      }
    };

    const existingCart = JSON.parse(localStorage.getItem('pendingCart') || '[]');
    localStorage.setItem('pendingCart', JSON.stringify([...existingCart, cartItem]));
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Cover Image & Header Overlay */}
      <div className="relative h-[400px] w-full">
        <img src={activity.image_url} alt={activity.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute bottom-10 left-0 right-0 max-w-7xl mx-auto px-4">
          <button onClick={() => navigate('/activities')} className="text-white/80 hover:text-white mb-4 flex items-center gap-2">
            ← Quay lại danh sách
          </button>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">{activity.name}</h1>
          <div className="flex flex-wrap items-center gap-4 text-white/90">
             <span className="flex items-center gap-1"><IconLocation className="w-5 h-5 text-orange-400" /> {activity.location}</span>
             <span className="flex items-center gap-1"><IconClock className="w-5 h-5 text-orange-400" /> {activity.duration}</span>
             <span className="bg-orange-500 text-white text-xs px-3 py-1 rounded-full font-bold uppercase">{activity.category}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-10">
        <div className="grid lg:grid-cols-3 gap-10">
          
          {/* Left Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Tab Navigation */}
            <div className="flex gap-2 bg-gray-100 p-1.5 rounded-2xl overflow-x-auto sticky top-20 z-10">
              {tabs.map(tab => (
                <button 
                  key={tab.id} 
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-shrink-0 px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                    activeTab === tab.id ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Panels */}
            <div className="py-2">
              {activeTab === 'info' && (
                <div className="space-y-8 animate-fadeIn">
                  <div>
                    <h3 className="text-2xl font-bold mb-4">Mô tả tour</h3>
                    <p className="text-gray-600 leading-relaxed text-lg">{activity.description}</p>
                  </div>

                  {includes.length > 0 && (
                    <div>
                      <h3 className="text-xl font-bold mb-4">Tour bao gồm</h3>
                      <div className="grid md:grid-cols-2 gap-3">
                        {includes.map((item, i) => (
                          <div key={i} className="flex items-center gap-3 bg-green-50 p-4 rounded-xl border border-green-100">
                            <IconCheck className="text-green-600 w-5 h-5" />
                            <span className="text-gray-700 font-medium">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activity.meeting_point && (
                    <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                      <h4 className="font-bold text-blue-900 mb-2">Điểm hẹn</h4>
                      <p className="text-blue-800">{activity.meeting_point}</p>
                      <p className="text-sm text-blue-600 mt-2 font-medium italic">* Vui lòng có mặt trước giờ khởi hành 15-30 phút.</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'itinerary' && (
                <div className="space-y-4 animate-fadeIn">
                  <h3 className="text-2xl font-bold mb-6">Lịch trình chi tiết</h3>
                  {itinerary.map((day, idx) => (
                    <div key={idx} className="border-2 rounded-2xl overflow-hidden transition-all bg-white hover:border-orange-200">
                      <button 
                        className="w-full flex items-center gap-4 px-6 py-5 text-left"
                        onClick={() => setExpandedDay(expandedDay === idx ? -1 : idx)}
                      >
                        <div className="w-12 h-12 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold shadow-lg flex-shrink-0">
                          {day.day}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 text-lg">{day.title}</h4>
                          <p className="text-sm text-gray-500">{day.description}</p>
                        </div>
                        <span className="text-gray-400">{expandedDay === idx ? '▲' : '▼'}</span>
                      </button>
                      {expandedDay === idx && (
                        <div className="px-6 pb-6 pt-2 border-t border-gray-100 space-y-3">
                          {day.activities?.map((act, i) => (
                            <div key={i} className="flex items-start gap-4">
                              <div className="w-2 h-2 mt-2.5 rounded-full bg-orange-500"></div>
                              <p className="text-gray-700">{act}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'pricing' && (
                <div className="animate-fadeIn">
                   <h3 className="text-2xl font-bold mb-6">Gói giá ưu đãi</h3>
                   <div className="grid md:grid-cols-2 gap-6">
                      {pricePackages.map((pkg, idx) => (
                        <button 
                          key={idx}
                          onClick={() => setSelectedPkg(pkg)}
                          className={`text-left p-6 rounded-3xl border-2 transition-all relative ${
                            selectedPkg?.name === pkg.name 
                            ? 'border-orange-500 bg-orange-50 shadow-xl scale-[1.02]' 
                            : 'border-gray-100 hover:border-gray-300'
                          }`}
                        >
                          {selectedPkg?.name === pkg.name && (
                            <div className="absolute top-4 right-4 bg-orange-500 text-white rounded-full p-1"><IconCheck className="w-4 h-4" /></div>
                          )}
                          <h4 className="font-bold text-xl mb-2">{pkg.name}</h4>
                          <div className="text-2xl font-black text-orange-600 mb-2">{formatPrice(pkg.price)} đ <span className="text-sm font-normal text-gray-400">/khách</span></div>
                          <p className="text-sm text-gray-500 mb-4">Tối thiểu {pkg.min_people} người - Tối đa {pkg.max_people} người</p>
                          <ul className="space-y-2">
                             {pkg.includes?.map((inc, i) => (
                               <li key={i} className="text-sm text-gray-600 flex gap-2"><IconCheck className="w-4 h-4 text-green-500" /> {inc}</li>
                             ))}
                          </ul>
                        </button>
                      ))}
                   </div>
                </div>
              )}

              {activeTab === 'policy' && (
                <div className="space-y-6 animate-fadeIn">
                   <h3 className="text-2xl font-bold mb-6">Chính sách & Quy định</h3>
                   {[
                      { key: 'cancel', label: 'Chính sách hoàn hủy', color: 'orange' },
                      { key: 'change', label: 'Chính sách đổi ngày', color: 'blue' },
                      { key: 'weather', label: 'Điều kiện thời tiết', color: 'sky' },
                      { key: 'children', label: 'Quy định trẻ em', color: 'purple' }
                   ].map(p => policies?.[p.key] && (
                     <div key={p.key} className={`border-l-4 border-${p.color}-500 pl-6 py-2`}>
                        <h4 className="font-bold text-lg mb-2">{p.label}</h4>
                        <p className="text-gray-600 whitespace-pre-line">{policies[p.key]}</p>
                     </div>
                   ))}
                </div>
              )}

              {activeTab === 'terms' && (
                <div className="space-y-8 animate-fadeIn">
                  {activity.terms && (
                    <div className="bg-gray-50 p-8 rounded-3xl">
                      <h3 className="text-xl font-bold mb-4">Điều khoản & Lưu ý</h3>
                      <p className="text-gray-600 whitespace-pre-line leading-relaxed">{activity.terms}</p>
                    </div>
                  )}
                  {activity.notes && (
                    <div className="bg-yellow-50 p-8 rounded-3xl border border-yellow-100">
                      <h3 className="text-xl font-bold text-yellow-800 mb-4">Ghi chú thêm từ Jurni</h3>
                      <p className="text-yellow-700 italic whitespace-pre-line">{activity.notes}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar - Booking */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="bg-white rounded-[2rem] shadow-2xl border-2 border-gray-50 p-8">
                <div className="mb-6">
                  <span className="text-gray-500 text-sm">Giá từ</span>
                  <div className="text-4xl font-black text-orange-600">{formatPrice(effectivePrice)} đ</div>
                  <span className="text-gray-400 text-sm">/ khách</span>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Chọn ngày khởi hành</label>
                    <input 
                      type="date" 
                      value={tourDate}
                      onChange={e => setTourDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-orange-500 outline-none font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Số lượng khách</label>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded-2xl border-2 border-gray-100">
                      <button onClick={() => setParticipants(Math.max(1, participants - 1))} className="w-12 h-12 flex items-center justify-center bg-white rounded-xl shadow-sm text-2xl font-bold">-</button>
                      <span className="text-xl font-bold">{participants}</span>
                      <button onClick={() => setParticipants(participants + 1)} className="w-12 h-12 flex items-center justify-center bg-white rounded-xl shadow-sm text-2xl font-bold">+</button>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-100">
                    <div className="flex justify-between items-end mb-6">
                      <span className="text-gray-600 font-bold">Tổng cộng</span>
                      <div className="text-right">
                         <div className="text-3xl font-black text-orange-600">{formatPrice(effectivePrice * participants)} đ</div>
                         <p className="text-xs text-gray-400 mt-1">{participants} khách × {formatPrice(effectivePrice)} đ</p>
                      </div>
                    </div>
                    
                    <button 
                      onClick={handleBook}
                      className="w-full bg-gradient-to-r from-orange-600 to-orange-500 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-orange-200 hover:shadow-orange-300 transform transition-all hover:scale-[1.02] active:scale-95"
                    >
                      Đặt tour ngay
                    </button>
                  </div>
                </div>
              </div>

              {/* Support Card */}
              <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-[2rem] p-8 text-white shadow-xl">
                 <h4 className="font-bold text-xl mb-4">Cần hỗ trợ?</h4>
                 <div className="space-y-4">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"><IconPhone className="w-5 h-5" /></div>
                       <div>
                          <p className="text-xs text-white/60">Hotline 24/7</p>
                          <p className="font-bold">1900 123 456</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"><IconStar className="w-5 h-5" /></div>
                       <p className="text-sm font-medium">Đảm bảo giá tốt nhất & dịch vụ uy tín</p>
                    </div>
                 </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
