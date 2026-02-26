import { Request, Response, NextFunction, RequestHandler } from 'express';

// Wraps an async route handler and forwards any thrown errors to Express's
// next(err) — which triggers the central errorHandler middleware.
// Without this, unhandled promise rejections in async handlers would crash
// the process or result in a hanging request.
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
): RequestHandler {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
}
