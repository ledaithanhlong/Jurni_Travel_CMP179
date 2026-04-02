import React from 'react';

// Professional SVG Icons for Travel
const HotelIcon = ({ className = "w-12 h-12" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 2.18l8 4v8.82c0 4.54-3.07 8.79-7.09 9.95C8.07 21.79 5 17.54 5 13V8.18l7-3.64v.64z"/>
    <path d="M7 9h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2zm-8 4h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2z"/>
  </svg>
);

const FlightIcon = ({ className = "w-12 h-12" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
  </svg>
);

const CarIcon = ({ className = "w-12 h-12" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
  </svg>
);

const ActivityIcon = ({ className = "w-12 h-12" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
    <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

const iconMap = {
  hotel: HotelIcon,
  hotels: HotelIcon,
  flight: FlightIcon,
  flights: FlightIcon,
  car: CarIcon,
  cars: CarIcon,
  activity: ActivityIcon,
  activities: ActivityIcon
};

export default function ServiceLink({ href, title, subtitle, iconType }) {
  const IconComponent = iconMap[iconType?.toLowerCase()] || HotelIcon;
  
  return (
    <a 
      href={href} 
      className="rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-5 flex flex-col items-center text-center group border"
      style={{ 
        backgroundColor: '#FFFFFF',
        borderRadius: '8px',
        borderColor: '#90CAF9' /* Xanh nhạt #5 */
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#FFE8E0'; /* Cam nhạt để nổi bật */
        e.currentTarget.style.borderColor = '#FF6B35';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = '#FFFFFF';
        e.currentTarget.style.borderColor = '#90CAF9'; /* Xanh nhạt #5 */
      }}
    >
      <div className="mb-3 group-hover:scale-110 transition-transform" style={{ color: '#FF6B35' }}>
        <IconComponent className="w-12 h-12" />
      </div>
      <div className="font-bold mb-1 transition" style={{ color: '#0D47A1' }}>{title}</div>
      <div className="text-xs" style={{ color: '#212121' }}>{subtitle}</div>
    </a>
  );
}


