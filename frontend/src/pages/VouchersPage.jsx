import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';

const API = import.meta.env.VITE_API_URL;

const mockVoucherData = {
  id: 'JRN-2025-001',
  booking_date: '15/01/2025',
  status: 'Đã thanh toán',
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
      start_date: '20/01/2025',
      end_date: '20/01/2025',
      price: 5000000
    },
    {
      type: 'hotel',
      name: 'Grand Hotel Hanoi',
      description: 'Phòng Deluxe, 2 đêm',
      start_date: '20/01/2025',
      end_date: '22/01/2025',
      price: 6000000
    },
    {
      type: 'car',
      name: 'Toyota Vios',
      description: '5 chỗ, 3 ngày',
      start_date: '20/01/2025',
      end_date: '23/01/2025',
      price: 2400000
    },
    {
      type: 'activity',
      name: 'Tour Phố Cổ Hà Nội',
      description: '4 giờ, 2 người',
      start_date: '21/01/2025',
      end_date: '21/01/2025',
      price: 1600000
    }
  ],
  total_price: 15000000,
  payment_method: 'VNPay'
};

export default function VouchersPage() {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getToken, isSignedIn, isLoaded } = useAuth();

  useEffect(() => {
    if (!isLoaded) return;

    const loadVouchers = async () => {
      if (!isSignedIn) {
        setVouchers([mockVoucherData]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const token = await getToken();
        console.log('Fetching bookings with token...');
        const res = await axios.get(`${API}/bookings`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        console.log('API Response:', res.data);

        if (!res.data || !Array.isArray(res.data) || res.data.length === 0) {
          console.log('No bookings found for this user.');
          setVouchers([]);
          setLoading(false);
          return;
        }

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
            const serviceData = booking.hotel || booking.hotel_id || 
                               booking.flight || booking.flight_id || 
                               booking.car || booking.car_id || 
                               booking.activity || booking.activity_id;

            let description = '';
            let serviceName = 'Dịch vụ'; // Default fallback

            if (booking.hotel || booking.hotel_id) {
              serviceName = serviceData?.name || 'Khách sạn';
              description = booking.item_variant || 'Phòng khách sạn';
            } else if (booking.flight || booking.flight_id) {
              serviceName = serviceData?.airline || 'Chuyến bay';
              description = `${serviceData?.departure_city || ''} – ${serviceData?.arrival_city || ''}`;
            } else if (booking.car || booking.car_id) {
              serviceName = serviceData?.company
                ? `${serviceData.company} ${serviceData.type || ''}`
                : 'Xe thuê';
              description = `${serviceData?.seats || ''} chỗ`;
            } else if (booking.activity || booking.activity_id) {
              serviceName = serviceData?.name || 'Hoạt động';
              description = serviceData?.description || '';
            }

            return {
              type: booking.service_type || (booking.hotel || booking.hotel_id ? 'hotel' : booking.flight || booking.flight_id ? 'flight' : booking.car || booking.car_id ? 'car' : 'activity'),
              name: serviceName,
              description: description,
              start_date: booking.start_date,
              end_date: booking.end_date,
              price: parseFloat(booking.total_price) || 0
            };
          });

          return {
            id: firstBooking.transaction_id || firstBooking.id,
            booking_date: new Date(firstBooking.createdAt).toLocaleDateString('vi-VN'),
            status: firstBooking.status === 'confirmed' ? 'Đã xác nhận' : 
                    firstBooking.status === 'completed' ? 'Hoàn thành' : 
                    firstBooking.status === 'cancelled' ? 'Đã hủy' : 'Chờ xác nhận',
            customer: {
              name: firstBooking.customer_name || 'Khách hàng',
              phone: firstBooking.customer_phone || '',
              email: firstBooking.customer_email || ''
            },
            services: services,
            total_price: services.reduce((sum, s) => sum + s.price, 0),
            payment_method: firstBooking.payment_method || 'Thẻ'
          };
        });

        setVouchers(transformedVouchers);
      } catch (err) {
        console.error('Error loading vouchers:', err);
        setVouchers([]);
      } finally {
        setLoading(false);
      }
    };

    loadVouchers();
  }, [isSignedIn, getToken]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  if (vouchers.length === 0) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 pt-20">
      <div className="text-gray-400 mb-4">
        <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Chưa có voucher nào</h2>
      <p className="text-gray-600">Hãy thực hiện đặt chỗ đầu tiên để nhận voucher nhé!</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 pt-24 pb-12 px-4">
      <div className="max-w-5xl mx-auto space-y-12">
        {vouchers.map((voucher, idx) => (
          <div key={voucher.id || idx} className="bg-white shadow-2xl rounded-xl overflow-hidden border border-gray-200">
            {/* Header section */}
            <div className="bg-blue-700 text-white p-8 text-center border-b-4 border-orange-500">
              <h1 className="text-4xl font-extrabold tracking-widest uppercase mb-2">Travel Voucher</h1>
              <p className="text-blue-100 text-lg">Xác nhận dịch vụ đã thanh toán</p>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                {/* Booking Info */}
                <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-600 shadow-sm">
                  <h3 className="text-blue-800 font-bold uppercase text-sm mb-4 flex items-center">
                    <span className="mr-2">┃</span> Thông tin đặt tour
                  </h3>
                  <div className="space-y-3">
                    <p className="text-sm"><span className="text-gray-500 block">Mã đặt tour</span> <span className="font-bold text-blue-700 text-lg">{voucher.id}</span></p>
                    <p className="text-sm"><span className="text-gray-500 block">Ngày đặt</span> <span className="font-semibold text-gray-800">{voucher.booking_date}</span></p>
                    <p className="text-sm"><span className="text-gray-500 block">Trạng thái</span> <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold mt-1 border border-green-200">{voucher.status}</span></p>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-600 shadow-sm">
                  <h3 className="text-blue-800 font-bold uppercase text-sm mb-4 flex items-center">
                    <span className="mr-2">┃</span> Thông tin khách hàng
                  </h3>
                  <div className="space-y-3">
                    <p className="text-sm"><span className="text-gray-500 block">Họ tên</span> <span className="font-bold text-gray-800">{voucher.customer.name}</span></p>
                    <p className="text-sm"><span className="text-gray-500 block">Số điện thoại</span> <span className="font-semibold text-gray-800">{voucher.customer.phone}</span></p>
                    <p className="text-sm"><span className="text-gray-500 block">Email</span> <span className="font-semibold text-gray-800">{voucher.customer.email}</span></p>
                  </div>
                </div>

                {/* QR Section */}
                <div className="border-2 border-dashed border-blue-200 p-6 rounded-lg flex flex-col items-center justify-center bg-gray-50">
                  <h3 className="text-gray-500 font-bold uppercase text-xs mb-4">┃ QR Code</h3>
                  <div className="bg-white p-2 rounded shadow-inner mb-3">
                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${voucher.id}`} alt="QR Code" className="w-28 h-28" />
                  </div>
                  <p className="text-[10px] text-gray-400 text-center px-4">Quét mã để kiểm tra tình trạng thanh toán</p>
                </div>
              </div>

              {/* Services Table */}
              <div className="mb-10">
                <h3 className="text-blue-900 font-bold uppercase text-lg mb-6 flex items-center">
                  Chi tiết dịch vụ
                </h3>
                <div className="overflow-hidden rounded-xl border border-gray-200 shadow-lg">
                  <table className="w-full text-left">
                    <thead className="bg-blue-800 text-white text-sm">
                      <tr>
                        <th className="px-6 py-4 font-bold uppercase">Loại dịch vụ</th>
                        <th className="px-6 py-4 font-bold uppercase">Tên dịch vụ</th>
                        <th className="px-6 py-4 font-bold uppercase">Mô tả</th>
                        <th className="px-6 py-4 font-bold uppercase">Thời gian</th>
                        <th className="px-6 py-4 font-bold uppercase text-right">Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {voucher.services.map((service, sIdx) => (
                        <tr key={sIdx} className="hover:bg-blue-50/50 transition-colors">
                          <td className="px-6 py-5">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-tighter block mb-1">
                              {service.type === 'flight' ? 'Vé máy bay' : 
                               service.type === 'hotel' ? 'Khách sạn' : 
                               service.type === 'car' ? 'Thuê xe' : 'Tour & Hoạt động'}
                            </span>
                          </td>
                          <td className="px-6 py-5 font-bold text-gray-800">{service.name}</td>
                          <td className="px-6 py-5 text-sm text-gray-600">{service.description}</td>
                          <td className="px-6 py-5 text-sm font-medium text-gray-500">
                            {service.start_date ? new Date(service.start_date).toLocaleDateString('vi-VN') : ''}
                            {service.end_date && service.end_date !== service.start_date ? ` - ${new Date(service.end_date).toLocaleDateString('vi-VN')}` : ''}
                          </td>
                          <td className="px-6 py-5 text-right font-bold text-blue-700">
                            {service.price.toLocaleString('vi-VN')} VND
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-orange-50/50 border-t-2 border-orange-100">
                      <tr>
                        <td colSpan="4" className="px-6 py-6 text-right">
                          <div className="flex flex-col items-end gap-2">
                            <span className="text-sm font-bold text-blue-900 uppercase">Tổng tiền thanh toán</span>
                            <div className="flex gap-2">
                              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-extrabold border border-green-200 flex items-center">
                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Đã thanh toán
                              </span>
                              <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-[10px] font-extrabold border border-orange-200 flex items-center">
                                {voucher.payment_method}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-6 text-right font-black text-2xl text-blue-900">
                          {voucher.total_price.toLocaleString('vi-VN')} VND
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Footer Guidelines */}
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h4 className="text-orange-600 font-bold text-sm mb-3 flex items-center uppercase">
                  <span className="mr-2">┃</span> Hướng dẫn sử dụng voucher
                </h4>
                <ul className="text-xs text-gray-500 space-y-2 list-disc ml-4 leading-relaxed">
                  <li>Vui lòng trình diện mã QR này hoặc mã đặt chỗ khi nhận dịch vụ tại quầy.</li>
                  <li>Mã voucher này có giá trị thay thế hóa đơn tài chính và tiền mặt.</li>
                  <li>Trường hợp cần hỗ trợ, vui lòng gọi hotline 1900 1234 (24/7).</li>
                </ul>
              </div>
            </div>
            
            {/* Bottom pattern */}
            <div className="h-2 bg-blue-800 flex">
              <div className="flex-1 bg-blue-800"></div>
              <div className="w-24 bg-orange-500"></div>
              <div className="w-12 bg-blue-600"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
