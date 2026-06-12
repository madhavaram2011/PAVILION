import express from 'express';
import { check } from 'express-validator';
import {
  getPlaces,
  getPlaceById,
  getPlacesByUserId,
  createPlace,
  updatePlace,
  deletePlace,
} from '../controllers/placeController.js';
import { checkAuth } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validationMiddleware.js';

const router = express.Router();

// ── Public Routes ────────────────────────────────────────────────

// GET all places
router.get('/', getPlaces);

// GET a single place by place ID
router.get('/:pid', getPlaceById);

// GET all places by a specific user
router.get('/user/:uid', getPlacesByUserId);

// ── Protected Routes (require auth) ─────────────────────────────

// POST create a new place
router.post(
  '/',
  checkAuth,
  [
    check('title')
      .not().isEmpty()
      .withMessage('Title is required.'),
    check('description')
      .isLength({ min: 10 })
      .withMessage('Description must be at least 10 characters long.'),
    check('address')
      .not().isEmpty()
      .withMessage('Address is required for map placement.'),
  ],
  validate,
  createPlace
);

// PATCH update an existing place
router.patch(
  '/:pid',
  checkAuth,
  [
    check('title')
      .optional()
      .not().isEmpty()
      .withMessage('Title must not be empty.'),
    check('description')
      .optional()
      .isLength({ min: 10 })
      .withMessage('Description must be at least 10 characters long.'),
  ],
  validate,
  updatePlace
);

// DELETE a place
router.delete('/:pid', checkAuth, deletePlace);

export default router;
