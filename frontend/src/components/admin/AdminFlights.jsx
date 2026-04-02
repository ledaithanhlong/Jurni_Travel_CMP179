import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const UPLOAD_API = `${API}/upload`;

// Định nghĩa các loại vé và tiện ích/chính sách mặc định
const FLIGHT_TYPES = {
    economy: {
        label: 'Hạng Phổ thông',
        icon: '✈️',
        defaultAmenities: ['Hành lý xách tay 7kg', 'Chỗ ngồi tiêu chuẩn', 'Đồ uống miễn phí'],
        defaultPolicies: {
            baggage: 'Hành lý xách tay: 7kg, Hành lý ký gửi: 20kg (phụ phí)',
            cancellation: 'Hủy vé: Phí 30% giá vé',
            refund: 'Hoàn tiền: 70% giá vé',
            meal: 'Bữa ăn: Có (phụ phí)',
            priority_boarding: 'Ưu tiên lên máy bay: Không',
            seat_selection: 'Chọn chỗ ngồi: Có (phụ phí)'
        }
    },
    premium_economy: {
        label: 'Hạng Phổ thông Đặc biệt',
        icon: '🛫',
        defaultAmenities: ['Hành lý xách tay 10kg', 'Chỗ ngồi rộng rãi hơn', 'Ưu tiên lên máy bay', 'Đồ uống miễn phí'],
        defaultPolicies: {
            baggage: 'Hành lý xách tay: 10kg, Hành lý ký gửi: 25kg',
            cancellation: 'Hủy vé: Phí 20% giá vé',
            refund: 'Hoàn tiền: 80% giá vé',
            meal: 'Bữa ăn: Có (miễn phí)',
            priority_boarding: 'Ưu tiên lên máy bay: Có',
            seat_selection: 'Chọn chỗ ngồi: Có (miễn phí)'
        }
    },
    business: {
        label: 'Hạng Thương gia',
        icon: '🛩️',
        defaultAmenities: ['Hành lý xách tay 12kg', 'Ghế ngả phẳng', 'Ưu tiên lên máy bay', 'Phòng chờ VIP', 'Bữa ăn cao cấp', 'Đồ uống đặc biệt'],
        defaultPolicies: {
            baggage: 'Hành lý xách tay: 12kg, Hành lý ký gửi: 30kg',
            cancellation: 'Hủy vé: Phí 10% giá vé',
            refund: 'Hoàn tiền: 90% giá vé',
            meal: 'Bữa ăn: Có (cao cấp, miễn phí)',
            priority_boarding: 'Ưu tiên lên máy bay: Có',
            seat_selection: 'Chọn chỗ ngồi: Có (miễn phí)'
        }
    },
    first_class: {
        label: 'Hạng Nhất',
        icon: '✈️✨',
        defaultAmenities: ['Hành lý xách tay 15kg', 'Khoang riêng tư', 'Ghế giường ngủ', 'Ưu tiên tối đa', 'Phòng chờ riêng', 'Bữa ăn đặc biệt', 'Dịch vụ cá nhân'],
        defaultPolicies: {
            baggage: 'Hành lý xách tay: 15kg, Hành lý ký gửi: 40kg',
            cancellation: 'Hủy vé: Miễn phí',
            refund: 'Hoàn tiền: 100% giá vé',
            meal: 'Bữa ăn: Có (đặc biệt, miễn phí)',
            priority_boarding: 'Ưu tiên lên máy bay: Có',
            seat_selection: 'Chọn chỗ ngồi: Có (miễn phí)'
        }
    }
};

const emptyForm = {
    airline: '',
    flight_number: '',
    departure_city: '',
    arrival_city: '',
    departure_time: '',
    arrival_time: '',
    image_url: '',
    amenities: [],
    policies: {},
    aircraft: 'Airbus A320',
    ticket_options: [
        // Default enable Economy
        { type: 'economy', price: '', available_seats: 180 }
    ]
};

export default function AdminFlights() {
    const { getToken } = useAuth();
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [form, setForm] = useState(emptyForm);
    const [bulkMode, setBulkMode] = useState(false);
    const [bulkCount, setBulkCount] = useState(5);
    const [flightNumberPrefix, setFlightNumberPrefix] = useState('');
    const [newAmenity, setNewAmenity] = useState('');

    useEffect(() => {
        loadFlights();
    }, []);

    // Auto-set Arrival Time
    useEffect(() => {
        if (form.departure_time) {
            const dep = new Date(form.departure_time);
            if (!isNaN(dep.getTime())) {
                // Add 2.5 hours (2h 30m)
                const arr = new Date(dep.getTime() + 2.5 * 60 * 60 * 1000);
                // Reduce by timezone offset to get local time string
                const tzOffset = dep.getTimezoneOffset() * 60000;
                const localArr = new Date(arr.getTime() - tzOffset);
                setForm(prev => ({
                    ...prev,
                    arrival_time: localArr.toISOString().slice(0, 16)
                }));
            }
        }
    }, [form.departure_time]);

    const loadFlights = async () => {
        try {
            const res = await axios.get(`${API}/flights`);
            setFlights(res.data || []);
        } catch (error) {
            console.error('Error loading flights:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            const token = await getToken();
            const formData = new FormData();
            formData.append('file', file);

            const res = await axios.post(UPLOAD_API, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (res.data.url) {
                setForm((prev) => ({
                    ...prev,
                    image_url: res.data.url
                }));
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Lỗi khi upload hình ảnh');
        } finally {
            setUploading(false);
        }
    };

    const resetForm = () => {
        setForm(emptyForm);
        setEditing(null);
        setBulkMode(false);
        setBulkCount(5);
        setFlightNumberPrefix('');
    };

    // Manage ticket options
    // Manage Detailed Ticket Options
    const addTicketVariant = (type, presetName) => {
        setForm(prev => ({
            ...prev,
            ticket_options: [...prev.ticket_options, {
                type,
                name: presetName,
                price: '',
                available_seats: 20,
                details: {
                    cabin_baggage: '7 kg',
                    checked_baggage: type === 'economy' ? '0 kg' : '23 kg',
                    refund_policy: 'non_refundable',
                    change_policy: 'fee_applies',
                    meal: type === 'business',
                    tax_invoice: true
                }
            }]
        }));
    };

    const removeTicketVariant = (index) => {
        setForm(prev => ({
            ...prev,
            ticket_options: prev.ticket_options.filter((_, i) => i !== index)
        }));
    };

    const updateTicketOption = (index, field, value) => {
        setForm(prev => ({
            ...prev,
            ticket_options: prev.ticket_options.map((opt, i) =>
                i === index ? { ...opt, [field]: value } : opt
            )
        }));
    };

    const updateTicketDetail = (index, key, value) => {
        setForm(prev => ({
            ...prev,
            ticket_options: prev.ticket_options.map((opt, i) =>
                i === index ? {
                    ...opt,
                    details: { ...opt.details, [key]: value }
                } : opt
            )
        }));
    };

    const addAmenity = () => {
        if (newAmenity.trim()) {
            setForm((prev) => ({
                ...prev,
                amenities: [...prev.amenities, newAmenity.trim()]
            }));
            setNewAmenity('');
        }
    };

    const removeAmenity = (index) => {
        setForm((prev) => ({
            ...prev,
            amenities: prev.amenities.filter((_, i) => i !== index)
        }));
    };

    const updatePolicy = (key, value) => {
        setForm((prev) => ({
            ...prev,
            policies: {
                ...prev.policies,
                [key]: value
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = await getToken();

            if (!form.departure_time) {
                alert('Vui lòng chọn giờ khởi hành!');
                return;
            }
            if (form.departure_city === form.arrival_city) {
                alert('Thành phố đi và đến không được giống nhau!');
                return;
            }
            if (form.ticket_options.length === 0) {
                alert('Vui lòng chọn ít nhất một loại vé!');
                return;
            }

            const now = new Date();
            const departureDate = new Date(form.departure_time);
            if (departureDate < now) {
                alert('Thời gian khởi hành không được trong quá khứ!');
                return;
            }

            // Calculate derived fields
            let arrivalTime;
            if (bulkMode) {
                // Determine arrival time based on flight duration (default 2h 30m if not set elsewhere, assuming same as interval for now or just duration)
                // User requirement: "giờ đến cách giờ đi 2h30p"
                arrivalTime = new Date(departureDate.getTime() + 2.5 * 60 * 60 * 1000).toISOString();
            } else {
                if (!form.arrival_time) return alert('Vui lòng chọn giờ đến!');

                const arrivalDate = new Date(form.arrival_time);
                arrivalTime = arrivalDate.toISOString();

                if (arrivalDate <= departureDate) {
                    return alert('Giờ đến phải sau giờ khởi hành!');
                }

                // Enforce at least 2h 30m duration
                const durationMs = arrivalDate - departureDate;
                const minDurationMs = 2.5 * 60 * 60 * 1000;
                if (durationMs < minDurationMs) {
                    return alert('Thời gian bay tối thiểu phải là 2 giờ 30 phút!');
                }
            }

            // Prepare payload
            // Backend automatically calculates min price and total seats from ticket_options
            const payload = {
                ...form,
                departure_time: new Date(form.departure_time).toISOString(),
                arrival_time: arrivalTime,
                amenities: form.amenities.length > 0 ? form.amenities : null,
                policies: Object.keys(form.policies).length > 0 ? form.policies : null,
                // map ticket_options to ensure numbers
                ticket_options: form.ticket_options.map(opt => ({
                    ...opt,
                    price: parseFloat(opt.price),
                    available_seats: parseInt(opt.available_seats)
                }))
            };

            if (editing) {
                await axios.put(`${API}/flights/${editing}`, payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert('Cập nhật thành công!');
            } else if (bulkMode) {
                const bulkPayload = {
                    ...payload,
                    count: bulkCount,
                    interval_hours: 2,
                    interval_minutes: 30, // User requested 2h 30m interval
                    flight_duration_hours: 2,
                    flight_duration_minutes: 30
                };
                const res = await axios.post(`${API}/flights/bulk`, bulkPayload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert(`Tạo thành công ${res.data.flights.length} chuyến bay!`);
            } else {
                await axios.post(`${API}/flights`, payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert('Tạo thành công!');
            }
            setShowForm(false);
            resetForm();
            loadFlights();
        } catch (error) {
            console.error('Error saving flight:', error);
            alert(error.response?.data?.error || 'Lỗi khi lưu chuyến bay');
        }
    };

    const handleEdit = (flight) => {
        setEditing(flight.id);
        setForm({
            airline: flight.airline || '',
            flight_number: flight.flight_number || '',
            departure_city: flight.departure_city || '',
            arrival_city: flight.arrival_city || '',
            departure_time: flight.departure_time ? new Date(flight.departure_time).toISOString().slice(0, 16) : '',
            arrival_time: flight.arrival_time ? new Date(flight.arrival_time).toISOString().slice(0, 16) : '',
            image_url: flight.image_url || '',
            amenities: Array.isArray(flight.amenities) ? flight.amenities : [],
            policies: flight.policies || {},
            aircraft: flight.aircraft || 'Airbus A320',
            // If valid ticket_options exists, use it. Else reconstruct from basic fields for backward compat
            // If valid ticket_options exists, use it. Else reconstruct from basic fields for backward compat
            ticket_options: (() => {
                let opts = flight.ticket_options;
                if (typeof opts === 'string') {
                    try { opts = JSON.parse(opts); } catch (e) { opts = []; }
                }
                return (Array.isArray(opts) && opts.length > 0)
                    ? opts
                    : [{ type: flight.flight_type || 'economy', price: flight.price, available_seats: flight.available_seats }];
            })()
        });
        setBulkMode(false);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Bạn có chắc chắn muốn xóa chuyến bay này?')) return;
        try {
            const token = await getToken();
            await axios.delete(`${API}/flights/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            loadFlights();
        } catch (error) {
            console.error('Error deleting flight:', error);
        }
    };

    if (loading) return <div className="text-center py-8">Đang tải...</div>;

    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-sky-600 to-blue-600 text-white p-6 rounded-2xl shadow-lg">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold">Danh sách Chuyến bay (Multi-Class)</h2>
                        <p className="text-white/80 mt-1">Tổng số: {flights.length} chuyến bay</p>
                    </div>
                    <button
                        onClick={() => { setShowForm(true); resetForm(); }}
                        className="bg-white text-sky-600 px-5 py-2 rounded-full font-semibold hover:bg-blue-50 transition"
                    >
                        + Thêm chuyến bay
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow border border-gray-100">
                {showForm && (
                    <div className="p-6 bg-white rounded-2xl shadow border border-gray-100 mb-6 max-h-[85vh] overflow-y-auto">
                        <h3 className="font-semibold text-xl mb-6">{editing ? 'Cập nhật chuyến bay' : 'Thêm chuyến bay mới'}</h3>
                        <form onSubmit={handleSubmit} className="space-y-6">

                            {/* Basic Info */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Hãng hàng không *</label>
                                    <select
                                        value={form.airline}
                                        onChange={(e) => setForm({ ...form, airline: e.target.value })}
                                        className="w-full border rounded-lg px-3 py-2"
                                        required
                                    >
                                        <option value="">Chọn hãng</option>
                                        <option value="Vietnam Airlines">Vietnam Airlines</option>
                                        <option value="VietJet Air">VietJet Air</option>
                                        <option value="Bamboo Airways">Bamboo Airways</option>
                                        <option value="Jetstar Pacific">Jetstar Pacific</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Loại máy bay</label>
                                    <input
                                        type="text"
                                        value={form.aircraft}
                                        onChange={(e) => setForm({ ...form, aircraft: e.target.value })}
                                        className="w-full border rounded-lg px-3 py-2"
                                        placeholder="VD: Boeing 787"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Đi từ *</label>
                                    <input
                                        type="text"
                                        value={form.departure_city}
                                        onChange={(e) => setForm({ ...form, departure_city: e.target.value })}
                                        className="w-full border rounded-lg px-3 py-2"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Đến *</label>
                                    <input
                                        type="text"
                                        value={form.arrival_city}
                                        onChange={(e) => setForm({ ...form, arrival_city: e.target.value })}
                                        className="w-full border rounded-lg px-3 py-2"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Giờ khởi hành *</label>
                                    <input
                                        type="datetime-local"
                                        value={form.departure_time}
                                        min={new Date().toISOString().slice(0, 16)}
                                        onChange={(e) => setForm({ ...form, departure_time: e.target.value })}
                                        className="w-full border rounded-lg px-3 py-2"
                                        required
                                    />
                                </div>
                                {!bulkMode && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Giờ đến (Auto +2.5h) *</label>
                                        <input
                                            type="datetime-local"
                                            value={form.arrival_time}
                                            min={form.departure_time}
                                            onChange={(e) => setForm({ ...form, arrival_time: e.target.value })}
                                            className="w-full border rounded-lg px-3 py-2 bg-gray-50"
                                            required
                                        />
                                    </div>
                                )}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Số hiệu chuyến bay</label>
                                    <input
                                        type="text"
                                        value={form.flight_number}
                                        onChange={(e) => setForm({ ...form, flight_number: e.target.value })}
                                        className="w-full border rounded-lg px-3 py-2"
                                        placeholder="VN123"
                                    />
                                </div>
                            </div>

                            {/* Advanced Ticket Builder */}
                            <div className="border-t pt-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="font-bold text-lg text-gray-800">Cấu hình Hạng vé & Tiện ích</h4>
                                    <div className="text-sm text-gray-500">Thêm các loại vé chi tiết cho chuyến bay này</div>
                                </div>

                                {/* Presets */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <span className="text-sm font-medium py-1">Thêm nhanh:</span>
                                    <button type="button" onClick={() => addTicketVariant('economy', 'Economy Lite')} className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm border border-green-200 hover:bg-green-100">+ Eco Lite</button>
                                    <button type="button" onClick={() => addTicketVariant('economy', 'Economy Standard')} className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm border border-green-200 hover:bg-green-100">+ Eco Standard</button>
                                    <button type="button" onClick={() => addTicketVariant('economy', 'Economy Flex')} className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm border border-green-200 hover:bg-green-100">+ Eco Flex</button>
                                    <button type="button" onClick={() => addTicketVariant('business', 'Business Classic')} className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm border border-purple-200 hover:bg-purple-100">+ Biz Classic</button>
                                    <button type="button" onClick={() => addTicketVariant('business', 'Business Flex')} className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm border border-purple-200 hover:bg-purple-100">+ Biz Flex</button>
                                </div>

                                {form.ticket_options.length === 0 ? (
                                    <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 text-gray-500">
                                        <p className="mb-2">Chưa có hạng vé nào.</p>
                                        <p className="text-sm">Hãy chọn "Thêm nhanh" ở trên hoặc tự thêm thủ công.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {form.ticket_options.map((opt, idx) => (
                                            <div key={idx} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                                                {/* Header */}
                                                <div className={`px-4 py-3 flex justify-between items-center ${opt.type === 'business' ? 'bg-purple-50 border-b border-purple-100' : 'bg-green-50 border-b border-green-100'}`}>
                                                    <div className="flex gap-2 items-center">
                                                        <select
                                                            value={opt.type}
                                                            onChange={(e) => updateTicketOption(idx, 'type', e.target.value)}
                                                            className="text-sm font-bold bg-transparent border-none focus:ring-0 cursor-pointer"
                                                        >
                                                            <option value="economy">Phổ thông</option>
                                                            <option value="premium_economy">PT Đặc biệt</option>
                                                            <option value="business">Thương gia</option>
                                                            <option value="first_class">Hạng nhất</option>
                                                        </select>
                                                        <span className="text-gray-400">|</span>
                                                        <input
                                                            type="text"
                                                            value={opt.name}
                                                            onChange={(e) => updateTicketOption(idx, 'name', e.target.value)}
                                                            className="font-semibold bg-transparent border-none focus:ring-0 p-0 text-gray-800 placeholder-gray-400 w-48"
                                                            placeholder="Tên hạng vé (VD: Eco Lite)"
                                                        />
                                                    </div>
                                                    <button type="button" onClick={() => removeTicketVariant(idx)} className="text-red-500 hover:text-red-700 px-2">×</button>
                                                </div>

                                                {/* Body */}
                                                <div className="p-4 grid md:grid-cols-2 gap-4">
                                                    {/* Price & Seats */}
                                                    <div className="space-y-3">
                                                        <div>
                                                            <label className="text-xs font-semibold text-gray-500 uppercase">Giá vé (VNĐ)</label>
                                                            <input
                                                                type="number"
                                                                value={opt.price}
                                                                onChange={(e) => updateTicketOption(idx, 'price', e.target.value)}
                                                                className="w-full border rounded px-3 py-2 mt-1 text-orange-600 font-bold"
                                                                placeholder="0"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="text-xs font-semibold text-gray-500 uppercase">Số ghế</label>
                                                            <input
                                                                type="number"
                                                                value={opt.available_seats}
                                                                onChange={(e) => updateTicketOption(idx, 'available_seats', e.target.value)}
                                                                className="w-full border rounded px-3 py-2 mt-1"
                                                                placeholder="Số lượng"
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Detailed Config */}
                                                    <div className="space-y-2 bg-gray-50 p-3 rounded">
                                                        <h5 className="text-xs font-bold text-gray-400 uppercase mb-2">Chính sách & Tiện ích</h5>
                                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                                            <div>
                                                                <label className="block text-xs text-gray-500">Hành lý xách tay</label>
                                                                <input
                                                                    type="text"
                                                                    value={opt.details?.cabin_baggage || ''}
                                                                    onChange={(e) => updateTicketDetail(idx, 'cabin_baggage', e.target.value)}
                                                                    className="w-full border rounded px-2 py-1 text-xs"
                                                                    placeholder="VD: 7 kg"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-xs text-gray-500">Hành lý ký gửi</label>
                                                                <input
                                                                    type="text"
                                                                    value={opt.details?.checked_baggage || ''}
                                                                    onChange={(e) => updateTicketDetail(idx, 'checked_baggage', e.target.value)}
                                                                    className="w-full border rounded px-2 py-1 text-xs"
                                                                    placeholder="VD: 23 kg"
                                                                />
                                                            </div>
                                                            <div className="col-span-2">
                                                                <label className="block text-xs text-gray-500">Hoàn/Hủy vé</label>
                                                                <select
                                                                    value={opt.details?.refund_policy || 'non_refundable'}
                                                                    onChange={(e) => updateTicketDetail(idx, 'refund_policy', e.target.value)}
                                                                    className="w-full border rounded px-2 py-1 text-xs"
                                                                >
                                                                    <option value="non_refundable">Không hoàn tiền</option>
                                                                    <option value="refundable_fee">Hoàn tiền (có phí)</option>
                                                                    <option value="refundable_free">Hoàn tiền miễn phí</option>
                                                                </select>
                                                            </div>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={opt.details?.meal || false}
                                                                    onChange={(e) => updateTicketDetail(idx, 'meal', e.target.checked)}
                                                                    id={`meal-${idx}`}
                                                                />
                                                                <label htmlFor={`meal-${idx}`} className="text-xs">Có suất ăn</label>
                                                            </div>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={opt.details?.tax_invoice || false}
                                                                    onChange={(e) => updateTicketDetail(idx, 'tax_invoice', e.target.checked)}
                                                                    id={`tax-${idx}`}
                                                                />
                                                                <label htmlFor={`tax-${idx}`} className="text-xs">Xuất hóa đơn</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Other sections (Image, Amenities, Policies) same as before */}
                            {/* Removed General Amenities as per user request */}

                            <div className="flex gap-2 pt-4 border-t">
                                <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-lg">{editing ? 'Lưu thay đổi' : 'Tạo mới'}</button>
                                <button type="button" onClick={() => setShowForm(false)} className="bg-gray-400 text-white px-6 py-2 rounded-lg">Hủy</button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Flight List Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-3 text-left">Hãng/Số hiệu</th>
                                <th className="px-6 py-3 text-left">Hành trình</th>
                                <th className="px-6 py-3 text-left">Giá (từ)</th>
                                <th className="px-6 py-3 text-center">Các hạng vé</th>
                                <th className="px-6 py-3 text-left">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {flights.map(flight => (
                                <tr key={flight.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="font-semibold">{flight.airline}</div>
                                        <div className="text-xs text-gray-500">{flight.flight_number}</div>
                                        <div className="text-xs text-gray-500">{flight.aircraft}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div>{flight.departure_city} ➝ {flight.arrival_city}</div>
                                        <div className="text-xs text-gray-500">
                                            {new Date(flight.departure_time).toLocaleString('vi-VN')}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-orange-600 font-bold">
                                        {Number(flight.price).toLocaleString('vi-VN')} đ
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex justify-center gap-1">
                                            {(() => {
                                                let options = flight.ticket_options;
                                                if (typeof options === 'string') {
                                                    try { options = JSON.parse(options); } catch (e) { options = []; }
                                                }
                                                return Array.isArray(options) ? options.map((opt, i) => {
                                                    if (!opt || !opt.type) return null;
                                                    const typeConfig = FLIGHT_TYPES[opt.type];
                                                    return (
                                                        <span key={i} title={`${typeConfig?.label || opt.type}: ${Number(opt.price || 0).toLocaleString()}đ`} className="cursor-help text-lg">
                                                            {typeConfig?.icon || '🎫'}
                                                        </span>
                                                    );
                                                }) : <span className="text-gray-400 text-xs">Standard</span>;
                                            })()}
                                            {(!flight.ticket_options || flight.ticket_options.length === 0) && (
                                                <span className="text-gray-400 text-xs">Single</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button onClick={() => handleEdit(flight)} className="text-blue-600 mr-3">Sửa</button>
                                        <button onClick={() => handleDelete(flight.id)} className="text-red-500">Xóa</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
