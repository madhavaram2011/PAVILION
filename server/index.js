import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import userRoutes from './routes/userRoutes.js';
import placeRoutes from './routes/placeRoutes.js';
import { handleMongooseErrors, errorHandler } from './middleware/errorMiddleware.js';
import AppError from './utils/AppError.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Routes ───────────────────────────────────────────────────────
app.use('/api/users', userRoutes);
app.use('/api/places', placeRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Pavilion API is running smoothly 🚀',
    timestamp: new Date().toISOString(),
    mode: process.env.NODE_ENV || 'development',
    endpoints: {
      users: '/api/users',
      places: '/api/places',
      health: '/api/health',
    },
  });
});

app.get('/', (req, res) => {
  res.json({
    message: '🏛️ Pavilion API',
    version: '1.0.0',
    docs: {
      'GET /api/health': 'Health check',
      'GET /api/users': 'Get all users',
      'POST /api/users/signup': 'Register a new user',
      'POST /api/users/login': 'Login',
      'GET /api/places': 'Get all places',
      'GET /api/places/:pid': 'Get place by ID',
      'GET /api/places/user/:uid': 'Get places by user ID',
      'POST /api/places': 'Create a place (auth required)',
      'PATCH /api/places/:pid': 'Update a place (auth required)',
      'DELETE /api/places/:pid': 'Delete a place (auth required)',
    },
  });
});

// ── Handle unmatched routes ──────────────────────────────────────
app.all('*', (req, res, next) => {
  next(new AppError(`Cannot find ${req.method} ${req.originalUrl} on this server.`, 404));
});

// ── Global error handler ─────────────────────────────────────────
app.use(handleMongooseErrors);
app.use(errorHandler);

// ── Start server ─────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n${'═'.repeat(55)}`);
  console.log(`  🏛️  Pavilion API Server`);
  console.log(`${'─'.repeat(55)}`);
  console.log(`  Port:      ${PORT}`);
  console.log(`  Mode:      ${process.env.NODE_ENV || 'development'}`);
  console.log(`  Geocoding: ${process.env.GOOGLE_API_KEY ? '✅ Google API' : '⚠️  Fallback coords'}`);
  console.log(`${'─'.repeat(55)}`);
  console.log(`  Routes:`);
  console.log(`    GET    /api/health`);
  console.log(`    GET    /api/users`);
  console.log(`    POST   /api/users/signup`);
  console.log(`    POST   /api/users/login`);
  console.log(`    GET    /api/places`);
  console.log(`    GET    /api/places/:pid`);
  console.log(`    GET    /api/places/user/:uid`);
  console.log(`    POST   /api/places`);
  console.log(`    PATCH  /api/places/:pid`);
  console.log(`    DELETE /api/places/:pid`);
  console.log(`${'═'.repeat(55)}\n`);
});
