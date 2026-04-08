import React, { useMemo, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '@clerk/clerk-react';

const formatCurrency = (value = 0, currency = 'VND') => {
  const number = Number(value) || 0;
  return `${new Intl.NumberFormat('vi-VN').format(number)} ${currency}`;
};

const beneficiaryTemplate = {
  bank: 'Vietcombank',
  accountNumber: '1027 239 741',
  accountName: 'CÔNG TY TNHH JURNI',
  branch: 'Chi nhánh thành phố Hồ Chí Minh',
};

const paymentCatalog = {
  vietnamese: [
    {
      id: 'internet-banking',
      name: 'Internet Banking',
      description: 'Thanh toán online qua tài khoản ngân hàng nội địa',
      type: 'bank',
      badge: 'IB',
      color: 'from-blue-500 to-indigo-500',
      logo: '/payment/logos/internet-banking.png',
      feePercent: 0,
      feeFixed: 0,
      beneficiary: beneficiaryTemplate,
      banks: ['Vietcombank', 'BIDV', 'VietinBank', 'Agribank', 'ACB', 'Techcombank', 'MBBank', 'VPBank'],
    },
    {
      id: 'atm-card',
      name: 'Thẻ ATM nội địa',
      description: 'Thanh toán bằng thẻ ATM đã kích hoạt chức năng online',
      type: 'atm',
      badge: 'ATM',
      color: 'from-emerald-500 to-teal-500',
      logo: '/payment/logos/atm-card.png',
      feePercent: 0.01,
      feeFixed: 0,
      beneficiary: beneficiaryTemplate,
    },
    {
      id: 'momo',
      name: 'Ví MoMo',
      description: 'Quét mã hoặc duyệt thanh toán ngay trong ứng dụng MoMo',
      type: 'ewallet',
      badge: 'MoMo',
      color: 'from-pink-500 to-rose-500',
      logo: '/payment/logos/momo.png',
      feePercent: 0.01,
      feeFixed: 0,
      beneficiary: beneficiaryTemplate,
    },
    {
      id: 'zalopay',
      name: 'ZaloPay',
      description: 'Duyệt thanh toán qua ví ZaloPay',
      type: 'ewallet',
      badge: 'ZP',
      color: 'from-sky-500 to-cyan-500',
      logo: '/payment/logos/zalopay.png',
      feePercent: 0.01,
      feeFixed: 0,
      beneficiary: beneficiaryTemplate,
    },
    {
      id: 'viettelpay',
      name: 'ViettelPay',
      description: 'Thanh toán nhanh qua ViettelPay',
      type: 'ewallet',
      badge: 'VT',
      color: 'from-amber-500 to-orange-500',
      logo: '/payment/logos/viettelpay.png',
      feePercent: 0.01,
      feeFixed: 0,
      beneficiary: beneficiaryTemplate,
    },
    {
      id: 'vnpay-qr',
      name: 'VNPAY QR',
      description: 'Quét mã QRPay hỗ trợ tất cả ngân hàng/ ví liên kết',
      type: 'qr',
      badge: 'QR',
      color: 'from-purple-500 to-fuchsia-500',
      logo: '/payment/logos/vnpay.png',
      feePercent: 0,
      feeFixed: 0,
      beneficiary: beneficiaryTemplate,
    },
  ],
  international: [
    {
      id: 'visa',
      name: 'Visa',
      description: 'Thanh toán bằng thẻ Visa Credit/Debit',
      type: 'card',
      badge: 'Visa',
      color: 'from-blue-600 to-blue-400',
      logo: '/payment/logos/visa.png',
      feePercent: 0.025,
      feeFixed: 0,
      beneficiary: beneficiaryTemplate,
    },
    {
      id: 'mastercard',
      name: 'Mastercard',
      description: 'Thanh toán bằng thẻ Mastercard Credit/Debit',
      type: 'card',
      badge: 'MC',
      color: 'from-orange-500 to-red-500',
      logo: '/payment/logos/mastercard.png',
      feePercent: 0.025,
      feeFixed: 0,
      beneficiary: beneficiaryTemplate,
    },
    {
      id: 'amex',
      name: 'American Express',
      description: 'Thanh toán bằng thẻ American Express',
      type: 'card',
      badge: 'Amex',
      color: 'from-slate-600 to-slate-400',
      logo: '/payment/logos/amex.png',
      feePercent: 0.03,
      feeFixed: 0,
      beneficiary: beneficiaryTemplate,
    },
    {
      id: 'paypal',
      name: 'PayPal',
      description: 'Thanh toán quốc tế qua PayPal',
      type: 'paypal',
      badge: 'PP',
      color: 'from-indigo-500 to-blue-400',
      logo: '/payment/logos/paypal.png',
      feePercent: 0.035,
      feeFixed: 0,
      beneficiary: beneficiaryTemplate,
    },
  ],
};

const Badge = ({ text, gradient }) => (
  <span
    className={`inline-flex items-center justify-center rounded-full bg-gradient-to-r ${gradient} px-2.5 py-1 text-xs font-semibold text-white shadow-sm`}
  >
    {text}
  </span>
);

const PaymentLogo = ({ logo, badge, gradient }) => {
  if (logo) {
    return (
      <img
        src={logo}
        alt={badge}
        className="h-8 w-auto object-contain drop-shadow-sm"
        onError={(e) => {
          e.currentTarget.style.display = 'none';
        }}
      />
    );
  }
  return <Badge text={badge} gradient={gradient} />;
};

// ... imports ...

export default function PaymentPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useUser();
  const [cartItems, setCartItems] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  // Voucher state
  const [vouchers, setVouchers] = useState([]);
  const [voucherCode, setVoucherCode] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [voucherError, setVoucherError] = useState('');

  // Load Cart
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('pendingCart') || '[]');
      if (Array.isArray(saved)) {
        setCartItems(saved);
        // Default select all
        setSelectedIds(saved.map(i => i.id));
      } else {
        setCartItems([]);
      }
    } catch (e) {
      console.error('Failed to load cart', e);
      setCartItems([]);
    }

    // Fetch Vouchers
    (async () => {
      try {
        const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const res = await axios.get(`${API}/vouchers`);
        setVouchers(res.data);
      } catch (e) {
        console.error('Failed to fetch vouchers', e);
      }
    })();
  }, []);

  const [showQRModal, setShowQRModal] = useState(false);
  const [form, setForm] = useState({
    fullName: state?.customer?.name || user?.fullName || '',
    email: state?.customer?.email || user?.primaryEmailAddress?.emailAddress || '',
    phone: state?.customer?.phone || '',
    notes: '',
    paymentCategory: 'vietnamese',
    paymentMethod: '',
    cardName: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    walletPhone: '',
    selectedBank: '',
    bankReference: '',
    paypalEmail: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: null, message: '', reference: '' });

  const selectedItems = useMemo(() => {
    return cartItems.filter(item => selectedIds.includes(item.id));
  }, [cartItems, selectedIds]);

  const hasOrder = selectedItems.length > 0;

  const subtotal = useMemo(() => {
    return selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [selectedItems]);

  const selectedMethod = useMemo(() => {
    const catalog = [...paymentCatalog.vietnamese, ...paymentCatalog.international];
    return catalog.find((m) => m.id === form.paymentMethod);
  }, [form.paymentMethod]);

  const methodFee = useMemo(() => {
    if (!selectedMethod || !hasOrder) return 0;
    return Math.round(subtotal * (selectedMethod.feePercent || 0) + (selectedMethod.feeFixed || 0));
  }, [selectedMethod, subtotal, hasOrder]);

  const discountAmount = useMemo(() => {
    if (!appliedVoucher) return 0;

    let discount = 0;
    if (appliedVoucher.discount_percent > 0) {
      discount = subtotal * (appliedVoucher.discount_percent / 100);
      if (appliedVoucher.max_discount > 0) {
        discount = Math.min(discount, appliedVoucher.max_discount);
      }
    } else {
      discount = Number(appliedVoucher.discount_amount) || 0;
    }

    return Math.min(discount, subtotal);
  }, [appliedVoucher, subtotal]);

  const total = hasOrder ? Math.max(0, subtotal + methodFee - discountAmount) : 0;

  const handleApplyVoucher = () => {
    setVoucherError('');
    setAppliedVoucher(null);

    if (!voucherCode.trim()) return;

    const voucher = vouchers.find(v => v.code === voucherCode.trim());
    if (!voucher) {
      setVoucherError('Mã giảm giá không hợp lệ');
      return;
    }

    const now = new Date();
    if (new Date(voucher.expiry_date) < now) {
      setVoucherError('Mã giảm giá đã hết hạn');
      return;
    }

    if (voucher.usage_limit > 0 && voucher.current_usage >= voucher.usage_limit) {
      setVoucherError('Mã giảm giá đã hết lượt sử dụng');
      return;
    }

    if (voucher.min_spend > subtotal) {
      setVoucherError(`Đơn hàng tối thiểu ${formatCurrency(voucher.min_spend, 'VND')} để áp dụng mã này`);
      return;
    }

    setAppliedVoucher(voucher);
  };


  const toggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const removeItem = (id) => {
    const newCart = cartItems.filter(i => i.id !== id);
    setCartItems(newCart);
    setSelectedIds(prev => prev.filter(i => i !== id));
    localStorage.setItem('pendingCart', JSON.stringify(newCart));
  };

  const handleChange = (field) => (event) => {
    const { value } = event.target;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCategoryChange = (category) => {
    setForm((prev) => ({
      ...prev,
      paymentCategory: category,
      paymentMethod: '',
      cardName: '',
      cardNumber: '',
      cardExpiry: '',
      cardCvc: '',
      walletPhone: '',
      selectedBank: '',
      bankReference: '',
      paypalEmail: '',
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!hasOrder) {
      setStatus({ type: 'error', message: 'Bạn chưa chọn dịch vụ để thanh toán.', reference: '' });
      return;
    }
    if (!selectedMethod) {
      setStatus({ type: 'error', message: 'Vui lòng chọn phương thức thanh toán.', reference: '' });
      return;
    }

    setShowQRModal(true);
  };

  const confirmPayment = async () => {
    setSubmitting(true);
    try {
      const payload = {
        amount: total,
        currency: 'VND',
        currency: 'VND',
        paymentMethod: form.paymentMethod,
        customer: {
          name: form.fullName,
          email: form.email,
          phone: form.phone,
        },
        items: selectedItems,
        book_all_items: true, // Signal to backend to loop items
        user_id: user?.id,
      };

      const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      // Backend route is /api/payments/checkout (mounted at /payments in index.js, and /checkout in payments.routes.js)
      const res = await axios.post(`${API}/payments/checkout`, payload);

      if (res.data.success) {
        setStatus({ type: 'success', message: 'Thanh toán thành công! Đang chuyển đến trang voucher...', reference: res.data.payment?.reference });
        setShowQRModal(false);

        // Remove paid items from cart
        const remainingCart = cartItems.filter(i => !selectedIds.includes(i.id));
        setCartItems(remainingCart);
        setSelectedIds([]);
        localStorage.setItem('pendingCart', JSON.stringify(remainingCart));

        setTimeout(() => {
          navigate('/vouchers');
        }, 2000);
      } else {
        throw new Error(res.data.error || 'Thanh toán thất bại');
      }
    } catch (err) {
      console.error(err);
      setStatus({
        type: 'error',
        message: err.response?.data?.error || err.message || 'Có lỗi xảy ra khi xử lý thanh toán.',
        reference: ''
      });
      setShowQRModal(false);
    } finally {
      setSubmitting(false);
    }
  };

  const renderMethodForm = () => {
    if (!selectedMethod) return null;
    switch (selectedMethod.type) {
      case 'card':
      case 'atm':
        return (
          <div className="space-y-4 rounded-2xl border border-blue-100 bg-white/80 p-5">
            <h3 className="font-semibold text-blue-900">Thông tin thẻ</h3>
            <div>
              <label className="text-sm font-medium text-blue-900">Tên chủ thẻ *</label>
              <input
                value={form.cardName}
                onChange={handleChange('cardName')}
                className="mt-1 w-full rounded-lg border border-blue-100 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                placeholder="NGUYEN VAN A"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-blue-900">Số thẻ *</label>
              <input
                value={form.cardNumber}
                onChange={handleChange('cardNumber')}
                className="mt-1 w-full rounded-lg border border-blue-100 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                placeholder="XXXX XXXX XXXX XXXX"
                inputMode="numeric"
                maxLength={19}
                required
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-blue-900">Ngày hết hạn *</label>
                <input
                  value={form.cardExpiry}
                  onChange={handleChange('cardExpiry')}
                  className="mt-1 w-full rounded-lg border border-blue-100 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  placeholder="MM/YY"
                  maxLength={5}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-blue-900">Mã CVV *</label>
                <input
                  value={form.cardCvc}
                  onChange={handleChange('cardCvc')}
                  className="mt-1 w-full rounded-lg border border-blue-100 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  placeholder="123"
                  inputMode="numeric"
                  maxLength={4}
                  required
                />
              </div>
            </div>
          </div>
        );
      case 'ewallet':
        return (
          <div className="space-y-3 rounded-2xl border border-blue-100 bg-white/80 p-5">
            <h3 className="font-semibold text-blue-900">Thông tin ví điện tử</h3>
            <label className="text-sm font-medium text-blue-900">Số điện thoại đăng ký ví *</label>
            <input
              value={form.walletPhone}
              onChange={handleChange('walletPhone')}
              className="mt-1 w-full rounded-lg border border-blue-100 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              placeholder="0901 234 567"
              required
            />
            <p className="text-xs text-blue-600/70">Số điện thoại phải trùng với tài khoản ví {selectedMethod.name}.</p>
          </div>
        );
      case 'bank':
        return (
          <div className="space-y-3 rounded-2xl border border-blue-100 bg-white/80 p-5">
            <h3 className="font-semibold text-blue-900">Thông tin chuyển khoản</h3>
            <label className="text-sm font-medium text-blue-900">Chọn ngân hàng *</label>
            <select
              value={form.selectedBank}
              onChange={handleChange('selectedBank')}
              className="mt-1 w-full rounded-lg border border-blue-100 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              required
            >
              <option value="">-- Chọn ngân hàng --</option>
              {selectedMethod.banks?.map((bank) => (
                <option key={bank} value={bank}>
                  {bank}
                </option>
              ))}
            </select>
            <label className="text-sm font-medium text-blue-900">Nội dung chuyển khoản</label>
            <input
              value={form.bankReference}
              onChange={handleChange('bankReference')}
              className="mt-1 w-full rounded-lg border border-blue-100 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              placeholder="JURNI + HỌ TÊN"
            />
          </div>
        );
      case 'qr':
        return (
          <div className="space-y-4 rounded-2xl border border-blue-100 bg-white/80 p-5">
            <h3 className="font-semibold text-blue-900">Quét mã QR</h3>
            <div className="flex items-center justify-center rounded-2xl border border-dashed border-blue-200 bg-blue-50/60 p-6">
              <img
                src="/payment/vnpay.png"
                alt="VNPAY QR"
                className="h-56 w-56 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <p className="text-xs text-blue-700/80 text-center">
              Sử dụng ứng dụng ngân hàng hoặc ví điện tử hỗ trợ VNPAY để quét mã và hoàn tất thanh toán.
            </p>
          </div>
        );
      case 'paypal':
        return (
          <div className="space-y-3 rounded-2xl border border-blue-100 bg-white/80 p-5">
            <h3 className="font-semibold text-blue-900">Thông tin PayPal</h3>
            <label className="text-sm font-medium text-blue-900">Email PayPal *</label>
            <input
              type="email"
              value={form.paypalEmail}
              onChange={handleChange('paypalEmail')}
              className="mt-1 w-full rounded-lg border border-blue-100 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              placeholder="you@example.com"
              required
            />
            <p className="text-xs text-blue-600/70">Bạn sẽ được chuyển hướng tới PayPal để xác nhận thanh toán.</p>
          </div>
        );
      default:
        return null;
    }
  };

  const renderBeneficiary = () => {
    if (!selectedMethod?.beneficiary) return null;
    const info = selectedMethod.beneficiary;
    return (
      <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-5 text-sm text-blue-900">
        <div className="flex items-center gap-2 text-blue-700">
          <span className="text-base font-semibold">Tài khoản hưởng thụ</span>
        </div>
        <div className="mt-3 space-y-1">
          <p>Ngân hàng: <span className="font-semibold">{info.bank}</span></p>
          <p>Số tài khoản: <span className="font-semibold">{info.accountNumber}</span></p>
          <p>Chủ tài khoản: <span className="font-semibold">{info.accountName}</span></p>
          {info.branch && <p>Chi nhánh: <span className="font-semibold">{info.branch}</span></p>}
        </div>
        <p className="mt-3 text-xs text-blue-600/80">
          Vui lòng đối chiếu thông tin trước khi chuyển khoản. Bạn có thể chỉnh sửa nội dung này trong file cấu hình.
        </p>
      </div>
    );
  };

  const activeMethods =
    form.paymentCategory === 'vietnamese' ? paymentCatalog.vietnamese : paymentCatalog.international;

  return (
    <div className="bg-gradient-to-b from-white via-blue-50/40 to-white py-12">
      <div className="mx-auto max-w-7xl px-4">
        <header className="mb-8 space-y-2">
          <span className="text-xs uppercase tracking-[0.3em] text-blue-500">Thanh toán</span>
          <h1 className="text-3xl font-semibold text-blue-900">Hoàn tất đặt dịch vụ</h1>
          <p className="text-sm text-blue-700/80 max-w-2xl">
            Vui lòng nhập thông tin liên hệ và chọn phương thức thanh toán phù hợp. Chúng tôi mã hóa mọi dữ liệu thẻ theo chuẩn PCI-DSS.
          </p>
        </header>

        {status.type && (
          <div
            className={`mb-6 rounded-2xl border px-4 py-3 text-sm ${status.type === 'success'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
              : 'border-rose-200 bg-rose-50 text-rose-800'
              }`}
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-semibold">{status.type === 'success' ? 'Xử lý thành công' : 'Có lỗi xảy ra'}</p>
                <p className="mt-1 text-xs leading-5">{status.message}</p>
              </div>
              {status.reference && (
                <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-blue-700 shadow-sm">
                  Mã: {status.reference}
                </span>
              )}
            </div>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1fr_1fr_0.9fr]">
          {/* Cột 1: Thông tin liên hệ */}
          <div className="space-y-6 rounded-3xl border border-blue-100 bg-white/90 p-6 shadow-xl backdrop-blur">
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-blue-900">Thông tin liên hệ</h2>
                <span className="text-xs text-blue-600/70">* Bắt buộc</span>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-blue-900">Họ và tên *</label>
                  <input
                    value={form.fullName}
                    onChange={handleChange('fullName')}
                    className="mt-1 w-full rounded-lg border border-blue-100 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    placeholder="Nhập họ và tên"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-blue-900">Số điện thoại *</label>
                  <input
                    value={form.phone}
                    onChange={handleChange('phone')}
                    className="mt-1 w-full rounded-lg border border-blue-100 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    placeholder="0901 234 567"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-blue-900">Email nhận hóa đơn *</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={handleChange('email')}
                    className="mt-1 w-full rounded-lg border border-blue-100 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    placeholder="you@example.com"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-blue-900">Ghi chú (không bắt buộc)</label>
                  <textarea
                    value={form.notes}
                    onChange={handleChange('notes')}
                    rows={3}
                    className="mt-1 w-full rounded-lg border border-blue-100 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    placeholder="Thông tin bổ sung cho Jurni..."
                  />
                </div>
              </div>
            </section>
          </div>

          {/* Cột 2: Phương thức thanh toán */}
          <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl border border-blue-100 bg-white/90 p-6 shadow-xl backdrop-blur">
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-blue-900">Phương thức thanh toán</h2>

              <div className="flex gap-2 border-b border-blue-100 pb-2">
                <button
                  type="button"
                  onClick={() => handleCategoryChange('vietnamese')}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition ${form.paymentCategory === 'vietnamese'
                    ? 'text-white shadow'
                    : 'hover:bg-orange-50'
                    }`}
                  style={form.paymentCategory === 'vietnamese' ? { backgroundColor: '#FF6B35' } : { color: '#FF6B35' }}
                >
                  Việt Nam
                </button>
                <button
                  type="button"
                  onClick={() => handleCategoryChange('international')}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition ${form.paymentCategory === 'international'
                    ? 'text-white shadow'
                    : 'hover:bg-orange-50'
                    }`}
                  style={form.paymentCategory === 'international' ? { backgroundColor: '#FF6B35' } : { color: '#FF6B35' }}
                >
                  Quốc tế
                </button>
              </div>

              <div className="space-y-2">
                {activeMethods.map((method) => (
                  <label
                    key={method.id}
                    className={`flex flex-col gap-1.5 rounded-xl border px-3 py-2.5 transition cursor-pointer ${form.paymentMethod === method.id
                      ? 'border-blue-500 bg-blue-50/80 shadow-md'
                      : 'border-blue-100 hover:border-orange-300 hover:bg-orange-50/40'
                      }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <PaymentLogo logo={method.logo} badge={method.badge} gradient={method.color} />
                        <div>
                          <p className="font-semibold text-sm text-blue-900">{method.name}</p>
                          <p className="text-xs text-blue-700/70 leading-tight">{method.description}</p>
                        </div>
                      </div>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.id}
                        checked={form.paymentMethod === method.id}
                        onChange={() => setForm((prev) => ({ ...prev, paymentMethod: method.id }))}
                        className="mt-0.5 h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                    </div>
                    <p className="text-xs text-blue-600/70 pl-11">
                      {method.feePercent === 0 && method.feeFixed === 0 ? (
                        <span className="text-emerald-600 font-medium">Miễn phí giao dịch</span>
                      ) : (
                        <>Phí: {(method.feePercent * 100).toFixed(1)}%{method.feeFixed ? ` + ${formatCurrency(method.feeFixed, 'VND')}` : ''}</>
                      )}
                    </p>
                  </label>
                ))}
              </div>

              {renderMethodForm()}
              {renderBeneficiary()}
            </section>

            <button
              type="submit"
              disabled={submitting || !hasOrder}
              className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 px-6 py-3.5 text-base font-semibold text-white shadow-lg transition hover:shadow-xl disabled:pointer-events-none disabled:opacity-60"
            >
              Thanh toán & hoàn tất đặt chỗ
            </button>
            <p className="text-xs text-center text-blue-600/70">
              Khi bấm "Thanh toán", bạn đồng ý với điều khoản sử dụng và chính sách hủy của Jurni.
            </p>
          </form>

          <aside className="space-y-4 rounded-3xl border border-blue-100 bg-white/90 p-6 shadow-xl backdrop-blur">
            {hasOrder ? (
              <>
                {/* Tổng thanh toán - Sticky ở đầu */}
                <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-sky-500 px-5 py-4 text-white shadow-lg">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium opacity-90">Tổng thanh toán</span>
                    <span className="text-2xl font-bold">{formatCurrency(total, 'VND')}</span>
                  </div>
                  <div className="space-y-1.5 text-xs opacity-80">
                    <div className="flex items-center justify-between">
                      <span>Tạm tính ({selectedItems.length} dịch vụ)</span>
                      <span>{formatCurrency(subtotal, 'VND')}</span>
                    </div>
                    {methodFee > 0 && (
                      <div className="flex items-center justify-between">
                        <span>Phí xử lý</span>
                        <span>+{formatCurrency(methodFee, 'VND')}</span>
                      </div>
                    )}
                    {discountAmount > 0 && (
                      <div className="flex items-center justify-between text-emerald-200 font-medium">
                        <span>Giảm giá</span>
                        <span>-{formatCurrency(discountAmount, 'VND')}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-blue-900 mb-3">Dịch vụ đã chọn</h3>
                  <ul className="space-y-2">
                    {cartItems.map((item) => (
                      <li key={item.id} className={`rounded-xl border px-3 py-2.5 transition-colors ${selectedIds.includes(item.id) ? 'border-blue-500 bg-blue-50/60' : 'border-gray-200 bg-white opacity-60'}`}>
                        <div className="flex items-start gap-2.5">
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(item.id)}
                            onChange={() => toggleSelect(item.id)}
                            className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <span className={`font-semibold text-sm truncate ${selectedIds.includes(item.id) ? 'text-blue-900' : 'text-gray-600'}`}>{item.name}</span>
                              <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-500 flex-shrink-0">
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                            <div className="flex items-center justify-between text-xs mt-1">
                              <span className="uppercase tracking-wide text-blue-600/70">{item.type}</span>
                              <span className="text-gray-500">x{item.quantity}</span>
                            </div>
                            <p className={`mt-1.5 text-sm font-bold ${selectedIds.includes(item.id) ? 'text-blue-900' : 'text-gray-500'}`}>
                              {formatCurrency(item.price * item.quantity, 'VND')}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Voucher Input */}
                <div className="rounded-xl border border-blue-100 bg-white px-3.5 py-3">
                  <h3 className="font-semibold text-blue-900 mb-2.5 text-sm">Mã ưu đãi</h3>
                  <div className="flex gap-2">
                    <input
                      value={voucherCode}
                      onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                      placeholder="Nhập mã giảm giá"
                      className="flex-1 rounded-lg border border-blue-100 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleApplyVoucher}
                      className="rounded-lg bg-blue-600 px-3.5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                      Áp dụng
                    </button>
                  </div>
                  {voucherError && <p className="mt-2 text-xs text-red-500">{voucherError}</p>}
                  {appliedVoucher && (
                    <div className="mt-2 flex items-center justify-between rounded-lg bg-green-50 px-3 py-2 text-xs text-green-700">
                      <span>Đã áp dụng: <b>{appliedVoucher.code}</b></span>
                      <button onClick={() => { setAppliedVoucher(null); setVoucherCode(''); }} className="text-red-500 hover:text-red-700">Xóa</button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="rounded-2xl border border-dashed border-blue-200 bg-blue-50/40 px-4 py-6 text-center text-blue-800">
                <h3 className="font-semibold text-blue-900 mb-1">Bạn chưa chọn dịch vụ</h3>
                <p className="text-sm">Vui lòng quay lại trang dịch vụ để chọn tour, vé máy bay hoặc khách sạn trước khi thanh toán.</p>
              </div>
            )}

            <div className="rounded-xl border border-blue-100 bg-white px-3.5 py-3 text-xs text-blue-700/80">
              <p className="font-semibold text-blue-900 mb-2">Cam kết Jurni</p>
              <ul className="space-y-1.5">
                <li>✔ Hoàn tiền trong 48h nếu thanh toán thất bại.</li>
                <li>✔ Hỗ trợ trực tuyến 24/7 trong suốt hành trình.</li>
                <li>✔ Mã hóa tiêu chuẩn ngành, bảo mật tuyệt đối thông tin thẻ.</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>

      {/* QR Modal */}
      {
        showQRModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in duration-300">
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 mb-4">
                  <img src="/payment/vnpay.png" alt="VNPay" className="h-10 w-10 object-contain" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Quét mã để thanh toán</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Sử dụng ứng dụng ngân hàng hoặc ví điện tử để quét mã QR bên dưới.
                </p>
              </div>

              <div className="mt-6 flex justify-center">
                <div className="relative rounded-xl border-2 border-dashed border-blue-200 p-2">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=JURNI-${total}-${Date.now()}`}
                    alt="Payment QR"
                    className="h-48 w-48 rounded-lg"
                  />
                </div>
              </div>

              <div className="mt-4 text-center">
                <p className="text-lg font-bold text-blue-600">{formatCurrency(total, 'VND')}</p>
                <p className="text-xs text-gray-400">Nội dung: JURNI THANH TOAN</p>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowQRModal(false)}
                  disabled={submitting}
                  className="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Hủy bỏ
                </button>
                <button
                  type="button"
                  onClick={confirmPayment}
                  disabled={submitting}
                  className="flex-1 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 shadow-md shadow-blue-200"
                >
                  {submitting ? 'Đang xác nhận...' : 'Đã thanh toán'}
                </button>
              </div>
              <p className="mt-4 text-xs text-center text-gray-400">
                Sau khi chuyển khoản thành công, vui lòng nhấn "Đã thanh toán" để hệ thống xử lý.
              </p>
            </div>
          </div>
        )
      }
    </div >
  );
}
