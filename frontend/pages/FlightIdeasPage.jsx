import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function FlightIdeasPage() {
  const navigate = useNavigate();
  const [budget, setBudget] = useState('');
  const [travelStyle, setTravelStyle] = useState('all');
  const [duration, setDuration] = useState('all');
  const [interests, setInterests] = useState([]);
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(false);

  // Dữ liệu mẫu các ý tưởng chuyến bay
  const allIdeas = [
    {
      id: 1,
      title: 'Hành trình miền Bắc cổ kính',
      route: 'TP HCM → Hà Nội → Sapa → Hạ Long',
      duration: '7 ngày 6 đêm',
      price: 3500000,
      description: 'Khám phá thủ đô nghìn năm văn hiến, vùng núi Tây Bắc hùng vĩ và vịnh Hạ Long kỳ vĩ',
      image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800',
      highlights: ['Phố cổ Hà Nội', 'Sapa mù sương', 'Vịnh Hạ Long', 'Ẩm thực miền Bắc'],
      bestTime: 'Tháng 9 - 11, 3 - 5',
      travelStyle: 'culture',
      interests: ['culture', 'nature', 'food']
    },
    {
      id: 2,
      title: 'Miền Trung di sản và biển xanh',
      route: 'TP HCM → Đà Nẵng → Hội An → Huế',
      duration: '5 ngày 4 đêm',
      price: 2800000,
      description: 'Kết hợp di sản văn hóa thế giới với những bãi biển đẹp nhất Việt Nam',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
      highlights: ['Phố cổ Hội An', 'Cố đô Huế', 'Bãi biển Mỹ Khê', 'Bà Nà Hills'],
      bestTime: 'Tháng 2 - 8',
      travelStyle: 'culture',
      interests: ['culture', 'beach', 'history']
    },
    {
      id: 3,
      title: 'Miền Nam sông nước miệt vườn',
      route: 'TP HCM → Cần Thơ → Phú Quốc',
      duration: '6 ngày 5 đêm',
      price: 3200000,
      description: 'Trải nghiệm văn hóa sông nước miền Tây và nghỉ dưỡng tại đảo ngọc Phú Quốc',
      image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800',
      highlights: ['Chợ nổi Cái Răng', 'Vườn trái cây', 'Bãi Sao Phú Quốc', 'VinWonders'],
      bestTime: 'Tháng 11 - 4',
      travelStyle: 'relax',
      interests: ['nature', 'beach', 'food']
    },
    {
      id: 4,
      title: 'Phiêu lưu Tây Nguyên',
      route: 'TP HCM → Đà Lạt → Buôn Ma Thuột',
      duration: '4 ngày 3 đêm',
      price: 2200000,
      description: 'Khám phá cao nguyên đầy nắng gió, văn hóa dân tộc và thiên nhiên hoang dã',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
      highlights: ['Đà Lạt mộng mơ', 'Cà phê Buôn Ma Thuột', 'Thác Dray Nur', 'Văn hóa Tây Nguyên'],
      bestTime: 'Tháng 12 - 3',
      travelStyle: 'adventure',
      interests: ['nature', 'adventure', 'culture']
    },
    {
      id: 5,
      title: 'Nha Trang - Vinpearl nghỉ dưỡng',
      route: 'TP HCM → Nha Trang',
      duration: '4 ngày 3 đêm',
      price: 2500000,
      description: 'Nghỉ dưỡng tại thành phố biển xinh đẹp với đầy đủ tiện ích giải trí',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
      highlights: ['VinWonders Nha Trang', 'Bãi biển Nha Trang', 'Tháp Bà Ponagar', 'Ẩm thực hải sản'],
      bestTime: 'Tháng 1 - 8',
      travelStyle: 'relax',
      interests: ['beach', 'entertainment', 'food']
    },
    {
      id: 6,
      title: 'Hành trình xuyên Việt',
      route: 'Hà Nội → Huế → Đà Nẵng → TP HCM',
      duration: '10 ngày 9 đêm',
      price: 5500000,
      description: 'Trải nghiệm trọn vẹn vẻ đẹp Việt Nam từ Bắc vào Nam',
      image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=800',
      highlights: ['Tất cả điểm đến nổi tiếng', 'Văn hóa đa dạng', 'Ẩm thực phong phú'],
      bestTime: 'Quanh năm',
      travelStyle: 'culture',
      interests: ['culture', 'nature', 'food', 'history']
    }
  ];

  useEffect(() => {
    filterIdeas();
  }, [budget, travelStyle, duration, interests]);

  const filterIdeas = () => {
    setLoading(true);
    let filtered = [...allIdeas];

    // Lọc theo ngân sách
    if (budget) {
      const budgetNum = parseInt(budget);
      filtered = filtered.filter(idea => idea.price <= budgetNum);
    }

    // Lọc theo phong cách du lịch
    if (travelStyle !== 'all') {
      filtered = filtered.filter(idea => idea.travelStyle === travelStyle);
    }

    // Lọc theo thời lượng
    if (duration !== 'all') {
      filtered = filtered.filter(idea => {
        // Extract number of days from duration string (e.g., "7 ngày 6 đêm" -> 7)
        const daysMatch = idea.duration.match(/(\d+)\s*ngày/);
        const days = daysMatch ? parseInt(daysMatch[1]) : 0;
        
        if (duration === 'short') return days <= 4;
        if (duration === 'medium') return days > 4 && days <= 7;
        if (duration === 'long') return days > 7;
        return true;
      });
    }

    // Lọc theo sở thích
    if (interests.length > 0) {
      filtered = filtered.filter(idea => 
        interests.some(interest => idea.interests.includes(interest))
      );
    }

    setIdeas(filtered);
    setTimeout(() => setLoading(false), 300);
  };

  const toggleInterest = (interest) => {
    setInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  const interestLabels = {
    'culture': 'Văn hóa',
    'nature': 'Thiên nhiên',
    'beach': 'Biển',
    'food': 'Ẩm thực',
    'adventure': 'Phiêu lưu',
    'history': 'Lịch sử',
    'entertainment': 'Giải trí'
  };

  const travelStyleLabels = {
    'all': 'Tất cả',
    'culture': 'Văn hóa',
    'relax': 'Nghỉ dưỡng',
    'adventure': 'Phiêu lưu'
  };

  return (
    <div className="max-w-7xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-blue-900 mb-3">Khám phá ý tưởng chuyến bay</h1>
        <p className="text-gray-600 text-lg">
          Tìm kiếm cảm hứng cho chuyến du lịch tiếp theo của bạn. Chúng tôi sẽ gợi ý những hành trình tuyệt vời 
          dựa trên ngân sách, sở thích và phong cách du lịch của bạn.
        </p>
      </div>

      {/* Bộ lọc */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Tùy chỉnh tìm kiếm</h2>
        
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ngân sách tối đa (VND)
            </label>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="5,000,000"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phong cách du lịch
            </label>
            <select
              value={travelStyle}
              onChange={(e) => setTravelStyle(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {Object.entries(travelStyleLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Thời lượng
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Tất cả</option>
              <option value="short">Ngắn (≤4 ngày)</option>
              <option value="medium">Trung bình (5-7 ngày)</option>
              <option value="long">Dài (≥8 ngày)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Sở thích (chọn nhiều)
          </label>
          <div className="flex flex-wrap gap-2">
            {Object.entries(interestLabels).map(([value, label]) => (
              <button
                key={value}
                onClick={() => toggleInterest(value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  interests.includes(value)
                    ? 'text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                style={interests.includes(value) ? { backgroundColor: '#FF6B35' } : {}}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Kết quả */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {loading ? 'Đang tìm kiếm...' : `Tìm thấy ${ideas.length} ý tưởng`}
          </h2>
          {(budget || travelStyle !== 'all' || duration !== 'all' || interests.length > 0) && (
            <button
              onClick={() => {
                setBudget('');
                setTravelStyle('all');
                setDuration('all');
                setInterests([]);
              }}
              className="text-orange-600 hover:text-orange-700 font-medium"
            >
              Xóa bộ lọc
            </button>
          )}
        </div>

        {ideas.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-lg">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-600 text-lg mb-2">Không tìm thấy ý tưởng phù hợp</p>
            <p className="text-gray-500">Thử điều chỉnh bộ lọc để xem thêm kết quả</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ideas.map((idea) => (
              <div
                key={idea.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition cursor-pointer flex flex-col h-full"
                onClick={() => navigate('/flights', { state: { from: idea.route.split(' → ')[0], to: idea.route.split(' → ')[1] } })}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={idea.image}
                    alt={idea.title}
                    className="w-full h-full object-cover hover:scale-110 transition duration-300"
                  />
                  <div className="absolute top-3 right-3">
                    <span className="text-white px-3 py-1 rounded-full text-sm font-semibold" style={{ backgroundColor: '#FF6B35' }}>
                      {formatPrice(idea.price)} VND
                    </span>
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{idea.title}</h3>
                  <p className="text-sm text-blue-600 font-medium mb-2">✈️ {idea.route}</p>
                  <p className="text-sm text-gray-600 mb-3">{idea.description}</p>
                  
                  <div className="mb-3">
                    <p className="text-xs text-gray-500 mb-1">Thời lượng: {idea.duration}</p>
                    <p className="text-xs text-gray-500">Thời điểm tốt nhất: {idea.bestTime}</p>
                  </div>

                  <div className="mb-4 flex-1">
                    <p className="text-xs font-semibold text-gray-700 mb-2">Điểm nổi bật:</p>
                    <div className="flex flex-wrap gap-1">
                      {idea.highlights.slice(0, 3).map((highlight, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate('/flights', { 
                        state: { 
                          from: idea.route.split(' → ')[0], 
                          to: idea.route.split(' → ')[1] 
                        } 
                      });
                    }}
                    className="w-full text-white py-2 rounded-lg font-semibold transition mt-auto"
                    style={{ backgroundColor: '#FF6B35' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FF8C42'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FF6B35'}
                  >
                    Xem chuyến bay
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

