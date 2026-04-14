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

export default function ActivitiesPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [reviews, setReviews] = useState([]);
  const [reviewsData, setReviewsData] = useState({ count: 0, average_rating: 0 });

  // Booking details
  const [tourDate, setTourDate] = useState('');
  const [participants, setParticipants] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState(null);

  const loadData = async () => {
    try {
      const [actRes, catRes] = await Promise.all([
        axios.get(`${API}/activities`),
        axios.get(`${API}/categories`)
      ]);
      
      setRows(actRes.data || []);
      setCategories(catRes.data || []);

      // If ID in URL, auto-select that activity
      if (id && actRes.data) {
        const activity = actRes.data.find(a => a.id === parseInt(id));
        if (activity) {
          setSelectedActivity(activity);
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  useEffect(() => { loadData(); }, [id]);

  useEffect(() => {
    if (selectedActivity) {
      axios.get(`${API}/reviews?service_type=activity&service_id=${selectedActivity.id}`)
        .then(res => {
          setReviews(res.data.items || []);
          setReviewsData({ count: res.data.count || 0, average_rating: res.data.average_rating || 0 });
        })
        .catch(err => {
          console.error('Error fetching reviews:', err);
        });
    }
  }, [selectedActivity]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price || 0);
  };

  const handleBookActivity = (activity) => {
    if (!tourDate) {
      alert('Vui lòng chọn ngày khởi hành!');
      return;
    }

    if (participants < 1) {
      alert('Số lượng người tham gia phải ít nhất là 1!');
      return;
    }

    const cartItem = {
      id: `activity-${activity.id}-${Date.now()}`,
      name: selectedPackage ? `${activity.name} - ${selectedPackage.name}` : activity.name,
      type: 'Tour',
      price: parseFloat(selectedPackage ? selectedPackage.price : activity.price),
      quantity: participants,
      image: activity.image_url,
      details: {
        activity_id: activity.id,
        location: activity.location,
        duration: activity.duration,
        tour_date: tourDate,
        participants: participants,
        package: selectedPackage ? selectedPackage.name : null
      }
    };

    try {
      const existingCart = JSON.parse(localStorage.getItem('pendingCart') || '[]');
      const updatedCart = [...existingCart, cartItem];
      localStorage.setItem('pendingCart', JSON.stringify(updatedCart));
      navigate('/checkout');
    } catch (e) {
      console.error('Failed to save to cart', e);
      alert('Có lỗi xảy ra. Vui lòng thử lại!');
    }
  };

  const handleCloseModal = () => {
    setSelectedActivity(null);
    setTourDate('');
    setParticipants(1);
    setReviews([]);
    setReviewsData({ count: 0, average_rating: 0 });
    setSelectedPackage(null);
  };

  const filteredActivities = rows.filter(act => {
    if (activeCategory === 'All') return true;
    return act.categories?.some(c => c.name === activeCategory);
  });

  const displayActivities = rows.length > 0 ? filteredActivities : sampleActivities;

  const statistics = [
    { number: '50,000+', label: 'Khách hàng hài lòng', icon: <IconUsers /> },
    { number: '500+', label: 'Hoạt động đa dạng', icon: <IconActivity /> },
    { number: '99%', label: 'Tỷ lệ hài lòng', icon: <IconStar /> },
    { number: '24/7', label: 'Hỗ trợ đặt tour', icon: <IconShield /> }
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

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
             <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full mb-8 shadow-lg">
              <IconShield className="w-4 h-4" />
              <span className="text-sm font-medium">Trải nghiệm đáng nhớ</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
              Khám Phá <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-cyan-200">Hoạt Động</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100/90 mb-10 leading-relaxed max-w-3xl mx-auto">
              Tìm kiếm sự phiêu lưu, thư giãn hoặc khám phá văn hóa tại mọi điểm đến.
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
           <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => setActiveCategory('All')}
                className={`px-6 py-2 rounded-full font-bold transition-all ${
                  activeCategory === 'All'
                    ? 'bg-blue-600 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Tất cả
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`px-6 py-2 rounded-full font-bold transition-all flex items-center gap-2 ${
                    activeCategory === cat.name
                      ? 'bg-blue-600 text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat.icon && (typeof cat.icon === 'string' && (cat.icon.startsWith('http') || cat.icon.startsWith('/')) ? (
                    <img src={cat.icon} alt={cat.name} className="w-5 h-5 rounded-full object-cover" />
                  ) : (
                    <span>{cat.icon}</span>
                  ))}
                  {cat.name}
                </button>
              ))}
           </div>
        </div>
      </section>

      {/* Activities Listing */}
      <section id="hoat-dong" className="py-20 bg-gradient-to-b from-gray-50 to-white min-h-[600px]">
        <div className="max-w-7xl mx-auto px-4">
          {displayActivities.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayActivities.map((activity) => (
                <ActivityCard key={activity.id} activity={activity} onClick={setSelectedActivity} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
               <IconActivityLarge className="mx-auto w-16 h-16 opacity-30 mb-4" />
               <p className="text-xl text-gray-500">Không tìm thấy hoạt động nào trong danh mục này.</p>
               <button onClick={() => setActiveCategory('All')} className="mt-4 text-blue-600 font-bold hover:underline">Xem tất cả hoạt động</button>
            </div>
          )}
        </div >
      </section >

      {/* Detail Modal */}
      {
        selectedActivity && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={handleCloseModal}>
            <div className="bg-white rounded-3xl max-w-4xl w-full my-8 shadow-2xl animate-in fade-in zoom-in duration-300" onClick={(e) => e.stopPropagation()}>
              <div className="relative h-72 md:h-96 w-full">
                {selectedActivity.image_url ? (
                  <img
                    src={selectedActivity.image_url}
                    alt={selectedActivity.name}
                    className="w-full h-full object-cover rounded-t-3xl"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-t-3xl">
                     <IconActivityLarge className="opacity-10 w-32 h-32" />
                  </div>
                )}
                <button
                  onClick={handleCloseModal}
                  className="absolute top-4 right-4 w-10 h-10 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full text-white text-2xl flex items-center justify-center transition"
                >
                  ×
                </button>
                <div className="absolute bottom-6 left-6 right-6">
                   <div className="flex flex-wrap gap-2 mb-3">
                      {selectedActivity.categories?.map(cat => (
                        <span key={cat.id} className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md text-white border border-white/30 px-3 py-1 rounded-full text-xs font-bold">
                          {cat.icon && (typeof cat.icon === 'string' && (cat.icon.startsWith('http') || cat.icon.startsWith('/')) ? (
                            <img src={cat.icon} alt={cat.name} className="w-3.5 h-3.5 rounded-full object-cover" />
                          ) : (
                            <span>{cat.icon}</span>
                          ))}
                          {cat.name}
                        </span>
                      ))}
                   </div>
                   <h2 className="text-3xl md:text-4xl font-extrabold text-white drop-shadow-lg">{selectedActivity.name}</h2>
                </div>
              </div>
              
              <div className="p-8 grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-8">
                   <div className="flex flex-wrap gap-6 border-b pb-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600">
                          <IconLocation className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Địa điểm</p>
                          <p className="font-bold text-gray-900">{selectedActivity.location}</p>
                        </div>
                      </div>
                      {selectedActivity.duration && (
                        <div className="flex items-center gap-3">
                           <div className="p-2.5 bg-orange-50 rounded-xl text-orange-600">
                            <IconClock className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Thời gian</p>
                            <p className="font-bold text-gray-900">{selectedActivity.duration}</p>
                          </div>
                        </div>
                      )}
                   </div>

                   <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                         Mô tả chi tiết
                      </h3>
                      <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{selectedActivity.description || 'Chưa có mô tả chi tiết cho hoạt động này.'}</p>
                   </div>

                   {selectedActivity.includes && (
                     <div className="mt-8">
                        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                           Bao gồm trong tour
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                           {(Array.isArray(selectedActivity.includes) ? selectedActivity.includes : []).map((item, idx) => (
                             <div key={idx} className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <IconCheck className="w-5 h-5 text-green-500" />
                                <span className="text-gray-700 font-medium">{item}</span>
                             </div>
                           ))}
                        </div>
                     </div>
                   )}

                   {/* Itinerary */}
                   {selectedActivity.itinerary && Array.isArray(selectedActivity.itinerary) && selectedActivity.itinerary.length > 0 && (
                     <div className="mt-8 border-t pt-8">
                        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                           Lịch trình chi tiết
                        </h3>
                        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-300 before:to-transparent">
                           {selectedActivity.itinerary.map((day, idx) => (
                             <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-blue-100 text-blue-600 font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10">
                                   {idx + 1}
                                </div>
                                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-5 rounded-2xl bg-gray-50 border border-gray-100 shadow-sm">
                                   <div className="flex flex-col">
                                      <h4 className="font-bold text-gray-900 text-lg mb-1">{day.title || `Ngày ${idx + 1}`}</h4>
                                      <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">{day.description}</p>
                                   </div>
                                </div>
                             </div>
                           ))}
                        </div>
                     </div>
                   )}

                   {/* Policies and Terms */}
                   <div className="mt-8 border-t pt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                      {(selectedActivity.cancellationPolicy || selectedActivity.policies?.cancellationPolicy) && (
                        <div className="bg-orange-50 rounded-2xl p-5 border border-orange-100 h-full">
                           <h3 className="text-lg font-bold text-orange-800 mb-3 flex items-center gap-2">
                              Chính sách hoàn huỷ
                           </h3>
                           <p className="text-orange-900/80 text-sm whitespace-pre-wrap leading-relaxed">
                             {selectedActivity.cancellationPolicy || selectedActivity.policies?.cancellationPolicy}
                           </p>
                        </div>
                      )}
                      
                      {(selectedActivity.termsAndConditions || selectedActivity.policies?.termsAndConditions) && (
                        <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100 h-full">
                           <h3 className="text-lg font-bold text-blue-800 mb-3 flex items-center gap-2">
                              Điều khoản & Lưu ý
                           </h3>
                           <p className="text-blue-900/80 text-sm whitespace-pre-wrap leading-relaxed">
                             {selectedActivity.termsAndConditions || selectedActivity.policies?.termsAndConditions}
                           </p>
                        </div>
                      )}
                   </div>

                   {/* Reviews Section */}
                   <div className="mt-8 border-t pt-8">
                      <div className="flex items-center justify-between mb-6">
                         <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <IconStar className="w-6 h-6 text-yellow-400" />
                            Đánh giá của người dùng
                         </h3>
                         {reviewsData.count > 0 && (
                           <div className="flex items-center gap-2 bg-yellow-50 px-4 py-2 rounded-xl border border-yellow-100">
                              <span className="font-extrabold text-xl text-yellow-600">{reviewsData.average_rating}</span>
                              <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                  <svg key={i} className={`w-4 h-4 ${i < Math.round(reviewsData.average_rating) ? 'fill-current' : 'text-gray-300'}`} viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                                ))}
                              </div>
                              <span className="text-sm font-bold text-gray-500">({reviewsData.count} đánh giá)</span>
                           </div>
                         )}
                      </div>

                      {reviews.length > 0 ? (
                        <div className="space-y-4">
                           {reviews.map((review) => (
                             <div key={review.id} className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                                <div className="flex items-center justify-between mb-3">
                                   <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">
                                         {String(review.user?.name || 'K').charAt(0).toUpperCase()}
                                      </div>
                                      <div>
                                         <p className="font-bold text-gray-900">{review.user?.name || 'Khách hàng ẩn danh'}</p>
                                         <p className="text-xs text-gray-500 font-medium">{new Date(review.createdAt).toLocaleDateString('vi-VN')}</p>
                                      </div>
                                   </div>
                                   <div className="flex text-yellow-400">
                                      {[...Array(5)].map((_, i) => (
                                        <svg key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`} viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                                      ))}
                                   </div>
                                </div>
                                {review.comment && (
                                  <p className="text-gray-600 italic">"{review.comment}"</p>
                                )}
                             </div>
                           ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                           <IconStar className="mx-auto w-10 h-10 text-gray-300 mb-2" />
                           <p className="text-gray-500 font-medium">Chưa có đánh giá nào cho hoạt động này.</p>
                        </div>
                      )}
                   </div>
                </div>

                <div className="space-y-6">
                   <div className="bg-white border-2 border-blue-600 rounded-3xl p-6 shadow-xl sticky top-24">
                      {selectedActivity.packages && Array.isArray(selectedActivity.packages) && selectedActivity.packages.length > 0 && (
                        <div className="mb-6 border-b pb-6">
                           <label className="block text-xs font-bold text-gray-500 mb-3 uppercase">Chọn gói dịch vụ</label>
                           <div className="space-y-3">
                              {selectedActivity.packages.map((pkg, idx) => (
                                <div 
                                  key={idx} 
                                  onClick={() => setSelectedPackage(pkg)}
                                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedPackage === pkg ? 'border-blue-600 bg-blue-50 shadow-md scale-[1.02]' : 'border-gray-100 hover:border-gray-300 bg-gray-50'}`}
                                >
                                   <div className="flex justify-between items-center mb-1">
                                      <span className="font-bold text-gray-900">{pkg.name}</span>
                                      <span className="font-bold text-blue-600">{formatPrice(pkg.price)} đ</span>
                                   </div>
                                   {pkg.description && <p className="text-xs text-gray-500 mt-1">{pkg.description}</p>}
                                </div>
                              ))}
                           </div>
                        </div>
                      )}

                      <div className="mb-6">
                        <p className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">Giá từ</p>
                        <div className="flex items-baseline gap-2">
                          <span className="text-4xl font-extrabold text-blue-600">{formatPrice(selectedPackage ? selectedPackage.price : selectedActivity.price)}</span>
                          <span className="text-gray-500 font-bold">VND</span>
                        </div>
                      </div>

                      <div className="space-y-4 mb-6">
                        <div>
                           <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Chọn ngày khởi hành</label>
                           <input
                              type="date"
                              value={tourDate}
                              onChange={(e) => setTourDate(e.target.value)}
                              min={new Date().toISOString().split('T')[0]}
                              className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-all font-bold"
                           />
                        </div>
                        <div>
                           <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Số lượng khách</label>
                           <div className="flex items-center justify-between bg-gray-50 border-2 border-gray-100 rounded-xl px-2 py-2">
                              <button
                                onClick={() => setParticipants(Math.max(1, participants - 1))}
                                className="w-10 h-10 rounded-lg bg-white border border-gray-200 text-gray-600 font-bold hover:bg-gray-100 transition shadow-sm"
                              >
                                -
                              </button>
                              <span className="font-bold text-xl">{participants}</span>
                              <button
                                onClick={() => setParticipants(participants + 1)}
                                className="w-10 h-10 rounded-lg bg-white border border-gray-200 text-gray-600 font-bold hover:bg-gray-100 transition shadow-sm"
                              >
                                +
                              </button>
                           </div>
                        </div>
                      </div>

                      <div className="border-t pt-6 mb-6">
                         <div className="flex justify-between items-center mb-1">
                            <span className="text-gray-500 font-medium">Tạm tính</span>
                            <span className="font-bold">{formatPrice((selectedPackage ? selectedPackage.price : selectedActivity.price) * participants)} VND</span>
                         </div>
                         <div className="flex justify-between items-center text-xl font-extrabold text-gray-900 mt-4">
                            <span>Tổng cộng</span>
                            <span className="text-blue-600">{formatPrice((selectedPackage ? selectedPackage.price : selectedActivity.price) * participants)} VND</span>
                         </div>
                      </div>

                      <button
                        onClick={() => handleBookActivity(selectedActivity)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-200 transition-all active:scale-95"
                      >
                        Đặt Ngay
                      </button>
                      <p className="text-center text-[10px] text-gray-400 mt-4">Xác nhận đặt tour ngay lập tức</p>
                   </div>
                </div>
              </div>
            </div>
          </div>
        )
      }
    </div >
  );
}
