/**
 * Pavilion India — Destination Seeder v2
 * ────────────────────────────────────────────────────────────────────────────
 * Connects to MongoDB, drops existing records, normalises data, and bulk-
 * inserts all 145 destinations using insertMany() for fast, reliable seeding.
 *
 * Usage:  node seeds/runSeed.js
 * ────────────────────────────────────────────────────────────────────────────
 */

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Destination from '../models/Destination.js';
import destinations from './seedDestinations.js';

dotenv.config();

// ── Constants ────────────────────────────────────────────────────────────────

const MONGO_URI = process.env.MONGODB_URI;

/** Map abbreviated month names → full names required by the Mongoose enum */
const MONTH_MAP = {
  Jan: 'January',  Feb: 'February', Mar: 'March',    Apr: 'April',
  May: 'May',      Jun: 'June',     Jul: 'July',      Aug: 'August',
  Sep: 'September',Oct: 'October',  Nov: 'November',  Dec: 'December',
};

/**
 * Map non-schema type values → nearest valid schema enum values.
 * Schema allows: Beach, Mountain, Desert, Wildlife, Cultural, Spiritual,
 *                Adventure, Heritage, Hill Station, Backwater, Island, Forest
 */
const TYPE_MAP = {
  Nature:       'Forest',
  Scenic:       'Forest',
  Lakes:        'Backwater',
  Lake:         'Backwater',
  Waterfall:    'Forest',
  Trekking:     'Adventure',
  Pilgrimage:   'Spiritual',
  Historical:   'Heritage',
  Hill:         'Hill Station',
};

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Expand abbreviated climate month names to the full names the Mongoose schema
 * enum expects.  Also tolerates already-expanded names (idempotent).
 */
function normaliseClimate(climate = []) {
  return climate.map((entry) => ({
    ...entry,
    month: MONTH_MAP[entry.month] ?? entry.month,
  }));
}

/**
 * Normalise a single destination document so it satisfies the Mongoose schema:
 *  - Expand abbreviated climate month names → full names (enum requirement)
 *  - Remap invalid `type` values → nearest valid enum value
 *  - Ensure required coordinates exist (fallback to 0,0 if somehow missing)
 */
function prepareDocument(raw) {
  return {
    ...raw,
    type: TYPE_MAP[raw.type] ?? raw.type,
    climate: normaliseClimate(raw.climate ?? []),
    coordinates: {
      lat: raw.coordinates?.lat ?? 0,
      lng: raw.coordinates?.lng ?? 0,
    },
  };
}

// ── Main seeder ──────────────────────────────────────────────────────────────

async function seed() {
  if (!MONGO_URI) {
    console.error('❌  MONGODB_URI is not defined in .env');
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGO_URI);
    console.log('🔗  Connected to MongoDB');

    // ── 1. Clear existing records ────────────────────────────────────────────
    const { deletedCount } = await Destination.deleteMany({});
    console.log(`🗑️   Cleared ${deletedCount} existing destination(s)`);

    // ── 2. Prepare & validate data ───────────────────────────────────────────
    const docs = destinations.map(prepareDocument);
    console.log(`📦  Preparing to insert ${docs.length} destinations…`);

    // ── 3. Bulk-insert ───────────────────────────────────────────────────────
    //   • ordered: false  → continue inserting even if one document fails
    //   • runValidators is NOT a valid option for insertMany on the collection
    //     level; instead we validate through Mongoose by using Model.insertMany
    //     with lean documents + { lean: true } (default).
    const result = await Destination.insertMany(docs, {
      ordered: false,          // non-blocking on individual failures
      rawResult: true,         // get the full driver result object
    });

    const insertedCount = result.insertedCount ?? result.mongoose?.results?.length ?? docs.length;
    console.log(`\n✅  Successfully seeded ${insertedCount} destinations into MongoDB!\n`);

    // ── 4. Print region breakdown ────────────────────────────────────────────
    const byRegion = docs.reduce((acc, d) => {
      acc[d.region] = (acc[d.region] || 0) + 1;
      return acc;
    }, {});
    console.log('📍  Breakdown by region:');
    for (const [region, count] of Object.entries(byRegion)) {
      console.log(`    ${region.padEnd(16)} → ${count} destinations`);
    }

    console.log(`\n🔢  Total: ${docs.length} destinations`);
    console.log(`⭐  Featured: ${docs.filter(d => d.isFeatured).length}`);
    console.log(`🔥  Popular : ${docs.filter(d => d.isPopular).length}`);

  } catch (err) {
    // BulkWriteError reports partial success — still print how many were saved
    if (err.name === 'BulkWriteError' || err.code === 11000) {
      const inserted = err.result?.nInserted ?? 0;
      const failed   = err.writeErrors?.length ?? 0;
      console.error(`\n⚠️   Bulk write completed with errors:`);
      console.error(`    ✅ Inserted : ${inserted}`);
      console.error(`    ❌ Failed   : ${failed}`);
      if (err.writeErrors?.length) {
        err.writeErrors.slice(0, 5).forEach((e) =>
          console.error(`    → ${e.errmsg ?? e.err?.errmsg}`)
        );
      }
    } else {
      console.error('❌  Seeding failed:', err.message);
    }
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌  MongoDB connection closed');
    process.exit(0);
  }
}

seed();
