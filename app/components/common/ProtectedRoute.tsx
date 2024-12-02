'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthService from '@/app/services/authService';
import { UserType } from '@/app/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedUserTypes?: UserType[];
}

export const ProtectedRoute = ({ 
  children, 
  allowedUserTypes = ['customer', 'shopOwner'] 
}: ProtectedRouteProps) => {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (!user) {
      router.push('/');
      return;
    }

    if (!allowedUserTypes.includes(user.user_type)) {
      AuthService.logout();
      router.push('/');
      return;
    }

    setIsAuthorized(true);
  }, [router, allowedUserTypes]);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return <>{children}</>;
};