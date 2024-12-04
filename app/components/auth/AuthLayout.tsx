'use client';

import { Store } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => (
  <div className="min-h-screen bg-gray-50">
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center">
        <Store className="h-8 w-8 text-blue-600" />
        <h1 className="ml-2 text-xl font-bold text-gray-900">Pressto</h1>
      </div>
    </header>
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {children}
    </main>
  </div>
);