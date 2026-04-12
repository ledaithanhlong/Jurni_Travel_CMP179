import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
    const [reviewModal, setReviewModal] = useState({ open: false, booking: null });
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewComment, setReviewComment] = useState('');
    const [reviewSubmitting, setReviewSubmitting] = useState(false);
    const [reviewError, setReviewError] = useState(null);
    const [reviewSuccess, setReviewSuccess] = useState(null);

    const canReview = useCallback((booking) => {
        return booking?.status === 'completed' && !booking?.review;
    }, []);

    const openReviewModal = useCallback((booking) => {
        setReviewModal({ open: true, booking });
        setReviewRating(5);
        setReviewComment('');
        setReviewError(null);
        setReviewSuccess(null);
    }, []);

    const closeReviewModal = useCallback(() => {
        setReviewModal({ open: false, booking: null });
        setReviewError(null);
        setReviewSuccess(null);
    }, []);

    const serviceLabel = useMemo(() => {
        return {
            hotel: 'Khách sạn',
            flight: 'Vé máy bay',
            car: 'Cho thuê xe',
            activity: 'Hoạt động'
        };
    }, []);

    const fetchBookings = useCallback(async () => {
        try {
            setLoading(true);
            const token = await getToken();
            const res = await axios.get(`${API}/bookings`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBookings(res.data);
        } catch (err) {
            console.error(err);
            setError('Không thể tải lịch sử đặt chỗ.');
        } finally {
            setLoading(false);
        }
    }, [getToken]);

    useEffect(() => {
        if (!isLoaded || !isSignedIn) return;
        fetchBookings();
    }, [isLoaded, isSignedIn, fetchBookings]);

    const submitReview = useCallback(async () => {
        const booking = reviewModal.booking;
        if (!booking) return;

        try {
            setReviewSubmitting(true);
            setReviewError(null);
            setReviewSuccess(null);

            const token = await getToken();
            await axios.post(`${API}/reviews`, {
                booking_id: booking.id,
                rating: reviewRating,
                comment: reviewComment
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setReviewSuccess('Đã gửi đánh giá. Nội dung sẽ hiển thị sau khi được duyệt.');
            await fetchBookings();
        } catch (err) {
            const message = err?.response?.data?.error || err?.response?.data?.message || 'Không thể gửi đánh giá.';
            setReviewError(message);
        } finally {
            setReviewSubmitting(false);
        }
    }, [fetchBookings, getToken, reviewComment, reviewModal.booking, reviewRating]);

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
                            const service = booking.service || {};
                            // Determine service details based on type
                            let serviceName = booking.service_type === 'hotel' ? service.name :
                                booking.service_type === 'flight' ? `${service.airline} - ${service.flight_number}` :
                                    booking.service_type === 'car' ? service.name :
                                        booking.service_type === 'activity' ? service.name : 'Dịch vụ khác';

                            let serviceImage = booking.service_type === 'hotel' ? service.image :
                                booking.service_type === 'flight' ? service.airline_logo :
                                    booking.service_type === 'car' ? service.image :
                                        booking.service_type === 'activity' ? service.image : null;

                            return (
                                <div key={booking.id} className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition">
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
                                                        {booking.service_type}
                                                    </span>
                                                    <span className="text-xs text-gray-400">#{booking.id}</span>
                                                </div>
                                                <h3 className="text-lg font-bold text-gray-900 mb-1">{serviceName}</h3>
                                                <p className="text-sm text-gray-500">
                                                    Thanh toán: {booking.payment_method?.toUpperCase()}
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
                                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(booking.total_price)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Footer Actions (Optional) */}
                                    <div className="bg-gray-50 px-6 py-3 flex justify-between items-center text-sm">
                                        <span className="text-gray-500">Cần hỗ trợ? <Link to="/support" className="text-blue-600 font-medium hover:underline">Liên hệ</Link></span>
                                        <div className="flex items-center gap-2">
                                            {booking.review && (
                                                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white border border-gray-200 text-gray-700">
                                                    Đã đánh giá ({booking.review.status === 'approved' ? 'Đã duyệt' : booking.review.status === 'hidden' ? 'Đã ẩn' : 'Chờ duyệt'})
                                                </span>
                                            )}
                                            {canReview(booking) && (
                                                <button
                                                    onClick={() => openReviewModal(booking)}
                                                    className="text-blue-600 font-semibold hover:underline"
                                                >
                                                    Đánh giá
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {reviewModal.open && reviewModal.booking && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40" onClick={closeReviewModal} />
                    <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-gray-100 p-6">
                        <div className="flex items-start justify-between gap-4 mb-4">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Đánh giá & Bình luận</h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    {serviceLabel[reviewModal.booking.service_type] || reviewModal.booking.service_type} • #{reviewModal.booking.id}
                                </p>
                            </div>
                            <button
                                onClick={closeReviewModal}
                                className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="mb-5">
                            <p className="text-sm font-semibold text-gray-700 mb-2">Xếp hạng</p>
                            <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map(v => (
                                    <button
                                        key={v}
                                        onClick={() => setReviewRating(v)}
                                        className={`text-2xl leading-none transition ${v <= reviewRating ? 'text-yellow-500' : 'text-gray-300'}`}
                                        aria-label={`Chọn ${v} sao`}
                                    >
                                        ★
                                    </button>
                                ))}
                                <span className="ml-2 text-sm text-gray-600">{reviewRating}/5</span>
                            </div>
                        </div>

                        <div className="mb-5">
                            <label className="text-sm font-semibold text-gray-700">Nhận xét</label>
                            <textarea
                                value={reviewComment}
                                onChange={(e) => setReviewComment(e.target.value)}
                                rows={4}
                                className="mt-2 w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:border-blue-500 focus:outline-none"
                                placeholder="Chia sẻ trải nghiệm của bạn..."
                            />
                        </div>

                        {reviewError && (
                            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                                {reviewError}
                            </div>
                        )}
                        {reviewSuccess && (
                            <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">
                                {reviewSuccess}
                            </div>
                        )}

                        <div className="flex items-center justify-end gap-3">
                            <button
                                onClick={closeReviewModal}
                                className="px-4 py-2 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition"
                                disabled={reviewSubmitting}
                            >
                                Đóng
                            </button>
                            <button
                                onClick={submitReview}
                                className="px-5 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-60"
                                disabled={reviewSubmitting}
                            >
                                {reviewSubmitting ? 'Đang gửi...' : 'Gửi đánh giá'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
