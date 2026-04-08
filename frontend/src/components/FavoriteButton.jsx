import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function FavoriteButton({ serviceType, serviceId, serviceName, meta, price }) {
    const [isFavorite, setIsFavorite] = useState(false);
    const [favoriteId, setFavoriteId] = useState(null);
    const [loading, setLoading] = useState(false);
    const { getToken, isSignedIn } = useAuth();

    useEffect(() => {
        if (!isSignedIn) return;

        let mounted = true;
        (async () => {
            try {
                const token = await getToken();
                const res = await axios.get(`${API}/favorites/check/${serviceType}/${serviceId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!mounted) return;
                setIsFavorite(res.data.isFavorite);
                setFavoriteId(res.data.favoriteId);
            } catch (err) {
                console.error('Error checking favorite:', err);
            }
        })();

        return () => {
            mounted = false;
        };
    }, [getToken, isSignedIn, serviceType, serviceId]);

    const toggleFavorite = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isSignedIn) {
            alert('Vui lòng đăng nhập để sử dụng chức năng yêu thích');
            return;
        }

        setLoading(true);
        try {
            const token = await getToken();

            if (isFavorite && favoriteId) {
                // Remove from favorites
                await axios.delete(`${API}/favorites/${favoriteId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setIsFavorite(false);
                setFavoriteId(null);
            } else {
                // Add to favorites
                const res = await axios.post(
                    `${API}/favorites`,
                    {
                        service_type: serviceType,
                        service_id: serviceId,
                        name: serviceName,
                        meta,
                        price
                    },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setIsFavorite(true);
                setFavoriteId(res.data.id);
            }
        } catch (err) {
            console.error('Error toggling favorite:', err);
            alert(err.response?.data?.error || 'Có lỗi xảy ra. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    if (!isSignedIn) return null;

    return (
        <button
            onClick={toggleFavorite}
            disabled={loading}
            className={`flex items-center justify-center w-10 h-10 rounded-full transition-all ${isFavorite
                ? 'bg-rose-500 text-white hover:bg-rose-600'
                : 'bg-white/80 text-gray-400 hover:bg-rose-50 hover:text-rose-500'
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            title={isFavorite ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
        >
            <svg
                className="w-5 h-5"
                fill={isFavorite ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
            </svg>
        </button>
    );
}
