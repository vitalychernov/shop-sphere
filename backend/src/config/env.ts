import dotenv from 'dotenv';

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

  // Email via Resend — optional, emails are silently skipped if not configured
  resendApiKey: process.env.RESEND_API_KEY ?? '',
} as const;
