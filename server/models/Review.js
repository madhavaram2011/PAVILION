import mongoose from 'mongoose';

// ══════════════════════════════════════════════════════════════════
// ██ REVIEW SCHEMA
// ══════════════════════════════════════════════════════════════════
const reviewSchema = new mongoose.Schema(
  {
    // ── Author ────────────────────────────────────────────────────
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },

    // ── Target (one of tour OR destination) ───────────────────────
    tour: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tour',
      default: null,
    },
    destination: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Destination',
      default: null,
    },

    // ── Content ───────────────────────────────────────────────────
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    title: {
      type: String,
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
      default: '',
    },
    text: {
      type: String,
      trim: true,
      maxlength: [2000, 'Review text cannot exceed 2000 characters'],
      default: '',
    },

    // ── Metadata ──────────────────────────────────────────────────
    isVerified: {
      type: Boolean,
      default: false,
    },
    helpfulCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ── Indexes ────────────────────────────────────────────────────────
// Prevent duplicate reviews: one review per user per tour/destination
reviewSchema.index({ user: 1, tour: 1 }, {
  unique: true,
  partialFilterExpression: { tour: { $type: 'objectId' } },
});
reviewSchema.index({ user: 1, destination: 1 }, {
  unique: true,
  partialFilterExpression: { destination: { $type: 'objectId' } },
});
reviewSchema.index({ tour: 1, rating: -1 });
reviewSchema.index({ destination: 1, rating: -1 });

// Validation handled by application logic or validators; pre-validate hook removed

// ── Static: calculate and update average rating ────────────────────
reviewSchema.statics.calcAverageRating = async function (targetId, targetType) {
  const matchField = targetType === 'Tour' ? 'tour' : 'destination';

  const stats = await this.aggregate([
    { $match: { [matchField]: targetId } },
    {
      $group: {
        _id: `$${matchField}`,
        avgRating: { $avg: '$rating' },
        numReviews: { $sum: 1 },
      },
    },
  ]);

  const Model = mongoose.model(targetType);

  if (stats.length > 0) {
    await Model.findByIdAndUpdate(targetId, {
      rating: stats[0].avgRating,
      reviewCount: stats[0].numReviews,
    });
  } else {
    await Model.findByIdAndUpdate(targetId, {
      rating: 0,
      reviewCount: 0,
    });
  }
};

// ── Post-save: recalculate ratings ─────────────────────────────────
reviewSchema.post('save', function () {
  if (this.tour) {
    this.constructor.calcAverageRating(this.tour, 'Tour');
  } else if (this.destination) {
    this.constructor.calcAverageRating(this.destination, 'Destination');
  }
});

// ── Post-remove: recalculate ratings ───────────────────────────────
reviewSchema.post(/^findOneAnd/, async function (doc) {
  if (doc) {
    if (doc.tour) {
      await doc.constructor.calcAverageRating(doc.tour, 'Tour');
    } else if (doc.destination) {
      await doc.constructor.calcAverageRating(doc.destination, 'Destination');
    }
  }
});

const Review = mongoose.model('Review', reviewSchema);
export default Review;
