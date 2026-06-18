import Review from '../models/Review.js';
import AppError from '../utils/AppError.js';

// ── GET /api/reviews/tour/:tourId ─────────────────────────────────
export const getTourReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ tour: req.params.tourId }).populate('user', 'name avatar');
    res.status(200).json({ status: 'success', results: reviews.length, data: { reviews } });
  } catch (err) { next(err); }
};

// ── POST /api/reviews ─────────────────────────────────────────────
export const createReview = async (req, res, next) => {
  try {
    const { rating, tour, destination, title, text } = req.body;
    if (!rating || (!tour && !destination)) {
      return next(AppError.badRequest('Rating and either Tour or Destination ID are required.'));
    }
    const existing = await Review.findOne({ user: req.user._id, tour });
    if (existing) return next(AppError.conflict('You have already reviewed this tour.'));

    const review = await Review.create({ user: req.user._id, tour, destination, rating, title, text });
    res.status(201).json({ status: 'success', data: { review } });
  } catch (err) { next(err); }
};

// ── PATCH /api/reviews/:id ────────────────────────────────────────
export const updateReview = async (req, res, next) => {
  try {
    let review = await Review.findById(req.params.id);
    if (!review) return next(AppError.notFound('Review'));
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return next(AppError.forbidden('Not authorized to edit this review.'));
    }
    review = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({ status: 'success', data: { review } });
  } catch (err) { next(err); }
};

// ── DELETE /api/reviews/:id ───────────────────────────────────────
export const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return next(AppError.notFound('Review'));
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return next(AppError.forbidden('Not authorized to delete this review.'));
    }
    await review.deleteOne();
    res.status(204).json({ status: 'success', data: null });
  } catch (err) { next(err); }
};
