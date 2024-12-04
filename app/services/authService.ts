import { apiService } from './api';
import { UserType } from '@/app/types';

interface JWTPayload {
  exp: number;
  userId: string;
}

interface VerifyTokenResponse {
  valid: boolean;
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
  message: string;
}

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
  static async verifyToken(): Promise<boolean> {
    const token = localStorage.getItem('token');
    console.log("Token being verified:", token); // Debug log
    
    if (!token) {
      return false;
    }
  
    try {
      const response = await apiService.get<VerifyTokenResponse>('/auth/verify-token');
      console.log("Verify token response:", response.data); // Debug log
      
      if (response.data.valid && response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Token verification failed:", error);
      return false;
    }
  }
  static async login(data: LoginData): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>('/auth/login', data);
    if (response.data) {
      // Ensure we're storing the complete response data
      this.setAuthData(response.data);
    }
    return response.data;
  }
  
  private static setAuthData(response: AuthResponse): void {
    if (response.token && response.user) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
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

  static async logout(): Promise<void> {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await apiService.post('/auth/logout', {});
      }
    } finally {
      this.clearAuthData();
    }
  }

  static getCurrentUser(): AuthResponse['user'] | null {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      return null;
    }
  }

  private static clearAuthData(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}

export default AuthService;