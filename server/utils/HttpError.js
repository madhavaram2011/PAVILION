/**
 * HttpError — Lightweight HTTP error class with structured data.
 * Used alongside AppError for route-level errors.
 */
export default class HttpError extends Error {
  constructor(message, statusCode, data = null) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.data = data;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    const json = {
      status: this.status,
      statusCode: this.statusCode,
      message: this.message,
    };
    if (this.data) json.data = this.data;
    return json;
  }
}
