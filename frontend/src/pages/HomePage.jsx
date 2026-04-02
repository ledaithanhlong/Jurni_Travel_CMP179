import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { sampleHotels, sampleActivities, sampleFlights } from '../data/mockData';
import JurniHero from '../components/JurniHero.jsx';
import ServiceLink from '../components/ServiceLink.jsx';
import { SectionHeader } from '../components/Section.jsx';
import { HotelCard, ActivityCard, FlightCard } from '../components/ServiceCards';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function HomePage() {
  const [hotels, setHotels] = useState([]);
  const [flights, setFlights] = useState([]);
  const [activities, setActivities] = useState([]);
  const [vouchers, setVouchers] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const [h, f, a, v] = await Promise.all([
          axios.get(`${API}/hotels`),
          axios.get(`${API}/flights`),
          axios.get(`${API}/activities`),
          axios.get(`${API}/vouchers`)
        ]);
        const hotelsData = h.data && h.data.length > 0 ? h.data : sampleHotels;
        const flightsData = f.data && f.data.length > 0 ? f.data : sampleFlights;
        const activitiesData = a.data && a.data.length > 0 ? a.data : sampleActivities;
        const vouchersData = v.data || [];

        setHotels(hotelsData.slice(0, 6));
        setFlights(flightsData.slice(0, 6));
        setActivities(activitiesData.slice(0, 6));
        setVouchers(vouchersData);
      } catch (e) {
        console.error('Homepage data fetch error, using samples:', e);
        setHotels(sampleHotels.slice(0, 6));
        setFlights(sampleFlights.slice(0, 6));
        setActivities(sampleActivities.slice(0, 6));
      }
    })();
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price || 0);
  };

  const popularRoutes = [
    { from: 'TP HCM', to: 'Hà Nội', price: 896600, type: 'MỘT CHIỀU' },
    { from: 'Hà Nội', to: 'TP HCM', price: 896600, type: 'MỘT CHIỀU' },
    { from: 'TP HCM', to: 'Đà Nẵng', price: 680600, type: 'MỘT CHIỀU' },
    { from: 'Hà Nội', to: 'Nha Trang', price: 896600, type: 'MỘT CHIỀU' },
    { from: 'TP HCM', to: 'Phú Quốc', price: 680600, type: 'MỘT CHIỀU' },
    { from: 'TP HCM', to: 'Đà Lạt', price: 692265, type: 'MỘT CHIỀU' },
  ];

  const promoCodes = [
    {
      title: 'Giảm đến 50.000đ cho lần đặt vé máy bay đầu tiên',
      desc: 'Ưu đãi chỉ dành riêng cho khách hàng mới của Jurni',
      code: 'JRNBANMOI',
      discount: '50.000đ'
    },
    {
      title: 'Giảm 8% cho lần đặt phòng khách sạn đầu tiên',
      desc: 'Khám phá hàng nghìn khách sạn được tuyển chọn kỹ lưỡng',
      code: 'JRNBANMOI',
      discount: '8%'
    },
    {
      title: 'Giảm 8% vé tham quan/hoạt động',
      desc: 'Book ngay những trải nghiệm đặc sắc ở điểm đến của bạn',
      code: 'JRNBANMOI',
      discount: '8%'
    },
    {
      title: 'Ưu đãi 12% cho dịch vụ đưa đón sân bay',
      desc: 'Đặt trước, đón tận nơi với đối tác uy tín của Jurni',
      code: 'JRNBANMOI',
      discount: '12%'
    },
    {
      title: 'Giảm 10% khi thuê xe tự lái',
      desc: 'Linh hoạt hành trình với nhiều dòng xe chất lượng',
      code: 'JRNBANMOI',
      discount: '10%'
    },
  ];

  const upgradeOptions = [
    {
      title: 'Tour & Danh thắng',
      description: 'Đặt trước những trải nghiệm nổi bật, không bỏ lỡ điểm đến hot.',
      icon: '🧭',
      href: '#',
      accent: 'from-blue-500 via-sky-500 to-cyan-400'
    },
    {
      title: 'Hoạt động giải trí',
      description: 'Chọn hoạt động phù hợp sở thích, từ thư giãn đến khám phá.',
      icon: '🎡',
      href: '#',
      accent: 'from-sky-500 via-blue-500 to-indigo-500'
    },
    {
      title: 'Bảo hiểm du lịch',
      description: 'An tâm trọn hành trình với gói bảo hiểm được thiết kế riêng.',
      icon: '🛡️',
      href: '#',
      accent: 'from-indigo-500 via-blue-500 to-sky-400'
    },
    {
      title: 'Đặt trước · Trả sau',
      description: 'Chủ động dòng tiền với phương thức thanh toán linh hoạt.',
      icon: '💳',
      href: '#',
      accent: 'from-blue-600 via-indigo-500 to-purple-500'
    },
  ];

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert(`Đã sao chép mã: ${text}`);
  };

  return (
    <div style={{ backgroundColor: '#FFFFFF' }}>
      <JurniHero />
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="space-y-10 pb-16">
          {/* Service Links */}
          {/* Xanh rất nhạt #1 */}
          <section className="py-8" style={{ backgroundColor: '#F0F7FF' }}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <ServiceLink href="/hotels" title="Khách sạn" subtitle="Ưu đãi mỗi ngày" iconType="hotels" />
              <ServiceLink href="/flights" title="Vé máy bay" subtitle="Bay mọi điểm đến" iconType="flights" />
              <ServiceLink href="/cars" title="Cho thuê xe" subtitle="Linh hoạt hành trình" iconType="cars" />
              <ServiceLink href="/activities" title="Hoạt động & Vui chơi" subtitle="Trải nghiệm đa dạng" iconType="activities" />
            </div>
          </section>

          {/* Promotional Codes Section */}
          {/* Xanh nhạt #2 */}
          <section
            className="rounded-lg shadow-md p-6 md:p-8"
            style={{ backgroundColor: '#E3F2FD', borderRadius: '8px' }}
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold" style={{ color: '#0D47A1' }}>Mã ưu đãi tặng bạn mới</h2>
                <p className="text-sm mt-1" style={{ color: '#212121' }}>Đăng nhập và áp dụng tại bước thanh toán để kích hoạt ưu đãi.</p>
              </div>
              <a
                href="/promotions"
                className="inline-flex items-center justify-center rounded-lg px-5 py-2 text-sm font-semibold text-white shadow-md transition hover:opacity-90"
                style={{ backgroundColor: '#FF6B35', borderRadius: '8px' }}
              >
                Khám phá thêm ưu đãi
              </a>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Vouchers from API */}
              {vouchers.slice(0, 6).map((promo, idx) => {
                const isPercent = promo.discount_percent > 0;
                const discountText = isPercent ? `${promo.discount_percent}%` : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(promo.discount_amount);
                const minSpendText = promo.min_spend > 0 ? `Cho đơn từ ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(promo.min_spend)}` : 'Không giới hạn';

                return (
                  <div
                    key={idx}
                    className="border rounded-lg bg-white p-5 shadow-sm hover:shadow-lg transition"
                    style={{ borderRadius: '8px', borderColor: '#BBDEFB' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#FF6B35';
                      e.currentTarget.style.backgroundColor = '#FFE8E0';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#BBDEFB';
                      e.currentTarget.style.backgroundColor = '#FFFFFF';
                    }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-semibold text-sm mb-1" style={{ color: '#0D47A1' }}>Giảm {discountText}</div>
                        <div className="text-xs mb-3" style={{ color: '#212121' }}>{minSpendText}</div>
                      </div>
                      <span
                        className="inline-flex items-center rounded-lg px-3 py-1 text-xs font-semibold text-white"
                        style={{ backgroundColor: '#FF6B35', borderRadius: '8px' }}
                      >
                        {discountText}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="flex-1 rounded-lg px-3 py-2 font-mono text-sm font-semibold"
                        style={{ backgroundColor: '#E8F4FD', borderRadius: '8px', color: '#0D47A1', border: '1px solid #90CAF9' }}
                      >
                        {promo.code}
                      </div>
                      <button
                        onClick={() => copyToClipboard(promo.code)}
                        className="text-white px-4 py-2 rounded-lg text-sm font-semibold transition shadow-md hover:opacity-90"
                        style={{ backgroundColor: '#FF6B35', borderRadius: '8px' }}
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                )
              })}
              {vouchers.length === 0 && (
                <div className="col-span-3 text-center text-gray-500 py-4">Hiện tại không có mã giảm giá nào.</div>
              )}
            </div>
          </section>

          {/* Popular Flight Routes */}
          <section className="py-8" style={{ backgroundColor: '#FFFFFF' }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold" style={{ color: '#0D47A1' }}>Vé máy bay giá tốt nhất</h2>
                <p className="text-sm mt-1" style={{ color: '#212121' }}>Vô vàn điểm đến hot</p>
              </div>
              <a
                href="/flights"
                className="text-sm font-semibold transition hover:opacity-80"
                style={{ color: '#FF6B35' }}
              >
                Xem tất cả ưu đãi bay →
              </a>
            </div>
            {/* Xanh nhạt vừa #3 */}
            <div
              className="rounded-lg border shadow-md p-6"
              style={{ backgroundColor: '#FFFFFF', borderRadius: '8px', borderColor: '#BBDEFB' }}
            >
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {popularRoutes.map((route, idx) => (
                  <a
                    key={idx}
                    href="/flights"
                    className="border rounded-lg p-4 transition group"
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '8px',
                      borderColor: '#90CAF9'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#FF6B35';
                      // Cam nhạt để nổi bật
                      e.currentTarget.style.backgroundColor = '#FFE8E0';
                    }}
                    onMouseLeave={(e) => {
                      // Xanh nhạt #5
                      e.currentTarget.style.borderColor = '#90CAF9';
                      e.currentTarget.style.backgroundColor = '#FFFFFF';
                    }}
                  >
                    <div className="text-xs mb-1 tracking-wide" style={{ color: '#212121' }}>{route.type}</div>
                    <div
                      className="font-semibold mb-2 transition"
                      style={{ color: '#0D47A1' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#FF6B35'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#0D47A1'}
                    >
                      {route.from} - {route.to}
                    </div>
                    <div className="font-bold text-lg" style={{ color: '#FF9800' }}>
                      Giá tốt nhất từ {formatPrice(route.price)} VND
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </section>

          {/* Popular Hotels */}
          {/* Xanh nhạt #4 */}
          <section className="py-8 rounded-lg" style={{ backgroundColor: '#E8F4FD', borderRadius: '8px' }}>
            <SectionHeader title="Nhiều lựa chọn khách sạn" href="/hotels" />
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {hotels.slice(0, 4).map(h => (
                <HotelCard key={h.id} hotel={h} />
              ))}
            </div>
            <div className="mt-6 text-center">
              <a
                href="/hotels"
                className="inline-block px-6 py-2 border border-blue-600 text-blue-600 font-semibold rounded-full hover:bg-blue-50 transition"
              >
                Xem thêm khách sạn
              </a>
            </div>
          </section>

          {/* Top Flights */}
          {/* Xanh rất nhạt #6 */}
          <section className="py-8" style={{ backgroundColor: '#F5FAFF' }}>
            <SectionHeader title="Vé máy bay phổ biến" href="/flights" />
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
              {flights.map(f => (
                <FlightCard key={f.id} flight={f} />
              ))}
            </div>
            <div className="mt-6 text-center">
              <a
                href="/flights"
                className="inline-block px-6 py-2 border border-blue-600 text-blue-600 font-semibold rounded-full hover:bg-blue-50 transition"
              >
                Xem thêm chuyến bay
              </a>
            </div>
          </section>

          {/* Things to do */}
          {/* Xanh rất nhạt #1 */}
          <section className="py-8 rounded-lg" style={{ backgroundColor: '#F0F7FF', borderRadius: '8px' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold" style={{ color: '#0D47A1' }}>Hoạt động & Vui chơi</h2>
              <a
                className="text-sm font-semibold transition hover:opacity-80"
                style={{ color: '#FF6B35' }}
                href="/activities"
              >
                Xem tất cả →
              </a>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {activities.slice(0, 4).map(a => (
                <ActivityCard key={a.id} activity={a} />
              ))}
            </div>
            <div className="mt-6 text-center">
              <a
                href="/activities"
                className="inline-block px-6 py-2 border border-blue-600 text-blue-600 font-semibold rounded-full hover:bg-blue-50 transition"
              >
                Xem thêm hoạt động
              </a>
            </div>
          </section>

          {/* Upgrade Your Trip Section */}
          <section
            className="relative overflow-hidden rounded-lg text-white shadow-xl"
            style={{ backgroundColor: '#0D47A1', borderRadius: '8px' }}
          >
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.35),_transparent_45%)]" />
            <div className="relative z-10 grid gap-10 p-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] md:p-12">
              <div className="max-w-md">
                <h2 className="text-3xl font-semibold leading-tight text-white">
                  Nâng tầm chuyến đi theo cách bạn muốn
                </h2>
                <p className="mt-4 text-sm text-white/90">
                  Lên kế hoạch thông minh với các dịch vụ bổ sung được Jurni tuyển chọn riêng cho từng hành trình. Linh hoạt hơn, an tâm hơn và tối ưu ngân sách.
                </p>
                <a
                  href="/upgrade-your-trip"
                  className="mt-6 inline-flex items-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:opacity-90"
                  style={{ backgroundColor: '#FF6B35', borderRadius: '8px' }}
                >
                  Khám phá các gói nâng hạng
                  <span aria-hidden>→</span>
                </a>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {upgradeOptions.map((option, idx) => (
                  <a
                    key={idx}
                    href={option.href}
                    className="group relative flex h-full flex-col gap-3 rounded-lg border p-6 backdrop-blur-sm transition"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      borderColor: 'rgba(255, 255, 255, 0.2)'
                    }}
                    onMouseEnter={(e) => {
                      // Cam trong suốt để nổi bật
                      e.currentTarget.style.backgroundColor = 'rgba(255, 107, 53, 0.2)';
                      e.currentTarget.style.borderColor = '#FF6B35';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                    }}
                  >
                    <span className="relative inline-flex h-12 w-12 items-center justify-center">
                      <span
                        className="absolute inset-0 rounded-full opacity-90 blur-[2px]"
                        style={{ backgroundColor: '#FF9800' }}
                        aria-hidden
                      />
                      <span
                        className="relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-xl shadow-lg ring-1 ring-white/50 transition"
                        style={{ borderRadius: '8px' }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#FF6B35'}
                        onMouseLeave={(e) => e.currentTarget.style.color = '#0D47A1'}
                      >
                        {option.icon}
                      </span>
                    </span>
                    <div>
                      <div className="text-base font-semibold text-white" style={{ color: '#FFFFFF' }}>{option.title}</div>
                      <p className="mt-2 text-sm" style={{ color: '#FFFFFF' }}>
                        {option.description}
                      </p>
                    </div>
                    <span
                      className="mt-auto inline-flex items-center text-sm font-semibold transition"
                      style={{ color: '#FFFFFF' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#FFE8E0'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#FFFFFF'}
                    >
                      Tìm hiểu thêm
                      <span className="ml-2 transition group-hover:translate-x-1">→</span>
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

