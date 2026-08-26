import { FilterQuery } from 'mongoose';
import { Product, ProductType } from '../models/product.model';
import { AppError } from '../utils/AppError';
import type { ProductQuery } from '../validators/product.validator';

export const ProductService = {
  async getAll(query: ProductQuery) {
    const { page, limit, category, search, minPrice, maxPrice, sort } = query;

    const filter: FilterQuery<ProductType> = {};

    if (category) {
      filter.category = category;
    }

    if (search) {
      // MongoDB text search — requires text index on name + description
      filter.$text = { $search: search };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) filter.price.$gte = minPrice;
      if (maxPrice !== undefined) filter.price.$lte = maxPrice;
    }

    const sortMap: Record<ProductQuery['sort'], Record<string, 1 | -1>> = {
      price_asc: { price: 1 },
      price_desc: { price: -1 },
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
    };

    const skip = (page - 1) * limit;

    // Run count and find in parallel for efficiency
    const [total, products] = await Promise.all([
      Product.countDocuments(filter),
      Product.find(filter).sort(sortMap[sort]).skip(skip).limit(limit).lean(),
    ]);

    return {
      products,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      },
    };
  },

  async getBySlug(slug: string) {
    const product = await Product.findOne({ slug }).lean();
    if (!product) {
      throw new AppError('Product not found', 404);
    }
    return product;
  },
};
