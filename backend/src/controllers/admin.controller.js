import db from '../models/index.js';

export async function getAdminStats(req, res, next) {
    try {
        console.log('=== getAdminStats called ===');

        // Get total counts from database
        const [
            totalBookings,
            totalUsers,
            totalHotels,
            totalFlights,
            totalCars,
            totalActivities,
            totalVouchers
        ] = await Promise.all([
            db.Booking.count(),
            db.User.count(),
            db.Hotel.count(),
            db.Flight.count(),
            db.Car.count(),
            db.Activity.count(),
            db.Voucher.count()
        ]);

        console.log('Counts:', { totalBookings, totalUsers, totalHotels, totalFlights, totalCars, totalActivities, totalVouchers });

        // Calculate total revenue from bookings
        const bookingsWithRevenue = await db.Booking.findAll({
            attributes: ['total_price'],
            where: {
                status: 'confirmed'
            }
        });

        const totalRevenue = bookingsWithRevenue.reduce((sum, booking) => {
            return sum + (parseFloat(booking.total_price) || 0);
        }, 0);

        console.log('Total revenue:', totalRevenue);

        // Get recent bookings for activity feed
        const recentBookings = await db.Booking.findAll({
            limit: 5,
            order: [['createdAt', 'DESC']],
            include: [
                {
                    model: db.User,
                    as: 'user',
                    attributes: ['email']
                }
            ]
        });

        // Format recent activity
        const recentActivity = recentBookings.map(booking => ({
            action: 'Đặt chỗ mới',
            detail: `${booking.serviceType || 'N/A'} - ${booking.user?.email || 'N/A'}`,
            time: formatTimeAgo(booking.createdAt),
            amount: booking.total_price
        }));

        const response = {
            stats: {
                totalBookings,
                totalUsers,
                totalRevenue,
                activeServices: totalHotels + totalFlights + totalCars + totalActivities
            },
            breakdown: {
                hotels: totalHotels,
                flights: totalFlights,
                cars: totalCars,
                activities: totalActivities,
                vouchers: totalVouchers
            },
            recentActivity
        };

        console.log('Sending response:', JSON.stringify(response, null, 2));
        res.json(response);
    } catch (error) {
        console.error('getAdminStats error:', error);
        next(error);
    }
}

function formatTimeAgo(date) {
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Vừa xong';
    if (minutes < 60) return `${minutes} phút trước`;
    if (hours < 24) return `${hours} giờ trước`;
    return `${days} ngày trước`;
}
