import React, { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const supportChannels = [
  {
    title: 'Trung tâm hỗ trợ 24/7',
    description:
      'Liên hệ hotline bất cứ lúc nào để được hỗ trợ đặt chỗ, thay đổi lịch trình hoặc xử lý các tình huống khẩn cấp.',
    icon: '📞',
    actions: [
      { label: 'Gọi hotline', href: 'tel:+842837111119' },
      { label: 'Gọi quốc tế', href: 'tel:+84861234567' },
    ],
  },
  {
    title: 'Hộp thư chăm sóc khách hàng',
    description:
      'Gửi email để được tư vấn chi tiết, nhận bảng giá, hoặc yêu cầu hóa đơn VAT sau chuyến đi.',
    icon: '✉️',
    actions: [
      { label: 'support@jurni.vn', href: 'mailto:support@jurni.vn' },
      { label: 'billing@jurni.vn', href: 'mailto:billing@jurni.vn' },
    ],
  },
  {
    title: 'Live Chat & Zalo Official',
    description:
      'Nhắn tin trực tiếp với chuyên viên của Jurni, nhận phản hồi trong vòng 2 phút vào giờ hành chính.',
    icon: '💬',
    actions: [
      { label: 'Chat trên ứng dụng', href: '/app' },
      { label: 'Zalo OA Jurni', href: 'https://zalo.me/jurni' },
    ],
  },
];

const faqs = [
  {
    question: 'Làm thế nào để thay đổi hoặc hủy đặt phòng?',
    answer:
      'Bạn có thể vào mục "Đặt chỗ của tôi" để thực hiện thay đổi. Nếu đặt phòng linh hoạt, bạn sẽ thấy nút hủy hoặc thay đổi. Hoặc liên hệ hotline để được hỗ trợ nhanh nhất.',
  },
  {
    question: 'Jurni chấp nhận những hình thức thanh toán nào?',
    answer:
      'Chúng tôi hỗ trợ thẻ quốc tế, ví điện tử (Momo, ZaloPay), chuyển khoản ngân hàng và thanh toán tại đối tác đối với một số dịch vụ đặc thù.',
  },
  {
    question: 'Bao lâu tôi nhận được xác nhận sau khi thanh toán?',
    answer:
      'Xác nhận được gửi qua email trong vòng 5 phút. Nếu sau 15 phút vẫn chưa nhận được, hãy kiểm tra thư rác hoặc liên hệ chúng tôi để kiểm tra trạng thái.',
  },
  {
    question: 'Tôi cần hóa đơn VAT cho công ty, phải làm sao?',
    answer:
      'Hãy gửi email về billing@jurni.vn với thông tin doanh nghiệp và mã đơn, đội ngũ kế toán sẽ phản hồi trong vòng 24 giờ làm việc.',
  },
];

export default function SupportPage() {
  const [form, setForm] = useState({ name: '', email: '', content: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // null | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    const { name, email, content } = form;
    if (!name.trim() || !email.trim() || !content.trim()) {
      setSubmitStatus('error');
      setErrorMsg('Vui lòng điền đầy đủ tất cả thông tin.');
      return;
    }

    setIsLoading(true);
    setSubmitStatus(null);

    try {
      const res = await fetch(`${API_URL}/support-requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, content }),
      });

      const data = await res.json();

      if (data.success) {
        setSubmitStatus('success');
        setForm({ name: '', email: '', content: '' });
      } else {
        setSubmitStatus('error');
        setErrorMsg(data.error || 'Có lỗi xảy ra. Vui lòng thử lại.');
      }
    } catch {
      setSubmitStatus('error');
      setErrorMsg('Không thể kết nối đến server. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-white via-blue-50/40 to-white py-12">
      <div className="max-w-7xl mx-auto px-4 space-y-16">
        <section className="rounded-3xl border border-blue-100 bg-gradient-to-r from-blue-900 via-blue-700 to-sky-600 p-10 text-white shadow-2xl">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs uppercase tracking-[0.4em] text-white/70">Hỗ trợ khách hàng</span>
            <h1 className="text-3xl md:text-4xl font-semibold leading-tight">
              Chúng tôi luôn sẵn sàng đồng hành trên mọi hành trình của bạn
            </h1>
            <p className="text-sm md:text-base text-white leading-relaxed">
              Jurni cung cấp nhiều kênh hỗ trợ 24/7 để bạn nhận trợ giúp kịp thời, từ khâu đặt dịch vụ đến khi kết thúc
              chuyến đi. Hãy chọn cách thức phù hợp nhất với bạn.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="tel:+842837111119"
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50 transition"
              >
                Gọi ngay hotline
              </a>
              <a
                href="/checkout"
                className="inline-flex items-center gap-2 rounded-full bg-white/15 px-5 py-2 text-sm font-semibold text-white hover:bg-white/25 transition"
              >
                Hỗ trợ đặt dịch vụ
              </a>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-blue-900">Các kênh hỗ trợ chính</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {supportChannels.map((channel) => (
              <div
                key={channel.title}
                className="rounded-3xl border border-blue-100 bg-white/90 p-6 shadow shadow-blue-100/40 transition hover:-translate-y-1 hover:border-orange-400 hover:shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{channel.icon}</span>
                  <h3 className="text-lg font-semibold text-blue-900">{channel.title}</h3>
                </div>
                <p className="mt-3 text-sm text-blue-700/80 leading-relaxed">{channel.description}</p>
                <div className="mt-4 space-y-2 text-sm">
                  {channel.actions.map((action) => (
                    <a
                      key={action.label}
                      href={action.href}
                      className="block rounded-full border border-blue-100 bg-blue-50/60 px-4 py-2 font-semibold text-blue-700 hover:border-orange-300 hover:bg-orange-100 transition"
                    >
                      {action.label}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div className="rounded-3xl border border-blue-100 bg-white/80 p-8 shadow-xl shadow-blue-100/40 space-y-5">
            <h2 className="text-2xl font-semibold text-blue-900">Thời gian làm việc & SLA</h2>
            <div className="grid gap-4 md:grid-cols-2 text-sm text-blue-700/80">
              <div className="rounded-2xl border border-blue-50 bg-blue-50/60 p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-blue-500">Hotline</p>
                <p className="mt-2 text-lg font-semibold text-blue-900">24 giờ mỗi ngày</p>
                <p className="mt-2 leading-relaxed">
                  Hotline 1900 6868 hoạt động liên tục, ưu tiên xử lý sự cố trong vòng 5 phút kể từ khi tiếp nhận.
                </p>
              </div>
              <div className="rounded-2xl border border-blue-50 bg-blue-50/60 p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-blue-500">Email hỗ trợ</p>
                <p className="mt-2 text-lg font-semibold text-blue-900">08:00 – 21:00 (T2 - CN)</p>
                <p className="mt-2 leading-relaxed">
                  Phản hồi email trong vòng 2 giờ làm việc. Hồ sơ hoàn tiền/hoá đơn được xử lý tối đa 24 giờ.
                </p>
              </div>
              <div className="rounded-2xl border border-blue-50 bg-blue-50/60 p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-blue-500">Live chat</p>
                <p className="mt-2 text-lg font-semibold text-blue-900">07:00 – 23:00 hàng ngày</p>
                <p className="mt-2 leading-relaxed">
                  Đội ngũ trực chat phản hồi trong 120 giây. Khi ngoài giờ, bạn có thể để lại tin nhắn để được gọi lại.
                </p>
              </div>
              <div className="rounded-2xl border border-blue-50 bg-blue-50/60 p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-blue-500">Tại văn phòng</p>
                <p className="mt-2 text-lg font-semibold text-blue-900">Thứ 2 – Thứ 6</p>
                <p className="mt-2 leading-relaxed">
                  Hẹn làm việc tại văn phòng HUTECH, 475A Điện Biên Phủ, Q. Bình Thạnh, TP.HCM (09:00 – 17:30).
                </p>
              </div>
            </div>
          </div>

          {/* Form gửi yêu cầu */}
          <aside className="rounded-3xl border border-blue-100 bg-white/90 p-8 shadow-xl shadow-blue-100/40">
            <h3 className="text-lg font-semibold text-blue-900">Gửi yêu cầu hỗ trợ nhanh</h3>

            {submitStatus === 'success' && (
              <div className="mt-4 rounded-xl bg-green-50 border border-green-200 p-4 text-sm text-green-700">
                ✅ Yêu cầu đã được gửi thành công! Chúng tôi sẽ phản hồi trong vòng 2 giờ làm việc.
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="mt-4 rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
                ❌ {errorMsg}
              </div>
            )}

            <form className="mt-4 space-y-4 text-sm" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="font-medium text-blue-900">Họ và tên</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Nhập họ tên"
                  className="mt-1 w-full rounded-lg border border-blue-100 bg-white px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>
              <div>
                <label className="font-medium text-blue-900">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="mt-1 w-full rounded-lg border border-blue-100 bg-white px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>
              <div>
                <label className="font-medium text-blue-900">Nội dung cần hỗ trợ</label>
                <textarea
                  rows={4}
                  name="content"
                  value={form.content}
                  onChange={handleChange}
                  placeholder="Hãy mô tả ngắn gọn vấn đề của bạn..."
                  className="mt-1 w-full rounded-lg border border-blue-100 bg-white px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Đang gửi...' : 'Gửi yêu cầu'}
              </button>
              <p className="text-xs text-blue-600/80">
                Yêu cầu của bạn sẽ được phản hồi qua email trong vòng 2 giờ làm việc. Gọi hotline nếu bạn cần hỗ trợ
                khẩn cấp.
              </p>
            </form>
          </aside>
        </section>

        <section className="space-y-5 rounded-3xl border border-blue-100 bg-white/80 p-8 shadow-xl shadow-blue-100/40">
          <h2 className="text-2xl font-semibold text-blue-900">Câu hỏi thường gặp</h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-2xl border border-blue-50 bg-blue-50/60 p-5 transition"
              >
                <summary className="cursor-pointer list-none text-lg font-semibold text-blue-900 flex items-center justify-between">
                  {faq.question}
                  <span className="text-sm text-blue-600 group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-3 text-sm text-blue-700/80 leading-relaxed">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}





