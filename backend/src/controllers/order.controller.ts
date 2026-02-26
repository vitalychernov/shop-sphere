import { Request, Response } from 'express';
import { OrderService } from '../services/order.service';
import { createOrderSchema } from '../validators/order.validator';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';

export const OrderController = {
  create: asyncHandler(async (req: Request, res: Response) => {
    const result = createOrderSchema.safeParse(req.body);
    if (!result.success) {
      throw new AppError(result.error.errors[0].message, 400);
    }

    // req.user is guaranteed by authenticate middleware on the route
    const order = await OrderService.create(req.user!.userId, result.data);

    res.status(201).json(order);
  }),

  getMyOrders: asyncHandler(async (req: Request, res: Response) => {
    const orders = await OrderService.getMyOrders(req.user!.userId);
    res.json(orders);
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const order = await OrderService.getById(req.params.id, req.user!.userId);
    res.json(order);
  }),
};
