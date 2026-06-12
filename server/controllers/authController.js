import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import AppError from '../utils/AppError.js';

// ── Token helpers ─────────────────────────────────────────────────
const JWT_SECRET         = process.env.JWT_SECRET         || 'pavilion_super_secret_key_2024';
const JWT_EXPIRES_IN     = process.env.JWT_EXPIRES_IN     || '15m';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || `${JWT_SECRET}_refresh`;
const JWT_REFRESH_EXPIRES= process.env.JWT_REFRESH_EXPIRES|| '7d';

const signAccessToken = (id) =>
  jwt.sign({ id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

const signRefreshToken = (id) =>
  jwt.sign({ id }, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRES });

/** Cookie options for the refresh token */
const refreshCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
};

/** Strip sensitive fields and return a clean user object */
const sanitizeUser = (user) => {
  const obj = user.toObject ? user.toObject() : { ...user };
  delete obj.password;
  delete obj.passwordChangedAt;
  delete obj.passwordResetToken;
  delete obj.passwordResetExpires;
  delete obj.__v;
  return obj;
};

// ── POST /api/auth/register ───────────────────────────────────────
export const register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return next(AppError.badRequest('Name, email and password are required.'));
    }

    // Check for duplicate email
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return next(AppError.conflict('An account with this email already exists.'));
    }

    const user = await User.create({ name, email, password, phone: phone || '' });

    const accessToken  = signAccessToken(user._id);
    const refreshToken = signRefreshToken(user._id);

    res.cookie('refreshToken', refreshToken, refreshCookieOptions);

    res.status(201).json({
      status: 'success',
      accessToken,
      data: { user: sanitizeUser(user) },
    });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/auth/login ──────────────────────────────────────────
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(AppError.badRequest('Email and password are required.'));
    }

    // Explicitly select password (it's `select: false` in schema)
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');

    if (!user) {
      return next(AppError.unauthorized('Invalid email or password.'));
    }

    const isMatch = await user.comparePassword(password, user.password);
    if (!isMatch) {
      return next(AppError.unauthorized('Invalid email or password.'));
    }

    const accessToken  = signAccessToken(user._id);
    const refreshToken = signRefreshToken(user._id);

    res.cookie('refreshToken', refreshToken, refreshCookieOptions);

    res.status(200).json({
      status: 'success',
      accessToken,
      data: { user: sanitizeUser(user) },
    });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/auth/logout ─────────────────────────────────────────
export const logout = (req, res) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });

  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully.',
  });
};

// ── POST /api/auth/refresh-token ──────────────────────────────────
export const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken;

    if (!token) {
      return next(AppError.unauthorized('No refresh token. Please log in.'));
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_REFRESH_SECRET);
    } catch {
      return next(AppError.unauthorized('Invalid or expired refresh token. Please log in again.'));
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return next(AppError.unauthorized('User no longer exists.'));
    }

    if (user.changedPasswordAfter(decoded.iat)) {
      return next(AppError.unauthorized('Password recently changed. Please log in again.'));
    }

    const newAccessToken  = signAccessToken(user._id);
    const newRefreshToken = signRefreshToken(user._id);

    res.cookie('refreshToken', newRefreshToken, refreshCookieOptions);

    res.status(200).json({
      status: 'success',
      accessToken: newAccessToken,
    });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/auth/me ──────────────────────────────────────────────
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return next(AppError.notFound('User'));

    res.status(200).json({
      status: 'success',
      data: { user: sanitizeUser(user) },
    });
  } catch (err) {
    next(err);
  }
};

// ── PATCH /api/auth/update-me ─────────────────────────────────────
export const updateMe = async (req, res, next) => {
  try {
    // Prevent password update via this route
    if (req.body.password || req.body.passwordConfirm) {
      return next(
        AppError.badRequest('This route is not for password updates. Use /change-password.')
      );
    }

    // Filter allowed fields only
    const allowed = ['name', 'phone', 'avatar'];
    const updates = {};
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) return next(AppError.notFound('User'));

    res.status(200).json({
      status: 'success',
      data: { user: sanitizeUser(updatedUser) },
    });
  } catch (err) {
    next(err);
  }
};
