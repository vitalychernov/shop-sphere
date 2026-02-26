import mongoose from 'mongoose';
import { Order } from '../models/order.model';
import { Product } from '../models/product.model';
import { AppError } from '../utils/AppError';
import type { CreateOrderInput } from '../validators/order.validator';

export const OrderService = {
  async create(userId: string, input: CreateOrderInput) {
    const productIds = input.items.map((item) => item.productId);

    // Fetch all products in a single query
    const products = await Product.find({ _id: { $in: productIds } });

    // Verify all requested products exist
    if (products.length !== productIds.length) {
      throw new AppError('One or more products not found', 404);
    }

    // Build order items using DB prices — never trust client-sent prices
    const orderItems = input.items.map((item) => {
      const product = products.find((p) => p._id.toString() === item.productId);

      if (!product) {
        throw new AppError(`Product ${item.productId} not found`, 404);
      }

      if (product.stock < item.quantity) {
        throw new AppError(`Insufficient stock for "${product.name}"`, 400);
      }

      return {
        product: new mongoose.Types.ObjectId(item.productId),
        name: product.name,      // price and name snapshot at order time
        price: product.price,
        quantity: item.quantity,
      };
    });

    // Calculate total on the server — client total is never trusted
    const totalAmount = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const order = await Order.create({
      user: new mongoose.Types.ObjectId(userId),
      items: orderItems,
      totalAmount: Math.round(totalAmount * 100) / 100, // round to 2 decimal places
      status: 'pending',
    });

    return order;
  },

  async getMyOrders(userId: string) {
    return Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate('items.product', 'name images slug')
      .lean();
  },

  async getById(orderId: string, userId: string) {
    const order = await Order.findById(orderId)
      .populate('items.product', 'name images slug')
      .lean();

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    // Ensure users can only access their own orders
    if (order.user.toString() !== userId) {
      throw new AppError('Access denied', 403);
    }

    return order;
  },
};
