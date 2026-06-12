import { validationResult } from 'express-validator';
import AppError from '../utils/AppError.js';

/**
 * Validation middleware — checks express-validator results.
 * Returns structured field-level errors to the client.
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // Build structured field errors
    const fieldErrors = {};
    errors.array().forEach(err => {
      const field = err.path || err.param || 'unknown';
      if (!fieldErrors[field]) {
        fieldErrors[field] = [];
      }
      fieldErrors[field].push(err.msg);
    });

    const messages = errors.array().map(err => err.msg).join('. ');

    const error = AppError.validationError(
      `Validation failed: ${messages}`,
      fieldErrors
    );

    return next(error);
  }

  next();
};
