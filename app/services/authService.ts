import { apiService } from './api';
import { UserType } from '@/app/types';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterCustomerData {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface RegisterShopData {
  shopName: string;
  ownerName: string;
  email: string;
  phone: string;
  address: string;
  zipCode: string;
  serviceArea: string;
  pricePerItem: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    user_type: UserType;
    shop?: {
      shop_id: string;
      shop_name: string;
    };
  };
}

class AuthService {
  static async login(data: LoginData): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>('/auth/login', data);
    console.log("-------------Auth service login response-------------")
    console.log(response)
    this.setAuthData(response.data);
    return response.data;
  }

  static async registerCustomer(data: RegisterCustomerData): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>('/auth/register/customer', data);
    this.setAuthData(response.data);
    return response.data;
  }

  static async registerShop(data: RegisterShopData): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>('/auth/register/shop', data);
    this.setAuthData(response.data);
    return response.data;
  }

  static logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  }

  static getCurrentUser(): AuthResponse['user'] | null {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  static isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  private static setAuthData(response: AuthResponse): void {
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
  }
}

export default AuthService;