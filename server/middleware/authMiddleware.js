import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import AppError from '../utils/AppError.js';

if (!process.env.JWT_SECRET) {
  throw new Error('CRITICAL CONFIG ERROR: JWT_SECRET environment variable is missing!');
}
const JWT_SECRET = process.env.JWT_SECRET;

// ── protect ───────────────────────────────────────────────────────
/**
 * Verifies the access JWT from the Authorization header.
 * Attaches the full Mongoose user document to req.user.
 */
export const protect = async (req, res, next) => {
  try {
    // 1. Extract token
    let token;
    if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(AppError.unauthorized('Authentication required. Please log in.'));
    }

    // 2. Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch {
      return next(AppError.unauthorized('Invalid or expired token. Please log in again.'));
    }

    // 3. Check user still exists
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(AppError.unauthorized('The user belonging to this token no longer exists.'));
    }

    // 4. Check if password changed after token was issued
    if (user.changedPasswordAfter(decoded.iat)) {
      return next(AppError.unauthorized('Password recently changed. Please log in again.'));
    }

    // 5. Attach user to request
    req.user     = user;
    req.userData = { userId: user._id }; // backward compat with old middleware
    next();
  } catch (err) {
    next(err);
  }
};

// ── restrictTo ────────────────────────────────────────────────────
/**
 * Role-based access control.
 * Usage: restrictTo('admin'), restrictTo('admin', 'guide')
 */
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(AppError.unauthorized('Authentication required.'));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        AppError.forbidden(
          `Access denied. This action requires one of the following roles: ${roles.join(', ')}.`
        )
      );
    }

    next();
  };
};

// ── checkAuth — legacy alias ──────────────────────────────────────
export const checkAuth = protect;
