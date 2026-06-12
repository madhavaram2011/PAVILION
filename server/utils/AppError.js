/**
 * AppError — Custom operational error class for the Pavilion API.
 * Extends native Error with HTTP status codes, error codes, and factory methods.
 */
export default class AppError extends Error {
  constructor(message, statusCode, errorCode = null) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.errorCode = errorCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }

  /** Structured JSON for client consumption */
  toJSON() {
    return {
      status: this.status,
      statusCode: this.statusCode,
      errorCode: this.errorCode,
      message: this.message,
    };
  }

  // ── Factory Methods ──────────────────────────────────────────────

  static notFound(resource = 'Resource') {
    return new AppError(`${resource} not found.`, 404, 'NOT_FOUND');
  }

  static unauthorized(message = 'You are not authorized to perform this action.') {
    return new AppError(message, 401, 'UNAUTHORIZED');
  }

  static forbidden(message = 'You do not have permission to perform this action.') {
    return new AppError(message, 403, 'FORBIDDEN');
  }

  static badRequest(message = 'Invalid request.') {
    return new AppError(message, 400, 'BAD_REQUEST');
  }

  static validationError(message, fields = null) {
    const err = new AppError(message, 422, 'VALIDATION_ERROR');
    if (fields) err.fields = fields;
    return err;
  }

  static conflict(message = 'Resource already exists.') {
    return new AppError(message, 409, 'CONFLICT');
  }

  static internal(message = 'An unexpected error occurred.') {
    const err = new AppError(message, 500, 'INTERNAL_ERROR');
    err.isOperational = false;
    return err;
  }
}
