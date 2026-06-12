/**
 * Pavilion India — Tour Seeder
 * Connects to MongoDB and seeds the Tour collection.
 *
 * Usage:  node seeds/runTourSeed.js
 */

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Tour from '../models/Tour.js';
import tours from './seedTours.js';

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.error('❌  MONGODB_URI is not defined in .env');
  process.exit(1);
}

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('🔗  Connected to MongoDB');

    // Remove all existing tours
    const deleted = await Tour.deleteMany({});
    console.log(`🗑️   Cleared ${deleted.deletedCount} existing tour(s)`);

    // Insert all seed data
    let inserted = 0
    let failed = 0

    for (const tour of tours) {
      try {
        if (tour.isActive === undefined) {
          tour.isActive = true
        }
        await Tour.collection.insertOne(tour)
        inserted++
      } catch (err) {
        console.log(`⚠️ Failed: ${tour.title} — ${err.message}`)
        failed++
      }
    }

    console.log(`✅ Inserted ${inserted} tours`)
    console.log(`⚠️ Failed ${failed} tours`)
  } catch (err) {
    console.error('❌  Seeding failed:', err.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌  MongoDB connection closed');
    process.exit(0);
  }
}

seed();
