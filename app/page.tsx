'use client';

import { useAuth } from './contexts/AuthContext';
import { CustomerDashboard } from './components/dashboard/customer/CustomerDashboard';
import  ShopDashboard from './components/dashboard/shop/ShopDashboard';
import { AuthFlow } from './components/auth/AuthFlow';

export default function Home() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <AuthFlow />;
  }

  return user?.user_type === 'customer' ? 
    <CustomerDashboard /> : 
    <ShopDashboard />;
}