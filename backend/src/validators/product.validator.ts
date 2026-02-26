import { z } from 'zod';

// Query params come as strings — coerce converts them to correct types
export const productQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
  category: z.string().trim().optional(),
  search: z.string().trim().optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  sort: z
    .enum(['price_asc', 'price_desc', 'newest', 'oldest'])
    .default('newest'),
});

export type ProductQuery = z.infer<typeof productQuerySchema>;
