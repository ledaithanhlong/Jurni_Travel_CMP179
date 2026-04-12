const axios = require('axios');

const API = 'http://localhost:5000/api';

const cars = [
    {
        company: 'Honda',
        type: 'City',
        seats: 5,
        price_per_day: 850000,
        available: true,
        image_url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800',
        description: 'Xe sedan hiện đại với công nghệ tiên tiến, tiết kiệm nhiên liệu và an toàn',
        specifications: {
            engine: '1.5L',
            fuel: 'Xăng',
            transmission: 'Số tự động',
            luggageSpace: '500L'
        },
        amenities: ['Điều hòa', 'Bluetooth', 'USB', 'Camera lùi', 'Wifi']
    },
    {
        company: 'Toyota',
        type: 'Innova',
        seats: 7,
        price_per_day: 1200000,
        available: true,
        image_url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800',
        description: 'MPV 7 chỗ rộng rãi, thoải mái cho gia đình và nhóm bạn',
        specifications: {
            engine: '2.0L',
            fuel: 'Xăng',
            transmission: 'Số tự động',
            luggageSpace: '300L'
        },
        amenities: ['Điều hòa', 'Bluetooth', 'USB', 'Camera lùi', 'TV']
    }
];

async function addCars() {
    console.log('Adding cars to database...\n');

    for (const car of cars) {
        try {
            const response = await axios.post(`${API}/cars`, car);
            console.log(`✅ Added: ${car.company} ${car.type}`);
            console.log(`   ID: ${response.data.id}`);
            console.log(`   Price: ${car.price_per_day.toLocaleString('vi-VN')} VNĐ/ngày\n`);
        } catch (error) {
            console.error(`❌ Error adding ${car.company} ${car.type}:`, error.response?.data || error.message);
        }
    }

    console.log('Done!');
}

addCars();
