import { api } from './axios';
import type { Product, ProductsResponse, ProductFilters } from '../types';

export const productsApi = {
  getAll: (filters: ProductFilters = {}) =>
    api.get<ProductsResponse>('/products', { params: filters }).then((r) => r.data),

  getBySlug: (slug: string) =>
    api.get<Product>(`/products/${slug}`).then((r) => r.data),
};
