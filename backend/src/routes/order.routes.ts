import { Router } from 'express';
import { OrderController } from '../controllers/order.controller';
import { authenticate } from '../middleware/authenticate';

const router = Router();

// All order routes require authentication
router.use(authenticate);

// POST /api/orders — create order from cart items
router.post('/', OrderController.create);

// GET /api/orders/my — get current user's order history
router.get('/my', OrderController.getMyOrders);

// GET /api/orders/:id — get single order by ID
router.get('/:id', OrderController.getById);

export default router;
