import { Request, Response } from 'express';
import { ProductService } from '../services/product.service';
import { productQuerySchema } from '../validators/product.validator';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';

export const ProductController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const result = productQuerySchema.safeParse(req.query);
    if (!result.success) {
      throw new AppError(result.error.errors[0].message, 400);
    }

    const data = await ProductService.getAll(result.data);
    res.json(data);
  }),

  getBySlug: asyncHandler(async (req: Request, res: Response) => {
    const { slug } = req.params;
    const product = await ProductService.getBySlug(slug);
    res.json(product);
  }),
};
