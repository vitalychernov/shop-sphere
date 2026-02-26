import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';

const router = Router();

// GET /api/products?page=1&limit=12&category=shoes&search=nike&sort=price_asc
router.get('/', ProductController.getAll);

// GET /api/products/:slug
router.get('/:slug', ProductController.getBySlug);

export default router;
