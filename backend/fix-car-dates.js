import db from './src/models/index.js';

async function fixCarBookingDates() {
    try {
        await db.sequelize.authenticate();
        console.log('Connected to database');

        // Find booking #12 (the car booking)
        const booking = await db.Booking.findByPk(12);

        if (!booking) {
            console.log('Booking #12 not found');
            return;
        }

        console.log('Current booking data:', JSON.stringify(booking.toJSON(), null, 2));

        // Update with dates  
        // Assuming user booked the car for 3 days starting from creation date
        const startDate = new Date('2025-12-21');
        const endDate = new Date('2025-12-24'); // 3 days

        booking.start_date = startDate;
        booking.end_date = endDate;
        await booking.save();

        console.log('✓ Updated booking #12 with dates:');
        console.log('  Start:', startDate.toISOString());
        console.log('  End:', endDate.toISOString());

        await db.sequelize.close();
    } catch (error) {
        console.error('Error:', error);
    }
}

fixCarBookingDates();
