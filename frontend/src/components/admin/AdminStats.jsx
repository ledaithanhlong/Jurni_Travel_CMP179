import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const formatCurrency = (value = 0) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

export default function AdminStats() {
  const { getToken } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      if (!token) return;

      const res = await axios.get(`${API}/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(res.data?.data);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-8">Đang tải dữ liệu thống kê...</div>;
  if (!stats) return <div className="text-center py-8 text-red-500">Không thể tải dữ liệu thống kê</div>;

  const cards = [
    { label: 'Tổng Doanh thu', value: formatCurrency(stats.totalRevenue), icon: '💰', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
    { label: 'Tổng Đơn hàng', value: stats.totalBookings, icon: '📦', color: 'bg-blue-50 text-blue-600 border-blue-100' },
    { label: 'Tổng Người dùng', value: stats.totalUsers, icon: '👥', color: 'bg-amber-50 text-amber-600 border-amber-100' },
    { label: 'Đơn chờ xử lý', value: stats.pendingBookings, icon: '⏳', color: 'bg-rose-50 text-rose-600 border-rose-100' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, i) => (
          <div key={i} className={`p-6 rounded-xl border ${card.color} shadow-sm transition-transform hover:scale-105`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{card.icon}</span>
              <span className="text-xs font-bold uppercase tracking-wider opacity-60">{card.label}</span>
            </div>
            <div className="text-2xl font-bold">{card.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Doanh thu theo tháng (Dạng biểu đồ cột đơn giản bằng Tailwind) */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span>📈</span> Doanh thu theo tháng
          </h3>
          <div className="h-64 flex items-end gap-2 pb-6 border-b border-gray-100">
            {Array.from({ length: 12 }, (_, i) => {
              const monthData = stats.monthlyRevenue.find(m => m._id === i + 1);
              const height = monthData ? (monthData.revenue / (stats.totalRevenue || 1)) * 100 : 0;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative">
                  <div 
                    className="w-full bg-sky-500 rounded-t-sm transition-all hover:bg-sky-600 cursor-pointer" 
                    style={{ height: `${Math.max(height, 5)}%` }}
                  >
                    <div className="hidden group-hover:block absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-10">
                      {formatCurrency(monthData?.revenue || 0)}
                    </div>
                  </div>
                  <span className="text-[10px] text-gray-400 font-medium">T{i + 1}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Trạng thái đơn hàng */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span>📊</span> Tỉ lệ trạng thái đơn hàng
          </h3>
          <div className="space-y-4">
            {[
              { label: 'Chờ xử lý', count: stats.pendingBookings, color: 'bg-rose-500' },
              { label: 'Đã xác nhận', count: stats.confirmedBookings, color: 'bg-emerald-500' },
              { label: 'Đã hủy', count: stats.cancelledBookings, color: 'bg-gray-400' },
            ].map((item, i) => {
              const percent = stats.totalBookings > 0 ? (item.count / stats.totalBookings) * 100 : 0;
              return (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 font-medium">{item.label}</span>
                    <span className="text-gray-900 font-bold">{item.count} ({percent.toFixed(1)}%)</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color}`} style={{ width: `${percent}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-8 pt-6 border-t border-gray-50 flex justify-between items-center text-sm text-gray-500">
             <span>Tổng số người dùng tham gia:</span>
             <span className="font-bold text-gray-800">{stats.totalUsers} người</span>
          </div>
        </div>
      </div>
    </div>
  );
}
