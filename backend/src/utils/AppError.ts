// Custom error class that carries an HTTP status code alongside the message.
// Throwing new AppError('Not found', 404) anywhere in the app will produce
// a properly-formed HTTP error response via the central errorHandler middleware.
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);

    this.statusCode = statusCode;

    // Operational errors are expected (wrong input, not found, unauthorized).
    // Non-operational errors are bugs — they need different handling.
    this.isOperational = true;

    // Capture the stack trace, excluding the constructor call itself
    Error.captureStackTrace(this, this.constructor);
  }
}
