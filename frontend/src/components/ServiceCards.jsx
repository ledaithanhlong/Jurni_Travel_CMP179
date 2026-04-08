import React from 'react';
import { Link } from 'react-router-dom';
import { IconStar, IconLocation, IconBed, IconClock } from './Icons';

// Format price utility
const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price || 0);
};

export function HotelCard({ hotel }) {
    if (!hotel) return null;
    return (
        <a href={`/hotels/${hotel.id}`} className="group bg-white rounded-3xl shadow-lg border-2 border-gray-100 hover:border-orange-500 hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer flex flex-col h-full">
            {hotel.image_url && (
                <div className="relative h-56 overflow-hidden flex-shrink-0">
                    <img
                        src={hotel.image_url}
                        alt={hotel.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1">
                        <IconStar className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="font-bold text-gray-900">{hotel.rating || 4}</span>
                    </div>
                </div>
            )}
            <div className="p-5 flex flex-col flex-1">
                <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors line-clamp-1">
                        {hotel.name}
                    </h3>
                    <div className="flex items-center gap-2 text-gray-600 mb-3">
                        <IconLocation className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm line-clamp-1">{hotel.location}</span>
                    </div>
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <div className="text-xl font-extrabold" style={{ color: '#FF6B35' }}>
                                {formatPrice(hotel.price)} VND
                            </div>
                            <div className="text-xs text-gray-500">/ đêm</div>
                        </div>
                        <div className="text-xs text-gray-600">
                            <IconBed className="w-4 h-4 inline mr-1" />
                            {hotel.rooms || 'N/A'} phòng
                        </div>
                    </div>
                    {hotel.amenities && hotel.amenities.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                            {hotel.amenities.slice(0, 3).map((amenity, idx) => (
                                <span
                                    key={idx}
                                    className="text-[10px] px-2 py-0.5 rounded-full font-medium whitespace-nowrap"
                                    style={{ backgroundColor: '#FFE8E0', color: '#FF6B35' }}
                                >
                                    {amenity}
                                </span>
                            ))}
                            {hotel.amenities.length > 3 && (
                                <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">
                                    +{hotel.amenities.length - 3}
                                </span>
                            )}
                        </div>
                    )}
                </div>
                <button className="w-full text-white py-2.5 rounded-full font-bold text-sm hover:scale-105 transition-all duration-300 shadow-md mt-auto" style={{ background: 'linear-gradient(to right, #FF6B35, #FF8C42)' }}>
                    Xem chi tiết
                </button>
            </div>
        </a>
    );
}

export function ActivityCard({ activity, onClick }) {
    if (!activity) return null;
    return (
        <div
            onClick={() => onClick && onClick(activity)}
            className="group bg-white rounded-3xl overflow-hidden shadow-lg border-2 border-gray-100 hover:border-orange-500 hover:shadow-2xl transition-all duration-300 flex flex-col h-full cursor-pointer"
        >
            <div className="relative overflow-hidden h-56 flex-shrink-0">
                {activity.image_url ? (
                    <img
                        src={activity.image_url}
                        alt={activity.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-sky-500 flex items-center justify-center">
                        <span className="text-white">No Image</span>
                    </div>
                )}
                {activity.category && (
                    <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
                        {activity.category}
                    </div>
                )}
            </div>
            <div className="p-5 flex flex-col flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">{activity.name}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <IconLocation className="w-4 h-4 flex-shrink-0" />
                    <span className="line-clamp-1">{activity.location || activity.city}</span>
                </div>
                {activity.duration && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                        <IconClock className="w-4 h-4 flex-shrink-0" />
                        <span>{activity.duration}</span>
                    </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
                    <div>
                        <div className="text-xl font-bold" style={{ color: '#FF6B35' }}>
                            {formatPrice(activity.price)} VND
                        </div>
                        <div className="text-xs text-gray-500">/ người</div>
                    </div>
                    <button
                        className="text-white px-5 py-2 rounded-full font-bold text-sm transition shadow-md"
                        style={{ backgroundColor: '#FF6B35' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FF8C42'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FF6B35'}
                    >
                        Chi tiết
                    </button>
                </div>
            </div>
        </div>
    );
}

export function FlightCard({ flight }) {
    if (!flight) return null;
    // Compact version of Flight Card for Homepage Grid

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <Link to="/flights" className="group block bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-orange-500 transition-all duration-300 h-full">
            <div className="p-4 flex flex-col h-full">
                {/* Airline & Logo */}
                <div className="flex items-center gap-3 mb-3">
                    {flight.image_url ? (
                        <img
                            src={flight.image_url}
                            alt={flight.airline}
                            className="w-10 h-10 object-contain rounded bg-gray-50 p-1"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center text-xs font-bold text-blue-600">
                            {flight.airline?.substring(0, 2).toUpperCase()}
                        </div>
                    )}
                    <div className="text-sm font-bold text-gray-700 line-clamp-1">{flight.airline}</div>
                </div>

                {/* Route */}
                <div className="flex justify-between items-center mb-3 text-sm">
                    <div className="text-center">
                        <div className="font-bold text-gray-900">{flight.departure_city}</div>
                        <div className="text-xs text-gray-500">{formatTime(flight.departure_time)}</div>
                    </div>
                    <div className="flex-1 px-2 flex flex-col items-center">
                        <div className="w-full border-t border-dashed border-gray-300 relative top-1.5"></div>
                        <div className="text-xs text-gray-400 mt-1">Bay thẳng</div>
                    </div>
                    <div className="text-center">
                        <div className="font-bold text-gray-900">{flight.arrival_city}</div>
                        <div className="text-xs text-gray-500">{formatTime(flight.arrival_time)}</div>
                    </div>
                </div>

                {/* Price & Action */}
                <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
                    <div>
                        <div className="font-bold text-lg" style={{ color: '#FF6B35' }}>{formatPrice(flight.price)}</div>
                        <div className="text-[10px] text-gray-500">VND / khách</div>
                    </div>
                    <span className="text-xs font-semibold text-blue-600 group-hover:text-orange-500 transition-colors">
                        Chọn →
                    </span>
                </div>
            </div>
        </Link>
    );
}
