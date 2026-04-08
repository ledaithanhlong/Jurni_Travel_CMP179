import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function AdminUsers() {
  const { getToken } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', role: 'user' });

  useEffect(() => {
    const fetchData = async () => {
      await loadUsers();
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      if (!token) {
        console.error('No token available');
        alert('Không thể lấy token xác thực. Vui lòng đăng nhập lại.');
        setLoading(false);
        return;
      }
      console.log('Loading users with token...');
      const res = await axios.get(`${API}/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Users loaded:', res.data);
      setUsers(
        Array.isArray(res.data)
          ? res.data.sort((a, b) => a.id - b.id)   // sort tăng dần
          : []
      );
      
    } catch (error) {
      console.error('Error loading users:', error);
      console.error('Error response:', error.response);
      const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message || 'Lỗi không xác định';
      const statusCode = error.response?.status;
      alert(`Lỗi khi tải danh sách người dùng (${statusCode || 'N/A'}): ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditing(user.id);
    setForm({ name: user.name, email: user.email, role: user.role });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = await getToken();
      if (!token) {
        alert('Không thể lấy token xác thực. Vui lòng đăng nhập lại.');
        return;
      }
      await axios.put(`${API}/users/${editing}`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Cập nhật thành công!');
      setEditing(null);
      loadUsers();
    } catch (error) {
      console.error('Error updating user:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Lỗi không xác định';
      alert(`Lỗi khi cập nhật người dùng: ${errorMessage}`);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Bạn có chắc chắn muốn xóa người dùng này?')) return;
    try {
      const token = await getToken();
      if (!token) {
        alert('Không thể lấy token xác thực. Vui lòng đăng nhập lại.');
        return;
      }
      await axios.delete(`${API}/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Xóa thành công!');
      loadUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Lỗi không xác định';
      alert(`Lỗi khi xóa người dùng: ${errorMessage}`);
    }
  };

  if (loading) return <div className="text-center py-8">Đang tải...</div>;

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold text-gray-800">Quản lý Người dùng</h2>
        <p className="text-sm text-gray-600 mt-1">Tổng số: {users.length} người dùng</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vai trò</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                {editing === user.id ? (
                  <td colSpan="5" className="px-6 py-4">
                    <form onSubmit={handleUpdate} className="flex gap-4 items-end">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tên</label>
                        <input
                          type="text"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className="w-full border rounded px-3 py-2"
                          required
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                          type="email"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          className="w-full border rounded px-3 py-2"
                          required
                        />
                      </div>
                      <div className="w-32">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Vai trò</label>
                        <select
                          value={form.role}
                          onChange={(e) => setForm({ ...form, role: e.target.value })}
                          className="w-full border rounded px-3 py-2"
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                      <button
                        type="submit"
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                      >
                        Lưu
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditing(null)}
                        className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                      >
                        Hủy
                      </button>
                    </form>
                  </td>
                ) : (
                  <>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleEdit(user)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Xóa
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

