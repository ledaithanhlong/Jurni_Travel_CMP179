import React from 'react';
import { Link } from 'react-router-dom';
import { IconStar, IconLocation, IconBed, IconClock } from './Icons';
import FavoriteButton from './FavoriteButton';

// Format price utility
const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price || 0);
};

export function HotelCard({ hotel }) {
    if (!hotel) return null;
    return (
        /* card-base: bg-white, border-line-light, hover:border-cta, hover:shadow-lg */
        <a href={`/hotels/${hotel.id}`} className="card-base group rounded-3xl overflow-hidden flex flex-col h-full cursor-pointer">
            {hotel.image_url && (
                <div className="relative h-56 overflow-hidden flex-shrink-0">
                    <img
                        src={hotel.image_url}
                        alt={hotel.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {/* Rating badge — 30% secondary */}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1 shadow-sm">
                        <IconStar className="w-4 h-4 text-cta-soft fill-current" />
                        <span className="font-bold text-content-body text-sm">{hotel.rating || 4}</span>
                    </div>
                    <div className="absolute top-4 left-4">
                        <FavoriteButton
                            serviceType="hotel"
                            serviceId={hotel.id}
                            serviceName={hotel.name}
                            meta={hotel.location}
                            price={hotel.price}
                        />
                    </div>
                </div>
            )}
            <div className="p-5 flex flex-col flex-1">
                <div className="flex-1">
                    {/* Hotel name — 30% secondary, hover → 10% accent */}
                    <h3 className="text-lg font-bold text-content-body mb-2 group-hover:text-cta transition-colors line-clamp-1">
                        {hotel.name}
                    </h3>
                    <div className="flex items-center gap-2 text-content-muted mb-3">
                        <IconLocation className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm line-clamp-1">{hotel.location}</span>
                    </div>
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            {/* Price — 10% accent */}
                            <div className="price-tag-lg">{formatPrice(hotel.price)} VND</div>
                            <div className="text-xs text-content-muted">/ đêm</div>
                        </div>
                        <div className="text-xs text-content-muted">
                            <IconBed className="w-4 h-4 inline mr-1" />
                            {hotel.rooms || 'N/A'} phòng
                        </div>
                    </div>
                    {hotel.amenities && hotel.amenities.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                            {hotel.amenities.slice(0, 3).map((amenity, idx) => (
                                /* badge-soft: accent-light bg, accent text */
                                <span key={idx} className="badge-soft">{amenity}</span>
                            ))}
                            {hotel.amenities.length > 3 && (
                                <span className="badge-primary-soft">+{hotel.amenities.length - 3}</span>
                            )}
                        </div>
                    )}
                </div>
                {/* CTA button — 10% accent */}
                <button className="btn-accent w-full rounded-full mt-auto text-sm">
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
            className="card-base group rounded-3xl overflow-hidden flex flex-col h-full cursor-pointer"
        >
            <div className="relative overflow-hidden h-56 flex-shrink-0">
                {activity.image_url ? (
                    <img
                        src={activity.image_url}
                        alt={activity.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    /* 60% dominant bg nếu không có ảnh */
                    <div className="w-full h-full bg-dominant-muted flex items-center justify-center">
                        <span className="text-content-muted text-sm">Chưa có ảnh</span>
                    </div>
                )}
                <div className="absolute top-4 left-4 flex flex-wrap gap-1">
                    {activity.categories && activity.categories.length > 0 ? (
                        activity.categories.map(cat => (
                            <div key={cat.id} className="badge-primary shadow-md text-[10px] px-2 py-0.5 flex items-center gap-1">
                                {cat.icon && (typeof cat.icon === 'string' && (cat.icon.startsWith('http') || cat.icon.startsWith('/')) ? (
                                    <img src={cat.icon} alt={cat.name} className="w-3 h-3 rounded-full object-cover inline-block" />
                                ) : (
                                    <span>{cat.icon}</span>
                                ))}
                                <span>{cat.name}</span>
                            </div>
                        ))
                    ) : (
                        activity.category && (
                            <div className="badge-primary shadow-md text-[10px] px-2 py-0.5">
                                {activity.category}
                            </div>
                        )
                    )}
                </div>
                <div className="absolute top-4 right-4">
                    <FavoriteButton
                        serviceType="activity"
                        serviceId={activity.id}
                        serviceName={activity.name}
                        meta={activity.location || activity.city}
                        price={activity.price}
                    />
                </div>
            </div>
            <div className="p-5 flex flex-col flex-1">
                <h3 className="text-lg font-bold text-content-body mb-1 line-clamp-1">{activity.name}</h3>
                <div className="flex items-center gap-2 text-sm text-content-muted mb-2">
                    <IconLocation className="w-4 h-4 flex-shrink-0" />
                    <span className="line-clamp-1">{activity.location || activity.city}</span>
                </div>
                {activity.duration && (
                    <div className="flex items-center gap-2 text-sm text-content-muted mb-3">
                        <IconClock className="w-4 h-4 flex-shrink-0" />
                        <span>{activity.duration}</span>
                    </div>
                )}
                <div className="flex items-center justify-between pt-3 border-t border-line-light mt-auto">
                    <div>
                        {/* Price — 10% accent */}
                        <div className="price-tag-lg">{formatPrice(activity.price)} VND</div>
                        <div className="text-xs text-content-muted">/ người</div>
                    </div>
                    {/* CTA button — 10% accent */}
                    <button className="btn-accent rounded-full px-5 py-2 text-sm">
                        Chi tiết
                    </button>
                </div>
            </div>
        </div>
    );
}

export function FlightCard({ flight }) {
    if (!flight) return null;

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        /* card-base: hover:border-cta, hover:shadow-lg */
        <Link to="/flights" className="card-base group block rounded-xl overflow-hidden h-full">
            <div className="p-4 flex flex-col h-full">
                {/* Airline & Logo */}
                <div className="flex items-center gap-3 mb-3">
                    {flight.image_url ? (
                        <img
                            src={flight.image_url}
                            alt={flight.airline}
                            className="w-10 h-10 object-contain rounded bg-dominant-soft p-1"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded bg-dominant-muted flex items-center justify-center text-xs font-bold text-brand">
                            {flight.airline?.substring(0, 2).toUpperCase()}
                        </div>
                    )}
                    <div className="text-sm font-bold text-content-body line-clamp-1">{flight.airline}</div>
                </div>

                {/* Route */}
                <div className="flex justify-between items-center mb-3 text-sm">
                    <div className="text-center">
                        <div className="font-bold text-content-body">{flight.departure_city}</div>
                        <div className="text-xs text-content-muted">{formatTime(flight.departure_time)}</div>
                    </div>
                    <div className="flex-1 px-2 flex flex-col items-center">
                        <div className="w-full border-t border-dashed border-line-medium relative top-1.5"></div>
                        <div className="text-xs text-content-muted mt-1">Bay thẳng</div>
                    </div>
                    <div className="text-center">
                        <div className="font-bold text-content-body">{flight.arrival_city}</div>
                        <div className="text-xs text-content-muted">{formatTime(flight.arrival_time)}</div>
                    </div>
                </div>

                {/* Price & Action */}
                <div className="mt-auto pt-3 border-t border-line-light flex items-center justify-between">
                    <div>
                        {/* Price — 10% accent */}
                        <div className="price-tag text-lg">{formatPrice(flight.price)}</div>
                        <div className="text-[10px] text-content-muted">VND / khách</div>
                    </div>
                    {/* Link hover → accent */}
                    <span className="text-xs font-semibold text-brand group-hover:text-cta transition-colors">
                        Chọn →
                    </span>
                </div>
            </div>
        </Link>
    );
}


