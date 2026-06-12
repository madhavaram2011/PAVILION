import express from 'express';
import { check } from 'express-validator';
import { validate } from '../middleware/validationMiddleware.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '../controllers/userController.js';

// Legacy signup/login still available at /api/users/* for backward compat
import { register as signup, login } from '../controllers/authController.js';

const router = express.Router();

// ── Public (legacy endpoints kept for backward compat) ────────────

// POST /api/users/signup
router.post(
  '/signup',
  [
    check('name').notEmpty().withMessage('Name is required.'),
    check('email').normalizeEmail().isEmail().withMessage('Valid email required.'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters.'),
  ],
  validate,
  signup
);

// POST /api/users/login
router.post(
  '/login',
  [
    check('email').normalizeEmail().isEmail().withMessage('Valid email required.'),
    check('password').notEmpty().withMessage('Password is required.'),
  ],
  validate,
  login
);

// ── Admin-only user management ────────────────────────────────────
router.use(protect, restrictTo('admin'));

router.get('/',     getUsers);
router.get('/:id',  getUserById);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
