import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

// Temporary mock data (should be shared or fetched)
const positions = [
    { id: 1, title: 'Senior Frontend Engineer', department: 'Engineering' },
    { id: 2, title: 'Product Designer (UI/UX)', department: 'Design' },
    { id: 3, title: 'Marketing Specialist', department: 'Marketing' },
    { id: 4, title: 'Customer Success Manager', department: 'Operations' },
];

const JobApplicationPage = () => {
    const { jobId } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [submitted, setSubmitted] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        linkedin: '',
        portfolio: '',
        coverLetter: '',
        cv: null
    });

    useEffect(() => {
        // Simulate catching job details
        const foundJob = positions.find(p => p.id === Number(jobId));
        if (foundJob) {
            setJob(foundJob);
        } else {
            // Should redirect or show error in real app
        }
        window.scrollTo(0, 0);
    }, [jobId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setFormData(prev => ({ ...prev, cv: e.target.files[0] }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate API call
        setTimeout(() => {
            setSubmitted(true);
            window.scrollTo(0, 0);
        }, 1000);
    };

    if (!job) {
        return <div className="min-h-screen flex items-center justify-center p-4">Loading...</div>;
    }

    if (submitted) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white max-w-lg w-full rounded-2xl p-8 shadow-lg text-center">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Ứng tuyển thành công!</h2>
                    <p className="text-gray-600 mb-8">
                        Cảm ơn bạn đã quan tâm đến vị trí <b>{job.title}</b>. Bộ phận tuyển dụng Jurni sẽ xem xét hồ sơ và liên hệ với bạn trong thời gian sớm nhất.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Link to="/" className="text-gray-600 hover:text-gray-900 font-medium">Về trang chủ</Link>
                        <span className="text-gray-300">|</span>
                        <Link to="/careers" className="text-blue-600 hover:text-blue-700 font-medium font-bold">Xem vị trí khác</Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-3xl mx-auto px-4">
                <Link to="/careers" className="inline-flex items-center text-gray-500 hover:text-blue-600 mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Quay lại trang tuyển dụng
                </Link>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="bg-blue-600 p-8 text-white">
                        <p className="text-blue-200 text-sm font-semibold uppercase tracking-wider mb-2">Ứng tuyển vị trí</p>
                        <h1 className="text-3xl font-bold">{job.title}</h1>
                        <p className="mt-2 text-blue-100">{job.department}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Họ *</label>
                                <input
                                    required
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                                    placeholder="Nguyễn"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tên *</label>
                                <input
                                    required
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                                    placeholder="Văn A"
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                                <input
                                    required
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                                    placeholder="example@email.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại *</label>
                                <input
                                    required
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                                    placeholder="0912 345 678"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn Profile</label>
                            <input
                                name="linkedin"
                                value={formData.linkedin}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                                placeholder="https://linkedin.com/in/..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">CV / Resume *</label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-blue-400 transition-colors bg-gray-50">
                                <div className="space-y-1 text-center">
                                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                    <div className="flex text-sm text-gray-600 justify-center">
                                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                                            <span>Upload a file</span>
                                            <input id="file-upload" name="file-upload" type="file" className="sr-only" required onChange={handleFileChange} />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        PDF, DOC, DOCX up to 10MB
                                    </p>
                                    {formData.cv && (
                                        <p className="text-sm font-semibold text-green-600 mt-2">
                                            Đã chọn: {formData.cv.name}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Thư giới thiệu (Cover Letter)</label>
                            <textarea
                                name="coverLetter"
                                value={formData.coverLetter}
                                onChange={handleChange}
                                rows={4}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                                placeholder="Hãy cho chúng tôi biết tại sao bạn phù hợp với vị trí này..."
                            />
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all transform active:scale-95"
                            >
                                Gửi Hồ Sơ Ứng Tuyển
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default JobApplicationPage;
