// Sample hotels data (moved from HotelsPage.jsx)
export const sampleHotels = [
    {
        id: 1,
        name: 'Khách Sạn Grand Saigon',
        location: 'Quận 1, TP.HCM',
        price: 2500000,
        rating: 5,
        image_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
        description: 'Khách sạn 5 sao sang trọng tại trung tâm thành phố, với view đẹp và dịch vụ đẳng cấp quốc tế',
        amenities: ['Wifi miễn phí', 'Bể bơi', 'Spa', 'Nhà hàng', 'Fitness center', 'Parking'],
        rooms: 150,
        checkIn: '14:00',
        checkOut: '12:00',
        policies: {
            cancel: 'Miễn phí hủy trước 48 giờ',
            children: 'Trẻ em dưới 12 tuổi ở miễn phí',
            pets: 'Không cho phép thú cưng',
            smoking: 'Không hút thuốc'
        }
    },
    {
        id: 2,
        name: 'Resort Đà Lạt Premium',
        location: 'Đà Lạt, Lâm Đồng',
        price: 1800000,
        rating: 4,
        image_url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
        description: 'Resort nghỉ dưỡng cao cấp với view núi rừng, không gian yên tĩnh và không khí trong lành',
        amenities: ['Wifi miễn phí', 'Bể bơi', 'Spa', 'Nhà hàng', 'Golf', 'Parking'],
        rooms: 80,
        checkIn: '15:00',
        checkOut: '11:00',
        policies: {
            cancel: 'Miễn phí hủy trước 72 giờ',
            children: 'Trẻ em dưới 10 tuổi ở miễn phí',
            pets: 'Cho phép thú cưng (phí 200.000 VND/đêm)',
            smoking: 'Có khu vực hút thuốc'
        }
    },
    {
        id: 3,
        name: 'Boutique Hotel Hội An',
        location: 'Hội An, Quảng Nam',
        price: 1200000,
        rating: 4,
        image_url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
        description: 'Khách sạn boutique nhỏ xinh với kiến trúc cổ điển, gần phố cổ Hội An',
        amenities: ['Wifi miễn phí', 'Nhà hàng', 'Xe đạp miễn phí', 'Tour booking'],
        rooms: 25,
        checkIn: '14:00',
        checkOut: '12:00',
        policies: {
            cancel: 'Miễn phí hủy trước 24 giờ',
            children: 'Trẻ em dưới 6 tuổi ở miễn phí',
            pets: 'Không cho phép thú cưng',
            smoking: 'Không hút thuốc'
        }
    },
    {
        id: 4,
        name: 'Beach Resort Nha Trang',
        location: 'Nha Trang, Khánh Hòa',
        price: 2200000,
        rating: 5,
        image_url: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
        description: 'Resort bãi biển 5 sao với bãi biển riêng, view biển tuyệt đẹp và nhiều hoạt động giải trí',
        amenities: ['Wifi miễn phí', 'Bể bơi', 'Bãi biển riêng', 'Spa', 'Nhà hàng', 'Bar', 'Fitness center'],
        rooms: 200,
        checkIn: '15:00',
        checkOut: '12:00',
        policies: {
            cancel: 'Miễn phí hủy trước 48 giờ',
            children: 'Trẻ em dưới 12 tuổi ở miễn phí',
            pets: 'Không cho phép thú cưng',
            smoking: 'Có khu vực hút thuốc'
        }
    },
    {
        id: 5,
        name: 'City Hotel Hà Nội',
        location: 'Hoàn Kiếm, Hà Nội',
        price: 1500000,
        rating: 4,
        image_url: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800',
        description: 'Khách sạn 4 sao hiện đại tại trung tâm Hà Nội, gần các điểm tham quan nổi tiếng',
        amenities: ['Wifi miễn phí', 'Nhà hàng', 'Fitness center', 'Parking', 'Business center'],
        rooms: 100,
        checkIn: '14:00',
        checkOut: '12:00',
        policies: {
            cancel: 'Miễn phí hủy trước 24 giờ',
            children: 'Trẻ em dưới 10 tuổi ở miễn phí',
            pets: 'Không cho phép thú cưng',
            smoking: 'Không hút thuốc'
        }
    },
    {
        id: 6,
        name: 'Mountain Lodge Sapa',
        location: 'Sapa, Lào Cai',
        price: 1600000,
        rating: 4,
        image_url: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800',
        description: 'Lodge nghỉ dưỡng trên núi với view ruộng bậc thang, không gian ấm cúng và ẩm thực địa phương',
        amenities: ['Wifi miễn phí', 'Lò sưởi', 'Nhà hàng', 'Tour trekking', 'Parking'],
        rooms: 40,
        checkIn: '14:00',
        checkOut: '11:00',
        policies: {
            cancel: 'Miễn phí hủy trước 48 giờ',
            children: 'Trẻ em dưới 8 tuổi ở miễn phí',
            pets: 'Cho phép thú cưng (phí 150.000 VND/đêm)',
            smoking: 'Có khu vực hút thuốc'
        }
    },
    {
        id: 7,
        name: 'Luxury Hotel Đà Nẵng',
        location: 'Sơn Trà, Đà Nẵng',
        price: 2800000,
        rating: 5,
        image_url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
        description: 'Khách sạn 5 sao sang trọng với view biển, spa cao cấp và dịch vụ đẳng cấp',
        amenities: ['Wifi miễn phí', 'Bể bơi vô cực', 'Spa', 'Nhà hàng', 'Bar', 'Fitness center', 'Parking'],
        rooms: 180,
        checkIn: '15:00',
        checkOut: '12:00',
        policies: {
            cancel: 'Miễn phí hủy trước 72 giờ',
            children: 'Trẻ em dưới 12 tuổi ở miễn phí',
            pets: 'Không cho phép thú cưng',
            smoking: 'Không hút thuốc'
        }
    },
    {
        id: 8,
        name: 'Eco Lodge Cần Thơ',
        location: 'Cần Thơ',
        price: 900000,
        rating: 3,
        image_url: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
        description: 'Lodge sinh thái gần sông, trải nghiệm văn hóa miền Tây và ẩm thực địa phương',
        amenities: ['Wifi miễn phí', 'Tour sông nước', 'Nhà hàng', 'Xe đạp miễn phí'],
        rooms: 30,
        checkIn: '14:00',
        checkOut: '12:00',
        policies: {
            cancel: 'Miễn phí hủy trước 24 giờ',
            children: 'Trẻ em dưới 8 tuổi ở miễn phí',
            pets: 'Cho phép thú cưng',
            smoking: 'Có khu vực hút thuốc'
        }
    },
    {
        id: 9,
        name: 'Beachfront Hotel Phú Quốc',
        location: 'Phú Quốc, Kiên Giang',
        price: 3200000,
        rating: 5,
        image_url: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800',
        description: 'Resort bãi biển 5 sao với villa riêng, bãi biển tuyệt đẹp và nhiều hoạt động giải trí',
        amenities: ['Wifi miễn phí', 'Bể bơi', 'Bãi biển riêng', 'Spa', 'Nhà hàng', 'Bar', 'Fitness center', 'Diving center'],
        rooms: 120,
        checkIn: '15:00',
        checkOut: '12:00',
        policies: {
            cancel: 'Miễn phí hủy trước 72 giờ',
            children: 'Trẻ em dưới 12 tuổi ở miễn phí',
            pets: 'Không cho phép thú cưng',
            smoking: 'Không hút thuốc'
        }
    }
];

// Sample activities data (moved from ActivitiesPage.jsx)
export const sampleActivities = [
    {
        id: 1,
        name: 'Tour Tham Quan Phố Cổ Hà Nội',
        city: 'Hà Nội',
        price: 350000,
        image_url: 'https://images.unsplash.com/photo-1523059623039-a9ed027e7fad?w=800',
        description: 'Khám phá 36 phố phường cổ kính, thưởng thức ẩm thực đường phố và tìm hiểu văn hóa lịch sử Hà Nội',
        duration: '4 giờ',
        category: 'Văn hóa & Lịch sử',
        includes: ['Hướng dẫn viên chuyên nghiệp', 'Bảo hiểm du lịch', 'Nước uống'],
        meetingPoint: 'Nhà hát lớn Hà Nội, 1 Tràng Tiền, Hoàn Kiếm',
        policies: {
            cancel: 'Miễn phí hủy trước 48 giờ. Hủy trong vòng 48 giờ: phí 30% giá trị đơn hàng.',
            change: 'Có thể đổi ngày tham gia, vui lòng liên hệ trước ít nhất 24 giờ.',
            weather: 'Tour vẫn diễn ra trong điều kiện thời tiết nhẹ. Hủy miễn phí nếu thời tiết cực đoan.',
            children: 'Trẻ em dưới 5 tuổi miễn phí. Trẻ em 5-12 tuổi giảm 50%.'
        }
    },
    {
        id: 2,
        name: 'Tham Quan Vịnh Hạ Long',
        city: 'Quảng Ninh',
        price: 1200000,
        image_url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
        description: 'Trải nghiệm vẻ đẹp kỳ vĩ của Di sản Thế giới UNESCO, tham quan hang động và tắm biển',
        duration: '1 ngày',
        category: 'Thiên nhiên & Du lịch',
        includes: ['Tàu tham quan', 'Bữa trưa trên tàu', 'Hướng dẫn viên', 'Bảo hiểm'],
        meetingPoint: 'Bến tàu Tuần Châu, Hạ Long',
        policies: {
            cancel: 'Miễn phí hủy trước 72 giờ. Hủy trong vòng 72 giờ: phí 50% giá trị đơn hàng.',
            change: 'Có thể đổi ngày, vui lòng liên hệ trước 48 giờ.',
            weather: 'Tour có thể bị hủy do thời tiết, hoàn tiền 100% nếu hủy.',
            children: 'Trẻ em dưới 5 tuổi miễn phí. Trẻ em 5-10 tuổi giảm 30%.'
        }
    },
    {
        id: 3,
        name: 'Công Viên Nước Vinpearl',
        city: 'Nha Trang',
        price: 650000,
        image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
        description: 'Vui chơi tại công viên nước lớn nhất Việt Nam với hơn 20 trò chơi cảm giác mạnh',
        duration: 'Cả ngày',
        category: 'Giải trí & Vui chơi',
        includes: ['Vé vào cửa', 'Sử dụng tất cả trò chơi', 'Áo phao', 'Két đồ'],
        meetingPoint: 'Công viên Vinpearl, Đảo Hòn Tre, Nha Trang',
        policies: {
            cancel: 'Miễn phí hủy trước 24 giờ. Hủy trong vòng 24 giờ: không hoàn tiền.',
            change: 'Có thể đổi ngày, vui lòng liên hệ trước 12 giờ.',
            weather: 'Tour vẫn diễn ra trong mưa nhẹ. Hủy miễn phí nếu mưa to.',
            children: 'Trẻ em dưới 1m miễn phí. Trẻ em 1m-1.4m giảm 30%.'
        }
    },
    {
        id: 4,
        name: 'Show Diễn Nhạc Nước',
        city: 'Đà Nẵng',
        price: 200000,
        image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
        description: 'Xem show diễn nhạc nước đầy màu sắc tại Cầu Rồng, một trong những điểm đến nổi tiếng nhất Đà Nẵng',
        duration: '1 giờ',
        category: 'Giải trí & Vui chơi',
        includes: ['Vé xem show', 'Ghế ngồi VIP'],
        meetingPoint: 'Cầu Rồng, Đà Nẵng',
        policies: {
            cancel: 'Miễn phí hủy trước 2 giờ. Hủy trong vòng 2 giờ: không hoàn tiền.',
            change: 'Có thể đổi giờ xem, vui lòng liên hệ trước 1 giờ.',
            weather: 'Show có thể bị hủy do thời tiết, hoàn tiền 100% nếu hủy.',
            children: 'Trẻ em dưới 3 tuổi miễn phí.'
        }
    },
    {
        id: 5,
        name: 'Tour Tham Quan Chùa Một Cột',
        city: 'Hà Nội',
        price: 250000,
        image_url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
        description: 'Tham quan biểu tượng văn hóa nổi tiếng của Hà Nội và tìm hiểu lịch sử Phật giáo Việt Nam',
        duration: '2 giờ',
        category: 'Văn hóa & Lịch sử',
        includes: ['Hướng dẫn viên', 'Vé vào cửa', 'Nước uống'],
        meetingPoint: 'Chùa Một Cột, Đội Cấn, Ba Đình, Hà Nội',
        policies: {
            cancel: 'Miễn phí hủy trước 24 giờ.',
            change: 'Có thể đổi giờ, vui lòng liên hệ trước 12 giờ.',
            weather: 'Tour vẫn diễn ra trong mọi điều kiện thời tiết.',
            children: 'Trẻ em dưới 6 tuổi miễn phí.'
        }
    },
    {
        id: 6,
        name: 'Lặn Biển Ngắm San Hô',
        city: 'Phú Quốc',
        price: 850000,
        image_url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
        description: 'Trải nghiệm lặn biển ngắm san hô đầy màu sắc và các loài cá nhiệt đới',
        duration: 'Nửa ngày',
        category: 'Thể thao & Mạo hiểm',
        includes: ['Thiết bị lặn', 'Hướng dẫn viên chuyên nghiệp', 'Bảo hiểm', 'Bữa trưa'],
        meetingPoint: 'Bến tàu An Thới, Phú Quốc',
        policies: {
            cancel: 'Miễn phí hủy trước 48 giờ. Hủy trong vòng 48 giờ: phí 40% giá trị đơn hàng.',
            change: 'Có thể đổi ngày, vui lòng liên hệ trước 24 giờ.',
            weather: 'Tour có thể bị hủy do thời tiết, hoàn tiền 100% nếu hủy.',
            children: 'Trẻ em từ 10 tuổi trở lên mới được tham gia.'
        }
    },
    {
        id: 7,
        name: 'Tham Quan Làng Gốm Bát Tràng',
        city: 'Hà Nội',
        price: 300000,
        image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
        description: 'Tìm hiểu nghề làm gốm truyền thống, tự tay làm gốm và mua sắm đồ lưu niệm',
        duration: '3 giờ',
        category: 'Văn hóa & Lịch sử',
        includes: ['Hướng dẫn viên', 'Trải nghiệm làm gốm', 'Nước uống'],
        meetingPoint: 'Làng Gốm Bát Tràng, Gia Lâm, Hà Nội',
        policies: {
            cancel: 'Miễn phí hủy trước 24 giờ.',
            change: 'Có thể đổi giờ, vui lòng liên hệ trước 12 giờ.',
            weather: 'Tour vẫn diễn ra trong mọi điều kiện thời tiết.',
            children: 'Trẻ em dưới 5 tuổi miễn phí. Trẻ em 5-12 tuổi giảm 50%.'
        }
    },
    {
        id: 8,
        name: 'Công Viên Chủ Đề Sun World',
        city: 'Đà Nẵng',
        price: 750000,
        image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
        description: 'Vui chơi tại công viên giải trí lớn với các trò chơi cảm giác mạnh và show biểu diễn',
        duration: 'Cả ngày',
        category: 'Giải trí & Vui chơi',
        includes: ['Vé vào cửa', 'Sử dụng tất cả trò chơi', 'Show biểu diễn', 'Két đồ'],
        meetingPoint: 'Sun World Ba Na Hills, Đà Nẵng',
        policies: {
            cancel: 'Miễn phí hủy trước 48 giờ. Hủy trong vòng 48 giờ: phí 30% giá trị đơn hàng.',
            change: 'Có thể đổi ngày, vui lòng liên hệ trước 24 giờ.',
            weather: 'Tour vẫn diễn ra trong mưa nhẹ. Hủy miễn phí nếu thời tiết cực đoan.',
            children: 'Trẻ em dưới 1m miễn phí. Trẻ em 1m-1.4m giảm 30%.'
        }
    },
    {
        id: 9,
        name: 'Tour Ẩm Thực Đường Phố',
        city: 'Hồ Chí Minh',
        price: 450000,
        image_url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
        description: 'Khách sạn ẩm thực đường phố Sài Gòn với các món ăn địa phương nổi tiếng',
        duration: '3 giờ',
        category: 'Văn hóa & Lịch sử',
        includes: ['Hướng dẫn viên', 'Tất cả các món ăn', 'Nước uống', 'Bảo hiểm'],
        meetingPoint: 'Chợ Bến Thành, Quận 1, TP.HCM',
        policies: {
            cancel: 'Miễn phí hủy trước 12 giờ. Hủy trong vòng 12 giờ: không hoàn tiền.',
            change: 'Có thể đổi giờ, vui lòng liên hệ trước 6 giờ.',
            weather: 'Tour vẫn diễn ra trong mọi điều kiện thời tiết.',
            children: 'Trẻ em dưới 5 tuổi miễn phí. Trẻ em 5-12 tuổi giảm 50%.'
        }
    },
    {
        id: 10,
        name: 'Tham Quan Đảo Khỉ Cần Giờ',
        city: 'Hồ Chí Minh',
        price: 550000,
        image_url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
        description: 'Tham quan đảo khỉ, tìm hiểu về động vật hoang dã và thưởng thức hải sản tươi sống',
        duration: 'Nửa ngày',
        category: 'Thiên nhiên & Du lịch',
        includes: ['Tàu tham quan', 'Hướng dẫn viên', 'Bữa trưa hải sản', 'Bảo hiểm'],
        meetingPoint: 'Bến tàu Cần Giờ, TP.HCM',
        policies: {
            cancel: 'Miễn phí hủy trước 48 giờ. Hủy trong vòng 48 giờ: phí 30% giá trị đơn hàng.',
            change: 'Có thể đổi ngày, vui lòng liên hệ trước 24 giờ.',
            weather: 'Tour có thể bị hủy do thời tiết, hoàn tiền 100% nếu hủy.',
            children: 'Trẻ em dưới 5 tuổi miễn phí. Trẻ em 5-12 tuổi giảm 50%.'
        }
    },
    {
        id: 11,
        name: 'Xe Đạp Tham Quan Phố Cổ Hội An',
        city: 'Hội An',
        price: 200000,
        image_url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
        description: 'Đạp xe tham quan phố cổ Hội An, khám phá kiến trúc cổ và văn hóa địa phương',
        duration: '2 giờ',
        category: 'Thiên nhiên & Du lịch',
        includes: ['Xe đạp', 'Hướng dẫn viên', 'Nước uống', 'Bảo hiểm'],
        meetingPoint: 'Phố cổ Hội An, Quảng Nam',
        policies: {
            cancel: 'Miễn phí hủy trước 12 giờ.',
            change: 'Có thể đổi giờ, vui lòng liên hệ trước 6 giờ.',
            weather: 'Tour vẫn diễn ra trong mưa nhẹ. Hủy miễn phí nếu mưa to.',
            children: 'Trẻ em dưới 10 tuổi cần người lớn đi kèm.'
        }
    },
    {
        id: 12,
        name: 'Spa & Massage Thư Giãn',
        city: 'Đà Nẵng',
        price: 500000,
        image_url: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800',
        description: 'Thư giãn với dịch vụ spa và massage chuyên nghiệp, phục hồi năng lượng sau chuyến du lịch',
        duration: '2 giờ',
        category: 'Giải trí & Vui chơi',
        includes: ['Massage body', 'Tắm thảo dược', 'Trà thảo mộc', 'Phòng thay đồ'],
        meetingPoint: 'Spa & Wellness Center, Đà Nẵng',
        policies: {
            cancel: 'Miễn phí hủy trước 6 giờ. Hủy trong vòng 6 giờ: phí 50% giá trị đơn hàng.',
            change: 'Có thể đổi giờ, vui lòng liên hệ trước 3 giờ.',
            weather: 'Không ảnh hưởng bởi thời tiết.',
            children: 'Dịch vụ dành cho người từ 16 tuổi trở lên.'
        }
    }
];

// Sample flights data
export const sampleFlights = [
    {
        id: 1,
        airline: 'Vietnam Airlines',
        departure_city: 'TP HCM',
        arrival_city: 'Hà Nội',
        departure_time: '2023-12-25T08:00:00',
        arrival_time: '2023-12-25T10:10:00',
        price: 1500000,
        image_url: '/AirlineLogo/vietnam-airlines.png'
    },
    {
        id: 2,
        airline: 'VietJet Air',
        departure_city: 'Hà Nội',
        arrival_city: 'Đà Nẵng',
        departure_time: '2023-12-25T09:30:00',
        arrival_time: '2023-12-25T10:50:00',
        price: 850000,
        image_url: '/AirlineLogo/vietjet.png'
    },
    {
        id: 3,
        airline: 'Bamboo Airways',
        departure_city: 'TP HCM',
        arrival_city: 'Nha Trang',
        departure_time: '2023-12-26T07:15:00',
        arrival_time: '2023-12-26T08:25:00',
        price: 920000,
        image_url: '/AirlineLogo/bamboo.png'
    },
    {
        id: 4,
        airline: 'Jetstar Pacific',
        departure_city: 'TP HCM',
        arrival_city: 'Phú Quốc',
        departure_time: '2023-12-27T14:00:00',
        arrival_time: '2023-12-27T15:00:00',
        price: 780000,
        image_url: '/AirlineLogo/jetstar.png'
    },
    {
        id: 5,
        airline: 'Vietnam Airlines',
        departure_city: 'Cần Thơ',
        arrival_city: 'Hà Nội',
        departure_time: '2023-12-28T16:30:00',
        arrival_time: '2023-12-28T18:45:00',
        price: 1850000,
        image_url: '/AirlineLogo/vietnam-airlines.png'
    },
    {
        id: 6,
        airline: 'VietJet Air',
        departure_city: 'Hải Phòng',
        arrival_city: 'Đà Lạt',
        departure_time: '2023-12-29T11:00:00',
        arrival_time: '2023-12-29T12:50:00',
        price: 1100000,
        image_url: '/AirlineLogo/vietjet.png'
    }
];
