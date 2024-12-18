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
  | 'accepted' 
  | 'pickedUp'
  | 'inProgress'
  | 'completed'
  | 'delivered'
  | 'cancelled'

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
  customerName: string;
  items: OrderItem[];
  status: 'pending' | 'inProgress' | 'completed' | 'cancelled';
  pickup_date: string;
  // pickup_time: string;
  // delivery_time?: string;
  totalAmount: number;
  created_at?: {
    $date: string;
  };
  pickup_address: {
    street?: string;
    landmark?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
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
  // serviceArea: string;
  // pricePerItem: string;
  password: string;
  confirmPassword: string;
}

// Navigation Props
export interface NavigationProps {
  onNavigate: (view: 'dashboard' | 'orders' | 'settings') => void;
}