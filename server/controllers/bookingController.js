import Booking from '../models/Booking.js';
import Tour from '../models/Tour.js';
import AppError from '../utils/AppError.js';

// ── Helpers ───────────────────────────────────────────────────────

/** Generate a PV-XXXXXX style reference (6 uppercase alphanumeric chars) */
const generateBookingRef = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `PV-${code}`;
};

/** Ensure uniqueness of the booking reference */
const uniqueBookingRef = async () => {
  let ref;
  let exists = true;
  let attempts = 0;

  while (exists && attempts < 10) {
    ref = generateBookingRef();
    exists = await Booking.exists({ bookingReference: ref });
    attempts++;
  }

  if (exists) throw new Error('Could not generate a unique booking reference.');
  return ref;
};

// ── POST /api/bookings ────────────────────────────────────────────
export const createBooking = async (req, res, next) => {
  try {
    const {
      tourId,
      travelDate,
      returnDate,
      guests,
      contactInfo,
      specialRequests,
      payment,
    } = req.body;

    if (!tourId || !travelDate || !contactInfo) {
      return next(AppError.badRequest('tourId, travelDate and contactInfo are required.'));
    }

    // Validate tour exists — accept both isActive:true and docs without the field
    const tour = await Tour.findOne({
      _id: tourId,
      $or: [{ isActive: true }, { isActive: { $exists: false } }],
    }).select('price discountPrice destination');

    if (!tour) return next(AppError.notFound('Tour'));

    // Calculate pricing
    const pricePerPerson = tour.discountPrice || tour.price;
    const totalGuests = (guests?.adults || 1) + (guests?.children || 0);
    const totalPrice  = pricePerPerson * totalGuests;

    // Generate PV-XXXXXX reference
    const bookingReference = await uniqueBookingRef();

    const booking = await Booking.create({
      user: req.user._id,
      tour: tourId,
      destination: tour.destination,
      travelDate: new Date(travelDate),
      returnDate: returnDate ? new Date(returnDate) : undefined,
      guests: guests || { adults: 1, children: 0, infants: 0 },
      pricePerPerson,
      totalPrice,
      contactInfo,
      specialRequests: specialRequests || '',
      payment: payment || {},
      bookingReference, // set explicitly to bypass Booking's pre-save PAV- generator
      status: 'confirmed',
    });

    const populated = await booking.populate([
      { path: 'tour', select: 'title slug coverImage duration type' },
      { path: 'destination', select: 'name slug' },
    ]);

    res.status(201).json({
      status: 'success',
      data: { booking: populated },
    });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/bookings/my ──────────────────────────────────────────
export const getMyBookings = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const filter = { user: req.user._id };
    if (status) filter.status = status;

    const pageNum  = Math.max(1, parseInt(page,  10));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
    const skip     = (pageNum - 1) * limitNum;

    const [bookings, total] = await Promise.all([
      Booking.find(filter)
        .populate('tour',        'title slug coverImage type duration')
        .populate('destination', 'name slug coverImage')
        .sort('-bookingDate')
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Booking.countDocuments(filter),
    ]);

    res.status(200).json({
      status: 'success',
      results: bookings.length,
      pagination: {
        total,
        totalPages: Math.ceil(total / limitNum),
        currentPage: pageNum,
        limit: limitNum,
      },
      data: { bookings },
    });
  } catch (err) {
    next(err);
  }
};

// ── PATCH /api/bookings/:id/cancel ────────────────────────────────
export const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) return next(AppError.notFound('Booking'));

    // Ownership check (admin can cancel any)
    if (
      booking.user.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return next(AppError.forbidden('You can only cancel your own bookings.'));
    }

    if (['cancelled', 'completed', 'refunded'].includes(booking.status)) {
      return next(
        AppError.badRequest(`Booking is already ${booking.status} and cannot be cancelled.`)
      );
    }

    booking.status = 'cancelled';
    booking.cancellationReason = req.body.reason || 'Cancelled by user';
    booking.cancelledAt = new Date();
    await booking.save();

    res.status(200).json({
      status: 'success',
      message: 'Booking cancelled successfully.',
      data: { booking },
    });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/bookings — Admin only ───────────────────────────────
export const getAllBookings = async (req, res, next) => {
  try {
    const {
      status,
      userId,
      tourId,
      from,
      to,
      page  = 1,
      limit = 20,
      sort  = '-bookingDate',
    } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (userId) filter.user   = userId;
    if (tourId) filter.tour   = tourId;

    // Date range on travelDate
    if (from || to) {
      filter.travelDate = {};
      if (from) filter.travelDate.$gte = new Date(from);
      if (to)   filter.travelDate.$lte = new Date(to);
    }

    const pageNum  = Math.max(1, parseInt(page,  10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip     = (pageNum - 1) * limitNum;

    const [bookings, total] = await Promise.all([
      Booking.find(filter)
        .populate('user',        'name email phone')
        .populate('tour',        'title slug type')
        .populate('destination', 'name slug region')
        .sort(sort)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Booking.countDocuments(filter),
    ]);

    res.status(200).json({
      status: 'success',
      results: bookings.length,
      pagination: {
        total,
        totalPages: Math.ceil(total / limitNum),
        currentPage: pageNum,
        limit: limitNum,
      },
      data: { bookings },
    });
  } catch (err) {
    next(err);
  }
};

// ── PATCH /api/bookings/:id/status — Admin only ───────────────────
export const updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowed = ['confirmed', 'completed', 'cancelled', 'refunded', 'no-show', 'pending'];
    if (!allowed.includes(status)) return next(AppError.badRequest('Invalid status value.'));
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status, ...(status === 'cancelled' ? { cancelledAt: new Date() } : {}) },
      { new: true, runValidators: true }
    );
    if (!booking) return next(AppError.notFound('Booking'));
    res.status(200).json({ status: 'success', data: { booking } });
  } catch (err) { next(err); }
};
