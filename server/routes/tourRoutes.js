import express from 'express';
import {
  getAllTours,
  getFeaturedTours,
  getTourById,
  getTourBySlug,
  createTour,
  updateTour,
  deleteTour,
} from '../controllers/tourController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

// ── Public ────────────────────────────────────────────────────────
router.get('/',           getAllTours);
router.get('/featured',   getFeaturedTours);
router.get('/id/:id',     getTourById);
router.get('/:slug',      getTourBySlug);

// ── Admin only ────────────────────────────────────────────────────
router.use(protect, restrictTo('admin'));

router.post('/',    createTour);
router.patch('/:id', updateTour);
router.delete('/:id', deleteTour);

export default router;
