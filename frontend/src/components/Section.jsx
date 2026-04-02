import React from 'react';

export function SectionHeader({ title, href }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-bold" style={{ color: '#0D47A1' }}>{title}</h2>
      {href && <a className="text-sm font-semibold transition hover:opacity-80" style={{ color: '#FF6B35' }} href={href}>Xem tất cả →</a>}
    </div>
  );
}

export function Card({ image, title, subtitle, price, rating, discount }) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price || 0);
  };

  return (
    <div 
      className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer group border bg-white"
      style={{ 
        backgroundColor: '#FFFFFF',
        borderRadius: '8px',
        borderColor: '#BBDEFB' /* Xanh nhạt vừa #3 */
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#FF6B35';
        // Cam nhạt để nổi bật
        e.currentTarget.style.backgroundColor = '#FFE8E0';
      }}
      onMouseLeave={(e) => {
        // Xanh nhạt vừa #3
        e.currentTarget.style.borderColor = '#BBDEFB';
        e.currentTarget.style.backgroundColor = '#FFFFFF';
      }}
    >
      <div className="relative">
        {image && (
          <img 
            src={image} 
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" 
            alt={title}
          />
        )}
        {discount && (
          <div 
            className="absolute top-2 left-2 text-white text-xs font-bold px-2 py-1 rounded shadow-md"
            style={{ backgroundColor: '#FF6B35', borderRadius: '8px' }}
          >
            {discount}
          </div>
        )}
        {rating && (
          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-xs font-semibold px-2 py-1 rounded-lg flex items-center gap-1 shadow-md" style={{ color: '#212121' }}>
            <span>⭐</span>
            <span>{rating}</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <div 
          className="font-semibold truncate mb-1 transition" 
          style={{ color: '#0D47A1' }}
          title={title}
        >
          {title}
        </div>
        {subtitle && (
          <div className="text-sm truncate mb-2" style={{ color: '#424242' }}>{subtitle}</div>
        )}
        {price != null && (
          <div className="mt-2">
            <div className="font-bold text-lg" style={{ color: '#FF6B35' }}>
              {formatPrice(price)} VND
            </div>
            {discount && (
              <div className="text-xs line-through mt-1" style={{ color: '#9E9E9E' }}>
                {formatPrice(price * 1.2)} VND
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}


