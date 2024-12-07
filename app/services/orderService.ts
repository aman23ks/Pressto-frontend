import { apiService } from './api';

// services/orderService.ts
interface OrderPayload {
  shop_id: string;
  items: Array<{ type: string; count: number }>;
  pickup_date: string;
  // pickup_time: string;
  // delivery_time: string;
  pickup_address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  special_instructions?: string;
}

class OrderService {
  static async createOrder(orderData: OrderPayload) {
    try {
      const token = localStorage.getItem('token');
      const response = await apiService.post('/orders', orderData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default OrderService;