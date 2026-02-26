import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { env } from './config/env';

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

  return app;
}
