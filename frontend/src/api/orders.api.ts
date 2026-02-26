import { api } from './axios';
import type { Order } from '../types';

interface CreateOrderItem {
  productId: string;
  quantity: number;
}

export const ordersApi = {
  create: (items: CreateOrderItem[]) =>
    api.post<Order>('/orders', { items }).then((r) => r.data),

  getMyOrders: () =>
    api.get<Order[]>('/orders/my').then((r) => r.data),

  getById: (id: string) =>
    api.get<Order>(`/orders/${id}`).then((r) => r.data),

  createCheckoutSession: (orderId: string) =>
    api.post<{ url: string }>('/stripe/checkout-session', { orderId }).then((r) => r.data),
};
