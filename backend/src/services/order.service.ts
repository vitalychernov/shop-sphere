import mongoose from 'mongoose';
import { Order } from '../models/order.model';
import { Product } from '../models/product.model';
import { User } from '../models/user.model';
import { AppError } from '../utils/AppError';
import { EmailService } from './email.service';
import type { CreateOrderInput } from '../validators/order.validator';

export const OrderService = {
  async create(userId: string, input: CreateOrderInput) {
    const productIds = input.items.map((item) => item.productId);

    // Fetch all products in a single query
    const products = await Product.find({ _id: { $in: productIds } });

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
        name: product.name,
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
      totalAmount: Math.round(totalAmount * 100) / 100,
      status: 'pending',
    });

    // Send confirmation email — runs in background, never blocks the response
    const user = await User.findById(userId).lean();
    if (user) {
      EmailService.sendOrderConfirmation({
        to: user.email,
        userName: user.name,
        orderId: order._id.toString(),
        items: orderItems.map((i) => ({
          name: i.name,
          quantity: i.quantity,
          price: i.price,
        })),
        totalAmount: order.totalAmount,
      });
    }

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

    if (order.user.toString() !== userId) {
      throw new AppError('Access denied', 403);
    }

    return order;
  },
};
