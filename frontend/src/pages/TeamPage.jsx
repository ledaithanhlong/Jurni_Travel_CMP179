
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useUser, useAuth } from '@clerk/clerk-react';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../utils/cropImage';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const TeamSection = ({ title, members, isAdmin, onEdit, onDelete, accentColor = "blue" }) => {
    if (!members || members.length === 0) return null;

    // Map accent colors to CSS classes for diverse section styling
    const colorMap = {
        gold: "from-yellow-400 to-amber-600",
        blue: "from-blue-400 to-indigo-600",
        emerald: "from-emerald-400 to-teal-600",
        purple: "from-purple-400 to-fuchsia-600",
        slate: "from-gray-400 to-slate-600"
    };

    const gradient = colorMap[accentColor] || colorMap.blue;

    return (
        <div className="mb-24 last:mb-0">
            <div className="flex items-center justify-center mb-12">
                <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-gray-300"></div>
                <h2 className="text-3xl font-bold text-center text-gray-800 mx-6 uppercase tracking-wider relative">
                    {title}
                    <span className={`absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gradient-to-r ${gradient} rounded-full opacity-80`}></span>
                </h2>
                <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-gray-300"></div>
            </div>

            <div className="flex flex-wrap justify-center gap-8 px-4">
                {members.map((member) => (
                    <div
                        key={member.id}
                        className="group relative bg-white rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(8,_112,_184,_0.1)] border border-gray-100 transition-all duration-300 ease-out hover:-translate-y-2 flex flex-col items-center w-full md:w-[calc(50%-2rem)] lg:w-[calc(33.333%-2rem)] max-w-sm"
                    >
                        {isAdmin && (
                            <div className="absolute top-4 right-4 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => onEdit(member)} className="p-2 bg-white/90 backdrop-blur shadow-sm border border-gray-100 rounded-full hover:bg-blue-50 text-blue-600 transition">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                                </button>
                                <button onClick={() => onDelete(member.id)} className="p-2 bg-white/90 backdrop-blur shadow-sm border border-gray-100 rounded-full hover:bg-red-50 text-red-600 transition">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                </button>
                            </div>
                        )}

                        {/* Card Header Background */}
                        <div className={`absolute top-0 left-0 right-0 h-32 bg-gradient-to-br ${gradient} opacity-5 rounded-t-2xl pointer-events-none`}></div>

                        {/* Avatar */}
                        <div className="relative mt-4 mb-6">
                            <div className={`absolute -inset-1 bg-gradient-to-br ${gradient} rounded-full opacity-70 blur-sm group-hover:opacity-100 transition duration-500`}></div>
                            {member.imageUrl ? (
                                <img src={member.imageUrl} alt={member.name} className="relative w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg" />
                            ) : (
                                <div className={`relative w-32 h-32 rounded-full ${member.color || 'bg-gray-400'} flex items-center justify-center text-white text-3xl font-bold border-4 border-white shadow-lg`}>
                                    {member.initials}
                                </div>
                            )}
                        </div>

                        {/* Content */}
                        <div className="text-center w-full z-10 transition-colors">
                            <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-700 transition-colors">{member.name}</h3>
                            <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-4 h-6 flex items-center justify-center">
                                {member.role}
                            </p>

                            <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-5"></div>

                            <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3 px-2 min-h-[4.5em]">
                                {member.bio}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default function TeamPage() {
    const { user, isLoaded } = useUser();
    const { getToken } = useAuth();
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Admin Check
    const adminEmails = (import.meta.env.VITE_ADMIN_EMAILS || '').split(',').map(e => e.trim());
    const isAdmin = user?.primaryEmailAddress?.emailAddress && adminEmails.includes(user.primaryEmailAddress.emailAddress);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMember, setEditingMember] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        role: '',
        bio: '',
        initials: '',
        imageUrl: '',
        color: 'bg-blue-500',
        group: 'staff'
    });
    const [uploading, setUploading] = useState(false);

    // Cropper State
    const [imageSrc, setImageSrc] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [isCropperOpen, setIsCropperOpen] = useState(false);

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        try {
            const res = await axios.get(`${API}/team`);
            setMembers(res.data);
        } catch (error) {
            console.error('Failed to fetch team members', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (member) => {
        setEditingMember(member);
        setFormData({
            name: member.name,
            role: member.role,
            bio: member.bio,
            initials: member.initials || '',
            imageUrl: member.imageUrl || '',
            color: member.color || 'bg-blue-500',
            group: member.group || 'staff'
        });
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setEditingMember(null);
        setFormData({
            name: '',
            role: '',
            bio: '',
            initials: '',
            imageUrl: '',
            color: 'bg-blue-500',
            group: 'staff'
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa thành viên này?')) return;
        try {
            const token = await getToken();
            await axios.delete(`${API}/team/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchMembers();
        } catch (error) {
            alert('Failed to delete member');
        }
    };

    const parseFile = (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                resolve(reader.result);
            };
        });
    };

    const onFileChange = async (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const imageDataUrl = await parseFile(file);
            setImageSrc(imageDataUrl);
            setIsCropperOpen(true);
        }
    };

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleCropSave = async () => {
        try {
            setUploading(true);
            const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels);

            // Upload blob to server
            const uploadData = new FormData();
            uploadData.append('file', croppedImageBlob, 'cropped-image.jpg');

            const token = await getToken();
            const res = await axios.post(`${API}/upload`, uploadData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });

            setFormData(prev => ({ ...prev, imageUrl: res.data.url }));
            setIsCropperOpen(false);
            setImageSrc(null);
        } catch (e) {
            console.error(e);
            alert('Lỗi xử lý ảnh');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = await getToken();
            if (editingMember) {
                await axios.put(`${API}/team/${editingMember.id}`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.post(`${API}/team`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            setIsModalOpen(false);
            fetchMembers();
        } catch (error) {
            console.error('Save failed', error);
            alert('Lưu thất bại');
        }
    };

    const cofounders = members.filter(m => m.group === 'cofounder');
    const executives = members.filter(m => m.group === 'executive');
    const seniorManagers = members.filter(m => m.group === 'senior_management');
    const middleManagers = members.filter(m => m.group === 'middle_management');
    const juniorManagers = members.filter(m => m.group === 'junior_management');

    return (
        <div className="bg-slate-50 min-h-screen relative overflow-hidden">
            {/* Decorative Background Blobs */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-orange-50/50 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/4 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 py-20 relative z-10">
                {/* Hero Section */}
                <div className="text-center mb-24 max-w-4xl mx-auto">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 font-semibold tracking-wide text-xs uppercase mb-6">
                        Đội ngũ Jurni
                    </span>
                    <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight mb-8">
                        Những người kiến tạo <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Những Hành Trình</span>
                    </h1>
                    <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
                        Chúng tôi là tập hợp những con người đam mê dịch chuyển và công nghệ, cùng nhau xây dựng nền tảng du lịch số 1 Việt Nam.
                    </p>

                    {isAdmin && (
                        <button
                            onClick={handleAddNew}
                            className="mt-10 px-8 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition transform hover:scale-105 shadow-xl shadow-blue-600/20 flex items-center gap-2 mx-auto"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
                            Thêm thành viên
                        </button>
                    )}
                </div>

                {/* Team Sections */}
                {loading ? (
                    <div className="flex justify-center py-32"><div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div></div>
                ) : (
                    <div className="space-y-12">
                        <TeamSection title="Ban Lãnh Đạo (Founders)" members={cofounders} isAdmin={isAdmin} onEdit={handleEdit} onDelete={handleDelete} accentColor="gold" />
                        {/* <TeamSection title="Cấp Điều Hành" members={executives} isAdmin={isAdmin} onEdit={handleEdit} onDelete={handleDelete} accentColor="blue" />
                        <TeamSection title="Cấp Quản Lý Cấp Cao" members={seniorManagers} isAdmin={isAdmin} onEdit={handleEdit} onDelete={handleDelete} accentColor="purple" />
                        <TeamSection title="Cấp Quản Lý Trung" members={middleManagers} isAdmin={isAdmin} onEdit={handleEdit} onDelete={handleDelete} accentColor="emerald" />
                        <TeamSection title="Cấp Quản Lý Thấp" members={juniorManagers} isAdmin={isAdmin} onEdit={handleEdit} onDelete={handleDelete} accentColor="slate" /> */}
                    </div>
                )}

                {/* Bottom CTA */}
                <div className="mt-32 text-center">
                    <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-[2.5rem] p-12 md:p-16 text-white relative overflow-hidden shadow-2xl mx-auto max-w-5xl">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-6 relative z-10">Gia nhập đội ngũ Nước Code Dừa?</h2>
                        <p className="text-slate-300 text-lg mb-10 max-w-2xl mx-auto relative z-10">
                            Chúng tôi luôn tìm kiếm những tài năng mới để cùng nhau chinh phục những đỉnh cao công nghệ. Liên hệ với chúng tôi ngay hôm nay!
                        </p>
                        <a href="/careers" className="relative z-10 inline-flex items-center justify-center px-8 py-3 bg-white text-slate-900 rounded-full font-bold hover:bg-blue-50 transition-all transform hover:scale-105">
                            Xem vị trí tuyển dụng
                        </a>
                    </div>
                </div>
            </div>

            {/* Modals remain mostly unchanged in structure but consistent in style if needed */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl animate-fade-in-up">
                        <h2 className="text-2xl font-bold mb-6 text-slate-800 border-b pb-4">{editingMember ? 'Chỉnh sửa hồ sơ' : 'Thêm thành viên mới'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Họ và Tên</label>
                                <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2.5 bg-gray-50 focus:bg-white transition" required />
                            </div>
                            <div className="grid grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Vai trò</label>
                                    <input type="text" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2.5 bg-gray-50 focus:bg-white transition" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Cấp bậc</label>
                                    <select
                                        value={formData.group}
                                        onChange={e => setFormData({ ...formData, group: e.target.value })}
                                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2.5 bg-white"
                                    >
                                        <option value="cofounder">Co-founder</option>
                                        <option value="executive">Executive (Cấp Điều Hành)</option>
                                        <option value="senior_management">Senior Mgmt (QL Cao Cấp)</option>
                                        <option value="middle_management">Middle Mgmt (QL Trung)</option>
                                        <option value="junior_management">Junior Mgmt (QL Thấp)</option>
                                        <option value="staff">Staff</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Giới thiệu ngắn</label>
                                <textarea value={formData.bio} onChange={e => setFormData({ ...formData, bio: e.target.value })} className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2.5 bg-gray-50 focus:bg-white transition" rows="3" />
                            </div>

                            {/* Color and Initials (less important styling) */}
                            <div className="grid grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Tên viết tắt</label>
                                    <input type="text" value={formData.initials} onChange={e => setFormData({ ...formData, initials: e.target.value })} className="w-full rounded-lg border p-2.5 bg-gray-50" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Màu mặc định</label>
                                    <input type="text" value={formData.color} onChange={e => setFormData({ ...formData, color: e.target.value })} className="w-full rounded-lg border p-2.5 bg-gray-50" placeholder="bg-blue-500" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Ảnh đại diện</label>
                                <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-dashed border-gray-300">
                                    {formData.imageUrl ? (
                                        <img src={formData.imageUrl} alt="Preview" className="h-16 w-16 rounded-full object-cover shadow-md" />
                                    ) : (
                                        <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">?</div>
                                    )}
                                    <input type="file" onChange={onFileChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 cursor-pointer" accept="image/*" />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-8 pt-4 border-t">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition">Hủy bỏ</button>
                                <button type="submit" disabled={uploading} className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-lg font-medium transition disabled:opacity-50">
                                    {uploading ? 'Đang lưu...' : 'Lưu thay đổi'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Cropper Modal - Dark Theme */}
            {isCropperOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4 animate-fade-in">
                    <div className="bg-slate-900 rounded-2xl p-6 w-full max-w-3xl shadow-2xl h-[85vh] flex flex-col border border-slate-700">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-white">Chỉnh sửa ảnh</h2>
                            <button onClick={() => setIsCropperOpen(false)} className="text-gray-400 hover:text-white">✕</button>
                        </div>

                        <div className="relative flex-1 bg-black rounded-xl overflow-hidden mb-6 border border-slate-800">
                            <Cropper
                                image={imageSrc}
                                crop={crop}
                                zoom={zoom}
                                aspect={1}
                                onCropChange={setCrop}
                                onCropComplete={onCropComplete}
                                onZoomChange={setZoom}
                            />
                        </div>

                        <div className="bg-slate-800 p-4 rounded-xl">
                            <label className="block text-sm font-medium text-gray-300 mb-3 flex justify-between">
                                <span>Zoom</span>
                                <span>{(zoom * 100).toFixed(0)}%</span>
                            </label>
                            <input
                                type="range"
                                value={zoom}
                                min={1}
                                max={3}
                                step={0.1}
                                onChange={(e) => setZoom(e.target.value)}
                                className="w-full h-2 bg-blue-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
                            />
                        </div>

                        <div className="flex justify-end gap-4 mt-6">
                            <button onClick={() => { setIsCropperOpen(false); setImageSrc(null); }} className="px-6 py-2.5 text-gray-300 hover:bg-slate-800 rounded-lg font-medium transition">Hủy</button>
                            <button onClick={handleCropSave} disabled={uploading} className="px-8 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-500 shadow-lg shadow-blue-900/50 font-medium disabled:opacity-50 transition transform hover:translate-y-px">
                                {uploading ? 'Đang xử lý...' : 'Cắt & Lưu Ảnh'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
