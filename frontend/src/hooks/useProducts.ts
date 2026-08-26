import { useQuery } from '@tanstack/react-query';
import { productsApi } from '../api/products.api';
import type { ProductFilters } from '../types';

export function useProducts(filters: ProductFilters = {}) {
  return useQuery({
    // Query key includes filters — React Query refetches when filters change
    queryKey: ['products', filters],
    queryFn: () => productsApi.getAll(filters),
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: () => productsApi.getBySlug(slug),
    enabled: !!slug,
  });
}
