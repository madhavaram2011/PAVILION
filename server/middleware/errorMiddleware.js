/**
 * Global error handler middleware.
 * Handles operational errors, Mongoose errors, JWT errors, and unknown errors.
 */
export const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    // Development: send full error details
    const response = {
      status: err.status,
      statusCode: err.statusCode,
      message: err.message,
      error: err,
      stack: err.stack,
    };

    if (err.fields) response.fields = err.fields;
    if (err.errorCode) response.errorCode = err.errorCode;

    res.status(err.statusCode).json(response);
  } else {
    // Production: only send operational errors
    if (err.isOperational) {
      const response = {
        status: err.status,
        message: err.message,
      };
      if (err.fields) response.fields = err.fields;
      if (err.errorCode) response.errorCode = err.errorCode;

      res.status(err.statusCode).json(response);
    } else {
      // Programming or unknown errors — don't leak details
      console.error('ERROR 💥:', err);
      res.status(500).json({
        status: 'error',
        message: 'Something went wrong! Please try again later.',
      });
    }
  }
};

/**
 * Handle Mongoose-specific errors and convert to operational errors.
 */
export const handleMongooseErrors = (err, req, res, next) => {
  let error = { ...err, message: err.message };

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    error.message = `Invalid ${err.path}: ${err.value}`;
    error.statusCode = 400;
    error.isOperational = true;
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue).join(', ');
    error.message = `Duplicate value for field: ${field}. Please use another value.`;
    error.statusCode = 409;
    error.isOperational = true;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message).join('. ');
    error.message = `Invalid input: ${messages}`;
    error.statusCode = 422;
    error.isOperational = true;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error.message = 'Invalid token. Please log in again.';
    error.statusCode = 401;
    error.isOperational = true;
  }

  if (err.name === 'TokenExpiredError') {
    error.message = 'Your session has expired. Please log in again.';
    error.statusCode = 401;
    error.isOperational = true;
  }

  next(error.statusCode ? error : err);
};
