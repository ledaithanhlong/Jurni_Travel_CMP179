import db from './models/index.js';

async function updateExistingHotels() {
    try {
        await db.sequelize.authenticate();
        console.log('Database connected');

        // Update all hotels that don't have a status set
        const updated = await db.Hotel.update(
            {
                status: 'pending'
            },
            {
                where: {
                    status: null
                }
            }
        );

        console.log(`Updated ${updated[0]} hotels with default status`);

        // Get all hotels to verify
        const hotels = await db.Hotel.findAll({
            include: [{ model: db.Room, as: 'rooms' }]
        });

        console.log('\nCurrent hotels:');
        hotels.forEach(hotel => {
            console.log(`- ${hotel.name}: status=${hotel.status}, price=${hotel.price}, star_rating=${hotel.star_rating}`);
            console.log(`  Rooms: ${hotel.rooms?.length || 0}`);
        });

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

updateExistingHotels();
