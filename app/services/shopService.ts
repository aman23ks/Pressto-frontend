// services/shopService.ts
import { apiService } from './api';

export interface Shop {
  id: string;
  name: string;
  rating: number;
  distance: string;
  pricePerItem: number;
  totalOrders: number;
  deliveryTime: string;
}

class ShopService {
  static async getAllShops(): Promise<Shop[]> {
    try {
      const response = await apiService.get('/shop');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default ShopService;