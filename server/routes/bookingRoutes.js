import express from 'express';
import {
  createBooking,
  getMyBookings,
  cancelBooking,
  getAllBookings,
  updateBookingStatus,
} from '../controllers/bookingController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

// ── All booking routes require authentication ─────────────────────
router.use(protect);

// ── User routes ───────────────────────────────────────────────────
router.post('/',                   createBooking);
router.get('/my',                  getMyBookings);
router.patch('/:id/cancel',        cancelBooking);

// ── Admin only ────────────────────────────────────────────────────
router.get('/', restrictTo('admin'), getAllBookings);
router.patch('/:id/status', restrictTo('admin'), updateBookingStatus);

export default router;
