import request from 'supertest';
import { createApp } from '../../src/app';
import { Product } from '../../src/models/product.model';
import { connectTestDB, clearTestDB, closeTestDB } from '../helpers/db';

const app = createApp();

const testProducts = [
  {
    name: 'Classic Sneakers',
    description: 'A classic pair of sneakers',
    price: 79.99,
    images: ['https://example.com/sneakers.jpg'],
    category: 'sneakers',
    stock: 20,
    slug: 'classic-sneakers',
  },
  {
    name: 'Running Shoes',
    description: 'Lightweight running shoes',
    price: 119.99,
    images: ['https://example.com/running.jpg'],
    category: 'running',
    stock: 15,
    slug: 'running-shoes',
  },
];

describe('Products Endpoints (Integration)', () => {
  beforeAll(async () => {
    await connectTestDB();
  });

  afterEach(async () => {
    await clearTestDB();
  });

  afterAll(async () => {
    await closeTestDB();
  });

  // ─── GET /api/products ───────────────────────────────────────────────────────

  describe('GET /api/products', () => {
    it('should return empty products array when no products exist', async () => {
      const res = await request(app).get('/api/products');

      expect(res.status).toBe(200);
      // API returns { products, pagination }
      expect(res.body.products).toEqual([]);
      expect(res.body.pagination.total).toBe(0);
    });

    it('should return all products with pagination info', async () => {
      await Product.insertMany(testProducts);

      const res = await request(app).get('/api/products');

      expect(res.status).toBe(200);
      expect(res.body.products).toHaveLength(2);
      expect(res.body.pagination.total).toBe(2);
      expect(res.body.products[0].slug).toBeDefined();
      expect(res.body.products[0].price).toBeDefined();
    });
  });

  // ─── GET /api/products/:slug ─────────────────────────────────────────────────

  describe('GET /api/products/:slug', () => {
    beforeEach(async () => {
      await Product.insertMany(testProducts);
    });

    it('should return a product by slug', async () => {
      const res = await request(app).get('/api/products/classic-sneakers');

      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Classic Sneakers');
      expect(res.body.price).toBe(79.99);
      expect(res.body.slug).toBe('classic-sneakers');
    });

    it('should return 404 for a non-existent slug', async () => {
      const res = await request(app).get('/api/products/does-not-exist');

      expect(res.status).toBe(404);
    });
  });
});
