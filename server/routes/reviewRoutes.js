import express from 'express';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// ── Stub controllers (replace with real imports once controller exists) ──
const createReview = (req, res) => {
  res.status(201).json({
    status: 'success',
    message: 'createReview stub — controller not yet implemented.',
  });
};

const getTourReviews = (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'getTourReviews stub — controller not yet implemented.',
    tourId: req.params.tourId,
    data: [],
  });
};

// ── Routes ───────────────────────────────────────────────────────────────
// POST /api/reviews          — create a review (auth required)
router.post('/', protect, createReview);

// GET  /api/reviews/tour/:tourId — fetch all reviews for a tour (public)
router.get('/tour/:tourId', getTourReviews);

export default router;
