// services/shopService.ts
import { apiService } from './api';

interface Shop {
  id: string;
  name: string;
  rating: number;
  distance: string;
  totalOrders: number;
  deliveryTime: string;
  services: Service[];
}

interface Service {
  id: string;
  type: string;
  price: number;
  description?: string;
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