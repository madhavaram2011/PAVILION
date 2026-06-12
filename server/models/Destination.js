import mongoose from 'mongoose';

// ── Climate sub-schema ───────────────────────────────────────────
const climateMonthSchema = new mongoose.Schema(
  {
    month: {
      type: String,
      required: true,
      enum: [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December',
      ],
    },
    minTemp: { type: Number },            // °C
    maxTemp: { type: Number },            // °C
    rainfall: { type: Number, default: 0 }, // mm
    season: {
      type: String,
      enum: ['Summer', 'Winter', 'Monsoon', 'Spring', 'Autumn', 'Post-Monsoon'],
    },
  },
  { _id: false }
);

// ── Accommodation sub-schema ─────────────────────────────────────
const accommodationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ['Budget', 'Mid-Range', 'Luxury', 'Homestay', 'Resort', 'Hostel', 'Camp', 'Houseboat'],
    },
    priceRange: { type: String }, // e.g. "₹800 - ₹2,500"
  },
  { _id: false }
);

// ── Fact sub-schema ──────────────────────────────────────────────
const factSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    value: { type: String, required: true },
  },
  { _id: false }
);

// ── How To Reach sub-schema ──────────────────────────────────────
const howToReachSchema = new mongoose.Schema(
  {
    byAir: { type: String, default: '' },
    byTrain: { type: String, default: '' },
    byRoad: { type: String, default: '' },
  },
  { _id: false }
);

// ══════════════════════════════════════════════════════════════════
// ██ DESTINATION SCHEMA
// ══════════════════════════════════════════════════════════════════
const destinationSchema = new mongoose.Schema(
  {
    // ── Identity ──────────────────────────────────────────────────
    name: {
      type: String,
      required: [true, 'Destination name is required'],
      trim: true,
      maxlength: [120, 'Name cannot exceed 120 characters'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    // ── Location ──────────────────────────────────────────────────
    region: {
      type: String,
      required: [true, 'Region is required'],
      enum: {
        values: ['North', 'South', 'East', 'West', 'Northeast', 'Central', 'Islands'],
        message: '{VALUE} is not a valid region',
      },
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true,
    },
    city: {
      type: String,
      trim: true,
      default: '',
    },
    country: {
      type: String,
      default: 'India',
    },
    coordinates: {
      lat: { type: Number, required: [true, 'Latitude is required'] },
      lng: { type: Number, required: [true, 'Longitude is required'] },
    },

    // ── Classification ────────────────────────────────────────────
    type: {
      type: String,
      required: [true, 'Destination type is required'],
      enum: {
        values: [
          'Beach', 'Mountain', 'Desert', 'Wildlife', 'Cultural',
          'Spiritual', 'Adventure', 'Heritage', 'Hill Station',
          'Backwater', 'Island', 'Forest',
        ],
        message: '{VALUE} is not a valid destination type',
      },
    },

    // ── Content ───────────────────────────────────────────────────
    tagline: {
      type: String,
      trim: true,
      maxlength: [200, 'Tagline cannot exceed 200 characters'],
      default: '',
    },
    intro: {
      type: String,
      trim: true,
      default: '',
    },
    history: {
      type: String,
      trim: true,
      default: '',
    },

    // ── Visit Info ────────────────────────────────────────────────
    bestTimeToVisit: {
      type: String,
      trim: true,
      default: '',
    },
    howToReach: {
      type: howToReachSchema,
      default: () => ({}),
    },
    entryFee: {
      type: String,
      default: 'Free',
    },
    timings: {
      type: String,
      default: 'Open 24 hours',
    },
    bestDuration: {
      type: String,
      default: '',   // e.g. "2-3 days"
    },

    // ── Media ─────────────────────────────────────────────────────
    coverImage: {
      type: String,
      default: '',
    },
    gallery: [{ type: String }],

    // ── Data Arrays ───────────────────────────────────────────────
    facts: [factSchema],
    climate: [climateMonthSchema],
    nearbyAttractions: [{ type: String }],
    thingsToDo: [{ type: String }],
    localCuisine: [{ type: String }],
    accommodation: [accommodationSchema],

    // ── Tags & Flags ──────────────────────────────────────────────
    tags: [{ type: String }],
    isFeatured: { type: Boolean, default: false, index: true },
    isPopular: { type: Boolean, default: false, index: true },

    // ── Ratings ───────────────────────────────────────────────────
    rating: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be below 0'],
      max: [5, 'Rating cannot exceed 5'],
      set: (val) => Math.round(val * 10) / 10, // round to 1 decimal
    },
    reviewCount: {
      type: Number,
      default: 0,
    },

    // ── References ────────────────────────────────────────────────
    tours: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tour' }],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ── Indexes ────────────────────────────────────────────────────────
destinationSchema.index({ name: 'text', tagline: 'text', tags: 'text' });
destinationSchema.index({ region: 1, type: 1 });
destinationSchema.index({ rating: -1 });

// ── Virtual: reviews ───────────────────────────────────────────────
destinationSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'destination',
  localField: '_id',
});



const Destination = mongoose.model('Destination', destinationSchema);
export default Destination;
