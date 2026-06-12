import AppError from '../utils/AppError.js';
import { getCoordsForAddress } from '../utils/geocode.js';
import {
  getAllPlaces,
  getPlaceById as findPlaceById,
  getPlacesByUserId as findPlacesByUser,
  createPlace as storePlace,
  updatePlace as storeUpdate,
  deletePlace as storeDelete,
} from '../data/placesStore.js';
import { addPlaceToUser, removePlaceFromUser } from '../data/usersStore.js';

// ── GET /api/places/:pid ────────────────────────────────────────
export const getPlaceById = async (req, res, next) => {
  try {
    const place = findPlaceById(req.params.pid);

    if (!place) {
      return next(AppError.notFound('Place'));
    }

    res.status(200).json({
      status: 'success',
      data: { place },
    });
  } catch (error) {
    next(error);
  }
};

// ── GET /api/places/user/:uid ───────────────────────────────────
export const getPlacesByUserId = async (req, res, next) => {
  try {
    const userId = req.params.uid;
    const places = findPlacesByUser(userId);

    // Return empty array if user has no places (not an error)
    res.status(200).json({
      status: 'success',
      results: places.length,
      data: { places },
    });
  } catch (error) {
    next(error);
  }
};

// ── GET /api/places ─────────────────────────────────────────────
export const getPlaces = async (req, res, next) => {
  try {
    const places = getAllPlaces();

    res.status(200).json({
      status: 'success',
      results: places.length,
      data: { places },
    });
  } catch (error) {
    next(error);
  }
};

// ── POST /api/places ────────────────────────────────────────────
export const createPlace = async (req, res, next) => {
  try {
    const { title, description, address, country, continent, image, category } = req.body;

    // Geocode the address to get coordinates
    let coordinates;
    try {
      coordinates = await getCoordsForAddress(address || title);
    } catch (geocodeErr) {
      return next(geocodeErr);
    }

    const newPlace = storePlace({
      title,
      description,
      address: address || title,
      location: coordinates,
      country: country || 'India',
      continent: continent || 'North India',
      image: image || '',
      category: category || [],
      rating: 0,
      creator: req.userData.userId,
    });

    // Add place reference to user
    addPlaceToUser(req.userData.userId, newPlace.id);

    res.status(201).json({
      status: 'success',
      data: { place: newPlace },
    });
  } catch (error) {
    next(error);
  }
};

// ── PATCH /api/places/:pid ──────────────────────────────────────
export const updatePlace = async (req, res, next) => {
  try {
    const place = findPlaceById(req.params.pid);

    if (!place) {
      return next(AppError.notFound('Place'));
    }

    // Check ownership
    if (place.creator !== req.userData.userId) {
      return next(AppError.forbidden('You are not allowed to edit this place.'));
    }

    const { title, description, address } = req.body;
    const updateData = {};

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;

    // Re-geocode if address changed
    if (address !== undefined && address !== place.address) {
      try {
        updateData.location = await getCoordsForAddress(address);
        updateData.address = address;
      } catch (geocodeErr) {
        return next(geocodeErr);
      }
    }

    const updatedPlace = storeUpdate(req.params.pid, updateData);

    res.status(200).json({
      status: 'success',
      data: { place: updatedPlace },
    });
  } catch (error) {
    next(error);
  }
};

// ── DELETE /api/places/:pid ─────────────────────────────────────
export const deletePlace = async (req, res, next) => {
  try {
    const place = findPlaceById(req.params.pid);

    if (!place) {
      return next(AppError.notFound('Place'));
    }

    // Check ownership
    if (place.creator !== req.userData.userId) {
      return next(AppError.forbidden('You are not allowed to delete this place.'));
    }

    storeDelete(req.params.pid);
    removePlaceFromUser(place.creator, req.params.pid);

    res.status(200).json({
      status: 'success',
      message: 'Place deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};
