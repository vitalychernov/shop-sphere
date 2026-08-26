import { Request, Response } from 'express';
import { StripeService } from '../services/stripe.service';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';

export const StripeController = {
  createCheckoutSession: asyncHandler(async (req: Request, res: Response) => {
    const { orderId } = req.body;

    if (!orderId) {
      throw new AppError('orderId is required', 400);
    }

    const result = await StripeService.createCheckoutSession(
      orderId,
      req.user!.userId
    );

    res.json(result);
  }),

  webhook: asyncHandler(async (req: Request, res: Response) => {
    const signature = req.headers['stripe-signature'];

    if (!signature || typeof signature !== 'string') {
      throw new AppError('Missing stripe-signature header', 400);
    }

    // req.body is a Buffer here because of express.raw() middleware applied in app.ts
    const result = await StripeService.handleWebhook(req.body as Buffer, signature);

    res.json(result);
  }),
};
