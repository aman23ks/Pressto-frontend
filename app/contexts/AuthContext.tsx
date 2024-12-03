'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { UserType } from '@/app/types';
import AuthService from '@/app/services/authService';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  user_type: UserType;
  address?: string;
  shop?: {
    shop_id: string;
    shop_name: string;
  };
}

interface AuthResponse {
  token: string;
  user: User;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  logout: () => void;
  registerCustomer: (data: any) => Promise<AuthResponse>;
  registerShop: (data: any) => Promise<AuthResponse>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    try {
      const currentUser = AuthService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<AuthResponse> => {
    const response = await AuthService.login({ email, password });
    setUser(response.user);
    return response;
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
  };

  const registerCustomer = async (data: any): Promise<AuthResponse> => {
    const response = await AuthService.registerCustomer(data);
    setUser(response.user);
    return response;
  };

  const registerShop = async (data: any): Promise<AuthResponse> => {
    const response = await AuthService.registerShop(data);
    setUser(response.user);
    return response;
  };

  const value = {
    isAuthenticated: !!user,
    user,
    loading,
    login,
    logout,
    registerCustomer,
    registerShop,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};