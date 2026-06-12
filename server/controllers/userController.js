import User from '../models/User.js';
import AppError from '../utils/AppError.js';

// ── GET /api/users — Admin: all users ────────────────────────────
export const getUsers = async (req, res, next) => {
  try {
    const { role, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (role) filter.role = role;

    const pageNum  = Math.max(1, parseInt(page,  10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip     = (pageNum - 1) * limitNum;

    const [users, total] = await Promise.all([
      User.find(filter)
        .select('-password -passwordChangedAt -passwordResetToken -passwordResetExpires')
        .sort('-createdAt')
        .skip(skip)
        .limit(limitNum)
        .lean(),
      User.countDocuments(filter),
    ]);

    res.status(200).json({
      status: 'success',
      results: users.length,
      pagination: {
        total,
        totalPages: Math.ceil(total / limitNum),
        currentPage: pageNum,
        limit: limitNum,
      },
      data: { users },
    });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/users/:id — Admin: single user ───────────────────────
export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -passwordChangedAt -passwordResetToken -passwordResetExpires')
      .lean();

    if (!user) return next(AppError.notFound('User'));

    res.status(200).json({
      status: 'success',
      data: { user },
    });
  } catch (err) {
    next(err);
  }
};

// ── PATCH /api/users/:id — Admin: update role / status ───────────
export const updateUser = async (req, res, next) => {
  try {
    // Admin can change role and active status only (not password via this route)
    const allowed = ['role', 'isActive', 'name', 'phone', 'avatar'];
    const updates = {};
    allowed.forEach((f) => {
      if (req.body[f] !== undefined) updates[f] = req.body[f];
    });

    if (req.body.password) {
      return next(AppError.badRequest('Cannot update password through this route.'));
    }

    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).select('-password -passwordChangedAt -passwordResetToken -passwordResetExpires');

    if (!user) return next(AppError.notFound('User'));

    res.status(200).json({
      status: 'success',
      data: { user },
    });
  } catch (err) {
    next(err);
  }
};

// ── DELETE /api/users/:id — Admin: deactivate user ────────────────
export const deleteUser = async (req, res, next) => {
  try {
    // Soft-delete: mark inactive (User pre-query filter handles it)
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!user) return next(AppError.notFound('User'));

    res.status(204).json({ status: 'success', data: null });
  } catch (err) {
    next(err);
  }
};


