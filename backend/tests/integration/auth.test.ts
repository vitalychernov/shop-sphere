import request from 'supertest';
import { createApp } from '../../src/app';
import { connectTestDB, clearTestDB, closeTestDB } from '../helpers/db';

const app = createApp();

describe('Auth Endpoints (Integration)', () => {
  beforeAll(async () => {
    await connectTestDB();
  });

  afterEach(async () => {
    await clearTestDB();
  });

  afterAll(async () => {
    await closeTestDB();
  });

  // ─── POST /api/auth/register ─────────────────────────────────────────────────

  describe('POST /api/auth/register', () => {
    it('should register a new user and return token + user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ name: 'Alice', email: 'alice@example.com', password: 'password123' });

      expect(res.status).toBe(201);
      expect(res.body.token).toBeDefined();
      expect(res.body.user.email).toBe('alice@example.com');
      expect(res.body.user.name).toBe('Alice');
      expect(res.body.user.role).toBe('customer');
      // Password hash must never be exposed
      expect(res.body.user.passwordHash).toBeUndefined();
    });

    it('should return 409 if email is already registered', async () => {
      const payload = { name: 'Alice', email: 'alice@example.com', password: 'password123' };
      await request(app).post('/api/auth/register').send(payload);

      const res = await request(app).post('/api/auth/register').send(payload);

      expect(res.status).toBe(409);
    });

    it('should return 400 if required fields are missing', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'alice@example.com' }); // missing name and password

      expect(res.status).toBe(400);
    });

    it('should return 400 if password is shorter than 8 characters', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ name: 'Alice', email: 'alice@example.com', password: 'short' });

      expect(res.status).toBe(400);
    });
  });

  // ─── POST /api/auth/login ────────────────────────────────────────────────────

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Register a user to log in with
      await request(app)
        .post('/api/auth/register')
        .send({ name: 'Alice', email: 'alice@example.com', password: 'password123' });
    });

    it('should return token for valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'alice@example.com', password: 'password123' });

      expect(res.status).toBe(200);
      expect(res.body.token).toBeDefined();
      expect(res.body.user.email).toBe('alice@example.com');
    });

    it('should return 401 for wrong password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'alice@example.com', password: 'wrongpassword' });

      expect(res.status).toBe(401);
    });

    it('should return 401 for non-existent email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'nobody@example.com', password: 'password123' });

      // Same status as wrong password — prevents email enumeration
      expect(res.status).toBe(401);
    });
  });
});
