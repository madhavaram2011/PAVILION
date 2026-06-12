/**
 * Pavilion India — Destination Seeder
 * Connects to MongoDB and seeds the Destination collection.
 *
 * Usage:  node seeds/runSeed.js
 */

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Destination from '../models/Destination.js';
import destinations from './seedDestinations.js';

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

    // Remove all existing destinations
    const deleted = await Destination.deleteMany({});
    console.log(`🗑️   Cleared ${deleted.deletedCount} existing destination(s)`);

    // Insert all seed data
    console.log('📦 Destinations to insert:', destinations.length, destinations[0]?.name)

    let inserted = 0
    let failed = 0

    for (const dest of destinations) {
      try {
        await Destination.collection.insertOne(dest)
        inserted++
      } catch (err) {
        console.log(`⚠️ Failed: ${dest.name} — ${err.message}`)
        failed++
      }
    }

    console.log(`✅ Inserted ${inserted} destinations`)
    console.log(`⚠️ Failed ${failed} destinations`)
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
