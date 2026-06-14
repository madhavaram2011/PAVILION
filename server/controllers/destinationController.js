import Destination from '../models/Destination.js';
import Tour from '../models/Tour.js';
import AppError from '../utils/AppError.js';

// ── GET /api/destinations ─────────────────────────────────────────
// Filters: region, type, state, search, isFeatured, isPopular + pagination
export const getAllDestinations = async (req, res, next) => {
  try {
    const {
      region,
      type,
      state,
      search,
      isFeatured,
      isPopular,
      page = 1,
      limit = 12,
      sort = '-rating',
    } = req.query;

    // ── Build filter ─────────────────────────────────────────────
    const filter = {};

    if (region) filter.region = region;
    if (type) filter.type = type;
    if (state) filter.state = new RegExp(state, 'i'); // partial, case-insensitive

    if (isFeatured !== undefined) filter.isFeatured = isFeatured === 'true';
    if (isPopular !== undefined) filter.isPopular = isPopular === 'true';

    if (search) {
      filter.$text = { $search: search };
    }

    // ── Pagination ───────────────────────────────────────────────
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(500, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    // ── Sorting ──────────────────────────────────────────────────
    const sortMap = {
      'rating_desc': '-rating',
      'name_asc': 'name',
      'newest': '-createdAt',
      'popular': '-reviewCount',
    };
    const sortStr = sortMap[sort] || sort;

    // ── Query ────────────────────────────────────────────────────
    const [destinations, total] = await Promise.all([
      Destination.find(filter)
        .sort(sortStr)
        .skip(skip)
        .limit(limitNum)
        .select('-climate -accommodation -facts -history') // lighter list payload
        .lean(),
      Destination.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    res.status(200).json({
      status: 'success',
      results: destinations.length,
      pagination: {
        total,
        totalPages,
        currentPage: pageNum,
        limit: limitNum,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
      data: { destinations },
    });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/destinations/:slug ───────────────────────────────────
// Full detail + nearby tours (up to 6 active tours for same destination)
export const getDestinationBySlug = async (req, res, next) => {
  try {
    const destination = await Destination.findOne({ slug: req.params.slug });

    if (!destination) return next(AppError.notFound('Destination'));

    // Populate nearby tours — also accept docs without isActive field (seed data)
    const nearbyToursRaw = await Tour.find({
      destination: destination._id,
      $or: [{ isActive: true }, { isActive: { $exists: false } }],
    })
      .sort('-rating')
      .limit(6)
      .select('title slug type difficulty price discountPrice duration coverImage rating reviewCount isFeatured')
      .lean();

    // Normalize duration to a plain number for the frontend
    const nearbyTours = nearbyToursRaw.map((t) => ({
      ...t,
      duration: t.duration && typeof t.duration === 'object'
        ? (t.duration.days ?? t.duration.nights ?? 0)
        : (t.duration ?? 0),
    }));

    res.status(200).json({
      status: 'success',
      data: {
        destination,
        nearbyTours,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/destinations/region/:region ──────────────────────────
export const getDestinationsByRegion = async (req, res, next) => {
  try {
    const { region } = req.params;
    const validRegions = ['North', 'South', 'East', 'West', 'Northeast', 'Central', 'Islands'];

    if (!validRegions.includes(region)) {
      return next(AppError.badRequest(`Invalid region. Must be one of: ${validRegions.join(', ')}`));
    }

    const limit = Math.min(50, parseInt(req.query.limit, 10) || 20);

    const destinations = await Destination.find({ region })
      .sort('-isPopular -rating')
      .limit(limit)
      .select('name slug type state coverImage rating reviewCount isFeatured isPopular tagline')
      .lean();

    res.status(200).json({
      status: 'success',
      results: destinations.length,
      data: { region, destinations },
    });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/destinations/search?q= ──────────────────────────────
// Text search across name, state, tags (uses MongoDB $text index)
export const searchDestinations = async (req, res, next) => {
  try {
    const { q, limit = 10 } = req.query;

    if (!q || q.trim().length < 2) {
      return next(AppError.badRequest('Search query must be at least 2 characters.'));
    }

    const limitNum = Math.min(20, parseInt(limit, 10));

    const destinations = await Destination.find(
      { $text: { $search: q } },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .limit(limitNum)
      .select('name slug type state region coverImage rating isFeatured isPopular tagline')
      .lean();

    res.status(200).json({
      status: 'success',
      results: destinations.length,
      data: { destinations },
    });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/destinations — Admin only ───────────────────────────
export const createDestination = async (req, res, next) => {
  try {
    const destination = await Destination.create(req.body);

    res.status(201).json({
      status: 'success',
      data: { destination },
    });
  } catch (err) {
    next(err);
  }
};

// ── PATCH /api/destinations/:id — Admin only ──────────────────────
export const updateDestination = async (req, res, next) => {
  try {
    if (req.body.name && !req.body.slug) {
      req.body.slug = req.body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    const destination = await Destination.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!destination) return next(AppError.notFound('Destination'));

    res.status(200).json({
      status: 'success',
      data: { destination },
    });
  } catch (err) {
    next(err);
  }
};

// ── DELETE /api/destinations/:id — Admin only ─────────────────────
export const deleteDestination = async (req, res, next) => {
  try {
    const destination = await Destination.findByIdAndDelete(req.params.id);

    if (!destination) return next(AppError.notFound('Destination'));

    res.status(204).json({ status: 'success', data: null });
  } catch (err) {
    next(err);
  }
};
