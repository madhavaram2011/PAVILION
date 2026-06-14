import mongoose from 'mongoose';
import Tour from '../models/Tour.js';
import Destination from '../models/Destination.js';
import AppError from '../utils/AppError.js';

// ── GET /api/tours ────────────────────────────────────────────────
// Filters: region, type, difficulty, minPrice, maxPrice, duration, search
// Pagination: page, limit — returns totalPages
export const getAllTours = async (req, res, next) => {
  try {
    const {
      region,
      type,
      difficulty,
      minPrice,
      maxPrice,
      duration,   // exact days (number)
      minDuration,
      maxDuration,
      search,
      category,
      isFeatured,
      page  = 1,
      limit = 12,
      sort  = '-createdAt',
    } = req.query;

    // ── Build filter object ──────────────────────────────────────
    const filter = {};

    if (type)       filter.type       = type;
    if (difficulty) filter.difficulty = difficulty;
    if (category)   filter.category   = category;
    if (isFeatured !== undefined) filter.isFeatured = isFeatured === 'true';

    // Price range
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Duration filter (duration.days)
    if (duration) {
      filter['duration.days'] = Number(duration);
    } else if (minDuration || maxDuration) {
      filter['duration.days'] = {};
      if (minDuration) filter['duration.days'].$gte = Number(minDuration);
      if (maxDuration) filter['duration.days'].$lte = Number(maxDuration);
    }

    // Region filter — need to find destination IDs in that region first
    if (region) {
      const destIds = await Destination.find({ region }).select('_id').lean();
      filter.destination = { $in: destIds.map((d) => d._id) };
    }

    // Text search
    if (search) {
      filter.$text = { $search: search };
    }

    // ── Pagination ───────────────────────────────────────────────
    const pageNum  = Math.max(1, parseInt(page,  10));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
    const skip     = (pageNum - 1) * limitNum;

    // ── Sorting ──────────────────────────────────────────────────
    const sortMap = {
      'price_asc':   'price',
      'price_desc':  '-price',
      'rating_desc': '-rating',
      'newest':      '-createdAt',
      'popular':     '-reviewCount',
    };
    const sortStr = sortMap[sort] || sort;

    // ── Query ────────────────────────────────────────────────────
    const [tours, total] = await Promise.all([
      Tour.find(filter)
        .populate('destination', 'name slug region state coverImage')
        .sort(sortStr)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Tour.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    res.status(200).json({
      status: 'success',
      results: tours.length,
      pagination: {
        total,
        totalPages,
        currentPage: pageNum,
        limit: limitNum,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
      data: { tours },
    });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/tours/featured ───────────────────────────────────────
export const getFeaturedTours = async (req, res, next) => {
  try {
    const limit = Math.min(20, parseInt(req.query.limit, 10) || 6);

    let tours = await Tour.find({ isFeatured: true })
      .populate('destination', 'name slug region state coverImage')
      .sort('-rating -reviewCount')
      .limit(limit)
      .lean();

    if (tours.length === 0) {
      tours = await Tour.find({})
        .populate('destination', 'name slug region state coverImage')
        .sort('-rating -reviewCount')
        .limit(limit)
        .lean();
    }

    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: { tours },
    });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/tours/id/:id ────────────────────────────────────────
// Accepts both a MongoDB ObjectId AND a slug — detects which one was passed.
export const getTourById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const isObjectId = mongoose.Types.ObjectId.isValid(id);

    const activeFilter = {
      $or: [{ isActive: true }, { isActive: { $exists: false } }],
    };

    const tour = await (
      isObjectId
        ? Tour.findOne({ _id: id, ...activeFilter })
        : Tour.findOne({ slug: id, ...activeFilter })
    )
      .populate('destination', 'name slug region state coverImage coordinates howToReach')
      .populate('guides', 'name avatar');

    if (!tour) return next(new AppError('Tour not found', 404));

    res.status(200).json({
      status: 'success',
      data: { tour },
    });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/tours/:slug ──────────────────────────────────────────
export const getTourBySlug = async (req, res, next) => {
  try {
    const tour = await Tour.findOne({
      slug: req.params.slug,
      $or: [
        { isActive: true },
        { isActive: { $exists: false } },
      ],
    })
      .populate('destination', 'name slug region state coverImage coordinates howToReach')
      .populate('guides', 'name avatar');

    if (!tour) return next(AppError.notFound('Tour'));

    // Normalize to a plain object and add frontend-friendly aliases
    const t = tour.toObject({ virtuals: true });

    // ── Field aliases for TourDetailPage ──────────────────────────
    // cover image
    t.cover = t.coverImage || '';

    // subtitle (may be stored directly, or fall back to region string)
    t.subtitle = t.subtitle || (t.destination?.region ? `${t.destination.region.toUpperCase()}` : '');

    // region / state — prefer stored values, then populated destination
    t.region = t.region || t.destination?.region || '';
    t.state  = t.state  || t.destination?.state  || '';

    // duration — frontend expects a plain number (days)
    if (t.duration && typeof t.duration === 'object') {
      t.duration = t.duration.days ?? t.duration.nights ?? 0;
    }

    // groupSize — frontend expects a plain number (max)
    if (t.groupSize && typeof t.groupSize === 'object') {
      t.groupSize = t.groupSize.max ?? 20;
    }

    // reviews count alias
    t.reviews = t.reviewCount ?? 0;

    // included / excluded aliases (seed data stored them directly; schema now has both)
    t.included = t.included?.length ? t.included : (t.includes ?? []);
    t.excluded = t.excluded?.length ? t.excluded : (t.excludes ?? []);

    // guides — populate returns User docs ({name, avatar}); frontend expects {name, role, exp, summits, img}
    // If guides are User refs, map to a display shape; if empty provide empty array
    if (Array.isArray(t.guides)) {
      t.guides = t.guides.map((g) =>
        typeof g === 'object' && g !== null
          ? {
              name: g.name || 'Guide',
              role: g.role || 'Expedition Guide',
              exp: g.experience || g.exp || '',
              summits: g.speciality || g.summits || '',
              img: g.avatar || g.img || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
            }
          : g
      );
    }

    // itinerary — ensure each item exposes both .description and .desc
    if (Array.isArray(t.itinerary)) {
      t.itinerary = t.itinerary.map((item) => ({
        ...item,
        desc: item.desc || item.description || '',
      }));
    }

    // gallery — ensure it's always an array
    t.gallery = Array.isArray(t.gallery) ? t.gallery : [];

    // highlights — ensure it's always an array
    t.highlights = Array.isArray(t.highlights) ? t.highlights : [];

    // tags — ensure it's always an array
    t.tags = Array.isArray(t.tags) ? t.tags : [];

    res.status(200).json({
      status: 'success',
      data: { tour: t },
    });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/tours — Admin only ──────────────────────────────────
export const createTour = async (req, res, next) => {
  try {
    const tour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: { tour },
    });
  } catch (err) {
    next(err);
  }
};

// ── PATCH /api/tours/:id — Admin only ────────────────────────────
export const updateTour = async (req, res, next) => {
  try {
    // Prevent slug override unless explicitly set
    if (req.body.title && !req.body.slug) {
      req.body.slug = req.body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!tour) return next(AppError.notFound('Tour'));

    res.status(200).json({
      status: 'success',
      data: { tour },
    });
  } catch (err) {
    next(err);
  }
};

// ── DELETE /api/tours/:id — Admin only ───────────────────────────
export const deleteTour = async (req, res, next) => {
  try {
    // Soft-delete: set isActive = false
    const tour = await Tour.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!tour) return next(AppError.notFound('Tour'));

    res.status(204).json({ status: 'success', data: null });
  } catch (err) {
    next(err);
  }
};
