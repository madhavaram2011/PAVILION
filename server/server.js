import 'dotenv/config'; // 🚨 SABSE UPAR! Express, cors, routes sabse pehle yeh chalna chahiye!

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// 🚨 CRITICAL: Saare custom files, routes, aur middleware se PEHLE variables load hone chahiye!
dotenv.config();

import connectDB, { closeDB } from './db.js';

// ── Routes ────────────────────────────────────────────────────────
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import tourRoutes from './routes/tourRoutes.js';
import destinationRoutes from './routes/destinationRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import statsRoutes from './routes/statsRoutes.js';

import reviewRoutes from './routes/reviewRoutes.js';

// ── Middleware ────────────────────────────────────────────────────
import { handleMongooseErrors, errorHandler } from './middleware/errorMiddleware.js';
import AppError from './utils/AppError.js';

const app = express();
const PORT = process.env.PORT || 5000;

// ── Core Middleware ───────────────────────────────────────────────
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175'
    ],
    credentials: true
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(helmet());
const apiLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 });
app.use('/api/', apiLimiter);
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // parse httpOnly refresh-token cookie

// ── API Routes ────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);       // legacy in-memory (kept for compat)
app.use('/api/tours', tourRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/stats', statsRoutes);

app.use('/api/reviews', reviewRoutes);

// ── Health Check ─────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Pavilion API is running smoothly 🚀',
    timestamp: new Date().toISOString(),
    mode: process.env.NODE_ENV || 'development',
    endpoints: {
      auth: '/api/auth',
      tours: '/api/tours',
      destinations: '/api/destinations',
      bookings: '/api/bookings',
      stats: '/api/stats',
      health: '/api/health',
    },
  });
});

app.get('/', (req, res) => {
  res.json({
    message: '🏛️ Pavilion API',
    version: '2.0.0',
    docs: {
      // ── Auth ──────────────────────────────────────────────────
      'POST /api/auth/register': 'Register a new user',
      'POST /api/auth/login': 'Login',
      'POST /api/auth/logout': 'Logout (clears cookie)',
      'POST /api/auth/refresh-token': 'Refresh access token via httpOnly cookie',
      'GET  /api/auth/me': 'Get current user (auth required)',
      'PATCH /api/auth/update-me': 'Update profile (auth required)',
      // ── Tours ─────────────────────────────────────────────────
      'GET  /api/tours': 'List all tours (filter + paginate)',
      'GET  /api/tours/featured': 'Featured tours (limit 6)',
      'GET  /api/tours/:slug': 'Tour detail by slug',
      'POST /api/tours': 'Create tour (admin)',
      'PATCH /api/tours/:id': 'Update tour (admin)',
      'DELETE /api/tours/:id': 'Delete tour — soft (admin)',
      // ── Destinations ──────────────────────────────────────────
      'GET  /api/destinations': 'List all destinations (filter + paginate)',
      'GET  /api/destinations/search?q=': 'Text search destinations',
      'GET  /api/destinations/region/:r': 'Destinations by region',
      'GET  /api/destinations/:slug': 'Destination detail + nearby tours',
      'POST /api/destinations': 'Create destination (admin)',
      'PATCH /api/destinations/:id': 'Update destination (admin)',
      'DELETE /api/destinations/:id': 'Delete destination (admin)',
      // ── Bookings ──────────────────────────────────────────────
      'POST /api/bookings': 'Create booking (auth)',
      'GET  /api/bookings/my': 'My bookings (auth)',
      'PATCH /api/bookings/:id/cancel': 'Cancel booking (auth)',
      'GET  /api/bookings': 'All bookings (admin)',
      // ── Stats ─────────────────────────────────────────────────
      'GET  /api/stats': 'Admin dashboard stats (admin)',
    },
  });
});

// ── Handle unmatched routes ──────────────────────────────────────
app.all('*', (req, res, next) => {
  next(new AppError(`Cannot find ${req.method} ${req.originalUrl} on this server.`, 404));
});

// ── Global Error Handlers ────────────────────────────────────────
app.use(handleMongooseErrors);
app.use(errorHandler);

// ── Start Server ─────────────────────────────────────────────────
const startServer = async () => {
  try {
    console.log(`\n${'═'.repeat(60)}`);
    console.log(`  🏛️  Pavilion API Server — Starting...`);
    console.log(`${'─'.repeat(60)}`);

    await connectDB();

    console.log(`${'─'.repeat(60)}`);

    app.listen(PORT, () => {
      console.log(`  Port:      ${PORT}`);
      console.log(`  Mode:      ${process.env.NODE_ENV || 'development'}`);
      console.log(`  Geocoding: ${process.env.GOOGLE_API_KEY ? '✅ Google API' : '⚠️  Fallback coords'}`);
      console.log(`${'─'.repeat(60)}`);
      console.log('  Routes:');
      console.log('    POST   /api/auth/register');
      console.log('    POST   /api/auth/login');
      console.log('    POST   /api/auth/logout');
      console.log('    POST   /api/auth/refresh-token');
      console.log('    GET    /api/auth/me');
      console.log('    ─');
      console.log('    GET    /api/tours');
      console.log('    GET    /api/tours/featured');
      console.log('    GET    /api/tours/:slug');
      console.log('    ─');
      console.log('    GET    /api/destinations');
      console.log('    GET    /api/destinations/search?q=');
      console.log('    GET    /api/destinations/region/:region');
      console.log('    GET    /api/destinations/:slug');
      console.log('    ─');
      console.log('    POST   /api/bookings');
      console.log('    GET    /api/bookings/my');
      console.log('    PATCH  /api/bookings/:id/cancel');
      console.log('    GET    /api/bookings  (admin)');
      console.log('    ─');
      console.log('    GET    /api/stats     (admin)');
      console.log('    GET    /api/health');
      console.log(`${'═'.repeat(60)}\n`);
    });
  } catch (error) {
    console.error('💀  Failed to start server:', error.message);
    process.exit(1);
  }
};

// ── Graceful Shutdown ────────────────────────────────────────────
const gracefulShutdown = async (signal) => {
  console.log(`\n📴  ${signal} received. Shutting down gracefully...`);
  await closeDB();
  process.exit(0);
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

process.on('unhandledRejection', (err) => {
  console.error('❌  UNHANDLED REJECTION:', err.message);
  process.exit(1);
});

// ── Launch ───────────────────────────────────────────────────────
startServer();