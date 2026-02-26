import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticate } from '../middleware/authenticate';

const router = Router();

// POST /api/auth/register
router.post('/register', AuthController.register);

// POST /api/auth/login
router.post('/login', AuthController.login);

// GET /api/auth/me — returns current user info (requires valid token)
router.get('/me', authenticate, (req, res) => {
  res.json({ user: req.user });
});

export default router;
