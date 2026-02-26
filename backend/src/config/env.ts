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
  // Optional on first deploy — set after registering the webhook URL in Stripe Dashboard
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET ?? '',

  clientUrl: process.env.CLIENT_URL ?? 'http://localhost:5173',

  // Email is optional — if SMTP_USER is not set, emails are silently skipped
  smtp: {
    host: process.env.SMTP_HOST ?? 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT ?? '465', 10),
    user: process.env.SMTP_USER ?? '',
    pass: process.env.SMTP_PASS ?? '',
    from: process.env.SMTP_FROM ?? 'ShopSphere <noreply@shopsphere.com>',
  },
} as const;
