import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// Professional SVG Icons for Travel
const HotelIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 2.18l8 4v8.82c0 4.54-3.07 8.79-7.09 9.95C8.07 21.79 5 17.54 5 13V8.18l7-3.64v.64z" />
    <path d="M7 9h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2zm-8 4h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2z" />
  </svg>
);

const FlightIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
  </svg>
);

const CarIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
  </svg>
);

const ActivityIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
    <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

export default function JurniHero() {
  const navigate = useNavigate();
  const [service, setService] = useState('flights');
  const [search, setSearch] = useState({
    from: '',
    to: '',
    date: '',
    time: '',
    flightType: 'one-way',
    passengers: { adults: 1, children: 0, infants: 0 },
    class: 'economy',
    // Hotels
    rooms: 1,
    guests: { adults: 2, children: 0 },
    roomType: 'standard',
    priceRange: 'all',
    minRating: 'all',
    amenities: [],
    // Cars
    carType: 'economy',
    pickupLocation: '',
    returnLocation: '',
    pickupTime: '',
    returnTime: '',
    insurance: false,
    // Activities
    activityType: 'all',
    participants: { adults: 2, children: 0 },
    duration: 'all',
    priceRangeActivity: 'all',
    minRatingActivity: 'all'
  });
  const [showPassengerMenu, setShowPassengerMenu] = useState(false);
  const [showClassMenu, setShowClassMenu] = useState(false);
  const [showGuestMenu, setShowGuestMenu] = useState(false);
  const [showRoomMenu, setShowRoomMenu] = useState(false);
  const [showCarTypeMenu, setShowCarTypeMenu] = useState(false);
  const [showActivityMenu, setShowActivityMenu] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState({ from: false, to: false, location: false });
  const [estimatedPrice, setEstimatedPrice] = useState(null);
  const passengerMenuRef = useRef(null);
  const classMenuRef = useRef(null);
  const guestMenuRef = useRef(null);
  const roomMenuRef = useRef(null);
  const carTypeMenuRef = useRef(null);
  const activityMenuRef = useRef(null);
  const fromSuggestionsRef = useRef(null);
  const toSuggestionsRef = useRef(null);
  const locationSuggestionsRef = useRef(null);

  const inputBaseClass = "w-full rounded-lg px-4 py-3 border border-white/30 bg-white/90 text-blue-dark placeholder-gray-400 focus:border-orange-accent focus:outline-none focus:ring-2 focus:ring-orange-accent/20 transition";
  const selectBaseClass = "w-full rounded-lg px-4 py-3 border border-white/30 bg-white/90 text-blue-dark focus:border-orange-accent focus:outline-none focus:ring-2 focus:ring-orange-accent/20 transition appearance-none";
  const ghostButtonClass = "w-full rounded-lg px-4 py-3 border border-white/30 bg-white/90 text-blue-dark text-left hover:bg-white transition";

  // Popular destinations with estimated prices
  const popularDestinations = {
    flights: [
      { name: 'TP HCM - Hà Nội', from: 'TP HCM', to: 'Hà Nội', price: 896600, badge: 'Phổ biến' },
      { name: 'TP HCM - Đà Nẵng', from: 'TP HCM', to: 'Đà Nẵng', price: 680600, badge: 'Giá tốt' },
      { name: 'TP HCM - Phú Quốc', from: 'TP HCM', to: 'Phú Quốc', price: 680600, badge: 'Hot' },
      { name: 'Hà Nội - Nha Trang', from: 'Hà Nội', to: 'Nha Trang', price: 896600, badge: 'Phổ biến' },
    ],
    hotels: [
      { name: 'Đà Nẵng', location: 'Đà Nẵng', price: 500000, badge: 'Bãi biển đẹp' },
      { name: 'Nha Trang', location: 'Nha Trang', price: 600000, badge: 'Nhiều resort' },
      { name: 'Phú Quốc', location: 'Phú Quốc', price: 800000, badge: 'Thiên đường' },
      { name: 'Hà Nội', location: 'Hà Nội', price: 400000, badge: 'Trung tâm' },
    ],
    cars: [
      { name: 'TP HCM', location: 'TP HCM', price: 500000, badge: 'Nhiều lựa chọn' },
      { name: 'Hà Nội', location: 'Hà Nội', price: 450000, badge: 'Giá tốt' },
      { name: 'Đà Nẵng', location: 'Đà Nẵng', price: 400000, badge: 'Phổ biến' },
    ],
    activities: [
      { name: 'VinWonders Nha Trang', location: 'Nha Trang', price: 800000, badge: 'Hot' },
      { name: 'Bà Nà Hills', location: 'Đà Nẵng', price: 900000, badge: 'Nổi tiếng' },
      { name: 'Sun World Hạ Long', location: 'Hạ Long', price: 600000, badge: 'Độc đáo' },
    ]
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price || 0);
  };

  const calculateEstimatedPrice = () => {
    if (service === 'flights' && search.from && search.to) {
      // Tìm giá từ popularDestinations nếu có route khớp
      const matchedRoute = popularDestinations.flights.find(
        dest => dest.from === search.from && dest.to === search.to
      );
      const basePrice = matchedRoute ? matchedRoute.price : 800000;
      const classMultiplier = { economy: 1, premium: 1.3, business: 2, first: 3.5 };
      const passengerCount = search.passengers.adults + search.passengers.children * 0.7;
      const price = Math.round(basePrice * classMultiplier[search.class] * passengerCount);
      setEstimatedPrice(price);
    } else if (service === 'hotels' && search.from && search.date && search.time) {
      // Tìm giá từ popularDestinations nếu có location khớp
      const matchedLocation = popularDestinations.hotels.find(
        dest => dest.location === search.from
      );
      const basePricePerNight = matchedLocation ? matchedLocation.price : 500000;
      const nights = search.time && search.date ? Math.max(1, Math.ceil((new Date(search.time) - new Date(search.date)) / (1000 * 60 * 60 * 24))) : 1;
      const roomTypeMultiplier = { standard: 1, deluxe: 1.6, suite: 3, family: 2.4 };
      const price = Math.round(basePricePerNight * roomTypeMultiplier[search.roomType] * nights * search.rooms);
      setEstimatedPrice(price);
    } else if (service === 'cars' && search.pickupLocation && search.date && search.time) {
      // Tìm giá từ popularDestinations nếu có location khớp
      const matchedLocation = popularDestinations.cars.find(
        dest => dest.location === search.pickupLocation
      );
      const basePricePerDay = matchedLocation ? matchedLocation.price : 500000;
      const days = search.time && search.date ? Math.max(1, Math.ceil((new Date(search.time) - new Date(search.date)) / (1000 * 60 * 60 * 24))) : 1;
      const carTypeMultiplier = { economy: 0.8, compact: 1, suv: 1.6, luxury: 3, pickup: 1.8 };
      const price = Math.round(basePricePerDay * carTypeMultiplier[search.carType] * days);
      setEstimatedPrice(price);
    } else if (service === 'activities' && search.from) {
      // Tìm giá từ popularDestinations nếu có location khớp
      const matchedActivity = popularDestinations.activities.find(
        dest => dest.location === search.from
      );
      const basePricePerPerson = matchedActivity ? matchedActivity.price : 500000;
      const activityTypeMultiplier = { all: 1, adventure: 1.6, culture: 0.8, nature: 1.2, entertainment: 1.4, sports: 1.8 };
      const price = Math.round(basePricePerPerson * activityTypeMultiplier[search.activityType] * (search.participants.adults + search.participants.children * 0.5));
      setEstimatedPrice(price);
    } else {
      setEstimatedPrice(null);
    }
  };

  useEffect(() => {
    calculateEstimatedPrice();
  }, [search, service]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (passengerMenuRef.current && !passengerMenuRef.current.contains(event.target)) {
        setShowPassengerMenu(false);
      }
      if (classMenuRef.current && !classMenuRef.current.contains(event.target)) {
        setShowClassMenu(false);
      }
      if (guestMenuRef.current && !guestMenuRef.current.contains(event.target)) {
        setShowGuestMenu(false);
      }
      if (roomMenuRef.current && !roomMenuRef.current.contains(event.target)) {
        setShowRoomMenu(false);
      }
      if (carTypeMenuRef.current && !carTypeMenuRef.current.contains(event.target)) {
        setShowCarTypeMenu(false);
      }
      if (activityMenuRef.current && !activityMenuRef.current.contains(event.target)) {
        setShowActivityMenu(false);
      }
      if (fromSuggestionsRef.current && !fromSuggestionsRef.current.contains(event.target)) {
        setShowSuggestions(prev => ({ ...prev, from: false }));
      }
      if (toSuggestionsRef.current && !toSuggestionsRef.current.contains(event.target)) {
        setShowSuggestions(prev => ({ ...prev, to: false }));
      }
      if (locationSuggestionsRef.current && !locationSuggestionsRef.current.contains(event.target)) {
        setShowSuggestions(prev => ({ ...prev, location: false }));
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const updateGuests = (type, delta) => {
    setSearch(prev => ({
      ...prev,
      guests: {
        ...prev.guests,
        [type]: Math.max(0, prev.guests[type] + delta)
      }
    }));
  };

  const updateRooms = (delta) => {
    setSearch(prev => ({
      ...prev,
      rooms: Math.max(1, prev.rooms + delta)
    }));
  };

  const updateParticipants = (type, delta) => {
    setSearch(prev => ({
      ...prev,
      participants: {
        ...prev.participants,
        [type]: Math.max(0, prev.participants[type] + delta)
      }
    }));
  };

  const handleSearch = () => {
    if (service === 'hotels') navigate('/hotels');
    else if (service === 'flights') {
      navigate('/flights', {
        state: {
          from: search.from,
          to: search.to,
          date: search.date
        }
      });
    } else if (service === 'cars') navigate('/cars');
    else if (service === 'activities') navigate('/activities');
  };

  const updatePassengers = (type, delta) => {
    setSearch(prev => ({
      ...prev,
      passengers: {
        ...prev.passengers,
        [type]: Math.max(0, prev.passengers[type] + delta)
      }
    }));
  };

  return (
    <div className="relative w-full -mt-16 mb-20">
      <div className="relative h-[750px] overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920')] bg-cover bg-center" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(13, 71, 161, 0.45), rgba(13, 71, 161, 0.15), rgba(13, 71, 161, 0.55))' }} />

        <div className="relative z-10 h-full flex flex-col pt-16">
          <div className="flex-1 flex items-center justify-center px-4 pt-6">
            <div className="text-center text-white drop-shadow-lg mb-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Khám phá Việt Nam theo cách của bạn
              </h1>
            </div>
          </div>

          <div className="pb-8 px-4">
            <div className="max-w-6xl mx-auto">
              <div className="p-6 relative z-30 text-white">
                <div className="flex flex-wrap gap-2 mb-4 border-b border-white/30 pb-4">
                  {[
                    { id: 'hotels', label: 'Khách sạn', icon: HotelIcon },
                    { id: 'flights', label: 'Vé máy bay', icon: FlightIcon },
                    { id: 'cars', label: 'Cho thuê xe', icon: CarIcon },
                    { id: 'activities', label: 'Hoạt động & Vui chơi', icon: ActivityIcon }
                  ].map(s => {
                    const IconComponent = s.icon;
                    return (
                      <button
                        key={s.id}
                        onClick={() => setService(s.id)}
                        className={`px-5 py-2.5 rounded-lg flex items-center gap-2 transition font-medium ${service === s.id
                          ? 'bg-white/20 text-white font-semibold border border-white/60 shadow-md'
                          : 'text-white/70 hover:text-orange-accent hover:bg-white/10 border border-transparent'
                          }`}
                      >
                        <IconComponent className="w-5 h-5" />
                        <span>{s.label}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="min-h-[400px]">
                  {service === 'flights' ? (
                    <>
                      <div className="flex gap-2 mb-4">
                        <button
                          onClick={() => setSearch({ ...search, flightType: 'one-way' })}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${search.flightType === 'one-way'
                            ? 'text-white border shadow-md'
                            : 'bg-white border border-gray-200 hover:border-orange-accent hover:text-orange-accent'
                            }`}
                          style={search.flightType === 'one-way' ? { backgroundColor: '#0D47A1', borderColor: '#0D47A1', borderRadius: '8px' } : { borderRadius: '8px', color: '#212121' }}
                        >
                          Một chiều / Khứ hồi
                        </button>
                        <button
                          onClick={() => setSearch({ ...search, flightType: 'multi-city' })}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${search.flightType === 'multi-city'
                            ? 'text-white border shadow-md'
                            : 'bg-white border border-gray-200 hover:border-orange-accent hover:text-orange-accent'
                            }`}
                          style={search.flightType === 'multi-city' ? { backgroundColor: '#0D47A1', borderColor: '#0D47A1', borderRadius: '8px' } : { borderRadius: '8px', color: '#212121' }}
                        >
                          Nhiều thành phố
                        </button>
                      </div>
                      <div className="grid md:grid-cols-5 gap-3">
                        <div className="md:col-span-2 relative" ref={fromSuggestionsRef}>
                          <label className="block text-sm font-medium text-white/85 mb-1">Từ</label>
                          <input
                            type="text"
                            placeholder="Thành phố hoặc sân bay"
                            className={inputBaseClass}
                            value={search.from}
                            onChange={e => {
                              setSearch({ ...search, from: e.target.value });
                              setShowSuggestions({ ...showSuggestions, from: e.target.value.length > 0 });
                            }}
                            onFocus={() => setShowSuggestions({ ...showSuggestions, from: true })}
                          />
                          {showSuggestions.from && popularDestinations.flights.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-2xl z-50 max-h-60 overflow-y-auto">
                              {popularDestinations.flights.map((dest, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => {
                                    setSearch({ ...search, from: dest.from, to: dest.to });
                                    setShowSuggestions({ ...showSuggestions, from: false, to: false });
                                  }}
                                  className="w-full text-left px-4 py-3 hover:bg-orange-50 transition border-b last:border-b-0"
                                >
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <div className="font-medium text-gray-900">{dest.name}</div>
                                      <div className="text-xs text-gray-500">{dest.from} → {dest.to}</div>
                                    </div>
                                    <div className="text-right">
                                      <div className="text-orange-accent font-semibold">{formatPrice(dest.price)} VND</div>
                                      <span className="text-xs bg-orange-accent text-white px-2 py-0.5 rounded">{dest.badge}</span>
                                    </div>
                                  </div>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="md:col-span-2 relative" ref={toSuggestionsRef}>
                          <label className="block text-sm font-medium text-white/85 mb-1">Đến</label>
                          <input
                            type="text"
                            placeholder="Thành phố hoặc sân bay"
                            className={inputBaseClass}
                            value={search.to}
                            onChange={e => {
                              setSearch({ ...search, to: e.target.value });
                              setShowSuggestions({ ...showSuggestions, to: e.target.value.length > 0 });
                            }}
                            onFocus={() => setShowSuggestions({ ...showSuggestions, to: true })}
                          />
                          {showSuggestions.to && popularDestinations.flights.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-2xl z-50 max-h-60 overflow-y-auto">
                              {popularDestinations.flights.map((dest, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => {
                                    setSearch({ ...search, to: dest.to });
                                    setShowSuggestions({ ...showSuggestions, to: false });
                                  }}
                                  className="w-full text-left px-4 py-3 hover:bg-orange-50 transition border-b last:border-b-0"
                                >
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <div className="font-medium text-gray-900">{dest.to}</div>
                                      <div className="text-xs text-gray-500">Từ {dest.from}</div>
                                    </div>
                                    <div className="text-right">
                                      <div className="text-orange-accent font-semibold">{formatPrice(dest.price)} VND</div>
                                      <span className="text-xs bg-orange-accent text-white px-2 py-0.5 rounded">{dest.badge}</span>
                                    </div>
                                  </div>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="md:col-span-1">
                          <label className="block text-sm font-medium text-white/85 mb-1">Ngày khởi hành</label>
                          <input
                            type="date"
                            className={inputBaseClass}
                            value={search.date}
                            onChange={e => setSearch({ ...search, date: e.target.value })}
                          />
                        </div>
                        <div className="md:col-span-2 relative" ref={passengerMenuRef}>
                          <label className="block text-sm font-medium text-white/85 mb-1">Hành khách</label>
                          <button
                            onClick={() => setShowPassengerMenu(!showPassengerMenu)}
                            className={`${ghostButtonClass} whitespace-nowrap`}
                          >
                            {search.passengers.adults} Người lớn, {search.passengers.children} Trẻ em, {search.passengers.infants} Em bé
                          </button>
                          {showPassengerMenu && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-2xl p-4 z-40">
                              <div className="flex items-center justify-between mb-3">
                                <span className="text-sm font-semibold text-blue-dark">Người lớn</span>
                                <div className="flex items-center gap-3">
                                  <button onClick={() => updatePassengers('adults', -1)} className="w-8 h-8 rounded-full border border-orange-accent bg-orange-accent/10 text-orange-accent hover:bg-orange-accent/20 flex items-center justify-center transition">-</button>
                                  <span className="w-8 text-center text-blue-dark font-semibold">{search.passengers.adults}</span>
                                  <button onClick={() => updatePassengers('adults', 1)} className="w-8 h-8 rounded-full border border-orange-accent bg-orange-accent/10 text-orange-accent hover:bg-orange-accent/20 flex items-center justify-center transition">+</button>
                                </div>
                              </div>
                              <div className="flex items-center justify-between mb-3">
                                <span className="text-sm font-semibold text-blue-dark">Trẻ em</span>
                                <div className="flex items-center gap-3">
                                  <button onClick={() => updatePassengers('children', -1)} className="w-8 h-8 rounded-full border border-orange-accent bg-orange-accent/10 text-orange-accent hover:bg-orange-accent/20 flex items-center justify-center transition">-</button>
                                  <span className="w-8 text-center text-blue-dark font-semibold">{search.passengers.children}</span>
                                  <button onClick={() => updatePassengers('children', 1)} className="w-8 h-8 rounded-full border border-orange-accent bg-orange-accent/10 text-orange-accent hover:bg-orange-accent/20 flex items-center justify-center transition">+</button>
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold text-blue-dark">Em bé</span>
                                <div className="flex items-center gap-3">
                                  <button onClick={() => updatePassengers('infants', -1)} className="w-8 h-8 rounded-full border border-orange-accent bg-orange-accent/10 text-orange-accent hover:bg-orange-accent/20 flex items-center justify-center transition">-</button>
                                  <span className="w-8 text-center text-blue-dark font-semibold">{search.passengers.infants}</span>
                                  <button onClick={() => updatePassengers('infants', 1)} className="w-8 h-8 rounded-full border border-orange-accent bg-orange-accent/10 text-orange-accent hover:bg-orange-accent/20 flex items-center justify-center transition">+</button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="md:col-span-1 relative" ref={classMenuRef}>
                          <label className="block text-sm font-medium text-white/85 mb-1">Hạng</label>
                          <button
                            onClick={() => setShowClassMenu(!showClassMenu)}
                            className={ghostButtonClass}
                          >
                            {search.class === 'economy' ? 'Phổ thông' :
                              search.class === 'premium' ? 'Phổ thông đặc biệt' :
                                search.class === 'business' ? 'Thương gia' : 'Hạng nhất'}
                          </button>
                          {showClassMenu && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-2xl p-2 z-40">
                              {[
                                { value: 'economy', label: 'Phổ thông' },
                                { value: 'premium', label: 'Phổ thông đặc biệt' },
                                { value: 'business', label: 'Thương gia' },
                                { value: 'first', label: 'Hạng nhất' }
                              ].map(c => (
                                <button
                                  key={c.value}
                                  onClick={() => {
                                    setSearch({ ...search, class: c.value });
                                    setShowClassMenu(false);
                                  }}
                                  className={`w-full text-left px-4 py-2 rounded-lg hover:bg-orange-50 transition ${search.class === c.value ? 'bg-orange-accent/10 text-orange-accent font-semibold' : 'text-gray-700'
                                    }`}
                                >
                                  {c.label}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        {estimatedPrice && (
                          <div className="md:col-span-5 bg-white/10 border border-white/30 rounded-xl p-3 mb-3">
                            <div className="flex items-center justify-between text-white">
                              <div>
                                <div className="text-xs text-white/70 mb-1">Giá ước tính</div>
                                <div className="text-2xl font-bold text-white">{formatPrice(estimatedPrice)} VND</div>
                                <div className="text-xs text-white/70 mt-1">Cho {search.passengers.adults} người lớn, {search.passengers.children} trẻ em</div>
                              </div>
                              <div className="text-right">
                                <div className="text-xs bg-white/20 text-white px-3 py-1 rounded-full font-semibold mb-2">Giá tốt nhất</div>
                                <div className="text-xs text-white/60">Bao gồm thuế và phí</div>
                              </div>
                            </div>
                          </div>
                        )}
                        <div className="md:col-span-5 flex gap-3">
                          <button
                            onClick={handleSearch}
                            className="flex-1 rounded-lg text-white font-semibold py-4 px-6 transition text-lg shadow-xl hover:opacity-90"
                            style={{ backgroundColor: '#0D47A1', borderRadius: '8px' }}
                          >
                            Tìm kiếm
                          </button>
                          <button
                            onClick={() => navigate('/flight-ideas')}
                            className="px-6 py-4 border border-white/50 text-white rounded-lg transition shadow-md hover:opacity-90"
                            style={{ borderRadius: '8px' }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#FF6B35';
                              e.currentTarget.style.borderColor = '#FF6B35';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent';
                              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                            }}
                          >
                            Khám phá ý tưởng chuyến bay
                          </button>
                          <button
                            onClick={() => navigate('/price-alerts')}
                            className="px-6 py-4 border border-white/50 text-white rounded-lg transition shadow-md hover:opacity-90"
                            style={{ borderRadius: '8px' }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#FF6B35';
                              e.currentTarget.style.borderColor = '#FF6B35';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent';
                              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                            }}
                          >
                            Cảnh báo giá
                          </button>
                        </div>
                      </div>
                    </>
                  ) : service === 'hotels' ? (
                    <>
                      <div className="grid md:grid-cols-5 gap-3 mb-3">
                        <div className="md:col-span-2 relative" ref={locationSuggestionsRef}>
                          <label className="block text-sm font-medium text-white/85 mb-1">Địa điểm</label>
                          <input
                            type="text"
                            placeholder="Thành phố, địa điểm"
                            className={inputBaseClass}
                            value={search.from}
                            onChange={e => {
                              setSearch({ ...search, from: e.target.value });
                              setShowSuggestions({ ...showSuggestions, location: e.target.value.length > 0 });
                            }}
                            onFocus={() => setShowSuggestions({ ...showSuggestions, location: true })}
                          />
                          {showSuggestions.location && popularDestinations.hotels.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-2xl z-50 max-h-60 overflow-y-auto">
                              {popularDestinations.hotels.map((dest, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => {
                                    setSearch({ ...search, from: dest.location });
                                    setShowSuggestions({ ...showSuggestions, location: false });
                                  }}
                                  className="w-full text-left px-4 py-3 hover:bg-orange-50 transition border-b last:border-b-0"
                                >
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <div className="font-medium text-gray-900">{dest.name}</div>
                                      <div className="text-xs text-gray-500">{dest.location}</div>
                                    </div>
                                    <div className="text-right">
                                      <div className="text-orange-accent font-semibold">Từ {formatPrice(dest.price)}/đêm</div>
                                      <span className="text-xs bg-orange-accent text-white px-2 py-0.5 rounded">{dest.badge}</span>
                                    </div>
                                  </div>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="md:col-span-1">
                          <label className="block text-sm font-medium text-white/85 mb-1">Nhận phòng</label>
                          <input
                            type="date"
                            className="w-full rounded-lg px-4 py-3 border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:border-orange-accent focus:outline-none focus:ring-2 focus:ring-orange-accent/20 transition"
                            value={search.date}
                            onChange={e => setSearch({ ...search, date: e.target.value })}
                          />
                        </div>
                        <div className="md:col-span-1">
                          <label className="block text-sm font-medium text-white/85 mb-1">Trả phòng</label>
                          <input
                            type="date"
                            className="w-full rounded-lg px-4 py-3 border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:border-orange-accent focus:outline-none focus:ring-2 focus:ring-orange-accent/20 transition"
                            value={search.time}
                            onChange={e => setSearch({ ...search, time: e.target.value })}
                          />
                        </div>
                        <div className="md:col-span-1 relative" ref={guestMenuRef}>
                          <label className="block text-sm font-medium text-white/85 mb-1">Số khách</label>
                          <button
                            onClick={() => setShowGuestMenu(!showGuestMenu)}
                            className={ghostButtonClass}
                          >
                            {search.guests.adults} Người lớn, {search.guests.children} Trẻ em
                          </button>
                          {showGuestMenu && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-2xl p-4 z-40">
                              <div className="flex items-center justify-between mb-3">
                                <span className="text-sm font-semibold text-blue-dark">Người lớn</span>
                                <div className="flex items-center gap-3">
                                  <button onClick={() => updateGuests('adults', -1)} className="w-8 h-8 rounded-full border border-orange-accent bg-orange-accent/10 text-orange-accent hover:bg-orange-accent/20 flex items-center justify-center transition">-</button>
                                  <span className="w-8 text-center text-blue-dark font-semibold">{search.guests.adults}</span>
                                  <button onClick={() => updateGuests('adults', 1)} className="w-8 h-8 rounded-full border border-orange-accent bg-orange-accent/10 text-orange-accent hover:bg-orange-accent/20 flex items-center justify-center transition">+</button>
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold text-blue-dark">Trẻ em</span>
                                <div className="flex items-center gap-3">
                                  <button onClick={() => updateGuests('children', -1)} className="w-8 h-8 rounded-full border border-orange-accent bg-orange-accent/10 text-orange-accent hover:bg-orange-accent/20 flex items-center justify-center transition">-</button>
                                  <span className="w-8 text-center text-blue-dark font-semibold">{search.guests.children}</span>
                                  <button onClick={() => updateGuests('children', 1)} className="w-8 h-8 rounded-full border border-orange-accent bg-orange-accent/10 text-orange-accent hover:bg-orange-accent/20 flex items-center justify-center transition">+</button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="grid md:grid-cols-5 gap-3 mb-3">
                        <div className="md:col-span-1 relative" ref={roomMenuRef}>
                          <label className="block text-sm font-medium text-white/85 mb-1">Số phòng</label>
                          <button
                            onClick={() => setShowRoomMenu(!showRoomMenu)}
                            className={ghostButtonClass}
                          >
                            {search.rooms} Phòng
                          </button>
                          {showRoomMenu && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-2xl p-4 z-40">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold text-blue-dark">Số phòng</span>
                                <div className="flex items-center gap-3">
                                  <button onClick={() => updateRooms(-1)} className="w-8 h-8 rounded-full border border-orange-accent bg-orange-accent/10 text-orange-accent hover:bg-orange-accent/20 flex items-center justify-center transition">-</button>
                                  <span className="w-8 text-center text-blue-dark font-semibold">{search.rooms}</span>
                                  <button onClick={() => updateRooms(1)} className="w-8 h-8 rounded-full border border-orange-accent bg-orange-accent/10 text-orange-accent hover:bg-orange-accent/20 flex items-center justify-center transition">+</button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="md:col-span-1 relative">
                          <label className="block text-sm font-medium text-white/85 mb-1">Loại phòng</label>
                          <select
                            className={selectBaseClass}
                            value={search.roomType}
                            onChange={e => setSearch({ ...search, roomType: e.target.value })}
                          >
                            <option value="standard">Phòng tiêu chuẩn</option>
                            <option value="deluxe">Phòng deluxe</option>
                            <option value="suite">Suite</option>
                            <option value="family">Phòng gia đình</option>
                          </select>
                        </div>
                        <div className="md:col-span-1 relative">
                          <label className="block text-sm font-medium text-white/85 mb-1">Khoảng giá</label>
                          <select
                            className={selectBaseClass}
                            value={search.priceRange}
                            onChange={e => setSearch({ ...search, priceRange: e.target.value })}
                          >
                            <option value="all">Tất cả</option>
                            <option value="budget">Dưới 500k/đêm</option>
                            <option value="mid">500k - 1.5tr/đêm</option>
                            <option value="high">1.5tr - 3tr/đêm</option>
                            <option value="luxury">Trên 3tr/đêm</option>
                          </select>
                        </div>
                        <div className="md:col-span-1 relative">
                          <label className="block text-sm font-medium text-white/85 mb-1">Đánh giá tối thiểu</label>
                          <select
                            className={selectBaseClass}
                            value={search.minRating}
                            onChange={e => setSearch({ ...search, minRating: e.target.value })}
                          >
                            <option value="all">Tất cả</option>
                            <option value="3">Từ 3 sao</option>
                            <option value="4">Từ 4 sao</option>
                            <option value="5">5 sao</option>
                          </select>
                        </div>
                        <div className="md:col-span-1 flex items-end">
                          <button
                            onClick={handleSearch}
                            className="w-full bg-blue-dark hover:bg-blue-dark/90 text-white font-semibold py-3 px-4 rounded-lg transition shadow-lg"
                          >
                            Tìm kiếm
                          </button>
                        </div>
                      </div>
                      {estimatedPrice && (
                        <div className="mt-3 bg-white/10 border border-white/30 rounded-lg p-3">
                          <div className="flex items-center justify-between text-white">
                            <div>
                              <div className="text-xs text-white/70 mb-1">Giá ước tính cho {search.rooms} phòng</div>
                              <div className="text-2xl font-bold text-white">{formatPrice(estimatedPrice)} VND</div>
                              <div className="text-xs text-white/70 mt-1">
                                {search.time && search.date ?
                                  `${Math.ceil((new Date(search.time) - new Date(search.date)) / (1000 * 60 * 60 * 24))} đêm` :
                                  'Chọn ngày để xem giá'}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-xs bg-white/20 text-white px-3 py-1 rounded-full font-semibold mb-2">Giá tốt nhất</div>
                              <div className="text-xs text-white/60">Bao gồm thuế và phí</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  ) : service === 'cars' ? (
                    <>
                      <div className="grid md:grid-cols-5 gap-3 mb-3">
                        <div className="md:col-span-2 relative" ref={locationSuggestionsRef}>
                          <label className="block text-sm font-medium text-white/85 mb-1">Địa điểm nhận xe</label>
                          <input
                            type="text"
                            placeholder="Thành phố, địa điểm"
                            className="w-full rounded-lg px-4 py-3 border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:border-orange-accent focus:outline-none focus:ring-2 focus:ring-orange-accent/20 transition"
                            value={search.pickupLocation}
                            onChange={e => {
                              setSearch({ ...search, pickupLocation: e.target.value });
                              setShowSuggestions({ ...showSuggestions, location: e.target.value.length > 0 });
                            }}
                            onFocus={() => setShowSuggestions({ ...showSuggestions, location: true })}
                          />
                          {showSuggestions.location && popularDestinations.cars.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto">
                              {popularDestinations.cars.map((dest, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => {
                                    setSearch({ ...search, pickupLocation: dest.location, returnLocation: dest.location });
                                    setShowSuggestions({ ...showSuggestions, location: false });
                                  }}
                                  className="w-full text-left px-4 py-3 hover:bg-orange-50 transition border-b last:border-b-0"
                                >
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <div className="font-medium text-gray-900">{dest.name}</div>
                                      <div className="text-xs text-gray-500">{dest.location}</div>
                                    </div>
                                    <div className="text-right">
                                      <div className="text-orange-accent font-semibold">Từ {formatPrice(dest.price)}/ngày</div>
                                      <span className="text-xs bg-orange-accent text-white px-2 py-0.5 rounded">{dest.badge}</span>
                                    </div>
                                  </div>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-white/85 mb-1">Địa điểm trả xe</label>
                          <input
                            type="text"
                            placeholder="Thành phố, địa điểm"
                            className={inputBaseClass}
                            value={search.returnLocation}
                            onChange={e => setSearch({ ...search, returnLocation: e.target.value })}
                          />
                        </div>
                        <div className="md:col-span-1 relative" ref={carTypeMenuRef}>
                          <label className="block text-sm font-medium text-white/85 mb-1">Loại xe</label>
                          <button
                            onClick={() => setShowCarTypeMenu(!showCarTypeMenu)}
                            className={ghostButtonClass}
                          >
                            {search.carType === 'economy' ? 'Phổ thông' :
                              search.carType === 'compact' ? 'Gọn' :
                                search.carType === 'suv' ? 'SUV' :
                                  search.carType === 'luxury' ? 'Hạng sang' : 'Bán tải'}
                          </button>
                          {showCarTypeMenu && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-gray-200 rounded-lg shadow-xl p-2 z-40">
                              {[
                                { value: 'economy', label: 'Phổ thông' },
                                { value: 'compact', label: 'Gọn' },
                                { value: 'suv', label: 'SUV' },
                                { value: 'luxury', label: 'Hạng sang' },
                                { value: 'pickup', label: 'Bán tải' }
                              ].map(c => (
                                <button
                                  key={c.value}
                                  onClick={() => {
                                    setSearch({ ...search, carType: c.value });
                                    setShowCarTypeMenu(false);
                                  }}
                                  className={`w-full text-left px-4 py-2 rounded-lg hover:bg-orange-50 transition ${search.carType === c.value ? 'bg-orange-accent/10 text-orange-accent font-semibold' : ''
                                    }`}
                                >
                                  {c.label}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="grid md:grid-cols-5 gap-3 mb-3">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-white/85 mb-1">Ngày nhận xe</label>
                          <input
                            type="date"
                            className={inputBaseClass}
                            value={search.date}
                            onChange={e => setSearch({ ...search, date: e.target.value })}
                          />
                        </div>
                        <div className="md:col-span-1">
                          <label className="block text-sm font-medium text-white/85 mb-1">Giờ nhận xe</label>
                          <input
                            type="time"
                            className={inputBaseClass}
                            value={search.pickupTime}
                            onChange={e => setSearch({ ...search, pickupTime: e.target.value })}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-white/85 mb-1">Ngày trả xe</label>
                          <input
                            type="date"
                            className={inputBaseClass}
                            value={search.time}
                            onChange={e => setSearch({ ...search, time: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="grid md:grid-cols-5 gap-3">
                        <div className="md:col-span-1">
                          <label className="block text-sm font-medium text-white/85 mb-1">Giờ trả xe</label>
                          <input
                            type="time"
                            className={inputBaseClass}
                            value={search.returnTime}
                            onChange={e => setSearch({ ...search, returnTime: e.target.value })}
                          />
                        </div>
                        <div className="md:col-span-1 flex items-center">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={search.insurance}
                              onChange={e => setSearch({ ...search, insurance: e.target.checked })}
                              className="w-5 h-5 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm text-white/85">Bảo hiểm</span>
                          </label>
                        </div>
                        <div className="md:col-span-3 flex items-end">
                          <button
                            onClick={handleSearch}
                            className="w-full bg-blue-dark hover:bg-blue-dark/90 text-white font-semibold py-3 px-4 rounded-lg transition shadow-lg"
                          >
                            Tìm kiếm
                          </button>
                        </div>
                      </div>
                      {estimatedPrice && (
                        <div className="mt-3 bg-white/10 border border-white/30 rounded-lg p-3">
                          <div className="flex items-center justify-between text-white">
                            <div>
                              <div className="text-xs text-white/70 mb-1">Giá ước tính cho {search.carType === 'economy' ? 'xe phổ thông' : search.carType === 'suv' ? 'xe SUV' : 'xe hạng sang'}</div>
                              <div className="text-2xl font-bold text-white">{formatPrice(estimatedPrice)} VND</div>
                              <div className="text-xs text-white/70 mt-1">
                                {search.time && search.date ?
                                  `${Math.ceil((new Date(search.time) - new Date(search.date)) / (1000 * 60 * 60 * 24))} ngày` :
                                  'Chọn ngày để xem giá'}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-xs bg-white/20 text-white px-3 py-1 rounded-full font-semibold mb-2">Giá tốt nhất</div>
                              <div className="text-xs text-white/60">{search.insurance ? 'Có bảo hiểm' : 'Chưa có bảo hiểm'}</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="grid md:grid-cols-5 gap-3 mb-3">
                        <div className="md:col-span-2 relative" ref={locationSuggestionsRef}>
                          <label className="block text-sm font-medium text-white/85 mb-1">Địa điểm</label>
                          <input
                            type="text"
                            placeholder="Thành phố, địa điểm"
                            className={inputBaseClass}
                            value={search.from}
                            onChange={e => {
                              setSearch({ ...search, from: e.target.value });
                              setShowSuggestions({ ...showSuggestions, location: e.target.value.length > 0 });
                            }}
                            onFocus={() => setShowSuggestions({ ...showSuggestions, location: true })}
                          />
                          {showSuggestions.location && popularDestinations.activities.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-gray-200 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto">
                              {popularDestinations.activities.map((dest, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => {
                                    setSearch({ ...search, from: dest.location });
                                    setShowSuggestions({ ...showSuggestions, location: false });
                                  }}
                                  className="w-full text-left px-4 py-3 hover:bg-orange-50 transition border-b last:border-b-0"
                                >
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <div className="font-medium text-gray-900">{dest.name}</div>
                                      <div className="text-xs text-gray-500">{dest.location}</div>
                                    </div>
                                    <div className="text-right">
                                      <div className="text-orange-accent font-bold">Từ {formatPrice(dest.price)}</div>
                                      <span className="text-xs bg-orange-accent text-white px-2 py-0.5 rounded">{dest.badge}</span>
                                    </div>
                                  </div>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="md:col-span-1">
                          <label className="block text-sm font-medium text-white/85 mb-1">Ngày</label>
                          <input
                            type="date"
                            className={inputBaseClass}
                            value={search.date}
                            onChange={e => setSearch({ ...search, date: e.target.value })}
                          />
                        </div>
                        <div className="md:col-span-1 relative">
                          <label className="block text-sm font-medium text-white/85 mb-1">Loại hoạt động</label>
                          <select
                            className={selectBaseClass}
                            value={search.activityType}
                            onChange={e => setSearch({ ...search, activityType: e.target.value })}
                          >
                            <option value="all">Tất cả</option>
                            <option value="adventure">Phiêu lưu</option>
                            <option value="culture">Văn hóa</option>
                            <option value="nature">Thiên nhiên</option>
                            <option value="entertainment">Giải trí</option>
                            <option value="sports">Thể thao</option>
                          </select>
                        </div>
                        <div className="md:col-span-1 relative" ref={activityMenuRef}>
                          <label className="block text-sm font-medium text-white/85 mb-1">Số người</label>
                          <button
                            onClick={() => setShowActivityMenu(!showActivityMenu)}
                            className="w-full rounded-lg px-4 py-3 border border-white/30 bg-white/90 text-blue-dark text-left hover:bg-white transition"
                          >
                            {search.participants.adults} Người lớn, {search.participants.children} Trẻ em
                          </button>
                          {showActivityMenu && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-blue-200 rounded-xl shadow-2xl p-4 z-40">
                              <div className="flex items-center justify-between mb-3">
                                <span className="text-sm font-semibold text-blue-dark">Người lớn</span>
                                <div className="flex items-center gap-3">
                                  <button onClick={() => updateParticipants('adults', -1)} className="w-8 h-8 rounded-full border border-orange-accent bg-orange-accent/10 text-orange-accent hover:bg-orange-accent/20 flex items-center justify-center transition">-</button>
                                  <span className="w-8 text-center text-blue-dark font-semibold">{search.participants.adults}</span>
                                  <button onClick={() => updateParticipants('adults', 1)} className="w-8 h-8 rounded-full border border-orange-accent bg-orange-accent/10 text-orange-accent hover:bg-orange-accent/20 flex items-center justify-center transition">+</button>
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold text-blue-dark">Trẻ em</span>
                                <div className="flex items-center gap-3">
                                  <button onClick={() => updateParticipants('children', -1)} className="w-8 h-8 rounded-full border border-orange-accent bg-orange-accent/10 text-orange-accent hover:bg-orange-accent/20 flex items-center justify-center transition">-</button>
                                  <span className="w-8 text-center text-blue-dark font-semibold">{search.participants.children}</span>
                                  <button onClick={() => updateParticipants('children', 1)} className="w-8 h-8 rounded-full border border-orange-accent bg-orange-accent/10 text-orange-accent hover:bg-orange-accent/20 flex items-center justify-center transition">+</button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="grid md:grid-cols-5 gap-3 mb-3">
                        <div className="md:col-span-1 relative">
                          <label className="block text-sm font-medium text-white/85 mb-1">Thời lượng</label>
                          <select
                            className={selectBaseClass}
                            value={search.duration}
                            onChange={e => setSearch({ ...search, duration: e.target.value })}
                          >
                            <option value="all">Tất cả</option>
                            <option value="half-day">Nửa ngày</option>
                            <option value="full-day">Cả ngày</option>
                            <option value="multi-day">Nhiều ngày</option>
                          </select>
                        </div>
                        <div className="md:col-span-1 relative">
                          <label className="block text-sm font-medium text-white/85 mb-1">Khoảng giá</label>
                          <select
                            className={selectBaseClass}
                            value={search.priceRangeActivity}
                            onChange={e => setSearch({ ...search, priceRangeActivity: e.target.value })}
                          >
                            <option value="all">Tất cả</option>
                            <option value="budget">Dưới 200k</option>
                            <option value="mid">200k - 500k</option>
                            <option value="high">500k - 1tr</option>
                            <option value="premium">Trên 1tr</option>
                          </select>
                        </div>
                        <div className="md:col-span-1 relative">
                          <label className="block text-sm font-medium text-white/85 mb-1">Đánh giá tối thiểu</label>
                          <select
                            className={selectBaseClass}
                            value={search.minRatingActivity}
                            onChange={e => setSearch({ ...search, minRatingActivity: e.target.value })}
                          >
                            <option value="all">Tất cả</option>
                            <option value="3">Từ 3 sao</option>
                            <option value="4">Từ 4 sao</option>
                            <option value="5">5 sao</option>
                          </select>
                        </div>
                        <div className="md:col-span-2 flex items-end">
                          <button
                            onClick={handleSearch}
                            className="w-full bg-blue-dark hover:bg-blue-dark/90 text-white font-semibold py-3 px-4 rounded-lg transition shadow-lg"
                          >
                            Tìm kiếm
                          </button>
                        </div>
                      </div>
                      {estimatedPrice && (
                        <div className="mt-3 bg-white/10 border border-white/30 rounded-lg p-3">
                          <div className="flex items-center justify-between text-white">
                            <div>
                              <div className="text-xs text-white/70 mb-1">Giá ước tính cho {search.participants.adults} người lớn</div>
                              <div className="text-2xl font-bold text-white">{formatPrice(estimatedPrice)} VND</div>
                              <div className="text-xs text-white/70 mt-1">
                                {search.activityType !== 'all' ? `Loại: ${search.activityType === 'adventure' ? 'Phiêu lưu' : search.activityType === 'culture' ? 'Văn hóa' : search.activityType === 'nature' ? 'Thiên nhiên' : search.activityType === 'entertainment' ? 'Giải trí' : 'Thể thao'}` : 'Tất cả loại hoạt động'}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-xs bg-white/20 text-white px-3 py-1 rounded-full font-semibold mb-2">Giá tốt nhất</div>
                              <div className="text-xs text-white/60">Bao gồm thuế và phí</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

