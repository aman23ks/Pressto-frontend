export * from './order';

// Basic Type Definitions
export type UserType = 'customer' | 'shopOwner' | null;

export type ViewType = 
  | 'role-select' 
  | 'customer-login' 
  | 'customer-signup' 
  | 'shopOwner-login' 
  | 'shopOwner-signup' 
  | 'authenticated';

export type OrderStatus = 
  | 'pending' 
  | 'received' 
  | 'inProgress' 
  | 'ready' 
  | 'completed' 
  | 'cancelled';

// Props Interfaces
export interface AuthProps {
  onBack: () => void;
  onSwitch: () => void;
  onSuccess: () => void;
}

// Order Related Interfaces
export interface OrderItem {
  type: string;
  count: number;
}

export interface Order {
  id: string;
  shopName?: string;
  customerName?: string;
  items: OrderItem[] | number;
  status: OrderStatus;
  pickupTime: string;
  deliveryTime?: string;
  totalAmount?: string;
}

// API Response Types
export interface APIResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Auth Related Types
export interface LoginData {
  email: string;
  password: string;
}

export interface CustomerSignupData {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface ShopOwnerSignupData {
  shopName: string;
  ownerName: string;
  email: string;
  phone: string;
  address: string;
  zipCode: string;
  serviceArea: string;
  pricePerItem: string;
  password: string;
  confirmPassword: string;
}

// Navigation Props
export interface NavigationProps {
  onNavigate: (view: 'dashboard' | 'orders' | 'settings') => void;
}