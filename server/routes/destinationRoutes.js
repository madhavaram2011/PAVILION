import express from 'express';
import {
  getAllDestinations,
  getDestinationBySlug,
  getDestinationsByRegion,
  searchDestinations,
  createDestination,
  updateDestination,
  deleteDestination,
} from '../controllers/destinationController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

// ── Public ────────────────────────────────────────────────────────
router.get('/',                  getAllDestinations);
router.get('/search',            searchDestinations);
router.get('/region/:region',    getDestinationsByRegion);
router.get('/:slug',             getDestinationBySlug);

// ── Admin only ────────────────────────────────────────────────────
router.use(protect, restrictTo('admin'));

router.post('/',      createDestination);
router.patch('/:id',  updateDestination);
router.delete('/:id', deleteDestination);

export default router;
