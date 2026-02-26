import { Schema, model, InferSchemaType } from 'mongoose';

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [200, 'Name must be at most 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be a positive number'],
    },
    // Array of image URLs (stored externally, e.g. Cloudinary or placeholder)
    images: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    stock: {
      type: Number,
      required: true,
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    // URL-friendly identifier used in frontend routes (e.g. /products/cool-sneakers)
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for fast category filtering and text search
productSchema.index({ category: 1 });
productSchema.index({ name: 'text', description: 'text' });

export type ProductType = InferSchemaType<typeof productSchema>;

export const Product = model('Product', productSchema);
