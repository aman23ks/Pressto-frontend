'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { UserType } from '@/app/types';
import AuthService from '@/app/services/authService';
import { toast } from 'react-hot-toast';

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
  logout: () => Promise<void>;
  registerCustomer: (data: any) => Promise<AuthResponse>;
  registerShop: (data: any) => Promise<AuthResponse>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setUser(null);
        return;
      }

      const isValid = await AuthService.verifyToken();
      
      if (isValid) {
        const userData = localStorage.getItem('user');
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } else {
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  };

  // Initial auth check and periodic verification
  useEffect(() => {
    checkAuth();

    // Verify token every 30 minutes
    const intervalId = setInterval(checkAuth, 30 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  const login = async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await AuthService.login({ email, password });
      setUser(response.user);
      return response;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Login failed';
      toast.error(errorMessage);
      throw error;
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await AuthService.logout();
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Failed to logout');
    } finally {
      setLoading(false);
    }
  };

  const registerCustomer = async (data: any): Promise<AuthResponse> => {
    try {
      const response = await AuthService.registerCustomer(data);
      setUser(response.user);
      return response;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Registration failed';
      toast.error(errorMessage);
      throw error;
    }
  };

  const registerShop = async (data: any): Promise<AuthResponse> => {
    try {
      const response = await AuthService.registerShop(data);
      setUser(response.user);
      return response;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Registration failed';
      toast.error(errorMessage);
      throw error;
    }
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