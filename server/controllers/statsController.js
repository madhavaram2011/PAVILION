import Tour from '../models/Tour.js';
import Destination from '../models/Destination.js';
import Booking from '../models/Booking.js';
import User from '../models/User.js';

// ── GET /api/stats ────────────────────────────────────────────────
// Admin dashboard: totals + top rated + popular
export const getStats = async (req, res, next) => {
  try {
    // ── Run all aggregations in parallel for speed ─────────────
    const [
      totalTours,
      totalDestinations,
      totalBookings,
      totalUsers,
      bookingsByStatus,
      topRatedTours,
      popularDestinations,
      revenueAgg,
    ] = await Promise.all([
      // 1. Total active tours
      Tour.countDocuments({ isActive: true }),

      // 2. Total destinations
      Destination.countDocuments(),

      // 3. Total bookings
      Booking.countDocuments(),

      // 4. Total users (non-admin)
      User.countDocuments({ role: 'user' }),

      // 5. Bookings grouped by status
      Booking.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
          },
        },
      ]),

      // 6. Top 5 rated tours
      Tour.find({ isActive: true })
        .sort('-rating -reviewCount')
        .limit(5)
        .select('title slug type rating reviewCount price coverImage destination')
        .populate('destination', 'name slug')
        .lean(),

      // 7. Popular destinations (isPopular + rating)
      Destination.find({ isPopular: true })
        .sort('-rating -reviewCount')
        .limit(6)
        .select('name slug type state region rating reviewCount coverImage')
        .lean(),

      // 8. Total confirmed revenue
      Booking.aggregate([
        {
          $match: { status: { $in: ['confirmed', 'completed'] } },
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$totalPrice' },
            avgOrderValue: { $avg: '$totalPrice' },
          },
        },
      ]),
    ]);

    // ── Shape bookingsByStatus into an object ─────────────────
    const bookingStatusMap = { pending: 0, confirmed: 0, cancelled: 0, completed: 0, refunded: 0 };
    bookingsByStatus.forEach(({ _id, count }) => {
      if (_id in bookingStatusMap) bookingStatusMap[_id] = count;
    });

    const revenue = revenueAgg[0] || { totalRevenue: 0, avgOrderValue: 0 };

    res.status(200).json({
      status: 'success',
      data: {
        overview: {
          totalTours,
          totalDestinations,
          totalBookings,
          totalUsers,
          totalRevenue:   Math.round(revenue.totalRevenue   || 0),
          avgOrderValue:  Math.round(revenue.avgOrderValue  || 0),
        },
        bookingsByStatus: bookingStatusMap,
        topRatedTours,
        popularDestinations,
      },
    });
  } catch (err) {
    next(err);
  }
};
