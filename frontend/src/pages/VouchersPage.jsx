import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Generate QR Code URL using a free QR code API
const generateQRCode = (text) => {
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(text)}`;
};

// Mock data để test
const mockVoucherData = {
  booking_code: 'JRN-2025-001',
  booking_date: '2025-01-15',
  status: 'Đã thanh toán',
  payment_method: 'VNPay',
  customer: {
    name: 'Lê Đại Thanh Long',
    phone: '0769 749 465',
    email: 'lucaslee050304@gmail.com'
  },
  services: [
    {
      type: 'flight',
      name: 'Vietnam Airlines VN123',
      description: 'Hồ Chí Minh – Hà Nội',
      start_date: '2025-01-20',
      end_date: '2025-01-20',
      price: 5000000
    },
    {
      type: 'hotel',
      name: 'Grand Hotel Hanoi',
      description: 'Phòng Deluxe, 2 đêm',
      start_date: '2025-01-20',
      end_date: '2025-01-22',
      price: 6000000
    },
    {
      type: 'car',
      name: 'Toyota Vios',
      description: '5 chỗ, 3 ngày',
      start_date: '2025-01-20',
      end_date: '2025-01-23',
      price: 2400000
    },
    {
      type: 'activity',
      name: 'Tour Phố Cổ Hà Nội',
      description: '4 giờ, 2 người',
      start_date: '2025-01-21',
      end_date: '2025-01-21',
      price: 1600000
    }
  ],
  total_price: 15000000
};

// Icon Components
const IconPlane = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
  </svg>
);

const IconHotel = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
  </svg>
);

const IconCar = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
  </svg>
);

const IconActivity = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
  </svg>
);

const IconCheck = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);

const IconDownload = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
  </svg>
);

const IconPrint = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 19.5l-1.591-1.591a2.25 2.25 0 010-3.182L8.25 13.5H4.5A2.25 2.25 0 002.25 15.75v3.75A2.25 2.25 0 006.75 22.5h3.75a2.25 2.25 0 002.25-2.25V18l-1.591 1.591a2.25 2.25 0 01-3.182 0zM19.5 6.75l-1.591 1.591a2.25 2.25 0 01-3.182 0L13.5 8.25v-3.75A2.25 2.25 0 0115.75 2.25h3.75A2.25 2.25 0 0121.75 4.5v3.75a2.25 2.25 0 01-2.25 2.25h-3.75l-1.591-1.591a2.25 2.25 0 010-3.182L19.5 6.75z" />
  </svg>
);

// Helper functions
const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN').format(price || 0);
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

const getServiceIcon = (type) => {
  switch (type) {
    case 'flight':
      return <IconPlane />;
    case 'hotel':
      return <IconHotel />;
    case 'car':
      return <IconCar />;
    case 'activity':
      return <IconActivity />;
    default:
      return <IconActivity />;
  }
};

const getServiceEmoji = (type) => {
  switch (type) {
    case 'flight':
      return '✈️';
    case 'hotel':
      return '🏨';
    case 'car':
      return '🚗';
    case 'activity':
      return '🎫';
    default:
      return '🎫';
  }
};

const getServiceName = (type) => {
  switch (type) {
    case 'flight':
      return 'Vé máy bay';
    case 'hotel':
      return 'Khách sạn';
    case 'car':
      return 'Thuê xe';
    case 'activity':
      return 'Tour & hoạt động';
    default:
      return 'Dịch vụ';
  }
};

const getStatusBadge = (status) => {
  switch (status) {
    case 'pending':
      return {
        text: '🟡 Đang chờ xác nhận',
        className: 'bg-yellow-50 text-yellow-700 border-yellow-200'
      };
    case 'confirmed':
      return {
        text: '🟢 Đã xác nhận',
        className: 'bg-emerald-50 text-emerald-700 border-emerald-200'
      };
    case 'cancelled':
      return {
        text: '🔴 Đã hủy',
        className: 'bg-red-50 text-red-700 border-red-200'
      };
    case 'completed':
      return {
        text: '🔵 Đã hoàn thành',
        className: 'bg-blue-50 text-blue-700 border-blue-200'
      };
    default:
      return {
        text: status,
        className: 'bg-gray-50 text-gray-700 border-gray-200'
      };
  }
};

export default function VouchersPage() {
  const [vouchers, setVouchers] = useState([mockVoucherData]);
  const [loading, setLoading] = useState(false);
  const { getToken, isSignedIn } = useAuth();

  useEffect(() => {
    const loadVouchers = async () => {
      if (!isSignedIn) {
        setVouchers([mockVoucherData]);
        return;
      }

      try {
        setLoading(true);
        const token = await getToken();
        const res = await axios.get(`${API}/bookings`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        console.log('Raw booking data from API:', res.data);

        // Group bookings by transaction_id to combine services from same payment
        const bookingGroups = {};
        res.data.forEach(booking => {
          const txnId = booking.transaction_id || `single-${booking.id}`;
          if (!bookingGroups[txnId]) {
            bookingGroups[txnId] = [];
          }
          bookingGroups[txnId].push(booking);
        });

        // Transform each group into a voucher
        const transformedVouchers = Object.values(bookingGroups).map(bookings => {
          const firstBooking = bookings[0];

          // Build services array from all bookings in group
          const services = bookings.map(booking => {
            const serviceData = booking.hotel || booking.flight || booking.car || booking.activity;

            let description = '';
            let serviceName = 'Dịch vụ'; // Default fallback

            if (booking.hotel) {
              serviceName = serviceData?.name || 'Khách sạn';
              description = booking.item_variant || 'Phòng khách sạn';
            } else if (booking.flight) {
              serviceName = serviceData?.airline || 'Chuyến bay';
              description = `${serviceData?.departure || ''} – ${serviceData?.destination || ''}`;
            } else if (booking.car) {
              // Cars have company and model, not just name
              serviceName = serviceData?.company
                ? `${serviceData.company}${serviceData.model ? ' ' + serviceData.model : ''}`
                : 'Xe thuê';
              description = `${serviceData?.seats || ''} chỗ`;
            } else if (booking.activity) {
              serviceName = serviceData?.name || 'Hoạt động';
              description = serviceData?.description || '';
            }

            const serviceObj = {
              type: booking.service_type || (booking.hotel ? 'hotel' : booking.flight ? 'flight' : booking.car ? 'car' : 'activity'),
              name: serviceName,
              description: description,
              start_date: booking.start_date,
              end_date: booking.end_date,
              price: parseFloat(booking.total_price) || 0
            };

            console.log('Service data:', {
              type: serviceObj.type,
              name: serviceObj.name,
              start_date: booking.start_date,
              end_date: booking.end_date,
              formatted_start: booking.start_date ? formatDate(booking.start_date) : 'NO START',
              formatted_end: booking.end_date ? formatDate(booking.end_date) : 'NO END'
            });

            return serviceObj;
          });

          // Calculate total from all bookings in group
          const totalPrice = bookings.reduce((sum, b) => sum + (parseFloat(b.total_price) || 0), 0);

          return {
            booking_code: firstBooking.transaction_id || `JRN-${firstBooking.id}`,
            booking_date: firstBooking.createdAt || firstBooking.created_at,
            status: firstBooking.status || 'pending',
            payment_method: firstBooking.payment_method || 'VNPay',
            customer: {
              name: firstBooking.customer_name || firstBooking.user?.name || 'Khách hàng',
              phone: firstBooking.customer_phone || '',
              email: firstBooking.customer_email || firstBooking.user?.email || ''
            },
            services: services,
            total_price: totalPrice
          };
        });

        setVouchers(transformedVouchers.length > 0 ? transformedVouchers : [mockVoucherData]);
      } catch (error) {
        console.error('Error loading vouchers:', error);
        setVouchers([mockVoucherData]);
      } finally {
        setLoading(false);
      }
    };

    loadVouchers();
  }, [isSignedIn, getToken]);

  const handlePrint = (voucher) => {
    const printWindow = window.open('', '_blank');
    const qrCodeUrl = generateQRCode(voucher.booking_code);
    const bookingCode = voucher.booking_code.replace(/[^a-zA-Z0-9-]/g, '_');
    const timestamp = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const fileName = `Voucher-${bookingCode}-${timestamp}`;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="vi">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${fileName}</title>
        <link rel="icon" type="image/png" href="/JurniLogo/favicon-96x96.png" sizes="96x96" />
        <style>
          @page {
            size: A4;
            margin: 8mm;
          }
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, 'Roboto', 'Helvetica Neue', Arial, sans-serif;
            background: white;
            padding: 0;
            color: #1f2937;
            font-size: 11px;
            line-height: 1.4;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
          }
          .voucher-container {
            width: 100%;
            max-width: 210mm;
            margin: 0 auto;
            background: white;
            padding: 8px;
            position: relative;
            flex: 1;
            display: flex;
            flex-direction: column;
          }
          .seal-background {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            opacity: 0.05;
            pointer-events: none;
            z-index: 0;
            background-image: url('/JurniLogo/jurni-seal.png');
            background-repeat: no-repeat;
            background-position: center;
            background-size: 400px 400px;
          }
          .voucher-content-wrapper {
            position: relative;
            z-index: 1;
            flex: 1;
            display: flex;
            flex-direction: column;
          }
          .voucher-header {
            text-align: center;
            padding-bottom: 12px;
            border-bottom: 2px solid #e5e7eb;
            margin-bottom: 12px;
          }
          .voucher-header h1 {
            font-size: 22px;
            font-weight: 900;
            color: #0A4EC3;
            margin-bottom: 4px;
            text-transform: uppercase;
            letter-spacing: 1.5px;
          }
          .voucher-header .subtitle {
            font-size: 10px;
            color: #64748b;
            font-weight: 500;
          }
          .header-logo {
            width: 50px;
            height: 50px;
            margin: 0 auto 6px;
            object-fit: contain;
          }
          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 10px;
            margin-bottom: 10px;
          }
          .info-box {
            background: #f8fafc;
            border: 2px solid #0A4EC3;
            border-radius: 8px;
            padding: 8px;
          }
          .info-box h3 {
            font-size: 9px;
            text-transform: uppercase;
            color: #64748b;
            margin-bottom: 8px;
            font-weight: 700;
            letter-spacing: 0.5px;
          }
          .info-item {
            margin-bottom: 6px;
            font-size: 10px;
          }
          .info-label {
            color: #64748b;
            font-size: 8px;
            margin-bottom: 2px;
          }
          .info-value {
            color: #0A4EC3;
            font-weight: 700;
            font-size: 11px;
          }
          .qr-section {
            text-align: center;
          }
          .qr-code {
            width: 70px;
            height: 70px;
            margin: 6px auto;
            border: 2px solid #e5e7eb;
            border-radius: 6px;
            padding: 5px;
            background: white;
          }
          .qr-code img {
            width: 100%;
            height: 100%;
            object-fit: contain;
          }
          .qr-note {
            font-size: 9px;
            color: #64748b;
            font-style: italic;
            margin-top: 8px;
          }
          .services-section {
            margin-bottom: 12px;
          }
          .section-title {
            font-size: 13px;
            font-weight: 800;
            color: #0A4EC3;
            margin-bottom: 10px;
            padding-bottom: 6px;
            border-bottom: 2px solid #0A4EC3;
            text-transform: uppercase;
          }
          .service-item {
            background: white;
            border: 1.5px solid #e5e7eb;
            border-radius: 8px;
            padding: 10px;
            margin-bottom: 8px;
            display: flex;
            align-items: flex-start;
            gap: 10px;
          }
          .service-icon {
            width: 36px;
            height: 36px;
            background: #eff6ff;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            font-size: 18px;
          }
          .service-content {
            flex: 1;
          }
          .service-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 8px;
          }
          .service-name {
            font-size: 12px;
            font-weight: 700;
            color: #1f2937;
            margin-bottom: 3px;
            line-height: 1.3;
          }
          .service-description {
            font-size: 10px;
            color: #64748b;
            margin-bottom: 4px;
            line-height: 1.3;
          }
          .service-date {
            font-size: 9px;
            color: #94a3b8;
          }
          .service-price {
            font-size: 13px;
            font-weight: 800;
            color: #0A4EC3;
            text-align: right;
          }
          .total-section {
            background: linear-gradient(135deg, #0A4EC3 0%, #2563eb 100%);
            color: white;
            padding: 12px;
            border-radius: 8px;
            text-align: center;
            margin-bottom: 12px;
          }
          .total-label {
            font-size: 9px;
            text-transform: uppercase;
            opacity: 0.9;
            margin-bottom: 6px;
            letter-spacing: 0.5px;
          }
          .total-amount {
            font-size: 24px;
            font-weight: 900;
            margin-bottom: 8px;
          }
          .payment-info {
            display: flex;
            justify-content: center;
            gap: 16px;
            flex-wrap: wrap;
            margin-top: 12px;
          }
          .payment-badge {
            background: rgba(255, 255, 255, 0.2);
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 10px;
            font-weight: 600;
          }
          .instructions-section {
            background: #fef3c7;
            border-left: 3px solid #f59e0b;
            padding: 10px;
            border-radius: 8px;
            margin-bottom: 10px;
          }
          .instructions-title {
            font-size: 10px;
            font-weight: 800;
            color: #92400e;
            margin-bottom: 8px;
            text-transform: uppercase;
          }
          .instructions-list {
            list-style: none;
          }
          .instructions-list li {
            margin-bottom: 5px;
            font-size: 9px;
            color: #78350f;
            line-height: 1.3;
          }
          .seal-section {
            text-align: center;
            margin-bottom: 10px;
            padding: 8px;
          }
          .seal-placeholder {
            width: 80px;
            height: 80px;
            margin: 0 auto;
            border: 2px dashed #cbd5e1;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(10, 78, 195, 0.05);
            opacity: 0.3;
          }
          .seal-note {
            font-size: 8px;
            color: #94a3b8;
            margin-top: 6px;
            font-style: italic;
          }
          .footer {
            text-align: center;
            padding-top: 8px;
            border-top: 2px solid #e5e7eb;
            color: #64748b;
            font-size: 8px;
            margin-top: auto;
          }
          .footer-logo {
            font-size: 14px;
            font-weight: 900;
            color: #0A4EC3;
            margin-bottom: 6px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .footer div {
            margin: 3px 0;
            line-height: 1.4;
          }
          @media print {
            body {
              background: white;
              min-height: 100vh;
              display: flex;
              flex-direction: column;
            }
            .voucher-container {
              max-width: 100%;
              padding: 0;
              min-height: 100vh;
              display: flex;
              flex-direction: column;
            }
            .voucher-content-wrapper {
              min-height: 100vh;
              display: flex;
              flex-direction: column;
            }
            .footer {
              margin-top: auto;
              position: relative;
            }
            .service-item {
              page-break-inside: avoid;
            }
          }
        </style>
      </head>
      <body>
        <div class="voucher-container">
          <div class="seal-background"></div>
          <div class="voucher-content-wrapper">
          <div class="voucher-header">
            <img src="/JurniLogo/apple-touch-icon.png" alt="Jurni Logo" class="header-logo" />
            <h1>TRAVEL VOUCHER</h1>
            <div class="subtitle">Xác nhận dịch vụ đã thanh toán</div>
          </div>

          <div class="info-grid">
            <div class="info-box">
              <h3>Thông tin đặt tour</h3>
              <div class="info-item">
                <div class="info-label">Mã đặt tour</div>
                <div class="info-value">${voucher.booking_code}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Ngày đặt</div>
                <div class="info-value">${formatDate(voucher.booking_date)}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Trạng thái</div>
                <div class="info-value">${voucher.status}</div>
              </div>
            </div>

            <div class="info-box">
              <h3>Thông tin khách hàng</h3>
              <div class="info-item">
                <div class="info-label">Họ tên</div>
                <div class="info-value">${voucher.customer?.name || 'N/A'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Số điện thoại</div>
                <div class="info-value">${voucher.customer?.phone || 'N/A'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Email</div>
                <div class="info-value">${voucher.customer?.email || 'N/A'}</div>
              </div>
            </div>

            <div class="info-box">
              <h3>QR Code</h3>
              <div class="qr-section">
                <div class="qr-code">
                  <img src="${qrCodeUrl}" alt="QR Code" />
                </div>
                <div class="qr-note">Quét mã để kiểm tra tình trạng thanh toán</div>
              </div>
            </div>
          </div>

          <div class="services-section" style="position: relative; margin-bottom: 10px;">
            <div style="margin-bottom: 8px;">
              <div class="section-title" style="font-size: 14px; font-weight: 800; color: #0A4EC3; margin-bottom: 0; padding-bottom: 6px; border-bottom: 2px solid #0A4EC3; text-transform: uppercase;">Chi tiết dịch vụ</div>
            </div>
            <div style="overflow-x: auto; border-radius: 10px; border: 2px solid rgba(10, 78, 195, 0.2); background: white; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);">
              <table style="width: 100%; border-collapse: collapse; font-size: 10px;">
                <thead>
                  <tr style="background: linear-gradient(to right, #0A4EC3, #1e5cd8, #2563eb); color: white; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                    <th style="text-align: left; padding: 8px 10px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.3px; border-right: 1px solid rgba(255,255,255,0.2);">Loại dịch vụ</th>
                    <th style="text-align: left; padding: 8px 10px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.3px; border-right: 1px solid rgba(255,255,255,0.2);">Tên dịch vụ</th>
                    <th style="text-align: left; padding: 8px 10px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.3px; border-right: 1px solid rgba(255,255,255,0.2);">Mô tả</th>
                    <th style="text-align: left; padding: 8px 10px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.3px; border-right: 1px solid rgba(255,255,255,0.2);">Thời gian</th>
                    <th style="text-align: right; padding: 8px 10px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.3px;">Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  ${voucher.services?.map((service, idx) => `
                    <tr style="border-bottom: 2px solid #e5e7eb; background: ${idx % 2 === 0 ? '#ffffff' : 'rgba(239, 246, 255, 0.3)'};">
                      <td style="padding: 8px 10px; border-right: 2px solid #e5e7eb;">
                        <div style="font-size: 9px; font-weight: 600; color: #374151; text-transform: uppercase; letter-spacing: 0.2px;">${getServiceName(service.type)}</div>
                      </td>
                      <td style="padding: 8px 10px; border-right: 2px solid #e5e7eb;">
                        <div style="font-size: 10px; font-weight: 700; color: #111827;">${service.name}</div>
                      </td>
                      <td style="padding: 8px 10px; border-right: 2px solid #e5e7eb;">
                        <div style="font-size: 9px; color: #374151; line-height: 1.4; font-weight: 500;">${service.description || '-'}</div>
                      </td>
                      <td style="padding: 8px 10px; border-right: 2px solid #e5e7eb;">
                        <div style="font-size: 9px; color: #1f2937; white-space: nowrap;">
                          ${(() => {
        const start = formatDate(service.start_date);
        const end = formatDate(service.end_date);
        if (start && end && start !== end) {
          return `
                                <div style="font-weight: 600;">${start}</div>
                                <div style="color: #4b5563; font-size: 8px;">đến ${end}</div>
                              `;
        } else if (start) {
          return `<div style="font-weight: 600;">${start}</div>`;
        } else if (end) {
          return `<div style="font-weight: 600;">${end}</div>`;
        } else {
          return `<div style="color: #9ca3af; font-style: italic;">-</div>`;
        }
      })()}
                        </div>
                      </td>
                      <td style="padding: 8px 10px; text-align: right;">
                        <div style="font-size: 10px; font-weight: 900; color: #0A4EC3; white-space: nowrap;">
                          ${formatPrice(service.price)} VND
                        </div>
                      </td>
                    </tr>
                  `).join('') || ''}
                </tbody>
                <tfoot>
                  <tr style="background: linear-gradient(to right, #eff6ff, #e0e7ff); border-top: 4px solid #0A4EC3; box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);">
                    <td colspan="4" style="padding: 10px;">
                      <div style="display: flex; flex-direction: column; gap: 6px;">
                        <div style="font-size: 10px; font-weight: 700; color: #111827; text-transform: uppercase; letter-spacing: 0.3px;">
                          Tổng tiền thanh toán
                        </div>
                        <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                          <div style="display: inline-flex; align-items: center; gap: 4px; background: #d1fae5; color: #065f46; padding: 4px 8px; border-radius: 9999px; font-size: 9px; font-weight: 600; border: 2px solid #6ee7b7; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);">
                            ✓ Đã thanh toán
                          </div>
                          <div style="display: inline-flex; align-items: center; background: #dbeafe; color: #1e40af; padding: 4px 8px; border-radius: 9999px; font-size: 9px; font-weight: 600; border: 2px solid #93c5fd; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);">
                            ${voucher.payment_method || 'VNPay'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style="padding: 10px; text-align: right;">
                      <div style="font-size: 14px; font-weight: 900; color: #0A4EC3; white-space: nowrap; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);">
                        ${formatPrice(voucher.total_price)} VND
                      </div>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr auto; gap: 10px; margin-bottom: 10px; align-items: stretch;">
            <!-- PHẦN HƯỚNG DẪN -->
            <div class="instructions-section" 
                style="background: #fffef5; border-left: 4px solid #fbbf24; padding: 10px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
              <div class="instructions-title" 
                  style="font-size: 10px; font-weight: 900; margin-bottom: 8px; color: #78350f; text-transform: uppercase; letter-spacing: 0.3px;">
                HƯỚNG DẪN SỬ DỤNG VOUCHER
              </div>
              <ul class="instructions-list" style="list-style: none; padding: 0; margin: 0; line-height: 1.5;">
                <li style="margin-bottom: 6px; font-size: 9px; color: #78350f;">
                  Check-in sân bay bằng QR hoặc mã tour
                </li>
                <li style="margin-bottom: 6px; font-size: 9px; color: #78350f;">
                  Nhận phòng cần voucher + CCCD
                </li>
                <li style="margin-bottom: 6px; font-size: 9px; color: #78350f;">
                  Nhận xe cần đối chiếu thông tin
                </li>
                <li style="margin-bottom: 6px; font-size: 9px; color: #78350f;">
                  Tham gia tour trình voucher cho HDV
                </li>
              </ul>
            </div>

            <!-- DẤU MỘC -->
            <div style="
                  display: flex; 
                  flex-direction: column; 
                  align-items: center; 
                  justify-content: center;
                  height: 100%;
                ">
              <div style="
                    width: 100px;
                    height: 100px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                  ">
                <img src="/JurniLogo/jurni-seal.png" 
                    alt="Jurni Seal"
                    style="
                      width: 100%;
                      height: 100%;
                      object-fit: contain;
                    "
                    onerror="this.style.display='none'; this.parentElement.innerHTML='<div style=\'display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 8px;\'><div style=\'font-size: 7px; font-weight: 700; color: #0A4EC3; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 3px;\'>VERIFIED & APPROVED</div><div style=\'font-size: 16px; font-weight: 900; color: #0A4EC3; margin-bottom: 3px;\'>JURNI</div><div style=\'font-size: 6px; font-weight: 600; color: #0A4EC3; margin-bottom: 3px;\'>TRAVEL</div><div style=\'font-size: 5px; font-weight: 500; color: #0A4EC3;\'>EST. 2025</div><div style=\'font-size: 5px; font-weight: 700; color: #0A4EC3; text-transform: uppercase; letter-spacing: 1px; margin-top: 3px;\'>OFFICIAL AUTHENTICATION SEAL</div></div>';" />
              </div>

              <div style="margin-top: 6px; font-size: 8px; color: #78350f; font-style: italic;">
                Chứng nhận bởi JURNI
              </div>
            </div>
          </div>


          <div class="footer">
            <div class="footer-logo">JURNI TRAVEL</div>
            <div>Phân khu E1, Khu công nghệ cao, Xa lộ Hà Nội, Phường Hiệp Phú, TP. Thủ Đức, TP.HCM</div>
            <div>Hotline: 0769 749 465 | Email: support@jurni.com</div>
            <div style="margin-top: 12px; font-size: 9px; color: #94a3b8;">
              Voucher này là tài liệu chính thức xác nhận việc đặt và thanh toán dịch vụ du lịch.
            </div>
          </div>
          </div>
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();

    setTimeout(() => {
      // Đảm bảo title được set để browser tự động đề xuất tên file khi in PDF
      printWindow.document.title = fileName;

      // Thêm meta tag để hỗ trợ một số browser
      const metaTitle = printWindow.document.createElement('meta');
      metaTitle.setAttribute('name', 'title');
      metaTitle.setAttribute('content', fileName);
      printWindow.document.head.appendChild(metaTitle);

      printWindow.print();
    }, 500);
  };

  const handleDownload = async (voucher) => {
    try {
      const iframe = document.createElement('iframe');
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = 'none';
      iframe.style.opacity = '0';
      iframe.style.pointerEvents = 'none';
      document.body.appendChild(iframe);

      const qrCodeUrl = generateQRCode(voucher.booking_code);

      iframe.contentDocument.open();
      iframe.contentDocument.write(`
        <!DOCTYPE html>
        <html lang="vi">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Travel Voucher - ${voucher.booking_code}</title>
          <link rel="icon" type="image/png" href="/JurniLogo/favicon-96x96.png" sizes="96x96" />
          <style>
            @page {
              size: A4;
              margin: 8mm;
            }
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, 'Roboto', 'Helvetica Neue', Arial, sans-serif;
              background: white;
              padding: 0;
              color: #1f2937;
              font-size: 11px;
              line-height: 1.4;
              min-height: 100vh;
              display: flex;
              flex-direction: column;
            }
            .voucher-container {
              width: 100%;
              max-width: 210mm;
              margin: 0 auto;
              background: white;
              padding: 8px;
              position: relative;
              flex: 1;
              display: flex;
              flex-direction: column;
            }
            .seal-background {
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              opacity: 0.05;
              pointer-events: none;
              z-index: 0;
              background-image: url('/JurniLogo/jurni-seal.png');
              background-repeat: no-repeat;
              background-position: center;
              background-size: 400px 400px;
            }
            .voucher-content-wrapper {
              position: relative;
              z-index: 1;
              flex: 1;
              display: flex;
              flex-direction: column;
            }
            .voucher-header {
              text-align: center;
              padding-bottom: 12px;
              border-bottom: 2px solid #e5e7eb;
              margin-bottom: 12px;
            }
            .voucher-header h1 {
              font-size: 22px;
              font-weight: 900;
              color: #0A4EC3;
              margin-bottom: 4px;
              text-transform: uppercase;
              letter-spacing: 1.5px;
            }
            .voucher-header .subtitle {
              font-size: 10px;
              color: #64748b;
              font-weight: 500;
            }
            .header-logo {
              width: 50px;
              height: 50px;
              margin: 0 auto 6px;
              object-fit: contain;
            }
            .info-grid {
              display: grid;
              grid-template-columns: 1fr 1fr 1fr;
              gap: 10px;
              margin-bottom: 10px;
            }
            .info-box {
              background: #f8fafc;
              border: 2px solid #0A4EC3;
              border-radius: 8px;
              padding: 8px;
            }
            .info-box h3 {
              font-size: 9px;
              text-transform: uppercase;
              color: #64748b;
              margin-bottom: 8px;
              font-weight: 700;
              letter-spacing: 0.5px;
            }
            .info-item {
              margin-bottom: 6px;
              font-size: 10px;
            }
            .info-label {
              color: #64748b;
              font-size: 8px;
              margin-bottom: 2px;
            }
            .info-value {
              color: #0A4EC3;
              font-weight: 700;
              font-size: 11px;
            }
            .qr-section {
              text-align: center;
            }
            .qr-code {
              width: 70px;
              height: 70px;
              margin: 6px auto;
              border: 2px solid #e5e7eb;
              border-radius: 6px;
              padding: 5px;
              background: white;
            }
            .qr-code img {
              width: 100%;
              height: 100%;
              object-fit: contain;
            }
            .qr-note {
              font-size: 9px;
              color: #64748b;
              font-style: italic;
              margin-top: 8px;
            }
            .services-section {
              margin-bottom: 12px;
            }
            .section-title {
              font-size: 13px;
              font-weight: 800;
              color: #0A4EC3;
              margin-bottom: 10px;
              padding-bottom: 6px;
              border-bottom: 2px solid #0A4EC3;
              text-transform: uppercase;
            }
            .service-item {
              background: white;
              border: 1.5px solid #e5e7eb;
              border-radius: 8px;
              padding: 10px;
              margin-bottom: 8px;
              display: flex;
              align-items: flex-start;
              gap: 10px;
            }
            .service-icon {
              width: 36px;
              height: 36px;
              background: #eff6ff;
              border-radius: 8px;
              display: flex;
              align-items: center;
              justify-content: center;
              flex-shrink: 0;
              font-size: 18px;
            }
            .service-content {
              flex: 1;
            }
            .service-header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              margin-bottom: 8px;
            }
            .service-name {
              font-size: 12px;
              font-weight: 700;
              color: #1f2937;
              margin-bottom: 3px;
              line-height: 1.3;
            }
            .service-description {
              font-size: 10px;
              color: #64748b;
              margin-bottom: 4px;
              line-height: 1.3;
            }
            .service-date {
              font-size: 9px;
              color: #94a3b8;
            }
            .service-price {
              font-size: 13px;
              font-weight: 800;
              color: #0A4EC3;
              text-align: right;
            }
            .total-section {
              background: linear-gradient(135deg, #0A4EC3 0%, #2563eb 100%);
              color: white;
              padding: 12px;
              border-radius: 8px;
              text-align: center;
              margin-bottom: 12px;
            }
            .total-label {
              font-size: 9px;
              text-transform: uppercase;
              opacity: 0.9;
              margin-bottom: 6px;
              letter-spacing: 0.5px;
            }
            .total-amount {
              font-size: 24px;
              font-weight: 900;
              margin-bottom: 8px;
            }
            .payment-info {
              display: flex;
              justify-content: center;
              gap: 16px;
              flex-wrap: wrap;
              margin-top: 12px;
            }
            .payment-badge {
              background: rgba(255, 255, 255, 0.2);
              padding: 6px 12px;
              border-radius: 20px;
              font-size: 10px;
              font-weight: 600;
            }
            .instructions-section {
              background: #fef3c7;
              border-left: 3px solid #f59e0b;
              padding: 10px;
              border-radius: 8px;
              margin-bottom: 10px;
            }
            .instructions-title {
              font-size: 10px;
              font-weight: 800;
              color: #92400e;
              margin-bottom: 8px;
              text-transform: uppercase;
            }
            .instructions-list {
              list-style: none;
            }
            .instructions-list li {
              margin-bottom: 5px;
              font-size: 9px;
              color: #78350f;
              line-height: 1.3;
            }
            .seal-section {
              text-align: center;
              margin-bottom: 10px;
              padding: 8px;
            }
            .seal-placeholder {
              width: 80px;
              height: 80px;
              margin: 0 auto;
              border: 2px dashed #cbd5e1;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              background: rgba(10, 78, 195, 0.05);
              opacity: 0.3;
            }
            .seal-note {
              font-size: 8px;
              color: #94a3b8;
              margin-top: 6px;
              font-style: italic;
            }
            .footer {
              text-align: center;
              padding-top: 8px;
              border-top: 2px solid #e5e7eb;
              color: #64748b;
              font-size: 8px;
              margin-top: auto;
            }
            .footer-logo {
              font-size: 14px;
              font-weight: 900;
              color: #0A4EC3;
              margin-bottom: 6px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .footer div {
              margin: 3px 0;
              line-height: 1.4;
            }
          </style>
        </head>
        <body>
          <div class="voucher-container" id="voucher-content">
            <div class="seal-background"></div>
            <div class="voucher-content-wrapper">
            <div class="voucher-header">
              <img src="/JurniLogo/apple-touch-icon.png" alt="Jurni Logo" class="header-logo" />
              <h1>TRAVEL VOUCHER</h1>
              <div class="subtitle">Xác nhận dịch vụ đã thanh toán</div>
            </div>

            <div class="info-grid">
              <div class="info-box">
                <h3>Thông tin đặt tour</h3>
                <div class="info-item">
                  <div class="info-label">Mã đặt tour</div>
                  <div class="info-value">${voucher.booking_code}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Ngày đặt</div>
                  <div class="info-value">${formatDate(voucher.booking_date)}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Trạng thái</div>
                  <div class="info-value">${voucher.status}</div>
                </div>
              </div>

              <div class="info-box">
                <h3>Thông tin khách hàng</h3>
                <div class="info-item">
                  <div class="info-label">Họ tên</div>
                  <div class="info-value">${voucher.customer?.name || 'N/A'}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Số điện thoại</div>
                  <div class="info-value">${voucher.customer?.phone || 'N/A'}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Email</div>
                  <div class="info-value">${voucher.customer?.email || 'N/A'}</div>
                </div>
              </div>

              <div class="info-box">
                <h3>QR Code</h3>
                <div class="qr-section">
                  <div class="qr-code">
                    <img src="${qrCodeUrl}" alt="QR Code" />
                  </div>
                  <div class="qr-note">Quét mã để kiểm tra tình trạng thanh toán</div>
                </div>
              </div>
            </div>

            <div class="services-section" style="position: relative; margin-bottom: 10px;">
              <div style="margin-bottom: 8px;">
                <div class="section-title" style="font-size: 14px; font-weight: 800; color: #0A4EC3; margin-bottom: 0; padding-bottom: 6px; border-bottom: 2px solid #0A4EC3; text-transform: uppercase;">Chi tiết dịch vụ</div>
              </div>
              <div style="overflow-x: auto; border-radius: 10px; border: 2px solid rgba(10, 78, 195, 0.2); background: white; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);">
                <table style="width: 100%; border-collapse: collapse; font-size: 10px;">
                  <thead>
                    <tr style="background: linear-gradient(to right, #0A4EC3, #1e5cd8, #2563eb); color: white; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                      <th style="text-align: left; padding: 8px 10px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.3px; border-right: 1px solid rgba(255,255,255,0.2);">Loại dịch vụ</th>
                      <th style="text-align: left; padding: 8px 10px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.3px; border-right: 1px solid rgba(255,255,255,0.2);">Tên dịch vụ</th>
                      <th style="text-align: left; padding: 8px 10px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.3px; border-right: 1px solid rgba(255,255,255,0.2);">Mô tả</th>
                      <th style="text-align: left; padding: 8px 10px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.3px; border-right: 1px solid rgba(255,255,255,0.2);">Thời gian</th>
                      <th style="text-align: right; padding: 8px 10px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.3px;">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${voucher.services?.map((service, idx) => `
                      <tr style="border-bottom: 2px solid #e5e7eb; background: ${idx % 2 === 0 ? '#ffffff' : 'rgba(239, 246, 255, 0.3)'};">
                        <td style="padding: 8px 10px; border-right: 2px solid #e5e7eb;">
                          <div style="font-size: 9px; font-weight: 600; color: #374151; text-transform: uppercase; letter-spacing: 0.2px;">${getServiceName(service.type)}</div>
                        </td>
                        <td style="padding: 8px 10px; border-right: 2px solid #e5e7eb;">
                          <div style="font-size: 10px; font-weight: 700; color: #111827;">${service.name}</div>
                        </td>
                        <td style="padding: 8px 10px; border-right: 2px solid #e5e7eb;">
                          <div style="font-size: 9px; color: #374151; line-height: 1.4; font-weight: 500;">${service.description || '-'}</div>
                        </td>
                        <td style="padding: 8px 10px; border-right: 2px solid #e5e7eb;">
                          <div style="font-size: 9px; color: #1f2937; white-space: nowrap;">
                            <div style="font-weight: 600;">${formatDate(service.start_date)}</div>
                            <div style="color: #4b5563; font-size: 8px;">đến ${formatDate(service.end_date)}</div>
                          </div>
                        </td>
                        <td style="padding: 8px 10px; text-align: right;">
                          <div style="font-size: 10px; font-weight: 900; color: #0A4EC3; white-space: nowrap;">
                            ${formatPrice(service.price)} VND
                          </div>
                        </td>
                      </tr>
                    `).join('') || ''}
                  </tbody>
                  <tfoot>
                    <tr style="background: linear-gradient(to right, #eff6ff, #e0e7ff); border-top: 4px solid #0A4EC3; box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);">
                      <td colspan="4" style="padding: 10px;">
                        <div style="display: flex; flex-direction: column; gap: 6px;">
                          <div style="font-size: 10px; font-weight: 700; color: #111827; text-transform: uppercase; letter-spacing: 0.3px;">
                            Tổng tiền thanh toán
                          </div>
                          <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                            <div style="display: inline-flex; align-items: center; gap: 4px; background: #d1fae5; color: #065f46; padding: 4px 8px; border-radius: 9999px; font-size: 9px; font-weight: 600; border: 2px solid #6ee7b7; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);">
                              ✓ Đã thanh toán
                            </div>
                            <div style="display: inline-flex; align-items: center; background: #dbeafe; color: #1e40af; padding: 4px 8px; border-radius: 9999px; font-size: 9px; font-weight: 600; border: 2px solid #93c5fd; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);">
                              ${voucher.payment_method || 'VNPay'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style="padding: 10px; text-align: right;">
                        <div style="font-size: 14px; font-weight: 900; color: #0A4EC3; white-space: nowrap; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);">
                          ${formatPrice(voucher.total_price)} VND
                        </div>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr auto; gap: 10px; margin-bottom: 10px; align-items: stretch;">
              <!-- PHẦN HƯỚNG DẪN -->
              <div class="instructions-section" 
                  style="background: #fffef5; border-left: 4px solid #fbbf24; padding: 10px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <div class="instructions-title" 
                    style="font-size: 10px; font-weight: 900; margin-bottom: 8px; color: #78350f; text-transform: uppercase; letter-spacing: 0.3px;">
                  HƯỚNG DẪN SỬ DỤNG VOUCHER
                </div>
                <ul class="instructions-list" style="list-style: none; padding: 0; margin: 0; line-height: 1.5;">
                  <li style="margin-bottom: 6px; font-size: 9px; color: #78350f;">
                    Check-in sân bay bằng QR hoặc mã tour
                  </li>
                  <li style="margin-bottom: 6px; font-size: 9px; color: #78350f;">
                    Nhận phòng cần voucher + CCCD
                  </li>
                  <li style="margin-bottom: 6px; font-size: 9px; color: #78350f;">
                    Nhận xe cần đối chiếu thông tin
                  </li>
                  <li style="margin-bottom: 6px; font-size: 9px; color: #78350f;">
                    Tham gia tour trình voucher cho HDV
                  </li>
                </ul>
              </div>

              <!-- DẤU MỘC -->
              <div style="
                    display: flex; 
                    flex-direction: column; 
                    align-items: center; 
                    justify-content: center;
                    height: 100%;
                  ">
                <div style="
                      width: 100px;
                      height: 100px;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                    ">
                  <img src="/JurniLogo/jurni-seal.png" 
                      alt="Jurni Seal"
                      style="
                        width: 100%;
                        height: 100%;
                        object-fit: contain;
                      "
                      onerror="this.style.display='none'; this.parentElement.innerHTML='<div style=\'display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 8px;\'><div style=\'font-size: 7px; font-weight: 700; color: #0A4EC3; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 3px;\'>VERIFIED & APPROVED</div><div style=\'font-size: 16px; font-weight: 900; color: #0A4EC3; margin-bottom: 3px;\'>JURNI</div><div style=\'font-size: 6px; font-weight: 600; color: #0A4EC3; margin-bottom: 3px;\'>TRAVEL</div><div style=\'font-size: 5px; font-weight: 500; color: #0A4EC3;\'>EST. 2025</div><div style=\'font-size: 5px; font-weight: 700; color: #0A4EC3; text-transform: uppercase; letter-spacing: 1px; margin-top: 3px;\'>OFFICIAL AUTHENTICATION SEAL</div></div>';" />
                </div>

                <div style="margin-top: 6px; font-size: 8px; color: #78350f; font-style: italic;">
                  Chứng nhận bởi JURNI
                </div>
              </div>
            </div>

            <div class="footer">
              <div class="footer-logo">JURNI TRAVEL</div>
              <div>Phân khu E1, Khu công nghệ cao, Xa lộ Hà Nội, Phường Hiệp Phú, TP. Thủ Đức, TP.HCM</div>
              <div>Hotline: 0769 749 465 | Email: support@jurni.com</div>
              <div style="margin-top: 12px; font-size: 9px; color: #94a3b8;">
                Voucher này là tài liệu chính thức xác nhận việc đặt và thanh toán dịch vụ du lịch.
              </div>
            </div>
          </div>
        </body>
        </html>
      `);
      iframe.contentDocument.close();

      await new Promise((resolve) => {
        setTimeout(() => {
          const doc = iframe.contentDocument;
          const images = doc.querySelectorAll('img');
          let loadedImages = 0;
          const totalImages = images.length;

          if (totalImages === 0) {
            resolve();
            return;
          }

          images.forEach((img) => {
            if (img.complete) {
              loadedImages++;
              if (loadedImages === totalImages) resolve();
            } else {
              img.onload = () => {
                loadedImages++;
                if (loadedImages === totalImages) resolve();
              };
              img.onerror = () => {
                loadedImages++;
                if (loadedImages === totalImages) resolve();
              };
            }
          });
        }, 1000);
      });

      const element = iframe.contentDocument.getElementById('voucher-content');

      // Đợi tất cả hình ảnh load xong
      await new Promise((resolve) => {
        const images = element.querySelectorAll('img');
        let loadedCount = 0;
        const totalImages = images.length;

        if (totalImages === 0) {
          resolve();
          return;
        }

        images.forEach((img) => {
          if (img.complete) {
            loadedCount++;
            if (loadedCount === totalImages) resolve();
          } else {
            img.onload = () => {
              loadedCount++;
              if (loadedCount === totalImages) resolve();
            };
            img.onerror = () => {
              loadedCount++;
              if (loadedCount === totalImages) resolve();
            };
          }
        });

        // Timeout sau 5 giây
        setTimeout(() => resolve(), 5000);
      });

      const canvas = await html2canvas(element, {
        scale: 3,
        useCORS: true,
        allowTaint: false,
        logging: false,
        backgroundColor: '#ffffff',
        width: element.scrollWidth,
        height: element.scrollHeight,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
        imageTimeout: 15000,
        removeContainer: false,
        onclone: (clonedDoc) => {
          // Đảm bảo tất cả hình ảnh có crossOrigin
          const clonedImages = clonedDoc.querySelectorAll('img');
          clonedImages.forEach((img) => {
            if (img.src && !img.crossOrigin) {
              img.crossOrigin = 'anonymous';
            }
          });
        }
      });

      const bookingCode = voucher.booking_code.replace(/[^a-zA-Z0-9-]/g, '_');
      const timestamp = new Date().toISOString().split('T')[0].replace(/-/g, '');
      const fileName = `Voucher-${bookingCode}-${timestamp}.jpg`;

      canvas.toBlob((blob) => {
        if (!blob) {
          console.error('Failed to create blob from canvas');
          alert('Có lỗi xảy ra khi tạo file ảnh. Vui lòng thử lại.');
          if (document.body.contains(iframe)) {
            document.body.removeChild(iframe);
          }
          return;
        }

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();

        setTimeout(() => {
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          if (document.body.contains(iframe)) {
            document.body.removeChild(iframe);
          }
        }, 100);
      }, 'image/jpeg', 1.0);
    } catch (error) {
      console.error('Error generating JPG:', error);
      alert('Có lỗi xảy ra khi tạo file JPG. Vui lòng thử lại.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#0A4EC3]"></div>
          <p className="mt-4 text-gray-600">Đang tải voucher...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/20 to-white py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-6">
            <div className="w-20 h-1 bg-gradient-to-r from-transparent via-[#0A4EC3] to-transparent mx-auto mb-4"></div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-4 tracking-tight">
              Travel Voucher
            </h1>
            <div className="w-20 h-1 bg-gradient-to-r from-transparent via-[#0A4EC3] to-transparent mx-auto"></div>
          </div>
          <p className="text-lg md:text-xl text-gray-600 font-medium tracking-wide">
            Xác nhận dịch vụ đã thanh toán
          </p>
        </div>

        {/* Vouchers List */}
        {vouchers.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
              <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <IconCheck className="w-12 h-12 text-[#0A4EC3]" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Chưa có voucher</h3>
              <p className="text-gray-600 mb-6">
                Bạn chưa có voucher nào. Hãy đặt tour và thanh toán để nhận voucher.
              </p>
              <a
                href="/"
                className="inline-block bg-[#0A4EC3] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#083a9a] transition"
              >
                Đặt tour ngay
              </a>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {vouchers.map((voucher, index) => {
              const qrCodeUrl = generateQRCode(voucher.booking_code);

              return (
                <div
                  key={index}
                  className="bg-white rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden relative backdrop-blur-sm"
                  id={`voucher-${index}`}
                  style={{
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                  }}
                >
                  {/* Seal Background Watermark */}
                  <div
                    className="absolute inset-0 opacity-[0.03] pointer-events-none z-0"
                    style={{
                      backgroundImage: 'url(/JurniLogo/jurni-seal.png)',
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'center',
                      backgroundSize: '400px 400px'
                    }}
                  />

                  {/* Voucher Content */}
                  <div className="p-8 relative z-10">
                    {/* Header */}
                    <div className="text-center mb-8 pb-6 border-b border-gray-200/60">
                      <div className="mb-4">
                        <img
                          src="/JurniLogo/apple-touch-icon.png"
                          alt="Jurni Logo"
                          className="w-20 h-20 mx-auto object-contain drop-shadow-sm"
                        />
                      </div>
                      <h1 className="text-3xl font-extrabold text-[#0A4EC3] mb-2 uppercase tracking-widest letter-spacing-2">
                        TRAVEL VOUCHER
                      </h1>
                      <p className="text-sm text-gray-500 font-medium tracking-wide">
                        Xác nhận dịch vụ đã thanh toán
                      </p>
                    </div>

                    {/* 3 Columns Info Grid */}
                    <div className="grid md:grid-cols-3 gap-5 mb-6">
                      {/* Thông tin đặt tour */}
                      <div className="bg-[#f8fafc] border-2 border-[#0A4EC3] rounded-xl p-4">
                        <h3 className="text-xs uppercase text-gray-600 font-bold mb-4 tracking-widest flex items-center gap-2">
                          <span className="w-1 h-4 bg-[#0A4EC3] rounded-full"></span>
                          Thông tin đặt tour
                        </h3>
                        <div className="space-y-3">
                          <div>
                            <div className="text-xs text-gray-500 mb-1.5 font-medium">Mã đặt tour</div>
                            <div className="text-base font-bold text-[#0A4EC3] tracking-wide">{voucher.booking_code}</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 mb-1.5 font-medium">Ngày đặt</div>
                            <div className="text-sm font-semibold text-gray-900">{formatDate(voucher.booking_date)}</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 mb-1.5 font-medium">Trạng thái</div>
                            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${getStatusBadge(voucher.status).className}`}>
                              {getStatusBadge(voucher.status).text}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Thông tin khách hàng */}
                      <div className="bg-[#f8fafc] border-2 border-[#0A4EC3] rounded-xl p-4">
                        <h3 className="text-xs uppercase text-gray-600 font-bold mb-4 tracking-widest flex items-center gap-2">
                          <span className="w-1 h-4 bg-[#0A4EC3] rounded-full"></span>
                          Thông tin khách hàng
                        </h3>
                        <div className="space-y-3">
                          <div>
                            <div className="text-xs text-gray-500 mb-1.5 font-medium">Họ tên</div>
                            <div className="text-sm font-semibold text-gray-900">{voucher.customer?.name || 'N/A'}</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 mb-1.5 font-medium">Số điện thoại</div>
                            <div className="text-sm font-semibold text-gray-900">{voucher.customer?.phone || 'N/A'}</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 mb-1.5 font-medium">Email</div>
                            <div className="text-sm font-semibold text-gray-900 break-all">{voucher.customer?.email || 'N/A'}</div>
                          </div>
                        </div>
                      </div>

                      {/* QR Code */}
                      <div className="bg-[#f8fafc] border-2 border-[#0A4EC3] rounded-xl p-4">
                        <h3 className="text-xs uppercase text-gray-600 font-bold mb-4 tracking-widest text-center flex items-center justify-center gap-2">
                          <span className="w-1 h-4 bg-[#0A4EC3] rounded-full"></span>
                          QR Code
                        </h3>
                        <div className="text-center">
                          <div className="inline-block p-3 bg-white border border-gray-200 rounded-xl">
                            <img
                              src={qrCodeUrl}
                              alt="QR Code"
                              className="w-24 h-24"
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-3 font-medium">
                            Quét mã để kiểm tra tình trạng thanh toán
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Chi tiết dịch vụ */}
                    <div className="mb-6">
                      <div className="mb-4">
                        <h2 className="text-xl font-extrabold text-gray-900 mb-1 uppercase tracking-wide">
                          Chi tiết dịch vụ
                        </h2>
                        <div className="w-16 h-0.5 bg-gradient-to-r from-[#0A4EC3] to-transparent"></div>
                      </div>
                      <div className="overflow-x-auto rounded-xl border-2 border-[#0A4EC3]/20 bg-white shadow-lg">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="bg-gradient-to-r from-[#0A4EC3] via-[#1e5cd8] to-[#2563eb] text-white shadow-md">
                              <th className="text-left py-3 px-5 text-xs uppercase font-bold tracking-widest border-r border-white/20">Loại dịch vụ</th>
                              <th className="text-left py-3 px-5 text-xs uppercase font-bold tracking-widest border-r border-white/20">Tên dịch vụ</th>
                              <th className="text-left py-3 px-5 text-xs uppercase font-bold tracking-widest border-r border-white/20">Mô tả</th>
                              <th className="text-left py-3 px-5 text-xs uppercase font-bold tracking-widest border-r border-white/20">Thời gian</th>
                              <th className="text-right py-3 px-5 text-xs uppercase font-bold tracking-widest">Thành tiền</th>
                            </tr>
                          </thead>
                          <tbody>
                            {voucher.services?.map((service, idx) => (
                              <tr
                                key={idx}
                                className={`border-b-2 border-gray-200 transition-all duration-150 ${idx % 2 === 0 ? 'bg-white' : 'bg-orange-50/30'} hover:bg-orange-100/50 hover:shadow-sm`}
                              >
                                <td className="py-3 px-5 border-r-2 border-gray-200">
                                  <div className="text-xs font-semibold text-gray-700 uppercase tracking-wide">{getServiceName(service.type)}</div>
                                </td>
                                <td className="py-3 px-5 border-r-2 border-gray-200">
                                  <div className="text-sm font-bold text-gray-900">{service.name}</div>
                                </td>
                                <td className="py-3 px-5 border-r-2 border-gray-200">
                                  <div className="text-xs text-gray-700 leading-relaxed max-w-xs font-medium">{service.description || '-'}</div>
                                </td>
                                <td className="py-3 px-5 border-r-2 border-gray-200">
                                  <div className="text-xs text-gray-800 whitespace-nowrap">
                                    {(() => {
                                      const start = service.start_date ? formatDate(service.start_date) : null;
                                      const end = service.end_date ? formatDate(service.end_date) : null;

                                      // If both dates exist and are different
                                      if (start && end && start !== end) {
                                        return (
                                          <>
                                            <div className="font-semibold">{start}</div>
                                            <div className="text-[10px] text-gray-600 mt-0.5">đến {end}</div>
                                          </>
                                        );
                                      }
                                      // If both dates exist and are the same
                                      else if (start && end && start === end) {
                                        return <div className="font-semibold">{start}</div>;
                                      }
                                      // If only start date exists
                                      else if (start && !end) {
                                        return <div className="font-semibold">{start}</div>;
                                      }
                                      // If only end date exists
                                      else if (!start && end) {
                                        return <div className="font-semibold">{end}</div>;
                                      }
                                      // If neither exists
                                      else {
                                        return <div className="text-gray-400 italic">-</div>;
                                      }
                                    })()}
                                  </div>
                                </td>
                                <td className="py-3 px-5 text-right">
                                  <div className="text-sm font-black text-[#0A4EC3] whitespace-nowrap">
                                    {formatPrice(service.price)} VND
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr className="bg-gradient-to-r from-orange-50 to-orange-100 border-t-4 border-[#0A4EC3] shadow-inner">
                              <td colSpan="4" className="py-4 px-5">
                                <div className="flex flex-col gap-2">
                                  <div className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                                    Tổng tiền thanh toán
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                    <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-full text-xs font-semibold border-2 border-emerald-300 shadow-sm">
                                      <IconCheck className="w-3 h-3" />
                                      Đã thanh toán
                                    </div>
                                    <div className="inline-flex items-center bg-orange-100 text-orange-800 px-3 py-1.5 rounded-full text-xs font-semibold border-2 border-orange-300 shadow-sm">
                                      {voucher.payment_method || 'VNPay'}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-5 text-right">
                                <div className="text-lg font-black text-[#0A4EC3] whitespace-nowrap drop-shadow-sm">
                                  {formatPrice(voucher.total_price)} VND
                                </div>
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>

                    {/* Hướng dẫn sử dụng và Dấu mộc */}
                    <div className="grid grid-cols-[1fr_auto] gap-5 mb-6">
                      {/* Hướng dẫn sử dụng */}
                      <div className="bg-gradient-to-br from-amber-50/80 via-yellow-50/50 to-white border-l-4 border-amber-400 rounded-xl p-5 shadow-sm">
                        <h3 className="text-sm font-extrabold text-amber-900 mb-4 uppercase tracking-widest flex items-center gap-2">
                          <span className="w-1.5 h-5 bg-amber-400 rounded-full"></span>
                          HƯỚNG DẪN SỬ DỤNG VOUCHER
                        </h3>
                        <ul className="space-y-3">
                          <li className="text-sm text-amber-900 leading-relaxed">
                            <span className="font-medium">Check-in sân bay bằng QR hoặc mã tour</span>
                          </li>
                          <li className="text-sm text-amber-900 leading-relaxed">
                            <span className="font-medium">Nhận phòng cần voucher + CCCD</span>
                          </li>
                          <li className="text-sm text-amber-900 leading-relaxed">
                            <span className="font-medium">Nhận xe cần đối chiếu thông tin</span>
                          </li>
                          <li className="text-sm text-amber-900 leading-relaxed">
                            <span className="font-medium">Tham gia tour trình voucher cho HDV</span>
                          </li>
                        </ul>
                      </div>

                      {/* Dấu mộc */}
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-36 h-36 flex items-center justify-center">
                          <img
                            src="/JurniLogo/jurni-seal.png"
                            alt="Jurni Seal"
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.parentElement.innerHTML = '<div class="flex flex-col items-center justify-center p-3"><div class="text-[8px] font-bold text-[#0A4EC3] uppercase tracking-wider mb-1">VERIFIED & APPROVED</div><div class="text-xl font-black text-[#0A4EC3] mb-1">JURNI</div><div class="text-[7px] font-semibold text-[#0A4EC3] mb-1">TRAVEL</div><div class="text-[6px] font-medium text-[#0A4EC3]">EST. 2025</div><div class="text-[6px] font-bold text-[#0A4EC3] uppercase tracking-widest mt-1">OFFICIAL AUTHENTICATION SEAL</div></div>';
                            }}
                          />
                        </div>
                        <div className="mt-3 text-xs text-gray-600 italic font-medium">
                          Chứng nhận bởi JURNI
                        </div>
                      </div>
                    </div>


                    {/* Footer */}
                    <div className="text-center pt-6 border-t border-gray-200/60">
                      <div className="text-xl font-extrabold text-[#0A4EC3] mb-3 uppercase tracking-widest">
                        JURNI TRAVEL
                      </div>
                      <div className="mb-2 text-sm text-gray-600 font-medium">
                        Phân khu E1, Khu công nghệ cao, Xa lộ Hà Nội, Phường Hiệp Phú, TP. Thủ Đức, TP.HCM
                      </div>
                      <div className="mb-4 text-sm text-gray-600 font-medium">
                        <span className="font-semibold">Hotline:</span> 0769 749 465 | <span className="font-semibold">Email:</span> support@jurni.com
                      </div>
                      <div className="text-xs text-gray-400 italic font-medium bg-gray-50/50 py-2 px-4 rounded-lg inline-block">
                        Voucher này là tài liệu chính thức xác nhận việc đặt và thanh toán dịch vụ du lịch.
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-10 flex flex-wrap gap-4 pt-8 border-t border-gray-200/60">
                      <button
                        onClick={() => handlePrint(voucher)}
                        className="flex-1 bg-white border-2 border-[#0A4EC3] text-[#0A4EC3] hover:bg-[#0A4EC3] hover:text-white px-8 py-3.5 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2.5 shadow-sm hover:shadow-md"
                      >
                        <IconPrint className="w-5 h-5" />
                        In voucher
                      </button>
                      <button
                        onClick={() => handleDownload(voucher)}
                        className="flex-1 bg-gradient-to-r from-[#0A4EC3] to-[#2563eb] hover:from-[#083a9a] hover:to-[#1e5cd8] text-white px-8 py-3.5 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg"
                      >
                        <IconDownload className="w-5 h-5" />
                        Tải xuống JPG
                      </button>
                    </div>
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
