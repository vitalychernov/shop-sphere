import { Router } from 'express';
import { StripeController } from '../controllers/stripe.controller';
import { authenticate } from '../middleware/authenticate';

const router = Router();

// POST /api/stripe/checkout-session — requires auth, returns Stripe hosted page URL
router.post('/checkout-session', authenticate, StripeController.createCheckoutSession);

// POST /api/stripe/webhook — called by Stripe, no JWT auth
// Raw body middleware is applied in app.ts BEFORE express.json()
router.post('/webhook', StripeController.webhook);

export default router;
