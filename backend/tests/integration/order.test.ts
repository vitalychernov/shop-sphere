import request from 'supertest';
import { createApp } from '../../src/app';
import { Product } from '../../src/models/product.model';
import { connectTestDB, clearTestDB, closeTestDB } from '../helpers/db';

const app = createApp();

// Test product data
const testProduct = {
  name: 'Test Sneakers',
  description: 'A pair of test sneakers',
  price: 99.99,
  images: [],
  category: 'sneakers',
  stock: 10,
  slug: 'test-sneakers',
};

describe('Order Flow (Integration)', () => {
  let token: string;
  let productId: string;

  // Start in-memory MongoDB once before all tests in this file
  beforeAll(async () => {
    await connectTestDB();
  });

  // Clean DB between test cases
  afterEach(async () => {
    await clearTestDB();
  });

  // Tear down after all tests
  afterAll(async () => {
    await closeTestDB();
  });

  beforeEach(async () => {
    // Register a fresh user before each test
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test User', email: 'test@example.com', password: 'password123' });

    token = registerRes.body.token;

    // Insert a test product directly via model (faster than going through API)
    const product = await Product.create(testProduct);
    productId = product._id.toString();
  });

  it('should create an order with correct total and pending status', async () => {
    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({ items: [{ productId, quantity: 2 }] });

    expect(res.status).toBe(201);
    expect(res.body.status).toBe('pending');

    // Total should be price * quantity = 99.99 * 2 = 199.98
    expect(res.body.totalAmount).toBe(199.98);
    expect(res.body.items).toHaveLength(1);
    expect(res.body.items[0].name).toBe('Test Sneakers');
    expect(res.body.items[0].price).toBe(99.99);
  });

  it('should return 401 when creating order without token', async () => {
    const res = await request(app)
      .post('/api/orders')
      .send({ items: [{ productId, quantity: 1 }] });

    expect(res.status).toBe(401);
  });

  it('should return the order in my orders list', async () => {
    // Create an order first
    await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({ items: [{ productId, quantity: 1 }] });

    // Fetch order history
    const res = await request(app)
      .get('/api/orders/my')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].status).toBe('pending');
  });

  it('should return 404 for non-existent product', async () => {
    const fakeId = '507f1f77bcf86cd799439099';

    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({ items: [{ productId: fakeId, quantity: 1 }] });

    expect(res.status).toBe(404);
  });
});
