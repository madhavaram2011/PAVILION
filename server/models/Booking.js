import mongoose from 'mongoose';

// ── Guest info sub-schema ────────────────────────────────────────
const guestInfoSchema = new mongoose.Schema(
  {
    adults: { type: Number, required: true, min: 1, default: 1 },
    children: { type: Number, default: 0, min: 0 },
    infants: { type: Number, default: 0, min: 0 },
  },
  { _id: false }
);

// ── Contact info sub-schema ──────────────────────────────────────
const contactInfoSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    alternatePhone: { type: String, trim: true, default: '' },
  },
  { _id: false }
);

// ── Payment details sub-schema ───────────────────────────────────
const paymentDetailsSchema = new mongoose.Schema(
  {
    method: {
      type: String,
      enum: ['Credit Card', 'Debit Card', 'UPI', 'Net Banking', 'Wallet', 'Cash', 'EMI'],
      default: 'UPI',
    },
    transactionId: { type: String, default: '' },
    paidAt: { type: Date },
  },
  { _id: false }
);

// ══════════════════════════════════════════════════════════════════
// ██ BOOKING SCHEMA
// ══════════════════════════════════════════════════════════════════
const bookingSchema = new mongoose.Schema(
  {
    // ── References ────────────────────────────────────────────────
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Booking must belong to a user'],
      index: true,
    },
    tour: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tour',
      required: [true, 'Booking must be for a tour'],
      index: true,
    },
    destination: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Destination',
      index: true,
    },

    // ── Dates ─────────────────────────────────────────────────────
    bookingDate: {
      type: Date,
      default: Date.now,
    },
    travelDate: {
      type: Date,
      required: [true, 'Travel date is required'],
    },
    returnDate: {
      type: Date,
    },

    // ── Guests ────────────────────────────────────────────────────
    guests: {
      type: guestInfoSchema,
      required: true,
      default: () => ({ adults: 1, children: 0, infants: 0 }),
    },

    // ── Pricing ───────────────────────────────────────────────────
    pricePerPerson: {
      type: Number,
      required: [true, 'Price per person is required'],
      min: 0,
    },
    totalPrice: {
      type: Number,
      required: [true, 'Total price is required'],
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
    },
    tax: {
      type: Number,
      default: 0,
      min: 0,
    },
    currency: {
      type: String,
      default: 'INR',
      enum: ['INR', 'USD', 'EUR', 'GBP'],
    },

    // ── Status ────────────────────────────────────────────────────
    status: {
      type: String,
      enum: {
        values: ['pending', 'confirmed', 'cancelled', 'completed', 'refunded', 'no-show'],
        message: '{VALUE} is not a valid booking status',
      },
      default: 'pending',
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: {
        values: ['pending', 'paid', 'partially-paid', 'refunded', 'failed'],
        message: '{VALUE} is not a valid payment status',
      },
      default: 'pending',
    },

    // ── Payment ───────────────────────────────────────────────────
    payment: {
      type: paymentDetailsSchema,
      default: () => ({}),
    },

    // ── Contact ───────────────────────────────────────────────────
    contactInfo: {
      type: contactInfoSchema,
      required: [true, 'Contact information is required'],
    },

    // ── Extra ─────────────────────────────────────────────────────
    specialRequests: {
      type: String,
      trim: true,
      maxlength: [1000, 'Special requests cannot exceed 1000 characters'],
      default: '',
    },
    bookingReference: {
      type: String,
      unique: true,
      index: true,
    },
    cancellationReason: {
      type: String,
      trim: true,
      default: '',
    },
    cancelledAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ── Indexes ────────────────────────────────────────────────────────
bookingSchema.index({ user: 1, status: 1 });
bookingSchema.index({ travelDate: 1 });
bookingSchema.index({ bookingReference: 1 });

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
