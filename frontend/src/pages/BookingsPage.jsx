import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth, useUser } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    completed: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-red-100 text-red-800',
    refunded: 'bg-gray-100 text-gray-800',
};

const statusLabels = {
    pending: 'Chờ thanh toán',
    confirmed: 'Đã xác nhận',
    completed: 'Hoàn thành',
    cancelled: 'Đã hủy',
    refunded: 'Đã hoàn tiền',
};

export default function BookingsPage() {
    const { getToken, isLoaded, isSignedIn } = useAuth();
    const { user } = useUser();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!isLoaded || !isSignedIn) return;

        const fetchBookings = async () => {
            try {
                const token = await getToken();
                const res = await axios.get(`${API}/bookings/my-bookings`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setBookings(res.data.data || []);
            } catch (err) {
                console.error(err);
                setError('Không thể tải lịch sử đặt chỗ.');
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [isLoaded, isSignedIn, getToken]);

    if (!isLoaded) return null;

    if (!isSignedIn) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Vui lòng đăng nhập</h2>
                <p className="text-gray-600 mb-6">Bạn cần đăng nhập để xem lịch sử đặt chỗ của mình.</p>
                <Link to="/sign-in" className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition">
                    Đăng nhập ngay
                </Link>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen py-10">
            <div className="max-w-7xl mx-auto px-4">
                <h1 className="text-3xl font-bold text-blue-900 mb-8">Đặt chỗ của tôi</h1>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
                        {error}
                    </div>
                )}

                {bookings.length === 0 ? (
                    <div className="bg-white rounded-3xl shadow-sm p-12 text-center">
                        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
                            🎫
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 mb-2">Chưa có chuyến đi nào</h2>
                        <p className="text-gray-500 mb-8">Bạn chưa thực hiện đặt chỗ nào trên Jurni. Hãy khám phá ngay!</p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link to="/hotels" className="bg-white border border-gray-200 text-gray-700 px-6 py-2 rounded-full hover:bg-gray-50 transition font-medium">
                                Khách sạn
                            </Link>
                            <Link to="/flights" className="bg-white border border-gray-200 text-gray-700 px-6 py-2 rounded-full hover:bg-gray-50 transition font-medium">
                                Vé máy bay
                            </Link>
                            <Link to="/activities" className="bg-white border border-gray-200 text-gray-700 px-6 py-2 rounded-full hover:bg-gray-50 transition font-medium">
                                Hoạt động
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {bookings.map((booking) => {
                            const tour = booking.tourId || {};
                            const serviceName = tour.title || 'Dịch vụ';
                            const serviceImage = tour.images && tour.images.length > 0 ? tour.images[0] : null;
                            const serviceType = tour.category || 'Tour';

                            return (
                                <div key={booking._id} className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition">
                                    <div className="p-6 grid gap-6 md:grid-cols-[1fr_200px]">
                                        <div className="flex gap-4">
                                            {serviceImage ? (
                                                <img src={serviceImage} alt={serviceName} className="w-24 h-24 rounded-xl object-cover" />
                                            ) : (
                                                <div className="w-24 h-24 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 text-2xl">
                                                    image
                                                </div>
                                            )}

                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                                                        {serviceType}
                                                    </span>
                                                    <span className="text-xs text-gray-400">#{booking._id}</span>
                                                </div>
                                                <h3 className="text-lg font-bold text-gray-900 mb-1">{serviceName}</h3>
                                                <p className="text-sm text-gray-500">
                                                    Trạng thái thanh toán: {booking.paymentStatus?.toUpperCase()}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    Ngày đặt: {new Date(booking.createdAt).toLocaleDateString('vi-VN')}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-end justify-between">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${statusColors[booking.status] || 'bg-gray-100 text-gray-800'}`}>
                                                {statusLabels[booking.status] || booking.status}
                                            </span>

                                            <div className="text-right">
                                                <p className="text-sm text-gray-500">Tổng tiền</p>
                                                <p className="text-xl font-bold text-blue-600">
                                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(booking.totalPrice)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Footer Actions (Optional) */}
                                    <div className="bg-gray-50 px-6 py-3 flex justify-between items-center text-sm">
                                        <span className="text-gray-500">Cần hỗ trợ? <Link to="/support" className="text-blue-600 font-medium hover:underline">Liên hệ</Link></span>
                                        {/* <button className="text-blue-600 font-semibold hover:underline">Xem chi tiết</button> */}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
