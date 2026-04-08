import db from './models/index.js';

const seedData = async () => {
    try {
        await db.connect();

        const hotels = [
            {
                name: 'Khách Sạn Grand Saigon',
                location: 'Quận 1, TP.HCM',
                address: 'Quận 1, TP.HCM',
                price: 2500000,
                star_rating: 5,
                image_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
                description: 'Khách sạn 5 sao sang trọng tại trung tâm thành phố, với view đẹp và dịch vụ đẳng cấp quốc tế',
                amenities: ['Wifi miễn phí', 'Bể bơi', 'Spa', 'Nhà hàng', 'Fitness center', 'Parking'],
                total_rooms: 150,
                check_in_time: '14:00',
                check_out_time: '12:00',
                status: 'approved'
            },
            {
                name: 'Resort Đà Lạt Premium',
                location: 'Đà Lạt, Lâm Đồng',
                address: 'Đà Lạt, Lâm Đồng',
                price: 1800000,
                star_rating: 4,
                image_url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
                description: 'Resort nghỉ dưỡng cao cấp với view núi rừng, không gian yên tĩnh và không khí trong lành',
                amenities: ['Wifi miễn phí', 'Bể bơi', 'Spa', 'Nhà hàng', 'Golf', 'Parking'],
                total_rooms: 80,
                check_in_time: '15:00',
                check_out_time: '11:00',
                status: 'approved'
            },
            {
                name: 'Boutique Hotel Hội An',
                location: 'Hội An, Quảng Nam',
                address: 'Hội An, Quảng Nam',
                price: 1200000,
                star_rating: 4,
                image_url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
                description: 'Khách sạn boutique nhỏ xinh với kiến trúc cổ điển, gần phố cổ Hội An',
                amenities: ['Wifi miễn phí', 'Nhà hàng', 'Xe đạp miễn phí', 'Tour booking'],
                total_rooms: 25,
                check_in_time: '14:00',
                check_out_time: '12:00',
                status: 'approved'
            },
            {
                name: 'Beach Resort Nha Trang',
                location: 'Nha Trang, Khánh Hòa',
                address: 'Nha Trang, Khánh Hòa',
                price: 2200000,
                star_rating: 5,
                image_url: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
                description: 'Resort bãi biển 5 sao với bãi biển riêng, view biển tuyệt đẹp và nhiều hoạt động giải trí',
                amenities: ['Wifi miễn phí', 'Bể bơi', 'Bãi biển riêng', 'Spa', 'Nhà hàng', 'Bar', 'Fitness center'],
                total_rooms: 200,
                check_in_time: '15:00',
                check_out_time: '12:00',
                status: 'approved'
            },
            {
                name: 'City Hotel Hà Nội',
                location: 'Hoàn Kiếm, Hà Nội',
                address: 'Hoàn Kiếm, Hà Nội',
                price: 1500000,
                star_rating: 4,
                image_url: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800',
                description: 'Khách sạn 4 sao hiện đại tại trung tâm Hà Nội, gần các điểm tham quan nổi tiếng',
                amenities: ['Wifi miễn phí', 'Nhà hàng', 'Fitness center', 'Parking', 'Business center'],
                total_rooms: 100,
                check_in_time: '14:00',
                check_out_time: '12:00',
                status: 'approved'
            },
            {
                name: 'Mountain Lodge Sapa',
                location: 'Sapa, Lào Cai',
                address: 'Sapa, Lào Cai',
                price: 1600000,
                star_rating: 4,
                image_url: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800',
                description: 'Lodge nghỉ dưỡng trên núi với view ruộng bậc thang, không gian ấm cúng và ẩm thực địa phương',
                amenities: ['Wifi miễn phí', 'Lò sưởi', 'Nhà hàng', 'Tour trekking', 'Parking'],
                total_rooms: 40,
                check_in_time: '14:00',
                check_out_time: '11:00',
                status: 'approved'
            },
            {
                name: 'Luxury Hotel Đà Nẵng',
                location: 'Sơn Trà, Đà Nẵng',
                address: 'Sơn Trà, Đà Nẵng',
                price: 2800000,
                star_rating: 5,
                image_url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
                description: 'Khách sạn 5 sao sang trọng với view biển, spa cao cấp và dịch vụ đẳng cấp',
                amenities: ['Wifi miễn phí', 'Bể bơi vô cực', 'Spa', 'Nhà hàng', 'Bar', 'Fitness center', 'Parking'],
                total_rooms: 180,
                check_in_time: '15:00',
                check_out_time: '12:00',
                status: 'approved'
            },
            {
                name: 'Eco Lodge Cần Thơ',
                location: 'Cần Thơ',
                address: 'Cần Thơ',
                price: 900000,
                star_rating: 3,
                image_url: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
                description: 'Lodge sinh thái gần sông, trải nghiệm văn hóa miền Tây và ẩm thực địa phương',
                amenities: ['Wifi miễn phí', 'Tour sông nước', 'Nhà hàng', 'Xe đạp miễn phí'],
                total_rooms: 30,
                check_in_time: '14:00',
                check_out_time: '12:00',
                status: 'approved'
            },
            {
                name: 'Beachfront Hotel Phú Quốc',
                location: 'Phú Quốc, Kiên Giang',
                address: 'Phú Quốc, Kiên Giang',
                price: 3200000,
                star_rating: 5,
                image_url: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800',
                description: 'Resort bãi biển 5 sao với villa riêng, bãi biển tuyệt đẹp và nhiều hoạt động giải trí',
                amenities: ['Wifi miễn phí', 'Bể bơi', 'Bãi biển riêng', 'Spa', 'Nhà hàng', 'Bar', 'Fitness center', 'Diving center'],
                total_rooms: 120,
                check_in_time: '15:00',
                check_out_time: '12:00',
                status: 'approved'
            }
        ];

        for (const hotel of hotels) {
            await db.Hotel.findOneAndUpdate({ name: hotel.name }, hotel, { upsert: true, new: true });
            console.log(`Seeded hotel: ${hotel.name}`);
        }

        const activities = [
            {
                name: 'Tour Tham Quan Phố Cổ Hà Nội',
                location: 'Hà Nội',
                price: 350000,
                image_url: 'https://images.unsplash.com/photo-1523059623039-a9ed027e7fad?w=800',
                description: 'Khám phá 36 phố phường cổ kính, thưởng thức ẩm thực đường phố và tìm hiểu văn hóa lịch sử Hà Nội',
                duration: '4 giờ',
                category: 'Văn hóa & Lịch sử',
                includes: ['Hướng dẫn viên chuyên nghiệp', 'Bảo hiểm du lịch', 'Nước uống']
            },
            {
                name: 'Tham Quan Vịnh Hạ Long',
                location: 'Quảng Ninh',
                price: 1200000,
                image_url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
                description: 'Trải nghiệm vẻ đẹp kỳ vĩ của Di sản Thế giới UNESCO, tham quan hang động và tắm biển',
                duration: '1 ngày',
                category: 'Thiên nhiên & Du lịch',
                includes: ['Tàu tham quan', 'Bữa trưa trên tàu', 'Hướng dẫn viên', 'Bảo hiểm']
            },
            {
                name: 'Công Viên Nước Vinpearl',
                location: 'Nha Trang',
                price: 650000,
                image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
                description: 'Vui chơi tại công viên nước lớn nhất Việt Nam với hơn 20 trò chơi cảm giác mạnh',
                duration: 'Cả ngày',
                category: 'Giải trí & Vui chơi',
                includes: ['Vé vào cửa', 'Sử dụng tất cả trò chơi', 'Áo phao', 'Két đồ']
            },
            {
                name: 'Show Diễn Nhạc Nước',
                location: 'Đà Nẵng',
                price: 200000,
                image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
                description: 'Xem show diễn nhạc nước đầy màu sắc tại Cầu Rồng, một trong những điểm đến nổi tiếng nhất Đà Nẵng',
                duration: '1 giờ',
                category: 'Giải trí & Vui chơi',
                includes: ['Vé xem show', 'Ghế ngồi VIP']
            },
            {
                name: 'Tour Tham Quan Chùa Một Cột',
                location: 'Hà Nội',
                price: 250000,
                image_url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
                description: 'Tham quan biểu tượng văn hóa nổi tiếng của Hà Nội và tìm hiểu lịch sử Phật giáo Việt Nam',
                duration: '2 giờ',
                category: 'Văn hóa & Lịch sử',
                includes: ['Hướng dẫn viên', 'Vé vào cửa', 'Nước uống']
            },
            {
                name: 'Lặn Biển Ngắm San Hô',
                location: 'Phú Quốc',
                price: 850000,
                image_url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
                description: 'Trải nghiệm lặn biển ngắm san hô đầy màu sắc và các loài cá nhiệt đới',
                duration: 'Nửa ngày',
                category: 'Thể thao & Mạo hiểm',
                includes: ['Thiết bị lặn', 'Hướng dẫn viên chuyên nghiệp', 'Bảo hiểm', 'Bữa trưa']
            },
            {
                name: 'Tham Quan Làng Gốm Bát Tràng',
                location: 'Hà Nội',
                price: 300000,
                image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
                description: 'Tìm hiểu nghề làm gốm truyền thống, tự tay làm gốm và mua sắm đồ lưu niệm',
                duration: '3 giờ',
                category: 'Văn hóa & Lịch sử',
                includes: ['Hướng dẫn viên', 'Trải nghiệm làm gốm', 'Nước uống']
            },
            {
                name: 'Công Viên Chủ Đề Sun World',
                location: 'Đà Nẵng',
                price: 750000,
                image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
                description: 'Vui chơi tại công viên giải trí lớn với các trò chơi cảm giác mạnh và show biểu diễn',
                duration: 'Cả ngày',
                category: 'Giải trí & Vui chơi',
                includes: ['Vé vào cửa', 'Sử dụng tất cả trò chơi', 'Show biểu diễn', 'Két đồ']
            },
            {
                name: 'Tour Ẩm Thực Đường Phố',
                location: 'Hồ Chí Minh',
                price: 450000,
                image_url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
                description: 'Khách sạn ẩm thực đường phố Sài Gòn với các món ăn địa phương nổi tiếng',
                duration: '3 giờ',
                category: 'Văn hóa & Lịch sử',
                includes: ['Hướng dẫn viên', 'Tất cả các món ăn', 'Nước uống', 'Bảo hiểm']
            },
            {
                name: 'Tham Quan Đảo Khỉ Cần Giờ',
                location: 'Hồ Chí Minh',
                price: 550000,
                image_url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
                description: 'Tham quan đảo khỉ, tìm hiểu về động vật hoang dã và thưởng thức hải sản tươi sống',
                duration: 'Nửa ngày',
                category: 'Thiên nhiên & Du lịch',
                includes: ['Tàu tham quan', 'Hướng dẫn viên', 'Bữa trưa hải sản', 'Bảo hiểm']
            },
            {
                name: 'Xe Đạp Tham Quan Phố Cổ Hội An',
                location: 'Hội An',
                price: 200000,
                image_url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
                description: 'Đạp xe tham quan phố cổ Hội An, khám phá kiến trúc cổ và văn hóa địa phương',
                duration: '2 giờ',
                category: 'Thiên nhiên & Du lịch',
                includes: ['Xe đạp', 'Hướng dẫn viên', 'Nước uống', 'Bảo hiểm']
            },
            {
                name: 'Spa & Massage Thư Giãn',
                location: 'Đà Nẵng',
                price: 500000,
                image_url: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800',
                description: 'Thư giãn với dịch vụ spa và massage chuyên nghiệp, phục hồi năng lượng sau chuyến du lịch',
                duration: '2 giờ',
                category: 'Giải trí & Vui chơi',
                includes: ['Massage body', 'Tắm thảo dược', 'Trà thảo mộc', 'Phòng thay đồ']
            }
        ];

        for (const act of activities) {
            await db.Activity.findOneAndUpdate({ name: act.name }, act, { upsert: true, new: true });
            console.log(`Seeded activity: ${act.name}`);
        }

        const flights = [
            {
                airline: 'Vietnam Airlines',
                departure_city: 'TP HCM',
                arrival_city: 'Hà Nội',
                departure_time: new Date('2023-12-25T08:00:00'),
                arrival_time: new Date('2023-12-25T10:10:00'),
                flight_number: 'VN123',
                image_url: '/AirlineLogo/vietnam-airlines.png'
            },
            {
                airline: 'VietJet Air',
                departure_city: 'Hà Nội',
                arrival_city: 'Đà Nẵng',
                departure_time: new Date('2023-12-25T09:30:00'),
                arrival_time: new Date('2023-12-25T10:50:00'),
                flight_number: 'VJ456',
                image_url: '/AirlineLogo/vietjet.png'
            },
            {
                airline: 'Bamboo Airways',
                departure_city: 'TP HCM',
                arrival_city: 'Nha Trang',
                departure_time: new Date('2023-12-26T07:15:00'),
                arrival_time: new Date('2023-12-26T08:25:00'),
                flight_number: 'QH123',
                image_url: '/AirlineLogo/bamboo.png'
            },
            {
                airline: 'Jetstar Pacific',
                departure_city: 'TP HCM',
                arrival_city: 'Phú Quốc',
                departure_time: new Date('2023-12-27T14:00:00'),
                arrival_time: new Date('2023-12-27T15:00:00'),
                flight_number: 'BL123',
                image_url: '/AirlineLogo/jetstar.png'
            },
            {
                airline: 'Vietnam Airlines',
                departure_city: 'Cần Thơ',
                arrival_city: 'Hà Nội',
                departure_time: new Date('2023-12-28T16:30:00'),
                arrival_time: new Date('2023-12-28T18:45:00'),
                flight_number: 'VN456',
                image_url: '/AirlineLogo/vietnam-airlines.png'
            },
            {
                airline: 'VietJet Air',
                departure_city: 'Hải Phòng',
                arrival_city: 'Đà Lạt',
                departure_time: new Date('2023-12-29T11:00:00'),
                arrival_time: new Date('2023-12-29T12:50:00'),
                flight_number: 'VJ789',
                image_url: '/AirlineLogo/vietjet.png'
            }
        ];

        for (const flight of flights) {
            await db.Flight.findOneAndUpdate({ flight_number: flight.flight_number }, flight, { upsert: true, new: true });
            console.log(`Seeded flight: ${flight.flight_number}`);
        }

        console.log('Seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
