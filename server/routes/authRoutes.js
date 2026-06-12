import express from 'express';
import {
  register,
  login,
  logout,
  refreshToken,
  getMe,
  updateMe,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// ── Public ────────────────────────────────────────────────────────
router.post('/register', register);
router.post('/login',    login);
router.post('/logout',   logout);
router.post('/refresh-token', refreshToken);

// ── Protected (must be logged in) ────────────────────────────────
router.use(protect);

router.get('/me',         getMe);
router.patch('/update-me', updateMe);

export default router;
