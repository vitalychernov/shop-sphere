import { useQuery } from '@tanstack/react-query';
import { ordersApi } from '../api/orders.api';

export function useMyOrders() {
  return useQuery({
    queryKey: ['orders', 'my'],
    queryFn: () => ordersApi.getMyOrders(),
  });
}
