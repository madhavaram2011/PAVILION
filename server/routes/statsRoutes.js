import express from 'express';
import { getStats } from '../controllers/statsController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

// ── GET /api/stats — Admin dashboard ─────────────────────────────
router.get('/', protect, restrictTo('admin'), getStats);

export default router;
