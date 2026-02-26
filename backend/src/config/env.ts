import dotenv from 'dotenv';

// Load .env file into process.env before anything else reads it
dotenv.config();

// Helper that throws immediately if a required env variable is missing.
// This ensures the server never starts with a broken configuration.
function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  port: parseInt(process.env.PORT ?? '5000', 10),
  nodeEnv: process.env.NODE_ENV ?? 'development',

  mongoUri: requireEnv('MONGODB_URI'),

  jwtSecret: requireEnv('JWT_SECRET'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '7d',

  stripeSecretKey: requireEnv('STRIPE_SECRET_KEY'),
  stripeWebhookSecret: requireEnv('STRIPE_WEBHOOK_SECRET'),

  clientUrl: process.env.CLIENT_URL ?? 'http://localhost:5173',
} as const;
