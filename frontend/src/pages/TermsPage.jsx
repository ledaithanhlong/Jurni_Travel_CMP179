import React from 'react';

const sections = [
  {
    title: '1. Điều khoản chung',
    content: [
      'Jurni là nền tảng trung gian kết nối khách hàng với các nhà cung cấp dịch vụ du lịch (đối tác). Khi đặt dịch vụ trên Jurni, bạn đồng ý với điều khoản do Jurni và đối tác đưa ra.',
      'Các điều khoản có thể được cập nhật theo từng thời điểm nhằm tuân thủ quy định pháp luật và nâng cao chất lượng dịch vụ. Mọi thay đổi sẽ được thông báo trên trang này.',
      'Bằng cách tiếp tục sử dụng Jurni, bạn xác nhận đã đọc, hiểu và đồng ý với tất cả điều khoản hiện hành.',
    ],
  },
  {
    title: '2. Tài khoản và bảo mật',
    content: [
      'Bạn phải cung cấp thông tin chính xác, đầy đủ khi tạo tài khoản và cập nhật khi có thay đổi.',
      'Bạn chịu trách nhiệm bảo mật tài khoản, mật khẩu và mọi hoạt động phát sinh từ tài khoản của mình.',
      'Jurni có quyền tạm khóa hoặc chấm dứt tài khoản nếu phát hiện hành vi vi phạm pháp luật, gian lận, gây ảnh hưởng tới trải nghiệm người dùng khác.',
    ],
  },
  {
    title: '3. Chính sách đặt chỗ và thanh toán',
    content: [
      'Giá hiển thị đã bao gồm thuế và phí cơ bản (nếu có), chưa bao gồm phụ phí đặc biệt từ đối tác.',
      'Đơn đặt chỗ chỉ được xác nhận khi thanh toán thành công. Một số dịch vụ yêu cầu thanh toán cọc hoặc thanh toán tại chỗ; quy định này sẽ hiển thị rõ ở bước thanh toán.',
      'Jurni hỗ trợ nhiều phương thức thanh toán: thẻ quốc tế, ví điện tử, chuyển khoản và thanh toán tại điểm (tùy dịch vụ).',
    ],
  },
  {
    title: '4. Hủy, đổi và hoàn tiền',
    content: [
      'Chính sách hủy/đổi phụ thuộc vào từng dịch vụ và được thông báo cụ thể trước khi thanh toán.',
      'Một số dịch vụ áp dụng phí hủy hoặc không hoàn tiền. Hãy đọc kỹ mô tả và điều kiện đi kèm.',
      'Thời gian xử lý hoàn tiền từ 3 – 15 ngày làm việc, tùy phương thức thanh toán và đối tác liên quan.',
    ],
  },
  {
    title: '5. Quyền và trách nhiệm',
    content: [
      'Jurni đảm bảo bảo mật dữ liệu cá nhân theo quy định pháp luật và cam kết không bán/chia sẻ trái phép thông tin của bạn.',
      'Người dùng cam kết không đăng tải nội dung phản cảm, vi phạm pháp luật hoặc làm ảnh hưởng đến danh tiếng của Jurni và đối tác.',
      'Trong trường hợp tranh chấp, Jurni sẽ đứng ra làm trung gian hòa giải dựa trên chính sách hiện hành và văn bản pháp lý liên quan.',
    ],
  },
  {
    title: '6. Sở hữu trí tuệ',
    content: [
      'Toàn bộ nội dung, thiết kế, logo, hình ảnh và mã nguồn của Jurni thuộc quyền sở hữu của chúng tôi hoặc đã được cấp phép sử dụng hợp pháp.',
      'Bất kỳ hành vi sao chép, sử dụng trái phép nội dung Jurni cần có sự đồng ý bằng văn bản từ chúng tôi.',
    ],
  },
  {
    title: '7. Liên hệ',
    content: [
      'Nếu có thắc mắc hoặc khiếu nại liên quan tới điều khoản, vui lòng liên hệ: legal@jurni.vn hoặc hotline 1900 6868 (nhánh 4).',
      'Địa chỉ văn phòng: Tầng 5, Tòa nhà Innovation, Trường Đại học Công nghệ TP.HCM (HUTECH), 475A Điện Biên Phủ, Bình Thạnh, TP.HCM.',
    ],
  },
];

export default function TermsPage() {
  return (
    <div className="bg-gradient-to-b from-white via-blue-50/40 to-white py-12">
      <div className="max-w-5xl mx-auto px-4 space-y-10">
        <header className="space-y-4 text-center">
          <span className="text-xs uppercase tracking-[0.4em] text-blue-500">Điều khoản &amp; Chính sách</span>
          <h1 className="text-3xl md:text-4xl font-semibold text-blue-900">
            Điều khoản sử dụng dịch vụ Jurni
          </h1>
          <p className="text-sm md:text-base text-blue-700/80 leading-relaxed">
            Cập nhật lần cuối: 13/11/2025. Vui lòng đọc kỹ các điều khoản dưới đây trước khi sử dụng nền tảng Jurni.
          </p>
        </header>

        <section className="rounded-3xl border border-blue-100 bg-white/90 p-8 shadow-xl shadow-blue-100/40 space-y-8">
          {sections.map((section) => (
            <article key={section.title} className="space-y-3">
              <h2 className="text-xl font-semibold text-blue-900">{section.title}</h2>
              <ul className="space-y-2 text-sm md:text-base text-blue-700/80 leading-relaxed">
                {section.content.map((item, index) => (
                  <li key={index} className="flex gap-2">
                    <span className="mt-1 text-blue-500">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <footer className="rounded-3xl border border-blue-100 bg-blue-50/70 p-6 text-sm text-blue-800 shadow shadow-blue-100/50">
          <p className="font-semibold text-blue-900">Chúng tôi luôn lắng nghe</p>
          <p className="mt-2 leading-relaxed">
            Nếu bạn có câu hỏi, góp ý hoặc cần làm rõ điều khoản, hãy liên hệ bộ phận pháp lý của Jurni qua email
            <a href="mailto:legal@jurni.vn" className="font-semibold text-orange-600 hover:text-orange-700 transition">
              {' '}
              legal@jurni.vn
            </a>
            {' '}hoặc hotline 1900 6868 (nhánh 4).
          </p>
        </footer>
      </div>
    </div>
  );
}








