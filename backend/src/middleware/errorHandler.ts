import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { env } from '../config/env';

// Express identifies error-handling middleware by its 4-parameter signature.
// It must be registered AFTER all routes in app.ts.
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void {
  // Handle known operational errors (AppError instances)
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
    return;
  }

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    res.status(400).json({
      status: 'error',
      message: err.message,
    });
    return;
  }

  // Handle Mongoose duplicate key error (e.g. duplicate email)
  if ((err as NodeJS.ErrnoException).code === '11000') {
    res.status(409).json({
      status: 'error',
      message: 'Duplicate field value',
    });
    return;
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    res.status(401).json({
      status: 'error',
      message: 'Invalid token',
    });
    return;
  }

  if (err.name === 'TokenExpiredError') {
    res.status(401).json({
      status: 'error',
      message: 'Token expired',
    });
    return;
  }

  // Unexpected errors — log stack trace in development, hide details in production
  console.error('Unexpected error:', err);

  res.status(500).json({
    status: 'error',
    message: env.nodeEnv === 'development' ? err.message : 'Internal server error',
    ...(env.nodeEnv === 'development' && { stack: err.stack }),
  });
}
