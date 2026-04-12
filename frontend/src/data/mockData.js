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
        location: 'Hoàn Kiếm, Hà Nội',
        price: 350000,
        image_url: 'https://images.unsplash.com/photo-1523059623039-a9ed027e7fad?w=800',
        description: 'Khám phá 36 phố phường cổ kính, thưởng thức ẩm thực đường phố và tìm hiểu văn hóa lịch sử Hà Nội. Tour dành cho những ai yêu thích khám phá văn hóa và ẩm thực địa phương.',
        duration: '4 giờ',
        category: 'Văn hóa & Lịch sử',
        includes: ['Hướng dẫn viên chuyên nghiệp', 'Bảo hiểm du lịch', 'Nước uống', 'Ẩm thực thử nếm'],
        meeting_point: 'Nhà hát lớn Hà Nội, 1 Tràng Tiền, Hoàn Kiếm',
        itinerary: [
            { day: '1', title: 'Khởi hành & Hồ Hoàn Kiếm', description: 'Tập trung và bắt đầu khám phá', activities: ['Gặp mặt tại Nhà hát Lớn', 'Đi bộ quanh Hồ Hoàn Kiếm', 'Thăm Tháp Rùa và Đền Ngọc Sơn'] },
            { day: '2', title: 'Phố cổ 36 phường', description: 'Khám phá các con phố cổ', activities: ['Dạo phố Hàng Gai, Hàng Đào', 'Xem nghề thủ công truyền thống', 'Thưởng thức chả cá Lã Vọng'] },
            { day: '3', title: 'Ẩm thực đường phố', description: 'Trải nghiệm ẩm thực đặc sắc', activities: ['Thử phở bò Hà Nội', 'Ăn bún chả Obama', 'Thưởng thức cà phê trứng phố cổ'] },
            { day: '4', title: 'Đền Quán Thánh & Kết thúc', description: 'Tham quan di tích cuối và chia tay', activities: ['Thăm Đền Quán Thánh', 'Chụp ảnh lưu niệm', 'Chia tay tại điểm xuất phát'] }
        ],
        price_packages: [
            { name: 'Cơ bản', price: 350000, min_people: 1, max_people: 10, includes: ['Hướng dẫn viên', 'Bảo hiểm', 'Nước uống'] },
            { name: 'Tiêu chuẩn', price: 450000, min_people: 1, max_people: 10, includes: ['Hướng dẫn viên', 'Bảo hiểm', 'Nước uống', 'Ẩm thực thử nếm', 'Taxi về'] },
            { name: 'VIP', price: 650000, min_people: 1, max_people: 6, includes: ['Hướng dẫn viên riêng', 'Bảo hiểm', 'Bữa tối nhà hàng', 'Taxi cả ngày', 'Quà lưu niệm'] }
        ],
        policies: {
            cancel: 'Miễn phí hủy trước 48 giờ. Hủy trong vòng 48 giờ: phí 30% giá trị đơn hàng.',
            change: 'Có thể đổi ngày tham gia, vui lòng liên hệ trước ít nhất 24 giờ.',
            weather: 'Tour vẫn diễn ra trong điều kiện thời tiết nhẹ. Hủy miễn phí nếu thời tiết cực đoan.',
            children: 'Trẻ em dưới 5 tuổi miễn phí. Trẻ em 5-12 tuổi giảm 50%.'
        },
        terms: `1. Khách hàng cần có mặt tại điểm hẹn trước 15 phút để làm thủ tục.
2. Vui lòng mang theo CMND/CCCD hoặc hộ chiếu khi tham gia tour.
3. Tour không bao gồm chi phí cá nhân (mua sắm, ăn uống ngoài thực đơn).
4. Jurni có quyền thay đổi lịch trình trong trường hợp bất khả kháng.
5. Không mang theo thú nuôi trên tour.`,
        notes: 'Nên mặc quần áo thoải mái và đi giày bằng phẳng. Mang theo ô/áo mưa phòng khi trời mưa. Máy ảnh được phép sử dụng tại tất cả điểm tham quan.'
    },
    {
        id: 2,
        name: 'Tham Quan Vịnh Hạ Long',
        city: 'Quảng Ninh',
        location: 'Hạ Long, Quảng Ninh',
        price: 1200000,
        image_url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
        description: 'Trải nghiệm vẻ đẹp kỳ vĩ của Di sản Thế giới UNESCO với hàng nghìn đảo đá vôi, tham quan hang động huyền bí và tắm biển tuyệt vời.',
        duration: '1 ngày',
        category: 'Thiên nhiên & Du lịch',
        includes: ['Tàu tham quan có máy lạnh', 'Bữa trưa trên tàu', 'Hướng dẫn viên', 'Bảo hiểm', 'Phao cứu sinh', 'Nước uống'],
        meeting_point: 'Bến tàu Tuần Châu, Hạ Long, Quảng Ninh',
        itinerary: [
            { day: '7:30', title: 'Khởi hành từ bến Tuần Châu', description: 'Lên tàu và ra khơi', activities: ['Check-in tàu du lịch', 'Giới thiệu lịch trình và an toàn', 'Ngắm cảnh vịnh khi tàu chạy'] },
            { day: '9:00', title: 'Tham quan Hang Sửng Sốt', description: 'Hang động lớn nhất vịnh Hạ Long', activities: ['Đi bộ khám phá hang', 'Ngắm nhũ đá đẹp kỳ ảo', 'Chụp ảnh lưu niệm'] },
            { day: '11:00', title: 'Bơi & Chèo Kayak', description: 'Hoạt động dưới nước', activities: ['Tắm biển tại bãi tắm', 'Chèo kayak khám phá hang động', 'Câu cá giải trí'] },
            { day: '12:30', title: 'Bữa trưa trên tàu', description: 'Thưởng thức hải sản tươi', activities: ['Hải sản tươi sống', 'Đặc sản miền biển', 'Nghỉ ngơi'] },
            { day: '14:00', title: 'Tham quan Đảo Ti Tốp', description: 'Đảo nhỏ xinh đẹp', activities: ['Leo lên đỉnh đảo ngắm toàn cảnh', 'Tắm biển bãi Ti Tốp', 'Quay về bến'] }
        ],
        price_packages: [
            { name: 'Nhóm nhỏ (1-4 người)', price: 1200000, min_people: 1, max_people: 4, includes: ['Tàu nhỏ', 'Bữa trưa', 'Kayak 1 giờ', 'Bảo hiểm'] },
            { name: 'Nhóm gia đình (5-10 người)', price: 1050000, min_people: 5, max_people: 10, includes: ['Tàu lớn', 'Bữa trưa hải sản', 'Kayak 2 giờ', 'Bảo hiểm', 'Đồ uống tự do'] },
            { name: 'Đoàn lớn (11+ người)', price: 890000, min_people: 11, max_people: 50, includes: ['Tàu charter riêng', 'BBQ trên tàu', 'Kayak không giới hạn', 'Bảo hiểm', 'Đồ uống', 'Quà lưu niệm'] }
        ],
        policies: {
            cancel: 'Miễn phí hủy trước 72 giờ. Hủy trong vòng 72 giờ: phí 50% giá trị đơn hàng.',
            change: 'Có thể đổi ngày, vui lòng liên hệ trước 48 giờ.',
            weather: 'Tour có thể bị hủy do thời tiết hoặc cảnh báo biển động, hoàn tiền 100% nếu hủy.',
            children: 'Trẻ em dưới 5 tuổi miễn phí. Trẻ em 5-10 tuổi giảm 30%.'
        },
        terms: `1. Khách hàng cần có mặt tại bến tàu trước 30 phút.
2. Mang theo đồ bơi, kem chống nắng và thuốc say sóng (nếu cần).
3. Trẻ em phải mặc áo phao khi tắm biển và chèo kayak.
4. Không mang đồ uống có cồn lên tàu (trừ khi đã bao gồm trong gói).
5. Bảo vệ môi trường: không xả rác xuống biển.`,
        notes: 'Nên mang theo: kem chống nắng SPF50+, kính mắt, mũ, thuốc say sóng, quần áo thay. Thời điểm đẹp nhất: tháng 10 – tháng 4 năm sau.'
    },
    {
        id: 3,
        name: 'Công Viên Nước Vinpearl',
        city: 'Nha Trang',
        location: 'Đảo Hòn Tre, Nha Trang, Khánh Hòa',
        price: 650000,
        image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
        description: 'Vui chơi tại công viên nước lớn nhất Việt Nam với hơn 20 trò chơi cảm giác mạnh, máng trượt gia đình và khu spa nước khoáng thiên nhiên.',
        duration: 'Cả ngày (8:30 - 18:00)',
        category: 'Giải trí & Vui chơi',
        includes: ['Vé vào cửa Vinpearl Land', 'Cáp treo ra đảo', 'Sử dụng tất cả trò chơi', 'Áo phao', 'Két đồ miễn phí'],
        meeting_point: 'Cổng cáp treo Vinpearl, 90 Trần Phú, Nha Trang',
        itinerary: [
            { day: '8:30', title: 'Đến cổng & cáp treo', description: 'Bắt đầu hành trình ra đảo', activities: ['Mua vé và check-in', 'Ngồi cáp treo ngắm biển', 'Khám phá bản đồ công viên'] },
            { day: '9:00', title: 'Khu Công Viên Nước', description: 'Trượt và bơi các máng', activities: ['Máng trượt xoắn ốc tốc độ cao', 'Sóng nhân tạo', 'Lazy river thư giãn', 'Hồ bơi gia đình'] },
            { day: '12:00', title: 'Nghỉ trưa & ăn uống', description: 'Nạp năng lượng', activities: ['Nhà hàng buffet tại công viên', 'Nghỉ ngơi trong nhà', 'Thưởng thức đồ uống tropical'] },
            { day: '13:30', title: 'Khu Vui Chơi Giải Trí', description: 'Trò chơi điện tử và show', activities: ['Khu game điện tử', 'Show biểu diễn', 'Vườn thú & Thuỷ cung'] },
            { day: '16:00', title: 'Khu Spa Nước Khoáng', description: 'Thư giãn cuối ngày', activities: ['Ngâm mình nước khoáng nóng', 'Massage vòi rồng', 'Chuẩn bị về'] }
        ],
        price_packages: [
            { name: 'Người lớn', price: 650000, min_people: 1, max_people: 99, includes: ['Vé cáp treo', 'Tất cả trò chơi', 'Áo phao', 'Két đồ'] },
            { name: 'Trẻ em (1m–1.4m)', price: 500000, min_people: 1, max_people: 99, includes: ['Vé cáp treo', 'Trò chơi phù hợp', 'Áo phao', 'Két đồ'] },
            { name: 'Gia đình (2 người lớn + 2 trẻ em)', price: 2200000, min_people: 4, max_people: 4, includes: ['Vé cáp treo cho 4 người', 'Tất cả trò chơi', 'Bữa trưa buffet', 'Áo phao', 'Két đồ'] }
        ],
        policies: {
            cancel: 'Miễn phí hủy trước 24 giờ. Hủy trong vòng 24 giờ: không hoàn tiền.',
            change: 'Có thể đổi ngày, vui lòng liên hệ trước 12 giờ.',
            weather: 'Tour vẫn diễn ra trong mưa nhẹ. Hủy miễn phí nếu mưa to hoặc có cảnh báo bão.',
            children: 'Trẻ em dưới 1m miễn phí. Trẻ em 1m-1.4m giảm giá theo gói trẻ em.'
        },
        terms: `1. Vé không được hoàn tiền hoặc chuyển nhượng sau khi sử dụng.
2. Khách hàng tự chịu trách nhiệm về trang sức và đồ vật cá nhân.
3. Không được mang đồ ăn từ bên ngoài vào khu vực ăn uống.
4. Tuân thủ quy định an toàn tại từng trò chơi.
5. Trẻ em phải có người lớn giám sát tại tất cả khu nước sâu.`,
        notes: 'Mang theo: đồ bơi, khăn tắm, kem chống nắng, kính mắt (không gọng kim loại). Sandal được phép mang vào bãi cát nhưng không vào hồ bơi.'
    },
    {
        id: 4,
        name: 'Show Diễn Nhạc Nước Cầu Rồng',
        city: 'Đà Nẵng',
        location: 'Cầu Rồng, Đà Nẵng',
        price: 200000,
        image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
        description: 'Tận hưởng màn biểu diễn nhạc nước và phun lửa mãn nhãn ngay tại Cầu Rồng huyền thoại – biểu tượng của thành phố Đà Nẵng.',
        duration: '1 giờ (21:00 – 22:00)',
        category: 'Giải trí & Vui chơi',
        includes: ['Vé xem show', 'Ghế ngồi VIP có view đẹp', 'Nước uống khai vị'],
        meeting_point: 'Khu VIP khán đài Cầu Rồng, 02 Nguyễn Văn Linh, Đà Nẵng',
        itinerary: [
            { day: '20:30', title: 'Vào chỗ ngồi & chuẩn bị', description: 'Sắp xếp chỗ ngồi VIP', activities: ['Check-in tại quầy', 'Nhận nước uống khai vị', 'Ngắm Cầu Rồng buổi tối'] },
            { day: '21:00', title: 'Show nhạc nước bắt đầu', description: 'Phần 1: Nhạc nước đầy màu sắc', activities: ['Vòi nước nghệ thuật theo nhạc', 'Ánh đèn LED nhiều màu', 'Âm nhạc dân tộc kết hợp hiện đại'] },
            { day: '21:30', title: 'Rồng phun lửa & nước', description: 'Điểm nhấn của chương trình', activities: ['Màn phun lửa spectaculaire', 'Phun nước hàng chục mét', 'Khoảnh khắc chụp ảnh đẹp nhất'] },
            { day: '22:00', title: 'Kết thúc & chụp ảnh', description: 'Giao lưu và lưu niệm', activities: ['Chụp ảnh với Cầu Rồng', 'Dạo phố bờ sông Hàn', 'Kết thúc chương trình'] }
        ],
        price_packages: [
            { name: 'Ghế thường', price: 150000, min_people: 1, max_people: 99, includes: ['Vé xem show', 'Chỗ đứng/ghế thường'] },
            { name: 'Ghế VIP', price: 200000, min_people: 1, max_people: 50, includes: ['Ghế VIP có view tốt nhất', 'Nước uống khai vị'] },
            { name: 'Gói đôi lãng mạn', price: 450000, min_people: 2, max_people: 2, includes: ['2 Ghế VIP hàng đầu', '2 nước uống', 'Hoa hồng tặng kèm', 'Chụp ảnh kỷ niệm'] }
        ],
        policies: {
            cancel: 'Miễn phí hủy trước 2 giờ trước show. Hủy trong vòng 2 giờ: không hoàn tiền.',
            change: 'Có thể đổi ngày xem, vui lòng liên hệ trước ít nhất 1 ngày.',
            weather: 'Show có thể bị hủy do thời tiết xấu hoặc gió mạnh, hoàn tiền 100% nếu hủy.',
            children: 'Trẻ em dưới 3 tuổi miễn phí (không có ghế riêng). Trẻ từ 3 tuổi mua vé bình thường.'
        },
        terms: `1. Vé chỉ có giá trị cho đúng ngày và giờ đã đặt.
2. Không hoàn tiền sau khi show đã bắt đầu.
3. Giữ trật tự và không gây ồn trong khi biểu diễn.
4. Không sử dụng đèn flash mạnh khi chụp ảnh.
5. Show diễn vào 21:00 thứ 7 và Chủ nhật hàng tuần.`,
        notes: 'Show diễn vào tối thứ 7 và Chủ nhật. Đến sớm ít nhất 30 phút để chọn góc chụp đẹp. Mang thêm áo khoác nếu đi vào mùa đông Đà Nẵng.'
    },
    {
        id: 5,
        name: 'Tour Tham Quan Chùa Một Cột',
        city: 'Hà Nội',
        location: 'Ba Đình, Hà Nội',
        price: 250000,
        image_url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
        description: 'Tham quan biểu tượng văn hóa nổi tiếng của Hà Nội và tìm hiểu lịch sử Phật giáo Việt Nam qua nhiều thế kỷ.',
        duration: '2 giờ',
        category: 'Văn hóa & Lịch sử',
        includes: ['Hướng dẫn viên am hiểu lịch sử', 'Vé vào cửa', 'Nước uống'],
        meeting_point: 'Cổng chính Chùa Một Cột, Đội Cấn, Ba Đình, Hà Nội',
        itinerary: [
            { day: '1', title: 'Tham quan Chùa Một Cột', description: 'Khám phá kiến trúc độc đáo', activities: ['Nghe lịch sử xây dựng chùa từ thế kỷ 11', 'Chiêm bái Phật Quan Âm', 'Tìm hiểu kiến trúc đặc trưng', 'Chụp ảnh với kiến trúc trên trụ đá'] },
            { day: '2', title: 'Lăng Hồ Chí Minh & Bảo tàng', description: 'Di tích lịch sử cận đại', activities: ['Thăm Bảo tàng Hồ Chí Minh', 'Ngắm Lăng từ bên ngoài', 'Tham quan Quảng trường Ba Đình', 'Kết thúc hành trình'] }
        ],
        price_packages: [
            { name: 'Cá nhân', price: 250000, min_people: 1, max_people: 5, includes: ['Hướng dẫn viên', 'Vé tham quan', 'Nước uống'] },
            { name: 'Nhóm (6-15 người)', price: 200000, min_people: 6, max_people: 15, includes: ['Hướng dẫn viên nhóm', 'Vé tham quan', 'Nước uống', 'Tai nghe HDV'] }
        ],
        policies: {
            cancel: 'Miễn phí hủy trước 24 giờ. Không hoàn tiền nếu hủy muộn hơn.',
            change: 'Có thể đổi giờ tham quan, vui lòng liên hệ trước 12 giờ.',
            weather: 'Tour vẫn diễn ra trong mọi điều kiện thời tiết. Mang áo mưa nếu cần.',
            children: 'Trẻ em dưới 6 tuổi miễn phí vé. Trẻ 6-15 tuổi giảm 40%.'
        },
        terms: `1. Ăn mặc lịch sự khi vào khu vực chùa (không mặc đồ hở vai, hở gối).
2. Không được đưa thức ăn vào khu vực linh thiêng.
3. Giữ yên tĩnh và tôn trọng không gian tâm linh.
4. Chụp ảnh được phép nhưng không dùng flash trong chùa.`,
        notes: 'Chùa mở cửa từ 8:00 – 17:00 các ngày trong tuần. Nên mang theo khăn quàng nếu mặc đồ hở vai. Gần đây có Bảo tàng HCM và Quảng trường Ba Đình.'
    },
    {
        id: 6,
        name: 'Lặn Biển Ngắm San Hô Phú Quốc',
        city: 'Phú Quốc',
        location: 'An Thới, Phú Quốc, Kiên Giang',
        price: 850000,
        image_url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
        description: 'Khám phá thế giới đại dương kỳ diệu với san hô nhiều màu sắc, cá nhiệt đới và sinh vật biển hiếm gặp quanh vùng biển Phú Quốc.',
        duration: 'Nửa ngày (7:00 – 12:00)',
        category: 'Thể thao & Mạo hiểm',
        includes: ['Bình hơi và đồ lặn chuyên dụng', 'Hướng dẫn viên lặn biển chứng chỉ PADI', 'Bảo hiểm tai nạn', 'Bữa trưa hải sản tươi', 'Nước uống', 'Tàu cao tốc'],
        meeting_point: 'Bến tàu An Thới, Mũi Ông Đội, Phú Quốc',
        itinerary: [
            { day: '7:00', title: 'Tập kết & huấn luyện', description: 'Chuẩn bị an toàn trước khi lặn', activities: ['Check-in và nhận đồ lặn', 'Buổi học kỹ thuật lặn cơ bản (30 phút)', 'Hướng dẫn an toàn dưới nước'] },
            { day: '8:00', title: 'Lặn điểm 1 – Hòn Mây Rút', description: 'San hô đa dạng và cá nhiều', activities: ['Lặn ngắm san hô cứng và mềm', 'Quan sát cá hề, cá bướm, sao biển', 'Chụp ảnh dưới nước (dịch vụ thêm)'] },
            { day: '9:30', title: 'Lặn điểm 2 – Hòn Thơm', description: 'Vùng san hô nguyên sinh', activities: ['Lặn tự do snorkeling', 'Khám phá rạn san hô nguyên sinh', 'Quan sát bạch tuộc và cua đá'] },
            { day: '11:00', title: 'Bữa trưa trên tàu', description: 'Thưởng thức hải sản tươi', activities: ['Hải sản Phú Quốc tươi sống', 'Nước dừa tươi', 'Nghỉ ngơi trên boong tàu'] }
        ],
        price_packages: [
            { name: 'Snorkeling (Bơi mặt nước)', price: 550000, min_people: 1, max_people: 20, includes: ['Kính lặn và ống thở', 'Áo phao', 'Hướng dẫn viên', 'Bữa trưa', 'Bảo hiểm'] },
            { name: 'Scuba Diving (Lặn bình hơi)', price: 850000, min_people: 1, max_people: 10, includes: ['Toàn bộ thiết bị lặn', 'HDV lặn chứng chỉ PADI', 'Bữa trưa hải sản', 'Bảo hiểm', 'Ảnh kỷ niệm dưới nước'] },
            { name: 'VIP Private (2 điểm lặn)', price: 1500000, min_people: 1, max_people: 4, includes: ['Tàu riêng', 'Thiết bị lặn cao cấp', 'HDV riêng', 'BBQ trên biển', 'Bảo hiểm', 'GoPro ghi hình'] }
        ],
        policies: {
            cancel: 'Miễn phí hủy trước 48 giờ. Hủy trong vòng 48 giờ: phí 40% giá trị đơn hàng.',
            change: 'Có thể đổi ngày, vui lòng liên hệ trước 24 giờ.',
            weather: 'Tour có thể bị hủy do biển động hoặc sóng to. Hoàn tiền 100% nếu hủy do thời tiết.',
            children: 'Gói snorkeling: trẻ từ 6 tuổi. Gói lặn bình hơi: từ 10 tuổi trở lên.'
        },
        terms: `1. Không tham gia nếu đang mang thai hoặc có vấn đề về tim mạch, tai trong.
2. Không uống rượu bia trước khi lặn ít nhất 12 giờ.
3. Không chạm tay vào san hô – bảo vệ hệ sinh thái.
4. Mọi người tham gia phải biết bơi hoặc mặc áo phao (gói snorkeling).
5. Tuân thủ hoàn toàn hướng dẫn của HDV trong suốt chuyến đi.`,
        notes: 'Mang theo: đồ bơi, kem chống nắng không chứa oxybenzone (bảo vệ san hô), khăn tắm, thuốc say sóng. Thời điểm lặn tốt nhất: tháng 11 – tháng 5.'
    },
    {
        id: 7,
        name: 'Trải Nghiệm Làng Gốm Bát Tràng',
        city: 'Hà Nội',
        location: 'Bát Tràng, Gia Lâm, Hà Nội',
        price: 300000,
        image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
        description: 'Tìm hiểu nghề làm gốm truyền thống hơn 700 năm tuổi, tự tay nặn gốm trên bàn xoay và tạo ra sản phẩm lưu niệm độc đáo của riêng bạn.',
        duration: '3 giờ',
        category: 'Văn hóa & Lịch sử',
        includes: ['Hướng dẫn viên giới thiệu làng nghề', 'Trải nghiệm làm gốm trực tiếp', 'Đất sét và dụng cụ', 'Đốt sản phẩm và giao về sau', 'Nước uống'],
        meeting_point: 'Cổng Làng Gốm Bát Tràng, Bát Tràng, Gia Lâm, Hà Nội',
        itinerary: [
            { day: '1', title: 'Giới thiệu lịch sử làng gốm', description: 'Tìm hiểu nguồn gốc 700 năm', activities: ['Nghe kể lịch sử làng gốm Bát Tràng', 'Tham quan lò gốm cổ', 'Xem nghệ nhân biểu diễn làm gốm'] },
            { day: '2', title: 'Tự tay làm gốm', description: 'Trải nghiệm thực hành', activities: ['Học cách nhào đất sét', 'Nặn gốm trên bàn xoay', 'Trang trí hoa văn theo ý thích', 'Giao sản phẩm để đốt'] },
            { day: '3', title: 'Tham quan chợ gốm', description: 'Mua sắm đồ lưu niệm', activities: ['Dạo chợ gốm Bát Tràng', 'Mua đồ gốm làm quà', 'Thưởng thức bánh chưng Bát Tràng', 'Kết thúc tour'] }
        ],
        price_packages: [
            { name: 'Cá nhân trải nghiệm', price: 300000, min_people: 1, max_people: 5, includes: ['HDV', 'Trải nghiệm làm gốm', 'Đất sét', 'Nước uống'] },
            { name: 'Nhóm gia đình', price: 250000, min_people: 6, max_people: 20, includes: ['HDV nhóm', 'Trải nghiệm làm gốm', 'Đất sét', 'Nước uống', 'Vận chuyển sản phẩm về nhà miễn phí'] },
            { name: 'Workshop chuyên sâu', price: 500000, min_people: 1, max_people: 8, includes: ['Nghệ nhân 1-1 hướng dẫn', '3 sản phẩm gốm', 'Đất sét cao cấp', 'Bữa trưa', 'Photo session'] }
        ],
        policies: {
            cancel: 'Miễn phí hủy trước 24 giờ. Không hoàn tiền nếu hủy muộn hơn.',
            change: 'Có thể đổi ngày tham gia, vui lòng liên hệ trước 12 giờ.',
            weather: 'Tour vẫn diễn ra trong mọi điều kiện thời tiết (hoạt động trong nhà).',
            children: 'Trẻ em dưới 5 tuổi miễn phí. Trẻ em 5-12 tuổi giảm 50%.'
        },
        terms: `1. Mặc quần áo không sợ dính đất sét (hoặc mặc tạp dề được cung cấp).
2. Sản phẩm gốm sau khi đốt sẽ được giao sau 3-5 ngày.
3. Không đảm bảo hình dạng chính xác như ý nếu chưa có kinh nghiệm.
4. Sản phẩm bị vỡ trong quá trình đốt không được hoàn tiền.
5. Ảnh chụp trong workshop được tự do chia sẻ trên mạng xã hội.`,
        notes: 'Nên mặc đồ cũ hoặc đơn giản vì đất sét có thể dây bẩn. Sản phẩm gốm làm ra rất ý nghĩa để làm quà lưu niệm. Chợ gốm mở cửa từ 7:00 – 18:00 mỗi ngày.'
    },
    {
        id: 8,
        name: 'Sun World Ba Na Hills',
        city: 'Đà Nẵng',
        location: 'Núi Bà Nà, Hòa Ninh, Hòa Vang, Đà Nẵng',
        price: 750000,
        image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
        description: 'Trải nghiệm thế giới thần tiên trên núi cao 1.487m, cáp treo kỷ lục thế giới, Cầu Vàng nổi tiếng toàn cầu và Làng Pháp cổ điển.',
        duration: 'Cả ngày (7:00 – 21:00)',
        category: 'Giải trí & Vui chơi',
        includes: ['Vé cáp treo 2 chiều', 'Vé vào Fantasy Park', 'Sử dụng tất cả trò chơi', 'Bản đồ khu du lịch'],
        meeting_point: 'Ga cáp treo Sun World Ba Na Hills, Hòa Ninh, Đà Nẵng',
        itinerary: [
            { day: '7:30', title: 'Cáp treo kỷ lục lên núi', description: 'Hành trình 20 phút ngắm cảnh', activities: ['Ngồi cáp treo dài 5,801m lên đỉnh núi', 'Ngắm mây mù huyền ảo', 'Chụp ảnh giữa mây'] },
            { day: '8:30', title: 'Cầu Vàng – Bàn tay khổng lồ', description: 'Điểm check-in nổi tiếng thế giới', activities: ['Chụp ảnh tại Cầu Vàng', 'Ngắm toàn cảnh từ trên cao', 'Vườn hoa Le Jardin D\'Amour'] },
            { day: '10:00', title: 'Làng Pháp cổ điển', description: 'Kiến trúc châu Âu trên đỉnh núi', activities: ['Tham quan Nhà thờ Đức Bà Linh Ảnh', 'Khám phá Lâu đài Rượu vang', 'Chụp ảnh kiến trúc Pháp'] },
            { day: '12:30', title: 'Ăn trưa & nghỉ ngơi', description: 'Nhà hàng trên đỉnh núi', activities: ['Buffet hoặc món á âu', 'Nghỉ ngơi trong không khí mát mẻ'] },
            { day: '14:00', title: 'Fantasy Park – Khu vui chơi trong nhà', description: 'Trò chơi hiện đại', activities: ['Game điện tử 5D/7D', 'Đua xe điện trong nhà', 'Trò chơi cảm giác mạnh'] },
            { day: '17:00', title: 'Ngắm hoàng hôn & xuống núi', description: 'Kết thúc ngày tuyệt vời', activities: ['Ngắm hoàng hôn trên đỉnh núi', 'Mua quà lưu niệm', 'Cáp treo xuống núi'] }
        ],
        price_packages: [
            { name: 'Người lớn', price: 750000, min_people: 1, max_people: 99, includes: ['Cáp treo 2 chiều', 'Fantasy Park', 'Tất cả trò chơi'] },
            { name: 'Trẻ em (1m–1.4m)', price: 600000, min_people: 1, max_people: 99, includes: ['Cáp treo 2 chiều', 'Fantasy Park', 'Trò chơi phù hợp lứa tuổi'] },
            { name: 'Gói gia đình (2+2)', price: 2700000, min_people: 4, max_people: 4, includes: ['Cáp treo cho cả gia đình', 'Fantasy Park', 'Bữa trưa buffet', 'Ảnh gia đình tại Cầu Vàng'] }
        ],
        policies: {
            cancel: 'Miễn phí hủy trước 48 giờ. Hủy trong vòng 48 giờ: phí 30% giá trị đơn hàng.',
            change: 'Có thể đổi ngày, vui lòng liên hệ trước 24 giờ.',
            weather: 'Cáp treo có thể dừng hoạt động khi có sấm sét hoặc gió mạnh. Hoàn tiền 80% nếu không lên được do thời tiết.',
            children: 'Trẻ em dưới 1m miễn phí. Trẻ từ 1m mua vé theo gói tương ứng.'
        },
        terms: `1. Không được mang thú nuôi lên khu du lịch.
2. Du khách có trách nhiệm giữ gìn vệ sinh chung.
3. Không chạy nhảy gần khu vực cáp treo.
4. Tuân thủ hướng dẫn của nhân viên tại mỗi khu vực.
5. Đặt tour trực tuyến được ưu tiên xếp hàng tại ga cáp treo.`,
        notes: 'Nhiệt độ trên núi thường thấp hơn dưới chân núi 5-7°C. Mang thêm áo khoác nhẹ. Mùa đẹp nhất: tháng 3 – tháng 8. Nên đi sớm để tránh đông đúc.'
    },
    {
        id: 9,
        name: 'Tour Ẩm Thực Đường Phố Sài Gòn',
        city: 'Hồ Chí Minh',
        location: 'Quận 1 & Quận 3, TP.HCM',
        price: 450000,
        image_url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
        description: 'Theo chân hướng dẫn viên dọc theo những con hẻm ẩm thực nổi tiếng của Sài Gòn, thưởng thức hơn 8 món ăn đường phố đặc sắc và nghe câu chuyện văn hóa ẩm thực Nam Bộ.',
        duration: '3 giờ (17:30 – 20:30)',
        category: 'Văn hóa & Lịch sử',
        includes: ['Hướng dẫn viên am hiểu ẩm thực', 'Tất cả các món ăn (8 điểm dừng)', 'Nước uống tại mỗi điểm', 'Bảo hiểm', 'Áo mưa mỏng'],
        meeting_point: 'Tượng Trần Nguyên Hãn, trước Chợ Bến Thành, Quận 1, TP.HCM',
        itinerary: [
            { day: '17:30', title: 'Xuất phát từ Chợ Bến Thành', description: 'Điểm dừng đầu tiên', activities: ['Gặp mặt và giới thiệu nhóm', 'Thưởng thức bánh mì Sài Gòn truyền thống', 'Nghe câu chuyện lịch sử Chợ Bến Thành'] },
            { day: '18:00', title: 'Hẻm phở và bún bò', description: 'Món Bắc di cư vào Nam', activities: ['Ăn phở bò đặc biệt hẻm Pasteur', 'Thử bún bò Huế cay nồng', 'Khám phá con hẻm ẩm thực qua ảnh'] },
            { day: '18:45', title: 'Cơm tấm & Bánh cuốn', description: 'Đặc sản Nam Bộ', activities: ['Cơm tấm sườn bì chả', 'Bánh cuốn Tây Hồ chấm mắm', 'Trò chuyện với chủ quán lâu năm'] },
            { day: '19:30', title: 'Hẻm bánh ngọt & nước uống', description: 'Tráng miệng Sài Gòn', activities: ['Bánh tiêu, bánh bao nóng hổi', 'Sinh tố Mãng Cầu và Cóc muối', 'Cafe sữa đá kiểu Sài Gòn', 'Kết thúc và chia tay'] }
        ],
        price_packages: [
            { name: 'Gói tiêu chuẩn', price: 450000, min_people: 1, max_people: 12, includes: ['HDV ẩm thực', '8 điểm ăn', 'Nước uống', 'Bảo hiểm'] },
            { name: 'Gói cao cấp', price: 650000, min_people: 1, max_people: 6, includes: ['HDV chuyên ẩm thực Sài Gòn', '10 điểm ăn', 'Cocktail Sài Gòn', 'Bảo hiểm', 'Sách ẩm thực tặng kèm'] },
            { name: 'Gói riêng tư (Private)', price: 1200000, min_people: 2, max_people: 4, includes: ['Tour riêng theo yêu cầu', 'HDV riêng', 'Xe máy riêng', 'Menu tuỳ chỉnh', 'Photo ảnh chuyên nghiệp'] }
        ],
        policies: {
            cancel: 'Miễn phí hủy trước 12 giờ. Hủy trong vòng 12 giờ: không hoàn tiền.',
            change: 'Có thể đổi giờ, vui lòng liên hệ trước 6 giờ.',
            weather: 'Tour vẫn diễn ra dưới mưa nhỏ (cung cấp áo mưa). Hủy và hoàn tiền 100% nếu mưa lớn.',
            children: 'Trẻ em dưới 5 tuổi miễn phí. Trẻ em 5-12 tuổi giảm 50%.'
        },
        terms: `1. Vui lòng thông báo nếu có dị ứng thực phẩm trước khi tham gia.
2. Tour đi bộ khoảng 3-4 km, nên đi giày thoải mái.
3. Không đảm bảo lượng thức ăn là no nếu đã ăn trước đó.
4. Một số quán chỉ mở buổi tối, lịch trình có thể thay đổi ít.
5. Khuyến khích mang theo tiền mặt cho mua sắm thêm.`,
        notes: 'Tour buổi tối (17:30) – thời điểm ẩm thực đường phố Sài Gòn sôi động nhất. Mặc đồ thoải mái, đi giày bằng phẳng. Không nên ăn no trước khi tham gia.'
    },
    {
        id: 10,
        name: 'Tham Quan Đảo Khỉ Cần Giờ',
        city: 'Hồ Chí Minh',
        location: 'Cần Giờ, TP.HCM',
        price: 550000,
        image_url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
        description: 'Khám phá khu dự trữ sinh quyển thế giới Cần Giờ, gặp gỡ đàn khỉ hoang dã và thưởng thức hải sản tươi sống bên sông nước miền Tây.',
        duration: 'Nửa ngày (7:00 – 13:00)',
        category: 'Thiên nhiên & Du lịch',
        includes: ['Tàu cao tốc tham quan', 'Hướng dẫn viên', 'Bữa trưa hải sản tươi', 'Bảo hiểm', 'Nước uống'],
        meeting_point: 'Bến phà Cần Giờ, huyện Cần Giờ, TP.HCM',
        itinerary: [
            { day: '7:00', title: 'Khởi hành từ bến phà', description: 'Hành trình qua rừng ngập mặn', activities: ['Lên tàu và di chuyển', 'Ngắm rừng ngập mặn hai bên', 'Nghe giới thiệu về hệ sinh thái Cần Giờ'] },
            { day: '8:30', title: 'Đảo Khỉ – Khu bảo tồn', description: 'Gặp gỡ linh trưởng hoang dã', activities: ['Quan sát khỉ đuôi dài tự nhiên', 'Cho khỉ ăn (có giám sát)', 'Tham quan trại cá sấu', 'Xem biểu diễn xiếc khỉ'] },
            { day: '10:30', title: 'Đầm Dơi & Sân chim', description: 'Hệ sinh thái độc đáo', activities: ['Thuyền nhỏ vào đầm dơi', 'Ngắm hàng vạn con dơi', 'Quan sát sân chim cò về tổ'] },
            { day: '12:00', title: 'Bữa trưa hải sản', description: 'Đặc sản biển Cần Giờ', activities: ['Tôm, cua, hàu tươi nướng', 'Cá lóc nướng trui', 'Bánh canh ghẹ đặc sản'] }
        ],
        price_packages: [
            { name: 'Gói cơ bản', price: 550000, min_people: 1, max_people: 20, includes: ['Tàu tham quan', 'HDV', 'Bữa trưa hải sản', 'Bảo hiểm', 'Nước uống'] },
            { name: 'Gói gia đình', price: 480000, min_people: 4, max_people: 20, includes: ['Tàu tham quan', 'HDV', 'Bữa trưa hải sản cao cấp', 'Bảo hiểm', 'Nước uống', 'Quà trẻ em'] }
        ],
        policies: {
            cancel: 'Miễn phí hủy trước 48 giờ. Hủy trong vòng 48 giờ: phí 30% giá trị đơn hàng.',
            change: 'Có thể đổi ngày, vui lòng liên hệ trước 24 giờ.',
            weather: 'Tour có thể bị hủy do thời tiết hoặc triều cường. Hoàn tiền 100% nếu hủy do thời tiết.',
            children: 'Trẻ em dưới 5 tuổi miễn phí. Trẻ em 5-12 tuổi giảm 50%.'
        },
        terms: `1. Không được tự ý tiếp xúc hoặc chọc phá khỉ trong khu bảo tồn.
2. Không mang thức ăn vào khu nuôi động vật.
3. Mặc quần áo kín để tránh muỗi trong rừng ngập mặn.
4. Giữ gìn vệ sinh môi trường sinh thái Cần Giờ.
5. Bảo vệ đồ vật cá nhân khi ở gần khỉ.`,
        notes: 'Mang theo: áo tay dài, kem chống muỗi, mũ nón. Khỉ có thể lấy đồ nếu không cẩn thận – cất điện thoại và kính vào túi khi gần khỉ. Rừng ngập mặn rất đẹp vào buổi sáng sớm.'
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
