import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { env } from './config/env';
import { errorHandler } from './middleware/errorHandler';
import { AppError } from './utils/AppError';
import authRouter from './routes/auth.routes';
import productRouter from './routes/product.routes';

export function createApp() {
  const app = express();

  // Set security-related HTTP headers (XSS, clickjacking, etc.)
  app.use(helmet());

  // Allow requests from the frontend origin
  app.use(
    cors({
      origin: env.clientUrl,
      credentials: true,
    })
  );

  // Parse incoming JSON request bodies
  app.use(express.json());

  // Health check — used by Render and Docker to verify the service is alive
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', environment: env.nodeEnv });
  });

  // API routes
  app.use('/api/auth', authRouter);
  app.use('/api/products', productRouter);
  // app.use('/api/orders', orderRouter);  — coming later

  // Handle all unmatched routes — must come after all valid routes
  app.use((_req, _res, next) => {
    next(new AppError('Route not found', 404));
  });

  // Central error handler — must be registered last, after all routes
  app.use(errorHandler);

  return app;
}
