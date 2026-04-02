import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function AdminVouchers() {
  const { getToken } = useAuth();
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    code: '',
    discount_percent: '',
    expiry_date: ''
  });

  useEffect(() => {
    loadVouchers();
  }, []);

  const loadVouchers = async () => {
    try {
      const token = await getToken();
      if (!token) {
        alert('Không thể lấy token xác thực. Vui lòng đăng nhập lại.');
        setLoading(false);
        return;
      }
      const res = await axios.get(`${API}/vouchers/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setVouchers(res.data || []);
    } catch (error) {
      console.error('Error loading vouchers:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Lỗi không xác định';
      alert(`Lỗi khi tải danh sách voucher: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = await getToken();
      if (!token) {
        alert('Không thể lấy token xác thực. Vui lòng đăng nhập lại.');
        return;
      }
      const data = {
        ...form,
        discount_percent: Number(form.discount_percent),
        expiry_date: new Date(form.expiry_date).toISOString()
      };
      
      if (editing) {
        await axios.put(`${API}/vouchers/${editing}`, data, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Cập nhật thành công!');
      } else {
        await axios.post(`${API}/vouchers`, data, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Tạo thành công!');
      }
      setShowForm(false);
      setEditing(null);
      setForm({
        code: '',
        discount_percent: '',
        expiry_date: ''
      });
      loadVouchers();
    } catch (error) {
      console.error('Error saving voucher:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Lỗi không xác định';
      alert(`Lỗi khi lưu voucher: ${errorMessage}`);
    }
  };

  const handleEdit = (voucher) => {
    setEditing(voucher.id);
    setForm({
      code: voucher.code,
      discount_percent: voucher.discount_percent,
      expiry_date: voucher.expiry_date ? new Date(voucher.expiry_date).toISOString().slice(0, 16) : ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Bạn có chắc chắn muốn xóa voucher này?')) return;
    try {
      const token = await getToken();
      if (!token) {
        alert('Không thể lấy token xác thực. Vui lòng đăng nhập lại.');
        return;
      }
      await axios.delete(`${API}/vouchers/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Xóa thành công!');
      loadVouchers();
    } catch (error) {
      console.error('Error deleting voucher:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Lỗi không xác định';
      alert(`Lỗi khi xóa voucher: ${errorMessage}`);
    }
  };

  const isExpired = (expiryDate) => {
    return new Date(expiryDate) < new Date();
  };

  if (loading) return <div className="text-center py-8">Đang tải...</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Quản lý Voucher</h2>
            <p className="text-sm text-gray-600 mt-1">Tổng số: {vouchers.length} voucher</p>
          </div>
          <button
            onClick={() => {
              setShowForm(true);
              setEditing(null);
              setForm({
                code: '',
                discount_percent: '',
                expiry_date: ''
              });
            }}
            className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700"
          >
            + Thêm voucher
          </button>
        </div>

        {showForm && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
            <h3 className="font-semibold mb-4">{editing ? 'Sửa voucher' : 'Thêm voucher mới'}</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mã voucher</label>
                <input
                  type="text"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  className="w-full border rounded px-3 py-2"
                  required
                  placeholder="VD: SALE50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Giảm giá (%)</label>
                <input
                  type="number"
                  value={form.discount_percent}
                  onChange={(e) => setForm({ ...form, discount_percent: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  required
                  min="1"
                  max="100"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Ngày hết hạn</label>
                <input
                  type="datetime-local"
                  value={form.expiry_date}
                  onChange={(e) => setForm({ ...form, expiry_date: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div className="col-span-2 flex gap-2">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  {editing ? 'Cập nhật' : 'Tạo mới'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditing(null);
                  }}
                  className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mã</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giảm giá</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày hết hạn</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {vouchers.map((voucher) => {
                const expired = isExpired(voucher.expiry_date);
                return (
                  <tr key={voucher.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{voucher.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono font-semibold text-gray-900">
                      {voucher.code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {voucher.discount_percent}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(voucher.expiry_date).toLocaleString('vi-VN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        expired ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {expired ? 'Hết hạn' : 'Còn hiệu lực'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleEdit(voucher)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(voucher.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

