import mongoose from 'mongoose';

// ══════════════════════════════════════════════════════════════════
// ██ MONGODB CONNECTION WITH RETRY LOGIC
// ══════════════════════════════════════════════════════════════════

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 5000; // 5 seconds between retries

/**
 * Connect to MongoDB with automatic retry logic.
 * Falls back gracefully with clear console feedback.
 */
const connectDB = async () => {
  const MONGO_URI = process.env.MONGODB_URI;

  if (!MONGO_URI) {
    console.error('❌  MONGODB_URI is not defined in environment variables.');
    console.error('   Add MONGODB_URI to your .env file and restart.');
    process.exit(1);
  }

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const conn = await mongoose.connect(MONGO_URI, {
        // Mongoose 7+ uses these defaults, but explicit for clarity
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
      });

      console.log(`  ✅ MongoDB connected: ${conn.connection.host}`);
      console.log(`     Database: ${conn.connection.name}`);

      // ── Connection event listeners ──────────────────────────────
      mongoose.connection.on('error', (err) => {
        console.error('❌  MongoDB connection error:', err.message);
      });

      mongoose.connection.on('disconnected', () => {
        console.warn('⚠️  MongoDB disconnected. Attempting reconnection...');
      });

      mongoose.connection.on('reconnected', () => {
        console.log('✅  MongoDB reconnected successfully.');
      });

      return conn;
    } catch (error) {
      console.error(
        `❌  MongoDB connection attempt ${attempt}/${MAX_RETRIES} failed: ${error.message}`
      );

      if (attempt < MAX_RETRIES) {
        console.log(`   ⏳ Retrying in ${RETRY_DELAY_MS / 1000} seconds...`);
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
      } else {
        console.error('💀  All MongoDB connection attempts exhausted. Exiting.');
        process.exit(1);
      }
    }
  }
};

/**
 * Gracefully close the MongoDB connection.
 * Call this on SIGINT / SIGTERM for clean shutdowns.
 */
export const closeDB = async () => {
  try {
    await mongoose.connection.close();
    console.log('🔌  MongoDB connection closed gracefully.');
  } catch (err) {
    console.error('❌  Error closing MongoDB connection:', err.message);
  }
};

export default connectDB;
