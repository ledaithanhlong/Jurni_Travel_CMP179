import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const VoucherCard = ({ voucher, onCopy }) => {
    const isPercent = voucher.discount_percent > 0;
    const discountText = isPercent ? `${voucher.discount_percent}%` : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(voucher.discount_amount);
    const minSpendText = voucher.min_spend > 0 ? `Cho đơn từ ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(voucher.min_spend)}` : 'Không giới hạn đơn tối thiểu';

    return (
        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition flex flex-col h-full relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3">
                <div className="bg-orange-100 text-orange-600 font-bold text-xs px-2 py-1 rounded-lg">
                    {discountText}
                </div>
            </div>

            <div className="mb-4">
                <h3 className="text-lg font-bold text-blue-900 mb-1">
                    Giảm {discountText}
                </h3>
                <p className="text-sm text-gray-500 mb-1">
                    {minSpendText}
                </p>
                <p className="text-xs text-gray-400">
                    HSD: {new Date(voucher.expiry_date).toLocaleDateString('vi-VN')}
                </p>
            </div>

            <div className="mt-auto flex items-center gap-2">
                <div className="flex-1 bg-gray-50 border border-dashed border-gray-300 rounded-lg px-3 py-2 font-mono text-sm text-gray-600 text-center truncate">
                    {voucher.code}
                </div>
                <button
                    onClick={() => onCopy(voucher.code)}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition shadow-sm active:scale-95"
                >
                    Copy
                </button>
            </div>
        </div>
    );
};

export default function PromotionsPage() {
    const [vouchers, setVouchers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVouchers = async () => {
            try {
                const res = await axios.get(`${API}/vouchers`);
                setVouchers(res.data);
            } catch (error) {
                console.error('Failed to fetch vouchers', error);
            } finally {
                setLoading(false);
            }
        };
        fetchVouchers();
    }, []);

    const handleCopy = (code) => {
        navigator.clipboard.writeText(code);
        alert(`Đã sao chép mã: ${code}`);
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-8 pb-16">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-bold text-blue-900 mb-3">Kho Ưu Đãi Jurni</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Săn mã giảm giá cực hot, áp dụng cho đặt phòng khách sạn, vé máy bay và tour du lịch.
                        Số lượng có hạn, lưu mã và sử dụng ngay!
                    </p>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : vouchers.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl shadow-sm">
                        <p className="text-gray-500 text-lg">Hiện tại chưa có mã giảm giá nào đang diễn ra.</p>
                        <Link to="/" className="inline-block mt-4 text-orange-600 font-semibold hover:underline">
                            Quay về trang chủ
                        </Link>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {vouchers.map((voucher) => (
                            <VoucherCard key={voucher.id} voucher={voucher} onCopy={handleCopy} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
