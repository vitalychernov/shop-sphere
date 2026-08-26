import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { env } from './config/env';
import { errorHandler } from './middleware/errorHandler';
import { AppError } from './utils/AppError';
import authRouter from './routes/auth.routes';
import productRouter from './routes/product.routes';
import orderRouter from './routes/order.routes';
import stripeRouter from './routes/stripe.routes';

export function createApp() {
  const app = express();

  app.use(helmet());

  app.use(
    cors({
      origin: env.clientUrl,
      credentials: true,
    })
  );

  // IMPORTANT: Stripe webhook requires the raw request body (Buffer) to verify
  // its signature. This route must be registered BEFORE express.json() parses
  // the body — once parsed, the raw bytes are gone and signature check fails.
  app.use(
    '/api/stripe/webhook',
    express.raw({ type: 'application/json' })
  );

  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', environment: env.nodeEnv });
  });

  app.use('/api/auth', authRouter);
  app.use('/api/products', productRouter);
  app.use('/api/orders', orderRouter);
  app.use('/api/stripe', stripeRouter);

  // Handle all unmatched routes — must come after all valid routes
  app.use((_req, _res, next) => {
    next(new AppError('Route not found', 404));
  });

  // Central error handler — must be registered last, after all routes
  app.use(errorHandler);

  return app;
}
