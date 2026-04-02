import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, SignedIn, SignedOut } from '@clerk/clerk-react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function PriceAlertPage() {
  const navigate = useNavigate();
  const { getToken, isSignedIn } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    serviceType: 'flights', // flights, hotels, cars
    from: '',
    to: '',
    targetPrice: '',
    currentPrice: '',
    departureDate: '',
    returnDate: '',
    flexibleDates: false,
    email: '',
    notificationMethod: 'email' // email, push, both
  });

  // Load existing alerts
  useEffect(() => {
    if (isSignedIn) {
      loadAlerts();
    }
  }, [isSignedIn]);

  const loadAlerts = async () => {
    try {
      const token = await getToken();
      const res = await axios.get(`${API}/price-alerts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAlerts(res.data || []);
    } catch (err) {
      console.error('Error loading alerts:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!isSignedIn) {
      setError('Vui lòng đăng nhập để tạo cảnh báo giá');
      return;
    }

    if (!formData.from || !formData.to || !formData.targetPrice) {
      setError('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    setLoading(true);
    try {
      const token = await getToken();
      await axios.post(`${API}/price-alerts`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Đã tạo cảnh báo giá thành công! Bạn sẽ nhận thông báo khi giá đạt mục tiêu.');
      setFormData({
        serviceType: 'flights',
        from: '',
        to: '',
        targetPrice: '',
        currentPrice: '',
        departureDate: '',
        returnDate: '',
        flexibleDates: false,
        email: '',
        notificationMethod: 'email'
      });
      loadAlerts();
    } catch (err) {
      setError(err.response?.data?.error || 'Không thể tạo cảnh báo giá. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Bạn có chắc muốn xóa cảnh báo này?')) return;
    
    try {
      const token = await getToken();
      await axios.delete(`${API}/price-alerts/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Đã xóa cảnh báo giá thành công');
      loadAlerts();
    } catch (err) {
      setError('Không thể xóa cảnh báo. Vui lòng thử lại.');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price || 0);
  };

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-blue-900 mb-3">Cảnh báo giá</h1>
        <p className="text-gray-600 text-lg">
          Đăng ký nhận thông báo khi giá vé máy bay, khách sạn hoặc xe thuê giảm xuống mức bạn mong muốn. 
          Chúng tôi sẽ theo dõi và thông báo cho bạn ngay khi có giá tốt!
        </p>
      </div>

      <SignedOut>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Đăng nhập để sử dụng tính năng</h3>
          <p className="text-blue-700 mb-4">Bạn cần đăng nhập để tạo và quản lý cảnh báo giá.</p>
          <button
            onClick={() => navigate('/sign-in')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Đăng nhập ngay
          </button>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Form tạo cảnh báo */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Tạo cảnh báo giá mới</h2>
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}
            
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loại dịch vụ *
                </label>
                <select
                  value={formData.serviceType}
                  onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="flights">Vé máy bay</option>
                  <option value="hotels">Khách sạn</option>
                  <option value="cars">Cho thuê xe</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {formData.serviceType === 'flights' ? 'Điểm đi *' : formData.serviceType === 'hotels' ? 'Thành phố *' : 'Địa điểm nhận xe *'}
                  </label>
                  <input
                    type="text"
                    value={formData.from}
                    onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                    placeholder={formData.serviceType === 'flights' ? 'TP HCM' : 'Đà Nẵng'}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {formData.serviceType === 'flights' ? 'Điểm đến *' : formData.serviceType === 'hotels' ? 'Khách sạn' : 'Địa điểm trả xe'}
                  </label>
                  <input
                    type="text"
                    value={formData.to}
                    onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                    placeholder={formData.serviceType === 'flights' ? 'Hà Nội' : ''}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required={formData.serviceType === 'flights'}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giá hiện tại (VND)
                  </label>
                  <input
                    type="number"
                    value={formData.currentPrice}
                    onChange={(e) => setFormData({ ...formData, currentPrice: e.target.value })}
                    placeholder="1,000,000"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giá mục tiêu (VND) *
                  </label>
                  <input
                    type="number"
                    value={formData.targetPrice}
                    onChange={(e) => setFormData({ ...formData, targetPrice: e.target.value })}
                    placeholder="800,000"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              {formData.serviceType === 'flights' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ngày khởi hành
                      </label>
                      <input
                        type="date"
                        value={formData.departureDate}
                        onChange={(e) => setFormData({ ...formData, departureDate: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ngày về
                      </label>
                      <input
                        type="date"
                        value={formData.returnDate}
                        onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="flexibleDates"
                      checked={formData.flexibleDates}
                      onChange={(e) => setFormData({ ...formData, flexibleDates: e.target.checked })}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="flexibleDates" className="ml-2 text-sm text-gray-700">
                      Linh hoạt về ngày (±3 ngày)
                    </label>
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phương thức thông báo
                </label>
                <select
                  value={formData.notificationMethod}
                  onChange={(e) => setFormData({ ...formData, notificationMethod: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="email">Email</option>
                  <option value="push">Thông báo đẩy</option>
                  <option value="both">Cả hai</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Đang tạo...' : 'Tạo cảnh báo giá'}
              </button>
            </form>
          </div>

          {/* Danh sách cảnh báo */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Cảnh báo của tôi</h2>
            
            {alerts.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <p>Bạn chưa có cảnh báo giá nào</p>
                <p className="text-sm mt-2">Tạo cảnh báo đầu tiên để nhận thông báo khi giá giảm!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div key={alert.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded">
                            {alert.serviceType === 'flights' ? '✈️ Vé máy bay' : 
                             alert.serviceType === 'hotels' ? '🏨 Khách sạn' : '🚗 Xe thuê'}
                          </span>
                          {alert.status === 'active' && (
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">
                              Đang theo dõi
                            </span>
                          )}
                          {alert.status === 'triggered' && (
                            <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded">
                              Đã kích hoạt
                            </span>
                          )}
                        </div>
                        <h3 className="font-semibold text-gray-800">
                          {alert.from} {alert.to ? `→ ${alert.to}` : ''}
                        </h3>
                        {alert.departureDate && (
                          <p className="text-sm text-gray-600 mt-1">
                            Ngày: {new Date(alert.departureDate).toLocaleDateString('vi-VN')}
                            {alert.returnDate && ` - ${new Date(alert.returnDate).toLocaleDateString('vi-VN')}`}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => handleDelete(alert.id)}
                        className="text-red-500 hover:text-red-700 transition"
                        title="Xóa cảnh báo"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                      <div>
                        <p className="text-xs text-gray-500">Giá hiện tại</p>
                        <p className="text-sm font-semibold text-gray-700">
                          {alert.currentPrice ? `${formatPrice(alert.currentPrice)} VND` : 'Chưa có'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Mục tiêu</p>
                        <p className="text-sm font-semibold text-blue-600">
                          {formatPrice(alert.targetPrice)} VND
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </SignedIn>
    </div>
  );
}

