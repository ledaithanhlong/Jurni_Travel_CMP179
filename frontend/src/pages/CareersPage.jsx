import React, { useState, useEffect } from 'react';
import { Briefcase, Heart, Globe, DollarSign, Award, Coffee, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import EditableImage from '../components/EditableImage';

const CareersPage = () => {
    const [careerValues, setCareerValues] = useState([]);

    const refreshData = async () => {
        try {
            const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const res = await axios.get(`${API}/career-values`).catch(() => ({ data: [] }));
            setCareerValues(res.data || []);
        } catch (err) {
            console.error("Failed to fetch data", err);
        }
    };

    useEffect(() => {
        refreshData();
    }, []);

    const positions = [
        {
            id: 1,
            title: 'Senior Frontend Engineer',
            department: 'Engineering',
            location: 'Hồ Chí Minh (Hybrid)',
            type: 'Full-time',
        },
        {
            id: 2,
            title: 'Product Designer (UI/UX)',
            department: 'Design',
            location: 'Hồ Chí Minh',
            type: 'Full-time',
        },
        {
            id: 3,
            title: 'Marketing Specialist',
            department: 'Marketing',
            location: 'Hà Nội (Remote)',
            type: 'Part-time',
        },
        {
            id: 4,
            title: 'Customer Success Manager',
            department: 'Operations',
            location: 'Đà Nẵng',
            type: 'Full-time',
        },
    ];

    return (
        <div className="bg-gray-50 min-h-screen pb-12">
            {/* Hero Section */}
            <div className="bg-blue-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-800/50 backdrop-blur-sm z-0"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/3"></div>
                <div className="max-w-7xl mx-auto px-4 py-24 relative z-10 text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
                        Cùng Jurni <span className="text-orange-400">Kiến Tạo</span> Tương Lai Du Lịch
                    </h1>
                    <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-10 leading-relaxed">
                        Chúng tôi không chỉ xây dựng một ứng dụng, chúng tôi đang kết nối mọi người với những trải nghiệm tuyệt vời nhất Việt Nam.
                    </p>
                    <a
                        href="#positions"
                        className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-full transition-all transform hover:scale-105 shadow-lg"
                    >
                        <Briefcase className="w-5 h-5" />
                        Xem vị trí tuyển dụng
                    </a>
                </div>
            </div>

            {/* Values Section */}
            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Tại sao chọn Jurni?</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Tại Jurni, văn hóa là nền tảng của mọi thành công. Chúng tôi trân trọng sự sáng tạo và đam mê.
                    </p>
                </div>

                {careerValues.length > 0 ? (
                    <div className="space-y-12">
                        {careerValues.map((value, index) => (
                            <div key={value.id} className={`flex flex-col md:flex-row gap-8 items-center ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
                                <div className="flex-1 w-full">
                                    <EditableImage
                                        src={value.image_url}
                                        alt={value.title}
                                        apiEndpoint="career-values"
                                        id={value.id}
                                        onUpdate={refreshData}
                                        hasSizeOption="style"
                                        className="relative rounded-2xl overflow-hidden shadow-lg h-64 md:h-80 group"
                                    />
                                </div>
                                <div className="flex-1 text-center md:text-left">
                                    <h3 className="text-2xl font-bold text-gray-800 mb-4">{value.title}</h3>
                                    <p className="text-lg text-gray-600 leading-relaxed">{value.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Globe className="w-8 h-8 text-blue-600" />,
                                title: "Tác Động Toàn Cầu",
                                desc: "Sản phẩm của bạn sẽ giúp hàng nghìn người khám phá và yêu mến vẻ đẹp của đất nước."
                            },
                            {
                                icon: <Heart className="w-8 h-8 text-red-500" />,
                                title: "Con Người Là Trên Hết",
                                desc: "Chúng tôi xây dựng môi trường làm việc cởi mở, hỗ trợ lẫn nhau và tôn trọng sự khác biệt."
                            },
                            {
                                icon: <Award className="w-8 h-8 text-orange-500" />,
                                title: "Phát Triển Không Ngừng",
                                desc: "Cơ hội học hỏi công nghệ mới và thăng tiến trong sự nghiệp luôn rộng mở với bạn."
                            }
                        ].map((item, index) => (
                            <div key={index} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                                <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                                    {item.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-3">{item.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Benefits Section */}
            <div className="bg-white py-16">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-800 mb-6">Phúc lợi hấp dẫn</h2>
                            <div className="space-y-6">
                                {[
                                    { icon: <DollarSign className="w-5 h-5" />, text: "Mức lương cạnh tranh & Thưởng hiệu quả" },
                                    { icon: <Coffee className="w-5 h-5" />, text: "Môi trường làm việc linh hoạt (Hybrid/Remote)" },
                                    { icon: <Globe className="w-5 h-5" />, text: "Tài trợ du lịch hàng năm 5.000.000đ" },
                                    { icon: <Heart className="w-5 h-5" />, text: "Bảo hiểm sức khỏe cao cấp cho nhân viên" },
                                ].map((benefit, idx) => (
                                    <div key={idx} className="flex items-center gap-4">
                                        <div className="bg-orange-100 p-2 rounded-lg text-orange-600">
                                            {benefit.icon}
                                        </div>
                                        <span className="text-gray-700 font-medium">{benefit.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-blue-50 rounded-3xl p-8 relative overflow-hidden">
                            {/* Decorative elements */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200 rounded-full blur-2xl opacity-50 -mr-10 -mt-10"></div>
                            <div className="relative z-10 text-center">
                                <h3 className="text-2xl font-bold text-blue-900 mb-4">"Làm hết sức, chơi hết mình"</h3>
                                <p className="text-blue-700 italic">
                                    Chúng tôi tin rằng những ý tưởng tuyệt vời nhất thường đến khi bạn thoải mái và hạnh phúc nhất.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Work Culture (Replaces Gallery) */}
            <div className="py-16 bg-white border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-4">
                    <h2 className="text-3xl font-bold text-gray-800 mb-10 text-center">Văn hóa làm việc</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Coffee className="w-10 h-10 text-orange-500" />,
                                title: "Cân bằng & Linh hoạt",
                                desc: "Chúng tôi tin rằng hiệu quả công việc đến từ tinh thần thoải mái. Chế độ làm việc Hybrid và giờ giấc linh hoạt luôn được khuyến khích."
                            },
                            {
                                icon: <Award className="w-10 h-10 text-blue-600" />,
                                title: "Công nhận & Khen thưởng",
                                desc: "Mọi nỗ lực đều được ghi nhận xứng đáng. Hệ thống đánh giá hiệu suất minh bạch cùng các khoản thưởng dự án hấp dẫn."
                            },
                            {
                                icon: <Heart className="w-10 h-10 text-red-500" />,
                                title: "Sức khỏe & Tinh thần",
                                desc: "Chương trình bảo hiểm sức khỏe cao cấp, các hoạt động team building, yoga và câu lạc bộ thể thao hàng tuần."
                            }
                        ].map((item, idx) => (
                            <div key={idx} className="bg-gray-50 p-8 rounded-2xl border border-gray-100 hover:border-orange-200 transition-colors">
                                <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mb-6 shadow-sm">
                                    {item.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-3">{item.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Career Growth (Replaces Testimonials) */}
            <div className="bg-blue-50 py-20 px-4">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">Lộ trình phát triển</h2>
                    <div className="space-y-8">
                        {[
                            { title: "Onboarding", desc: "2 Tuần đầu tiên: Làm quen văn hóa, công cụ và quy trình. Bạn sẽ có một 'Buddy' đồng hành hướng dẫn." },
                            { title: "Junior to Mid", desc: "1-2 Năm: Tham gia các dự án thực tế, được mentor trực tiếp bởi Senior. Học hỏi kỹ năng chuyên môn sâu." },
                            { title: "Senior & Lead", desc: "3+ Năm: Làm chủ công nghệ, dẫn dắt đội nhóm và đưa ra các quyết định kiến trúc quan trọng." },
                        ].map((step, idx) => (
                            <div key={idx} className="flex gap-6 items-start">
                                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xl shadow-lg">
                                    {idx + 1}
                                </div>
                                <div className="bg-white p-6 rounded-xl shadow-sm flex-1">
                                    <h3 className="text-lg font-bold text-blue-900 mb-2">{step.title}</h3>
                                    <p className="text-gray-600">{step.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Open Positions Section */}
            <div id="positions" className="max-w-7xl mx-auto px-4 py-20 bg-gray-50">
                <h2 className="text-3xl font-bold text-gray-800 mb-10 text-center">Vị trí đang tuyển dụng</h2>
                <div className="space-y-4">
                    {positions.map((job) => (
                        <div key={job.id} className="bg-white border hover:border-blue-300 p-6 rounded-xl flex flex-col md:flex-row items-center justify-between transition-colors shadow-sm cursor-pointer group">
                            <div className="mb-4 md:mb-0 text-center md:text-left">
                                <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-700 transition-colors">{job.title}</h3>
                                <div className="text-sm text-gray-500 mt-1 flex flex-wrap gap-2 justify-center md:justify-start">
                                    <span className="bg-gray-100 px-2 py-1 rounded">{job.department}</span>
                                    <span>•</span>
                                    <span>{job.location}</span>
                                    <span>•</span>
                                    <span>{job.type}</span>
                                </div>
                            </div>
                            <Link
                                to={`/careers/apply/${job.id}`}
                                className="flex items-center gap-2 border border-blue-600 text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors"
                            >
                                Ứng tuyển ngay <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    ))}
                </div>
                <div className="text-center mt-12">
                    <p className="text-gray-600 mb-4">Không tìm thấy vị trí phù hợp?</p>
                    <a href="mailto:careers@jurni.vn" className="text-orange-600 font-bold hover:underline">
                        Gửi CV cho chúng tôi qua email
                    </a>
                </div>
            </div>

            {/* FAQ - Moved to bottom */}
            <div className="max-w-3xl mx-auto px-4 py-16">
                <h2 className="text-3xl font-bold text-gray-800 mb-10 text-center">Câu hỏi thường gặp</h2>
                <div className="space-y-4">
                    {[
                        { q: "Quy trình tuyển dụng diễn ra như thế nào?", a: "Quy trình thường bao gồm: Nộp CV -> Phỏng vấn nhân sự -> Bài kiểm tra năng lực (tùy vị trí) -> Phỏng vấn chuyên môn -> Offer." },
                        { q: "Jurni có hỗ trợ làm việc từ xa không?", a: "Có, chúng tôi áp dụng mô hình Hybrid Working (kết hợp làm việc tại văn phòng và từ xa) cho hầu hết các vị trí." },
                        { q: "Thời gian thử việc là bao lâu?", a: "Thời gian thử việc tiêu chuẩn là 2 tháng, hưởng 85%-100% lương chính thức tùy năng lực." }
                    ].map((faq, i) => (
                        <div key={i} className="bg-white border rounded-xl p-6 hover:border-orange-300 transition-colors cursor-default">
                            <h3 className="font-bold text-gray-900 mb-2">{faq.q}</h3>
                            <p className="text-gray-600 text-sm">{faq.a}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CareersPage;
