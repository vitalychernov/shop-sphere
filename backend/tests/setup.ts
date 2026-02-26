// Set all required environment variables before any module is imported.
// This file runs before each test file via jest.config.ts setupFiles.
// Without this, env.ts would throw "Missing required environment variable".

process.env.NODE_ENV = 'test';
process.env.PORT = '5001';

// MONGODB_URI will be overridden by mongodb-memory-server in db.ts
process.env.MONGODB_URI = 'mongodb://localhost/test';

process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-only';
process.env.JWT_EXPIRES_IN = '1d';

// Fake Stripe keys — unit tests mock Stripe, integration tests don't call Stripe
process.env.STRIPE_SECRET_KEY = 'sk_test_fake_key_for_testing';
process.env.STRIPE_WEBHOOK_SECRET = 'whsec_fake_secret_for_testing';

process.env.CLIENT_URL = 'http://localhost:5173';
