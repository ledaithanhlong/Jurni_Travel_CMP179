import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const formatCurrency = (value = 0) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

export default function AdminBookings() {
    const { getToken } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadBookings();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadBookings = async () => {
        try {
            setLoading(true);
            const token = await getToken();
            if (!token) return;

            const res = await axios.get(`${API}/bookings`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBookings(Array.isArray(res.data) ? res.data : []);
        } catch (error) {
            console.error('Error loading bookings:', error);
            alert('Lỗi khi tải danh sách đặt chỗ');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id, newStatus) => {
        if (!confirm(`Bạn có chắc chắn muốn chuyển trạng thái thành "${newStatus}"?`)) return;
        try {
            const token = await getToken();
            await axios.patch(`${API}/bookings/${id}`, { status: newStatus }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Cập nhật thành công!');
            loadBookings();
        } catch (error) {
            console.error('Error updating booking:', error);
            alert('Lỗi khi cập nhật trạng thái');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm(`Bạn có chắc chắn muốn XÓA booking #${id}?\n\nHành động này không thể hoàn tác!`)) {
            return;
        }

        try {
            const token = await getToken();
            await axios.delete(`${API}/bookings/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Đã xóa booking thành công!');
            loadBookings();
        } catch (error) {
            console.error('Error deleting booking:', error);
            alert(error.response?.data?.error || 'Lỗi khi xóa booking');
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            pending: 'bg-yellow-100 text-yellow-800',
            confirmed: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800',
            completed: 'bg-blue-100 text-blue-800',
        };
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
                {status}
            </span>
        );
    };

    if (loading) return <div className="text-center py-8">Đang tải dữ liệu đặt chỗ...</div>;

    return (
        <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Quản lý Đặt chỗ</h2>
                    <p className="text-sm text-gray-600 mt-1">Tổng số: {bookings.length} đơn</p>
                </div>
                <button
                    onClick={loadBookings}
                    className="text-sm text-blue-600 hover:text-blue-800 underline"
                >
                    Làm mới
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mã đơn</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Khách hàng</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dịch vụ</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tổng tiền</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày tạo</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {bookings.map((booking) => (
                            <tr key={booking.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    #{booking.id}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900">
                                    <div>{booking.user?.name || `User #${booking.user_id}`}</div>
                                    <div className="text-xs text-gray-500">{booking.user?.email || 'N/A'}</div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900">
                                    <div className="capitalize">{booking.service_type}</div>
                                    <div className="text-xs text-gray-500">ID: {booking.service_id}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                    {formatCurrency(booking.total_price)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(booking.createdAt).toLocaleDateString('vi-VN')}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {getStatusBadge(booking.status)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                                    {booking.status === 'pending' && (
                                        <>
                                            <button
                                                onClick={() => handleUpdateStatus(booking.id, 'confirmed')}
                                                className="text-green-600 hover:text-green-900 font-medium"
                                            >
                                                Duyệt
                                            </button>
                                            <button
                                                onClick={() => handleUpdateStatus(booking.id, 'cancelled')}
                                                className="text-red-600 hover:text-red-900 font-medium"
                                            >
                                                Hủy
                                            </button>
                                        </>
                                    )}
                                    {booking.status === 'confirmed' && (
                                        <button
                                            onClick={() => handleUpdateStatus(booking.id, 'completed')}
                                            className="text-blue-600 hover:text-blue-900 font-medium"
                                        >
                                            Hoàn tất
                                        </button>
                                    )}
                                    {/* Delete button always visible for admin */}
                                    <button
                                        onClick={() => handleDelete(booking.id)}
                                        className="text-red-600 hover:text-red-900 font-medium ml-2"
                                        title="Xóa booking"
                                    >
                                        Xóa
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {bookings.length === 0 && (
                            <tr>
                                <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                                    Chưa có dữ liệu đặt chỗ nào.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
