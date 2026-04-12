import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { sampleActivities } from '../data/mockData';
import { ActivityCard } from '../components/ServiceCards';

import {
  IconUsers, IconActivity, IconActivityLarge, IconShield,
  IconStar, IconCheck, IconPhone, IconMail, IconLocation, IconClock
} from '../components/Icons';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ─── Helper: safely parse JSON field ──────────────────────────────────────────
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

// ─── ActivityDetailModal ───────────────────────────────────────────────────────
function ActivityDetailModal({ activity, onClose, onBook, tourDate, setTourDate, participants, setParticipants, formatPrice }) {
  const [activeTab, setActiveTab] = useState('info');
  const [expandedDay, setExpandedDay] = useState(0);
  const [expandedTerms, setExpandedTerms] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState(null);

  const itinerary = safeArr(activity.itinerary);
  const pricePackages = safeArr(activity.price_packages);
  const includes = safeArr(activity.includes);

  let policies = activity.policies;
  if (typeof policies === 'string') { try { policies = JSON.parse(policies); } catch { policies = null; } }

  const tabs = [
    { id: 'info', label: 'Thông tin' },
    ...(itinerary.length > 0 ? [{ id: 'itinerary', label: 'Lịch trình' }] : []),
    ...(pricePackages.length > 0 ? [{ id: 'pricing', label: 'Giá gói' }] : []),
    ...((policies && Object.values(policies).some(Boolean)) ? [{ id: 'policy', label: 'Chính sách' }] : []),
    ...((activity.terms || activity.notes) ? [{ id: 'terms', label: 'Điều khoản' }] : []),
  ];

  const effectivePrice = selectedPkg ? selectedPkg.price : activity.price;

  const handleBook = () => {
    onBook({ ...activity, price: effectivePrice, selectedPackage: selectedPkg });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 rounded-t-3xl flex justify-between items-start z-10">
          <div className="flex-1 pr-4">
            <h2 className="text-2xl font-bold text-gray-900 leading-tight">{activity.name}</h2>
            <div className="flex flex-wrap items-center gap-3 mt-2">
              {activity.location && (
                <span className="flex items-center gap-1 text-sm text-gray-500">
                  <IconLocation className="w-4 h-4 text-blue-500" /> {activity.location}
                </span>
              )}
              {activity.duration && (
                <span className="flex items-center gap-1 text-sm text-gray-500">
                  <IconClock className="w-4 h-4 text-blue-500" /> {activity.duration}
                </span>
              )}
              {activity.category && (
                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-medium">{activity.category}</span>
              )}
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl flex-shrink-0 mt-1">×</button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1">
          {/* Hero image */}
          {activity.image_url && (
            <img src={activity.image_url} alt={activity.name} className="w-full h-52 object-cover" />
          )}

          {/* Tab Bar */}
          <div className="px-6 pt-4">
            <div className="flex gap-1 bg-gray-100 rounded-xl p-1 overflow-x-auto">
              {tabs.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    activeTab === tab.id ? 'bg-white text-blue-600 shadow' : 'text-gray-500 hover:text-gray-700'
                  }`}>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="px-6 py-4 space-y-6">

            {/* ── Tab: Thông tin ── */}
            {activeTab === 'info' && (
              <>
                {/* Price */}
                <div className="flex items-end gap-3">
                  <div className="text-4xl font-extrabold" style={{ color: '#FF6B35' }}>
                    {formatPrice(effectivePrice)} <span className="text-xl font-medium text-gray-400">VND</span>
                  </div>
                  <span className="text-gray-500 mb-1">/ người</span>
                </div>

                {/* Description */}
                {activity.description && (
                  <p className="text-gray-600 leading-relaxed">{activity.description}</p>
                )}

                {/* Includes */}
                {includes.length > 0 && (
                  <div>
                    <h4 className="font-bold text-gray-900 mb-3">Bao gồm</h4>
                    <div className="grid md:grid-cols-2 gap-2">
                      {includes.map((item, i) => (
                        <div key={i} className="flex items-center gap-2 bg-green-50 rounded-lg px-3 py-2">
                          <span className="text-green-600 font-bold flex-shrink-0">✓</span>
                          <span className="text-sm text-gray-700">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Meeting point */}
                {activity.meeting_point && (
                  <div className="bg-blue-50 rounded-xl p-4">
                    <div className="font-semibold text-gray-900 text-sm mb-1">Điểm hẹn</div>
                    <div className="text-gray-600 text-sm">{activity.meeting_point}</div>
                    <div className="text-xs text-blue-600 mt-1">Vui lòng có mặt trước 15 phút</div>
                  </div>
                )}
              </>
            )}

            {/* ── Tab: Lịch trình ── */}
            {activeTab === 'itinerary' && (
              <div className="space-y-3">
                {itinerary.map((day, idx) => (
                  <div key={idx} className={`border-2 rounded-2xl overflow-hidden transition-all ${expandedDay === idx ? 'border-blue-400 shadow-md' : 'border-gray-200'}`}>
                    <button
                      className="w-full flex items-center gap-4 px-5 py-4 text-left"
                      onClick={() => setExpandedDay(expandedDay === idx ? -1 : idx)}
                    >
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-600 to-sky-500 text-white rounded-full flex items-center justify-center font-bold text-sm shadow">
                        {day.day}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">{day.title}</div>
                        {day.description && <div className="text-xs text-gray-500 mt-0.5">{day.description}</div>}
                      </div>
                      <span className="text-gray-400 text-sm">{expandedDay === idx ? '▲' : '▼'}</span>
                    </button>
                    {expandedDay === idx && day.activities && day.activities.length > 0 && (
                      <div className="px-5 pb-4 space-y-2 border-t border-gray-100">
                        {day.activities.map((act, i) => (
                          <div key={i} className="flex items-start gap-3 py-2">
                            <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-blue-400"></div>
                            <span className="text-sm text-gray-700">{act}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* ── Tab: Giá gói ── */}
            {activeTab === 'pricing' && (
              <div>
                <p className="text-sm text-gray-500 mb-4">Chọn gói phù hợp với nhóm của bạn</p>
                <div className="grid md:grid-cols-2 gap-4">
                  {pricePackages.map((pkg, idx) => (
                    <button key={idx} type="button" onClick={() => setSelectedPkg(pkg)}
                      className={`text-left border-2 rounded-2xl p-5 transition-all ${
                        selectedPkg?.name === pkg.name
                          ? 'border-orange-500 bg-orange-50 shadow-lg'
                          : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50/50'
                      }`}>
                      <div className="flex items-start justify-between mb-2">
                        <div className="font-bold text-gray-900">{pkg.name}</div>
                        {selectedPkg?.name === pkg.name && (
                          <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">✓ Đã chọn</span>
                        )}
                      </div>
                      <div className="text-2xl font-extrabold text-orange-600 mb-2">
                        {formatPrice(pkg.price)} <span className="text-sm font-medium text-gray-400">đ/người</span>
                      </div>
                      <div className="text-xs text-gray-500 mb-3">{pkg.min_people}–{pkg.max_people} người</div>
                      {pkg.includes && pkg.includes.length > 0 && (
                        <ul className="space-y-1">
                          {pkg.includes.map((inc, i) => (
                            <li key={i} className="flex items-center gap-1.5 text-sm text-gray-700">
                              <span className="text-green-500 font-bold">✓</span> {inc}
                            </li>
                          ))}
                        </ul>
                      )}
                    </button>
                  ))}
                </div>
                {selectedPkg && (
                  <div className="mt-3 text-center text-sm text-green-600 font-semibold">
                    ✓ Đã chọn: {selectedPkg.name} – {formatPrice(selectedPkg.price)} đ/người
                  </div>
                )}
              </div>
            )}

            {/* ── Tab: Chính sách ── */}
            {activeTab === 'policy' && policies && (
              <div className="space-y-4">
                {[
                  { key: 'cancel', label: 'Hủy đặt tour', color: 'blue' },
                  { key: 'change', label: 'Đổi ngày', color: 'green' },
                  { key: 'weather', label: 'Thời tiết', color: 'yellow' },
                  { key: 'children', label: 'Trẻ em', color: 'purple' },
                ].map(({ key, label, color }) => policies[key] ? (
                  <div key={key} className={`border-l-4 border-${color}-500 pl-4 py-2`}>
                    <div className="font-semibold text-gray-900 mb-1">{label}</div>
                    <div className="text-sm text-gray-600 whitespace-pre-line">{policies[key]}</div>
                  </div>
                ) : null)}
              </div>
            )}

            {/* ── Tab: Điều khoản ── */}
            {activeTab === 'terms' && (
              <div className="space-y-6">
                {activity.terms && (
                  <div>
                    <button
                      className="w-full flex items-center justify-between font-bold text-gray-900 mb-3"
                      onClick={() => setExpandedTerms(!expandedTerms)}
                    >
                      <span>Điều khoản & Lưu ý</span>
                      <span className="text-gray-400">{expandedTerms ? '▲' : '▼'}</span>
                    </button>
                    {expandedTerms && (
                      <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                        {activity.terms}
                      </div>
                    )}
                    {!expandedTerms && (
                      <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 line-clamp-4 cursor-pointer" onClick={() => setExpandedTerms(true)}>
                        {activity.terms}
                      </div>
                    )}
                  </div>
                )}
                {activity.notes && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                    <div className="font-semibold text-yellow-800 mb-2">Ghi chú bổ sung</div>
                    <div className="text-sm text-yellow-700 whitespace-pre-line">{activity.notes}</div>
                  </div>
                )}
              </div>
            )}

            {/* Booking Form */}
            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-5 border-2 border-orange-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Thông tin đặt tour</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ngày khởi hành *</label>
                  <input type="date" value={tourDate} onChange={e => setTourDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full border-2 border-orange-300 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Số người tham gia *</label>
                  <div className="flex items-center gap-3">
                    <button type="button" onClick={() => setParticipants(Math.max(1, participants - 1))}
                      className="w-10 h-10 rounded-lg bg-orange-500 text-white font-bold hover:bg-orange-600 transition">-</button>
                    <input type="number" value={participants} onChange={e => setParticipants(Math.max(1, parseInt(e.target.value) || 1))}
                      min="1" className="w-20 border-2 border-orange-300 rounded-lg px-3 py-2 text-center font-bold focus:outline-none focus:border-orange-500" />
                    <button type="button" onClick={() => setParticipants(participants + 1)}
                      className="w-10 h-10 rounded-lg bg-orange-500 text-white font-bold hover:bg-orange-600 transition">+</button>
                    <span className="text-sm text-gray-600">người</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-orange-300 flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-700">Tổng tiền:</span>
                <div className="text-right">
                  <div className="text-3xl font-extrabold" style={{ color: '#FF6B35' }}>
                    {formatPrice(effectivePrice * participants)} VND
                  </div>
                  <div className="text-xs text-gray-500">{formatPrice(effectivePrice)} × {participants} người
                    {selectedPkg && ` • Gói: ${selectedPkg.name}`}
                  </div>
                </div>
              </div>
            </div>

            {/* Contact + Book */}
            <div id="lien-he" className="bg-gradient-to-r from-blue-600 to-sky-600 rounded-2xl p-5 text-white">
              <h3 className="text-lg font-bold mb-4">Liên Hệ & Đặt Tour</h3>
              <div className="grid md:grid-cols-2 gap-3 mb-4">
                <a href="tel:1900123456" className="flex flex-col bg-white/20 rounded-xl p-3 hover:bg-white/30 transition">
                  <div className="text-xs text-blue-100">Hotline</div><div className="font-semibold text-sm">1900 123 456</div>
                </a>
                <a href="mailto:activities@jurni.com" className="flex flex-col bg-white/20 rounded-xl p-3 hover:bg-white/30 transition">
                  <div className="text-xs text-blue-100">Email</div><div className="font-semibold text-sm">activities@jurni.com</div>
                </a>
              </div>
              <button className="w-full bg-white px-6 py-3 rounded-full font-bold transition-all hover:scale-105"
                style={{ color: '#FF6B35' }} onClick={handleBook}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#FFE8E0'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#FFFFFF'}>
                {selectedPkg ? `Đặt với gói "${selectedPkg.name}"` : 'Đặt tour ngay'}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}



export default function ActivitiesPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(null);

  // Booking details
  const [tourDate, setTourDate] = useState('');
  const [participants, setParticipants] = useState(1);

  const load = async () => {
    try {
      const res = await axios.get(`${API}/activities`);
      setRows(res.data || []);

      // If ID in URL, auto-select that activity
      if (id && res.data) {
        const activity = res.data.find(a => a.id === parseInt(id));
        if (activity) {
          setSelectedActivity(activity);
        }
      }
    } catch (error) {
      console.error('Error loading activities:', error);
      setRows([]);
    }
  };

  useEffect(() => { load(); }, [id]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price || 0);
  };

  const handleBookActivity = (activity) => {
    // Validate booking details
    if (!tourDate) {
      alert('Vui lòng chọn ngày khởi hành!');
      return;
    }

    if (participants < 1) {
      alert('Số lượng người tham gia phải ít nhất là 1!');
      return;
    }

    // Create cart item for the activity
    const cartItem = {
      id: `activity-${activity.id}-${Date.now()}`,
      name: activity.name,
      type: activity.category || 'Tour',
      price: parseFloat(activity.price),
      quantity: participants,
      image: activity.image_url,
      details: {
        activity_id: activity.id,
        location: activity.location,
        duration: activity.duration,
        category: activity.category,
        includes: activity.includes,
        tour_date: tourDate,
        participants: participants
      }
    };

    // Save to localStorage
    try {
      const existingCart = JSON.parse(localStorage.getItem('pendingCart') || '[]');
      const updatedCart = [...existingCart, cartItem];
      localStorage.setItem('pendingCart', JSON.stringify(updatedCart));

      // Navigate to checkout
      navigate('/checkout');
    } catch (e) {
      console.error('Failed to save to cart', e);
      alert('Có lỗi xảy ra. Vui lòng thử lại!');
    }
  };

  // Reset booking details when modal closes
  const handleCloseModal = () => {
    setSelectedActivity(null);
    setTourDate('');
    setParticipants(1);
  };

  const activities = rows.length > 0 ? rows : sampleActivities;

  const statistics = [
    { number: '50,000+', label: 'Khách hàng hài lòng', icon: <IconUsers /> },
    { number: '500+', label: 'Hoạt động đa dạng', icon: <IconActivity /> },
    { number: '99%', label: 'Tỷ lệ hài lòng', icon: <IconStar /> },
    { number: '24/7', label: 'Hỗ trợ đặt tour', icon: <IconShield /> }
  ];

  const values = [
    {
      title: 'Trải nghiệm độc đáo',
      description: 'Mỗi hoạt động đều được tuyển chọn kỹ lưỡng để mang đến trải nghiệm đáng nhớ nhất',
      icon: <IconStar />
    },
    {
      title: 'Giá cả hợp lý',
      description: 'Giá cả minh bạch, không phát sinh chi phí ẩn, nhiều chương trình khuyến mãi hấp dẫn',
      icon: <IconCheck />
    },
    {
      title: 'Hướng dẫn chuyên nghiệp',
      description: 'Đội ngũ hướng dẫn viên giàu kinh nghiệm, nhiệt tình và am hiểu văn hóa địa phương',
      icon: <IconUsers />
    },
    {
      title: 'An toàn tuyệt đối',
      description: 'Tất cả hoạt động đều được đảm bảo an toàn với bảo hiểm du lịch đầy đủ',
      icon: <IconShield />
    }
  ];

  const categories = [
    { name: 'Văn hóa & Lịch sử', icon: '🏛️', count: activities.filter(a => a.category?.includes('Văn hóa')).length },
    { name: 'Thiên nhiên & Du lịch', icon: '🌴', count: activities.filter(a => a.category?.includes('Thiên nhiên')).length },
    { name: 'Giải trí & Vui chơi', icon: '🎢', count: activities.filter(a => a.category?.includes('Giải trí')).length },
    { name: 'Thể thao & Mạo hiểm', icon: '🏄', count: activities.filter(a => a.category?.includes('Thể thao')).length }
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
              <span className="text-sm font-medium">Trải nghiệm đáng nhớ</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
              Hoạt Động & <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-cyan-200">Vui Chơi</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100/90 mb-10 leading-relaxed max-w-3xl mx-auto">
              Khám phá hàng trăm hoạt động thú vị từ tour văn hóa, giải trí đến thể thao mạo hiểm.
              Jurni mang đến cho bạn những trải nghiệm độc đáo và đáng nhớ tại mọi điểm đến.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="#hoat-dong" className="group relative bg-white text-blue-700 px-8 py-4 rounded-full font-bold hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-blue-500/50 overflow-hidden">
                <span className="relative z-10 flex items-center gap-2">
                  Xem hoạt động
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

                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values & Services Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
              Giá Trị & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-600">Dịch Vụ</span> Của Jurni
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Chúng tôi không chỉ tổ chức tour, mà còn mang đến những trải nghiệm đáng nhớ với những giá trị cốt lõi
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, idx) => (
              <div key={idx} className="group relative bg-white p-8 rounded-3xl border-2 border-gray-100 hover:border-orange-500 hover:shadow-2xl transition-all duration-300 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-sky-50/0 group-hover:from-blue-50 group-hover:to-sky-50 transition-all duration-300"></div>

                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-sky-600 text-white rounded-2xl mb-6 shadow-lg group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
                </div>

                <div className="absolute top-0 right-0 w-0 h-0 border-t-[40px] border-r-[40px] border-t-blue-500/10 border-r-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quality Focus Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-sky-700 rounded-[2.5rem] p-10 md:p-16 text-white overflow-hidden shadow-2xl">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-sky-400 rounded-full blur-3xl"></div>
            </div>

            <div className="absolute top-0 left-0 w-32 h-32 border-t-[3px] border-l-[3px] border-white/20 rounded-tl-[2.5rem]"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 border-b-[3px] border-r-[3px] border-white/20 rounded-br-[2.5rem]"></div>

            <div className="grid md:grid-cols-2 gap-12 relative z-10">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full mb-6">
                  <IconShield className="w-5 h-5" />
                  <span className="text-sm font-semibold">Cam kết chất lượng</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
                  Chất Lượng - <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-cyan-200">Mục Tiêu Hàng Đầu</span>
                </h2>
                <p className="text-lg text-blue-100/90 mb-8 leading-relaxed">
                  Tại Jurni, mỗi hoạt động đều được tuyển chọn kỹ lưỡng và đảm bảo:
                </p>
                <ul className="space-y-4">
                  {[
                    'Đối tác uy tín, được kiểm định chất lượng',
                    'Hướng dẫn viên chuyên nghiệp, giàu kinh nghiệm',
                    'An toàn tuyệt đối với bảo hiểm đầy đủ',
                    'Dịch vụ hỗ trợ 24/7, luôn sẵn sàng giúp đỡ',
                    'Giá cả minh bạch, không phát sinh chi phí ẩn'
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-4 group">
                      <div className="flex-shrink-0 w-8 h-8 bg-green-400/20 rounded-xl flex items-center justify-center group-hover:bg-green-400/30 transition-colors">
                        <IconCheck className="w-5 h-5 text-green-300" />
                      </div>
                      <span className="text-blue-100/90 text-base leading-relaxed pt-1">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative">
                <div className="bg-white/10 backdrop-blur-md rounded-3xl p-10 border-2 border-white/20 shadow-2xl">
                  <div className="text-center">
                    <div className="text-7xl font-extrabold mb-4 bg-gradient-to-br from-white to-blue-200 text-transparent bg-clip-text">
                      100%
                    </div>
                    <div className="text-2xl font-bold text-white mb-6">Hoạt động đạt chuẩn</div>
                    <div className="text-base text-blue-100/90 leading-relaxed max-w-sm mx-auto">
                      Tất cả hoạt động đều được kiểm tra và chứng nhận an toàn trước khi đưa vào sử dụng
                    </div>
                  </div>

                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-2xl rotate-12"></div>
                  <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-sky-400/20 rounded-2xl -rotate-12"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Diverse Categories Section */}
      <section className="py-20 bg-gradient-to-b from-white via-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
              Đa Dạng <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-600">Loại Hoạt Động</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Từ tour văn hóa, giải trí đến thể thao mạo hiểm, chúng tôi có đủ loại hoạt động phù hợp với mọi sở thích
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, idx) => (
              <div key={idx} className="group relative bg-white rounded-3xl p-8 shadow-lg border-2 border-gray-100 hover:border-orange-500 hover:shadow-2xl transition-all duration-300 overflow-hidden text-center">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-sky-50/0 group-hover:from-blue-50 group-hover:to-sky-50 transition-all duration-300"></div>

                <div className="relative z-10">
                  <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300">{category.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">{category.name}</h3>
                  <div className="text-blue-600 font-semibold">{category.count} hoạt động</div>
                </div>

                <div className="absolute top-0 right-0 w-0 h-0 border-t-[50px] border-r-[50px] border-t-blue-500/10 border-r-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Activities Listing */}
      <section id="hoat-dong" className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
              Danh Sách <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-600">Hoạt Động</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Khám phá các hoạt động thú vị và đặt tour ngay hôm nay
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activities.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} onClick={setSelectedActivity} />
            ))}
          </div>
        </div >
      </section >

      {/* Detail Modal */}
      {selectedActivity && (
        <ActivityDetailModal
          activity={selectedActivity}
          onClose={handleCloseModal}
          onBook={handleBookActivity}
          tourDate={tourDate}
          setTourDate={setTourDate}
          participants={participants}
          setParticipants={setParticipants}
          formatPrice={formatPrice}
        />
      )}
    </div >
  );
}
