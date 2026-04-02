import React from 'react';

const milestones = [
  {
    year: '2022',
    title: 'Ý tưởng Jurni chính thức được hình thành',
    description:
      'Nhóm sáng lập từ HUTECH bắt đầu xây dựng nền tảng giúp người Việt lên kế hoạch hành trình thông minh và cá nhân hóa.',
  },
  {
    year: '2023',
    title: 'Ra mắt bản beta và đối tác đầu tiên',
    description:
      'Jurni ký kết với 50 khách sạn, 30 hãng lữ hành và 5 hãng hàng không nội địa để cung cấp hệ sinh thái du lịch đa dạng.',
  },
  {
    year: '2024',
    title: 'Mở rộng trải nghiệm đa dịch vụ',
    description:
      'Hoàn thiện module đặt vé máy bay, thuê xe và hoạt động vui chơi, đồng thời tích hợp ví điện tử để thanh toán tiện lợi.',
  },
  {
    year: '2025',
    title: 'Ứng dụng Jurni vươn tầm',
    description:
      'Hơn 250.000 người dùng tin tưởng sử dụng Jurni để khám phá Việt Nam mỗi tháng, với đội ngũ chăm sóc khách hàng 24/7.',
  },
];

const valuePropositions = [
  {
    title: 'Tập trung vào trải nghiệm bản địa',
    description:
      'Chúng tôi hợp tác chặt chẽ với đối tác địa phương để mang đến những câu chuyện và hoạt động độc đáo ở từng điểm đến.',
  },
  {
    title: 'Công nghệ vì sự tiện lợi',
    description:
      'Từ gợi ý hành trình thông minh đến thanh toán điện tử, mọi tính năng đều được thiết kế để tối ưu thời gian và chi phí.',
  },
  {
    title: 'Đồng hành trong từng khoảnh khắc',
    description:
      'Jurni hỗ trợ xuyên suốt với đội ngũ tư vấn trực tuyến, thông báo hành trình và bảo hiểm du lịch phù hợp nhu cầu.',
  },
];

const stats = [
  { label: 'Giờ hỗ trợ mỗi năm', value: '8.760+' },
  { label: 'Lựa chọn dịch vụ', value: '5.000+' },
  { label: 'Điểm đến trải dài', value: '63 tỉnh thành' },
  { label: 'Đối tác tin cậy', value: '300+' },
];

export default function AboutPage() {
  return (
    <div className="bg-gradient-to-b from-white via-blue-50/40 to-white py-12">
      <div className="max-w-7xl mx-auto px-4 space-y-16">
        <section className="grid gap-10 lg:grid-cols-[1.3fr_1fr] items-center">
          <div>
            <span className="text-xs uppercase tracking-[0.4em] text-blue-500">Về chúng tôi</span>
            <h1 className="mt-3 text-3xl md:text-4xl font-semibold text-blue-900">
              Jurni – Người bạn đồng hành cho hành trình khám phá Việt Nam
            </h1>
            <p className="mt-4 text-sm md:text-base text-blue-700/80 leading-relaxed">
              Jurni ra đời với khát vọng đưa trải nghiệm du lịch của người Việt trở nên dễ dàng, đáng nhớ và giàu bản
              sắc hơn. Chúng tôi cung cấp nền tảng đặt dịch vụ du lịch đa dạng, tích hợp công nghệ thông minh, kết nối
              với các đối tác uy tín để bạn tự tin khám phá theo cách riêng.
            </p>
            <p className="mt-3 text-sm md:text-base text-blue-700/80 leading-relaxed">
              Đội ngũ Jurni gồm các nhà sáng lập, chuyên gia công nghệ và những người yêu du lịch, tất cả cùng chung mục
              tiêu xây dựng hành trình đáng nhớ cho từng khách hàng.
            </p>
          </div>
          <div className="rounded-3xl border border-blue-100 bg-white/80 p-8 shadow-xl shadow-blue-100/50">
            <h2 className="text-lg font-semibold text-blue-900">Những con số truyền cảm hứng</h2>
            <div className="mt-6 grid grid-cols-2 gap-4">
              {stats.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-blue-50 bg-blue-50/50 p-4 text-center shadow-sm"
                >
                  <p className="text-2xl font-semibold text-blue-900">{item.value}</p>
                  <p className="mt-1 text-xs text-blue-700/80 uppercase tracking-wide leading-snug">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-blue-100 bg-white/80 p-8 shadow-xl shadow-blue-100/40">
          <h2 className="text-2xl font-semibold text-blue-900">Điều làm nên sự khác biệt</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {valuePropositions.map((value) => (
              <div key={value.title} className="rounded-2xl border border-blue-50 bg-blue-50/60 p-6">
                <h3 className="text-lg font-semibold text-blue-900">{value.title}</h3>
                <p className="mt-3 text-sm text-blue-700/80 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-blue-900">Hành trình phát triển</h2>
          <div className="mt-6 space-y-4">
            {milestones.map((milestone, index) => (
              <div
                key={milestone.year}
                className="relative rounded-3xl border border-blue-100 bg-white/80 p-6 shadow shadow-blue-100/40"
              >
                <span className="absolute inset-y-6 left-0 w-1 rounded-full bg-gradient-to-b from-blue-500 to-sky-400" />
                <div className="pl-6">
                  <span className="text-xs uppercase tracking-[0.3em] text-blue-500">{milestone.year}</span>
                  <h3 className="mt-2 text-xl font-semibold text-blue-900">{milestone.title}</h3>
                  <p className="mt-2 text-sm text-blue-700/80 leading-relaxed">{milestone.description}</p>
                </div>
                {index !== milestones.length - 1 && (
                  <span className="absolute -bottom-2 left-1 h-4 w-4 rounded-full bg-white/80 shadow" />
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-blue-100 bg-gradient-to-r from-blue-900 via-blue-700 to-sky-600 p-8 text-white shadow-2xl">
          <div className="grid gap-6 md:grid-cols-[1.4fr_1fr] items-center">
            <div>
              <h2 className="text-3xl font-semibold leading-tight">Sẵn sàng đồng hành trên mọi hành trình</h2>
              <p className="mt-4 text-sm md:text-base text-white leading-relaxed">
                Dù bạn đang lên kế hoạch cho chuyến công tác hay kỳ nghỉ cùng gia đình, Jurni cung cấp công cụ, ưu đãi
                và đội ngũ chuyên gia để mỗi chuyến đi đều trọn vẹn. Hãy khám phá ngay các dịch vụ và ưu đãi nổi bật của
                chúng tôi.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href="/hotels"
                className="inline-flex flex-1 min-w-[140px] items-center justify-center rounded-full bg-white/10 px-5 py-3 text-sm font-semibold text-white hover:bg-white/20 transition"
              >
                Khách sạn
              </a>
              <a
                href="/flights"
                className="inline-flex flex-1 min-w-[140px] items-center justify-center rounded-full bg-white/10 px-5 py-3 text-sm font-semibold text-white hover:bg-white/20 transition"
              >
                Vé máy bay
              </a>
              <a
                href="/activities"
                className="inline-flex flex-1 min-w-[140px] items-center justify-center rounded-full bg-white/10 px-5 py-3 text-sm font-semibold text-white hover:bg-white/20 transition"
              >
                Hoạt động
              </a>
              <a
                href="/checkout"
                className="inline-flex flex-1 min-w-[140px] items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-50 transition"
              >
                Đặt dịch vụ ngay
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}








