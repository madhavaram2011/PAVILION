import express from 'express';
import { getTourReviews, createReview, updateReview, deleteReview } from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// ── Public ────────────────────────────────────────────────────────
router.get('/tour/:tourId', getTourReviews);

// ── Protected ─────────────────────────────────────────────────────
router.use(protect);
router.post('/', createReview);
router.route('/:id')
  .patch(updateReview)
  .delete(deleteReview);

export default router;
