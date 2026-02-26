import { z } from 'zod';

export const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().min(1, 'Product ID is required'),
        quantity: z.number().int().min(1, 'Quantity must be at least 1'),
      })
    )
    .min(1, 'Order must contain at least one item'),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
