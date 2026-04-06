import React from 'react';

const serviceHighlights = [
  {
    category: 'Khách sạn & Lưu trú',
    description:
      'Hơn 3.000 khách sạn, biệt thự và homestay được kiểm định chất lượng với chính sách huỷ linh hoạt và hỗ trợ nhận phòng 24/7.',
    icon: '🏨',
    href: '/hotels',
    features: ['Hạng phòng đa dạng', 'Ưu đãi mùa cao điểm', 'Đánh giá minh bạch'],
  },
  {
    category: 'Vé máy bay',
    description:
      'So sánh giá vé từ 20 hãng bay nội địa và quốc tế, hỗ trợ giữ vé trong 12 giờ và thanh toán trả sau linh hoạt.',
    icon: '✈️',
    href: '/flights',
    features: ['Thông báo giá vé rẻ', 'Chọn ghế & hành lý', 'Đổi vé nhanh chóng'],
  },
  {
    category: 'Hoạt động & Trải nghiệm',
    description:
      'Hàng trăm tour trải nghiệm, vé tham quan và workshop bản địa độc đáo phù hợp cho cả gia đình.',
    icon: '🎟️',
    href: '/activities',
    features: ['Vé điện tử tức thì', 'Trải nghiệm bản địa', 'Hủy miễn phí trước 48h'],
  },
  {
    category: 'Thuê xe & Di chuyển',
    description:
      'Từ xe tự lái, xe đưa đón sân bay đến thuê tài xế riêng theo giờ với bảo hiểm đầy đủ và hỗ trợ GPS miễn phí.',
    icon: '🚗',
    href: '/cars',
    features: ['Giao xe tận nơi', 'Linh hoạt 4-45 chỗ', 'Hỗ trợ 2 chiều toàn quốc'],
  },
];

const serviceFlow = [
  {
    title: 'Khám phá & so sánh',
    detail:
      'Duyệt hàng nghìn lựa chọn theo nhu cầu. Bộ lọc thông minh giúp bạn tìm dịch vụ phù hợp chỉ trong vài phút.',
  },
  {
    title: 'Đặt & thanh toán an toàn',
    detail:
      'Tích hợp nhiều phương thức thanh toán điện tử, bảo mật chuẩn PCI-DSS và xác nhận tức thì qua email, ứng dụng.',
  },
  {
    title: 'Đồng bộ hành trình',
    detail:
      'Mọi dịch vụ được tự động lưu vào “Hành trình của tôi”, kèm nhắc nhở, voucher, và hỗ trợ 24/7 suốt chuyến đi.',
  },
];

export default function ServicesPage() {
  return (
    <div className="bg-gradient-to-b from-white via-blue-50/40 to-white py-12">
      <div className="max-w-7xl mx-auto px-4 space-y-16">
        <section className="grid gap-10 lg:grid-cols-[1.3fr_1fr] items-center">
          <div>
            <span className="text-xs uppercase tracking-[0.4em] text-blue-500">Dịch vụ của Jurni</span>
            <h1 className="mt-3 text-3xl md:text-4xl font-semibold text-blue-900">
              Tất cả dịch vụ du lịch bạn cần – chỉ trong một nền tảng
            </h1>
            <p className="mt-4 text-sm md:text-base text-blue-700/80 leading-relaxed">
              Jurni mang đến trải nghiệm liền mạch từ đặt chỗ, thanh toán đến chăm sóc hậu mãi. Dù bạn là người mê dịch
              chuyển hay khách công tác, chúng tôi giúp bạn tối ưu chi phí, thời gian và cảm hứng cho mỗi hành trình.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="/checkout"
                className="inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold text-white transition"
                style={{ backgroundColor: '#FF6B35' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FF8C42'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FF6B35'}
              >
                Bắt đầu đặt dịch vụ
              </a>
              <a
                href="/support"
                className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold transition shadow"
                style={{ color: '#FF6B35' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FFE8E0'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
              >
                Nhận tư vấn miễn phí
              </a>
            </div>
          </div>
          <div className="rounded-3xl border border-blue-100 bg-white/80 p-8 shadow-xl shadow-blue-100/50">
            <h2 className="text-lg font-semibold text-blue-900">Các bước đồng hành cùng Jurni</h2>
            <ul className="mt-5 space-y-4 text-sm text-blue-700/80 leading-relaxed">
              {serviceFlow.map((step, index) => (
                <li key={step.title} className="rounded-2xl border border-blue-50 bg-blue-50/60 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-blue-500">Bước {index + 1}</p>
                  <p className="mt-1 text-base font-semibold text-blue-900">{step.title}</p>
                  <p className="mt-1">{step.detail}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <h2 className="text-2xl font-semibold text-blue-900">Danh mục dịch vụ nổi bật</h2>
            <p className="max-w-2xl text-sm md:text-base text-blue-700/80 leading-relaxed">
              Tất cả dịch vụ đều được Jurni tuyển chọn kỹ lưỡng, hợp tác trực tiếp cùng nhà cung cấp uy tín để mang tới
              mức giá cạnh tranh, ưu đãi độc quyền và chế độ hậu mãi rõ ràng.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {serviceHighlights.map((service) => (
              <div
                key={service.category}
                className="rounded-3xl border border-blue-100 bg-white/90 p-6 shadow shadow-blue-100/40 transition hover:-translate-y-1 hover:border-orange-400 hover:shadow-lg"
              >
                <div className="flex items-start gap-3">
                  <span className="text-3xl">{service.icon}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900">{service.category}</h3>
                    <p className="mt-2 text-sm text-blue-700/80 leading-relaxed">{service.description}</p>
                  </div>
                </div>
                <ul className="mt-4 space-y-2 text-sm text-blue-700/80">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <span className="text-blue-500">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href={service.href}
                  className="mt-5 inline-flex items-center text-sm font-semibold text-orange-600 hover:text-orange-700 transition"
                >
                  Khám phá ngay →
                </a>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-blue-100 bg-gradient-to-r from-blue-900 via-blue-700 to-sky-600 p-10 text-white shadow-2xl">
          <div className="grid gap-8 md:grid-cols-[1.4fr_1fr] items-center">
            <div>
              <h2 className="text-3xl font-semibold leading-tight">Giữ trọn cảm hứng cho chuyến đi sắp tới</h2>
              <p className="mt-4 text-sm md:text-base text-white leading-relaxed">
                Đăng ký nhận bản tin hàng tuần từ Jurni để cập nhật ưu đãi độc quyền, lịch hội thảo du lịch và gợi ý hành
                trình mới nhất từ đội ngũ chuyên gia địa phương.
              </p>
            </div>
            <form className="flex flex-col gap-3 text-sm">
              <input
                type="email"
                placeholder="Nhập email của bạn"
                className="w-full rounded-full border border-white/40 bg-white/10 px-5 py-3 text-white placeholder-white/70 focus:border-white focus:outline-none focus:ring-2 focus:ring-white/60"
              />
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-50 transition"
              >
                Đăng ký nhận ưu đãi
              </button>
              <p className="text-xs text-white/70">
                Bằng việc đăng ký, bạn đồng ý với{' '}
                <a href="/terms" className="font-semibold text-white hover:text-orange-100 underline decoration-white/40">
                  điều khoản sử dụng
                </a>{' '}
                và chính sách bảo mật của Jurni.
              </p>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}








