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
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
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
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
        <h2 className="text-2xl font-bold mb-4">Không tìm thấy tour này</h2>
        <button onClick={() => navigate('/activities')} className="bg-orange-600 text-white px-6 py-2 rounded-full font-bold">Quay lại danh sách tour</button>
      </div>
    );
  }

  const itinerary = safeArr(activity.itinerary);
  const pricePackages = safeArr(activity.price_packages);
  const includesList = safeArr(activity.includes);
  const albumImages = safeArr(activity.images);
  
  // Combine all images for gallery
  const allImages = [];
  if (activity.image_url) allImages.push(activity.image_url);
  albumImages.forEach(img => { if (img && !allImages.includes(img)) allImages.push(img); });
  const displayImageView = allImages[selectedImageIndex] || activity.image_url || 'https://via.placeholder.com/800x400';

  let policies = activity.policies;
  if (typeof policies === 'string') { try { policies = JSON.parse(policies); } catch { policies = null; } }

  const effectivePrice = selectedPkg ? selectedPkg.price : activity.price;

  const tabs = [
    { id: 'info', label: 'Thông tin' },
    ...(itinerary.length > 0 ? [{ id: 'itinerary', label: 'Lịch trình' }] : []),
    ...(pricePackages.length > 0 ? [{ id: 'pricing', label: 'Giá gói' }] : []),
    { id: 'gallery', label: 'Hình ảnh & Video' },
    ...((policies && typeof policies === 'object' && Object.values(policies).some(Boolean)) ? [{ id: 'policy', label: 'Chính sách' }] : []),
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
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Premium Hero Section */}
      <div className="relative h-[500px] w-full overflow-hidden shadow-2xl">
        <img src={displayImageView} alt={activity.name} className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        <div className="absolute bottom-12 left-0 right-0 max-w-7xl mx-auto px-4 animate-fadeInUp">
          <button onClick={() => navigate('/activities')} className="text-white/70 hover:text-white mb-6 flex items-center gap-2 group transition-all">
            <span className="group-hover:-translate-x-1 transition-transform">←</span> Quay lại danh sách
          </button>
          <div className="flex flex-wrap items-center gap-3 mb-4">
             <span className="bg-orange-600 text-white text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest">{activity.category}</span>
             <span className="flex items-center gap-1 text-yellow-400 font-bold text-sm">★ STRAWBERRY PICKING</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight drop-shadow-lg">{activity.name}</h1>
          <div className="flex flex-wrap items-center gap-6 text-white/90 font-medium">
             <span className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20"><IconLocation className="w-5 h-5 text-orange-500" /> {activity.location}</span>
             <span className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20"><IconClock className="w-5 h-5 text-orange-500" /> {activity.duration}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-12">
        <div className="grid lg:grid-cols-3 gap-10">
          
          <div className="lg:col-span-2 space-y-8">
            <div className="flex gap-2 bg-white p-2 rounded-2xl shadow-lg border border-gray-100 overflow-x-auto sticky top-4 z-20">
              {tabs.map(tab => (
                <button 
                  key={tab.id} 
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-shrink-0 px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                    activeTab === tab.id ? 'bg-orange-600 text-white shadow-orange-500/30 shadow-lg' : 'text-gray-400 hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
              {activeTab === 'info' && (
                <div className="space-y-8 animate-fadeIn">
                  <div>
                    <h3 className="text-2xl font-black text-gray-900 mb-4 border-l-4 border-orange-600 pl-4 uppercase">Tổng quan chuyến đi</h3>
                    <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line">{activity.description}</p>
                  </div>

                  {includesList.length > 0 && (
                    <div>
                      <h3 className="text-xl font-black text-gray-900 mb-6 uppercase">Tour bao gồm</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        {includesList.map((item, i) => (
                          <div key={i} className="flex items-center gap-3 bg-orange-50/50 p-4 rounded-2xl border border-orange-100 shadow-sm">
                            <IconCheck className="text-green-600 w-5 h-5" />
                            <span className="text-gray-700 font-bold text-sm">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activity.meeting_point && (
                    <div className="bg-blue-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden group">
                      <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                      <h4 className="font-black text-xl mb-3 flex items-center gap-2">📍 Điểm tập trung</h4>
                      <p className="text-blue-50 text-lg font-medium">{activity.meeting_point}</p>
                      <p className="text-xs text-blue-200 mt-4 leading-relaxed font-bold italic tracking-wide text-right">* Vui lòng có mặt đúng giờ để chuyến đi khởi hành đúng lịch trình.</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'itinerary' && (
                <div className="space-y-4 animate-fadeIn">
                  <h3 className="text-2xl font-black text-gray-900 mb-8 border-l-4 border-orange-600 pl-4 uppercase">Lịch trình chi tiết</h3>
                  {itinerary.map((day, idx) => (
                    <div key={idx} className="border-2 rounded-3xl overflow-hidden transition-all bg-white hover:border-orange-200 shadow-sm">
                      <button 
                        className="w-full flex items-center gap-5 px-8 py-6 text-left"
                        onClick={() => setExpandedDay(expandedDay === idx ? -1 : idx)}
                      >
                        <div className="w-14 h-14 bg-gradient-to-br from-orange-600 to-orange-400 text-white rounded-2xl flex items-center justify-center font-black shadow-lg flex-shrink-0 text-xl">
                          0{day.day || idx + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-black text-gray-900 text-lg">{day.title}</h4>
                          <p className="text-sm text-gray-500 font-medium">{day.description}</p>
                        </div>
                        <span className={`transition-transform duration-300 ${expandedDay === idx ? 'rotate-180' : ''}`}>▼</span>
                      </button>
                      {expandedDay === idx && (
                        <div className="px-8 pb-8 pt-2 border-t border-gray-100 space-y-4 animate-fadeIn">
                          {day.activities?.map((act, i) => (
                            <div key={i} className="flex items-start gap-4">
                              <div className="w-3 h-3 mt-1.5 rounded-full bg-orange-600 border-4 border-orange-100 shadow-sm"></div>
                              <p className="text-gray-700 font-bold leading-relaxed">{act}</p>
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
                   <h3 className="text-2xl font-black text-gray-900 mb-8 border-l-4 border-orange-600 pl-4 uppercase">Các gói dịch vụ</h3>
                   <div className="grid md:grid-cols-2 gap-6">
                      {pricePackages.map((pkg, idx) => (
                        <button 
                          key={idx}
                          onClick={() => setSelectedPkg(pkg)}
                          className={`text-left p-8 rounded-[2rem] border-2 transition-all relative ${
                            selectedPkg?.name === pkg.name 
                            ? 'border-orange-500 bg-orange-50 shadow-2xl scale-[1.02]' 
                            : 'border-gray-100 hover:border-orange-200 hover:bg-gray-50'
                          }`}
                        >
                          <h4 className="font-black text-xl mb-3 text-gray-900">{pkg.name}</h4>
                          <div className="text-3xl font-black text-orange-600 mb-3">{formatPrice(pkg.price)} đ <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">/ khách</span></div>
                          <p className="text-xs font-black text-gray-400 bg-white/80 p-2 rounded-lg mb-6 border border-gray-100 inline-block">Min {pkg.min_people} - Max {pkg.max_people} pax</p>
                          <ul className="space-y-3">
                             {Array.isArray(pkg.includes) && pkg.includes.map((inc, i) => (
                               <li key={i} className="text-sm text-gray-600 font-bold flex gap-3 items-center"><IconCheck className="w-4 h-4 text-green-500 flex-shrink-0" /> {inc}</li>
                             ))}
                          </ul>
                        </button>
                      ))}
                   </div>
                </div>
              )}

              {activeTab === 'gallery' && (
                <div className="space-y-12 animate-fadeIn">
                   <div>
                      <h3 className="text-2xl font-black text-gray-900 mb-8 border-l-4 border-orange-600 pl-4 uppercase">Thư viện ảnh Tour</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {(allImages.length > 0 ? allImages : [activity.image_url]).map((img, i) => (
                          <div key={i} onClick={() => setSelectedImageIndex(allImages.indexOf(img))} className="group aspect-video rounded-3xl overflow-hidden shadow-lg border-2 border-transparent hover:border-orange-500 cursor-pointer transition-all">
                            <img src={img} className="w-full h-full object-cover transition duration-500 group-hover:scale-110" />
                          </div>
                        ))}
                      </div>
                   </div>
                   {(activity.video_url && typeof activity.video_url === 'string' && activity.video_url.trim() !== '') && (
                      <div className="animate-fadeIn">
                        <h3 className="text-2xl font-black text-gray-900 mb-8 border-l-4 border-orange-600 pl-4 uppercase">Video trải nghiệm</h3>
                        <div className="aspect-video w-full rounded-[2.5rem] overflow-hidden bg-black shadow-2xl border-4 border-white shadow-orange-200">
                           <iframe 
                             className="w-full h-full" 
                             src={activity.video_url.includes('youtube') 
                               ? activity.video_url.replace('watch?v=', 'embed/').split('&')[0] 
                               : activity.video_url} 
                             allowFullScreen 
                             title="Tour Experience Video"
                           />
                        </div>
                      </div>
                   )}
                </div>
              )}

              {activeTab === 'policy' && (
                <div className="space-y-6 animate-fadeIn">
                   <h3 className="text-2xl font-black text-gray-900 mb-8 border-l-4 border-orange-600 pl-4 uppercase">Quy định & Chính sách</h3>
                   <div className="grid gap-4">
                      {[
                          { key: 'cancel', label: 'Hoàn hủy', icon: '❌', bg: 'bg-red-50', border: 'border-red-100', text: 'text-red-700' },
                          { key: 'change', label: 'Đổi ngày', icon: '📅', bg: 'bg-blue-50', border: 'border-blue-100', text: 'text-blue-700' },
                          { key: 'children', label: 'Trẻ em', icon: '👶', bg: 'bg-purple-50', border: 'border-purple-100', text: 'text-purple-700' }
                      ].map(p => policies?.[p.key] && (
                        <div key={p.key} className={`${p.bg} ${p.border} border-2 rounded-3xl p-8`}>
                           <h4 className="font-black text-lg mb-4 flex items-center gap-3">{p.icon} {p.label}</h4>
                           <p className={`${p.text} font-bold leading-relaxed text-sm whitespace-pre-line`}>{policies[p.key]}</p>
                        </div>
                      ))}
                   </div>
                </div>
              )}

              {activeTab === 'terms' && (
                <div className="space-y-8 animate-fadeIn">
                  {activity.terms && (
                    <div className="bg-gray-50 border border-gray-100 p-8 rounded-[2rem] shadow-inner">
                      <h3 className="text-xl font-black text-gray-900 mb-6 uppercase">Điều khoản dịch vụ</h3>
                      <p className="text-gray-600 font-bold whitespace-pre-line leading-relaxed text-sm">{activity.terms}</p>
                    </div>
                  )}
                  {activity.notes && (
                    <div className="bg-orange-600 text-white p-8 rounded-[2rem] shadow-2xl shadow-orange-100">
                      <h3 className="text-xl font-black mb-4 flex items-center gap-2">💡 Ghi chú quan trọng</h3>
                      <p className="text-orange-50 font-medium whitespace-pre-line leading-relaxed italic">{activity.notes}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white rounded-[2.5rem] shadow-2xl border-2 border-orange-50 p-10 relative">
                <div className="absolute top-0 right-10 -mt-5 bg-orange-600 text-white px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest shadow-xl">Hot Sale</div>
                <div className="mb-8 text-center">
                  <span className="text-gray-400 text-xs font-black uppercase tracking-widest">Giá trọn gói chỉ từ</span>
                  <div className="text-5xl font-black text-orange-600 mt-1">{formatPrice(effectivePrice)} <span className="text-lg">đ</span></div>
                  <p className="text-gray-400 text-xs mt-2 uppercase font-black">/ 01 hành khách</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">Lịch khởi hành</label>
                    <input 
                      type="date" 
                      value={tourDate}
                      onChange={e => setTourDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-orange-600 outline-none font-black text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">Số lượng thành viên</label>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded-2xl border-2 border-gray-100">
                      <button onClick={() => setParticipants(Math.max(1, participants - 1))} className="w-12 h-12 flex items-center justify-center bg-white rounded-xl shadow-lg text-2xl font-black text-orange-600 active:scale-90 transition">-</button>
                      <span className="text-2xl font-black">{participants}</span>
                      <button onClick={() => setParticipants(participants + 1)} className="w-12 h-12 flex items-center justify-center bg-white rounded-xl shadow-lg text-2xl font-black text-orange-600 active:scale-90 transition">+</button>
                    </div>
                  </div>

                  <div className="pt-8 border-t border-gray-100 mt-8">
                    <div className="flex justify-between items-center mb-8">
                       <span className="text-gray-900 font-black uppercase text-xs tracking-widest">Thành tiền</span>
                       <div className="text-right">
                          <div className="text-3xl font-black text-gray-900">{formatPrice(effectivePrice * participants)} đ</div>
                          <p className="text-[10px] text-gray-400 font-bold uppercase mt-1 tracking-tighter">Bao gồm VAT & Phí dịch vụ</p>
                       </div>
                    </div>
                    
                    <button 
                      onClick={handleBook}
                      className="w-full bg-gradient-to-br from-orange-600 to-orange-500 text-white py-6 rounded-[2rem] font-black text-xl shadow-2xl shadow-orange-200 hover:shadow-orange-400 transform transition-all hover:scale-[1.03] active:scale-95 uppercase tracking-wider"
                    >
                      Xác nhận đặt tour
                    </button>
                    {!isSignedIn && <p className="text-center text-[10px] text-gray-400 mt-4 font-black uppercase tracking-widest">Vui lòng đăng nhập để đặt Tour</p>}
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
