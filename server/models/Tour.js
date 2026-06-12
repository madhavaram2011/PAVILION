import mongoose from 'mongoose';

// ── Itinerary Day sub-schema ─────────────────────────────────────
const itineraryDaySchema = new mongoose.Schema(
  {
    day: { type: Number, required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: '' },
    activities: [{ type: String }],
    accommodation: { type: String, default: '' },
    meals: {
      breakfast: { type: Boolean, default: false },
      lunch: { type: Boolean, default: false },
      dinner: { type: Boolean, default: false },
    },
  },
  { _id: false }
);

// ── Location stop sub-schema ─────────────────────────────────────
const locationStopSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: '' },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },
    day: { type: Number },
  },
  { _id: false }
);

// ── FAQ sub-schema ───────────────────────────────────────────────
const faqSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
  },
  { _id: false }
);

// ══════════════════════════════════════════════════════════════════
// ██ TOUR SCHEMA
// ══════════════════════════════════════════════════════════════════
const tourSchema = new mongoose.Schema(
  {
    // ── Identity ──────────────────────────────────────────────────
    title: {
      type: String,
      required: [true, 'Tour title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'Tour summary is required'],
      maxlength: [300, 'Summary cannot exceed 300 characters'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    highlights: [{ type: String }],

    // ── Destination ref ───────────────────────────────────────────
    destination: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Destination',
      required: [true, 'Tour must belong to a destination'],
      index: true,
    },

    // ── Duration & Group ──────────────────────────────────────────
    duration: {
      days: { type: Number, required: [true, 'Number of days is required'], min: 1 },
      nights: { type: Number, required: [true, 'Number of nights is required'], min: 0 },
    },
    groupSize: {
      min: { type: Number, default: 1 },
      max: { type: Number, default: 20 },
    },

    // ── Pricing ───────────────────────────────────────────────────
    price: {
      type: Number,
      required: [true, 'Tour price is required'],
      min: [0, 'Price cannot be negative'],
    },
    discountPrice: {
      type: Number,
      min: 0,
      validate: {
        validator: function (val) {
          // discount must be less than original price
          return val === undefined || val === null || val < this.price;
        },
        message: 'Discount price ({VALUE}) must be less than regular price',
      },
    },
    currency: {
      type: String,
      default: 'INR',
      enum: ['INR', 'USD', 'EUR', 'GBP'],
    },

    // ── Classification ────────────────────────────────────────────
    difficulty: {
      type: String,
      enum: {
        values: ['Easy', 'Moderate', 'Challenging', 'Extreme'],
        message: '{VALUE} is not a valid difficulty level',
      },
      default: 'Easy',
    },
    type: {
      type: String,
      enum: [
        'Beach', 'Mountain', 'Desert', 'Wildlife', 'Cultural',
        'Spiritual', 'Adventure', 'Heritage', 'Hill Station',
        'Backwater', 'Island', 'Forest', 'Multi-Destination',
      ],
      default: 'Cultural',
    },
    category: {
      type: String,
      enum: ['Group', 'Private', 'Self-Guided', 'Luxury', 'Budget', 'Family', 'Honeymoon', 'Solo'],
      default: 'Group',
    },

    // ── Itinerary ─────────────────────────────────────────────────
    itinerary: [itineraryDaySchema],

    // ── Inclusions / Exclusions ───────────────────────────────────
    includes: [{ type: String }],
    excludes: [{ type: String }],

    // ── Media ─────────────────────────────────────────────────────
    coverImage: {
      type: String,
      default: '',
    },
    gallery: [{ type: String }],

    // ── Schedule ──────────────────────────────────────────────────
    startDates: [{ type: Date }],
    startLocation: {
      name: { type: String, default: '' },
      coordinates: {
        lat: { type: Number },
        lng: { type: Number },
      },
    },
    locations: [locationStopSchema],

    // ── People ────────────────────────────────────────────────────
    guides: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

    // ── Ratings ───────────────────────────────────────────────────
    rating: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be below 0'],
      max: [5, 'Rating cannot exceed 5'],
      set: (val) => Math.round(val * 10) / 10,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },

    // ── Policies ──────────────────────────────────────────────────
    cancellationPolicy: {
      type: String,
      default: 'Free cancellation up to 7 days before departure.',
    },
    termsAndConditions: {
      type: String,
      default: '',
    },

    // ── FAQ ───────────────────────────────────────────────────────
    faqs: [faqSchema],

    // ── Flags ─────────────────────────────────────────────────────
    isFeatured: { type: Boolean, default: false, index: true },
    isActive: { type: Boolean, default: true, index: true },
    tags: [{ type: String }],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ── Indexes ────────────────────────────────────────────────────────
tourSchema.index({ title: 'text', summary: 'text', tags: 'text' });
tourSchema.index({ price: 1 });
tourSchema.index({ destination: 1, isActive: 1 });
tourSchema.index({ rating: -1 });

// ── Virtual: reviews ───────────────────────────────────────────────
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});



const Tour = mongoose.model('Tour', tourSchema);
export default Tour;
